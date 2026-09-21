/* Minimal Luna-style window manager: open, focus, drag, resize,
   minimise / maximise / close, plus a back-forward view stack for
   windows that use the browser chrome. */
(function () {
  const I = window.XPIcons;
  const host = () => document.getElementById('windows');
  const wins = new Map();
  let zTop = 10;
  let activeId = null;
  let openCount = 0;

  const MOBILE = () => window.innerWidth < 760;
  const notify = () => document.dispatchEvent(new CustomEvent('xp:windows'));

  /* ---------- markup ---------- */
  function chromeMarkup(opts) {
    const browser = opts.chrome !== 'simple';
    const menu = `
      <div class="win-menu">
        ${['File', 'View', 'Tools', 'Help'].map(m => `<span class="win-menu-item is-disabled">${m}</span>`).join('')}
        <span class="win-menu-spacer"></span>
        <span class="win-menu-flag">${window.XPBrand.flag("w-" + opts.id)}</span>
      </div>`;

    const toolbar = `
      <div class="win-toolbar">
        <button class="tb-btn" data-act="close">${I.closeX()}<span>Close</span></button>
        <span class="tb-sep"></span>
        <button class="tb-btn" data-act="back" disabled>${I.arrow('left')}<span>Back</span></button>
        <button class="tb-btn" data-act="forward" disabled>${I.arrow('right')}<span>Forward</span></button>
        ${(opts.tools || []).map(t =>
          `<span class="tb-sep"></span><button class="tb-btn" data-tool="${t.id}">${I[t.icon] ? I[t.icon]() : ''}<span>${t.label}</span></button>`
        ).join('')}
      </div>`;

    const address = browser ? `
      <div class="win-address">
        <span class="win-address-label">Address</span>
        <span class="win-address-field">${I.globe()}<span class="win-address-text"></span></span>
        <span class="win-address-go">${I.go()}<span>Go</span></span>
      </div>` : '';

    return `
      <div class="win-title">
        <span class="win-title-icon">${opts.icon ? I[opts.icon]() : I.folder()}</span>
        <span class="win-title-text">${opts.title}</span>
        <span class="win-btns">
          <button class="win-btn" data-act="min" title="Minimize">${I.minGlyph()}</button>
          <button class="win-btn" data-act="max" title="Maximize">${I.maxGlyph()}</button>
          <button class="win-btn win-btn-close" data-act="close" title="Close">${I.closeGlyph()}</button>
        </span>
      </div>
      ${menu}
      ${toolbar}
      ${address}
      <div class="win-body"></div>
      <div class="win-status">
        <span class="win-status-cell grow" data-status>Done</span>
        <span class="win-status-cell">${opts.statusRight || 'My Computer'}</span>
      </div>
      <div class="win-resize win-resize-e"></div>
      <div class="win-resize win-resize-s"></div>
      <div class="win-resize win-resize-se"></div>`;
  }

  /* ---------- lifecycle ---------- */
  function open(opts) {
    if (wins.has(opts.id)) {
      const existing = wins.get(opts.id);
      if (existing.minimized) restore(opts.id);
      focus(opts.id);
      return existing;
    }

    const el = document.createElement('section');
    el.className = 'win';
    el.dataset.id = opts.id;
    el.innerHTML = chromeMarkup(opts);

    // Cascade placement, clamped to the viewport.
    const stage = host().getBoundingClientRect();
    const w = Math.min(opts.width || 900, Math.max(320, stage.width - 40));
    const h = Math.min(opts.height || 600, Math.max(240, stage.height - 40));
    const off = (openCount++ % 6) * 24;
    const rect = {
      x: Math.max(8, Math.min(off + 24, stage.width - w - 8)),
      y: Math.max(8, Math.min(off + 16, stage.height - h - 8)),
      w, h
    };

    const win = {
      id: opts.id, el, opts, rect,
      bodyEl: el.querySelector('.win-body'),
      views: [], viewIndex: -1,
      minimized: false, maximized: !!opts.maximized || MOBILE()
    };
    wins.set(opts.id, win);

    applyRect(win);
    host().appendChild(el);
    wireChrome(win);
    wireDrag(win);
    wireResize(win);

    win.api = makeApi(win);
    win.api.navigate(opts.view);

    focus(opts.id);
    notify();
    return win;
  }

  function applyRect(win) {
    const { el, rect } = win;
    if (win.maximized) {
      el.classList.add('is-max');
      Object.assign(el.style, { left: '0px', top: '0px', width: '100%', height: '100%' });
    } else {
      el.classList.remove('is-max');
      Object.assign(el.style, {
        left: rect.x + 'px', top: rect.y + 'px',
        width: rect.w + 'px', height: rect.h + 'px'
      });
    }
    const btn = el.querySelector('[data-act="max"]');
    if (btn) btn.innerHTML = win.maximized ? I.restoreGlyph() : I.maxGlyph();
  }

  function focus(id) {
    activeId = id;
    wins.forEach((w, key) => {
      const isActive = key === id;
      w.el.classList.toggle('is-inactive', !isActive);
      if (isActive) w.el.style.zIndex = ++zTop;
    });
    notify();
  }

  function close(id) {
    const w = wins.get(id);
    if (!w) return;
    w.el.remove();
    wins.delete(id);
    if (activeId === id) {
      const next = [...wins.keys()].pop() || null;
      activeId = next;
      if (next) focus(next);
    }
    notify();
  }

  function minimize(id) {
    const w = wins.get(id);
    if (!w) return;
    w.minimized = true;
    w.el.classList.add('is-minimized');
    if (activeId === id) activeId = null;
    notify();
  }

  function restore(id) {
    const w = wins.get(id);
    if (!w) return;
    w.minimized = false;
    w.el.classList.remove('is-minimized');
    focus(id);
  }

  function toggleMax(id) {
    const w = wins.get(id);
    if (!w) return;
    w.maximized = !w.maximized;
    applyRect(w);
    focus(id);
  }

  function toggle(id) {
    const w = wins.get(id);
    if (!w) return;
    if (w.minimized) restore(id);
    else if (activeId === id) minimize(id);
    else focus(id);
  }

  /* ---------- view stack ---------- */
  function makeApi(win) {
    const titleEl = win.el.querySelector('.win-title-text');
    const addrEl = win.el.querySelector('.win-address-text');
    const statusEl = win.el.querySelector('[data-status]');
    const backBtn = win.el.querySelector('[data-act="back"]');
    const fwdBtn = win.el.querySelector('[data-act="forward"]');

    function paint() {
      const view = win.views[win.viewIndex];
      if (!view) return;
      win.bodyEl.innerHTML = '';
      win.bodyEl.scrollTop = 0;
      view.render(win.bodyEl, api);
      if (view.title) titleEl.textContent = view.title;
      if (addrEl) addrEl.textContent = view.address || '';
      if (backBtn) backBtn.disabled = win.viewIndex <= 0;
      if (fwdBtn) fwdBtn.disabled = win.viewIndex >= win.views.length - 1;
      notify();
    }

    const api = {
      win,
      navigate(view) {
        if (!view) return;
        win.views = win.views.slice(0, win.viewIndex + 1);
        win.views.push(view);
        win.viewIndex = win.views.length - 1;
        paint();
      },
      back() { if (win.viewIndex > 0) { win.viewIndex--; paint(); } },
      forward() { if (win.viewIndex < win.views.length - 1) { win.viewIndex++; paint(); } },
      close() { close(win.id); },
      setStatus(text) { if (statusEl) statusEl.textContent = text; }
    };
    return api;
  }

  /* ---------- interaction ---------- */
  function wireChrome(win) {
    const { el, id } = win;
    el.addEventListener('mousedown', () => focus(id), true);

    el.addEventListener('click', (e) => {
      const actBtn = e.target.closest('[data-act]');
      if (actBtn) {
        const act = actBtn.dataset.act;
        if (act === 'close') close(id);
        else if (act === 'min') minimize(id);
        else if (act === 'max') toggleMax(id);
        else if (act === 'back') win.api.back();
        else if (act === 'forward') win.api.forward();
        return;
      }
      const toolBtn = e.target.closest('[data-tool]');
      if (toolBtn && win.opts.onTool) win.opts.onTool(toolBtn.dataset.tool, win.api);
    });

    el.querySelector('.win-title').addEventListener('dblclick', (e) => {
      if (!e.target.closest('.win-btn')) toggleMax(id);
    });
  }

  function wireDrag(win) {
    const bar = win.el.querySelector('.win-title');
    bar.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.win-btn') || win.maximized) return;
      const startX = e.clientX, startY = e.clientY;
      const origin = { ...win.rect };
      const stage = host().getBoundingClientRect();
      bar.setPointerCapture(e.pointerId);

      const move = (ev) => {
        win.rect.x = clamp(origin.x + ev.clientX - startX, -win.rect.w + 80, stage.width - 80);
        win.rect.y = clamp(origin.y + ev.clientY - startY, 0, stage.height - 30);
        applyRect(win);
      };
      const up = () => {
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', up);
      };
      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', up);
    });
  }

  function wireResize(win) {
    win.el.querySelectorAll('.win-resize').forEach((grip) => {
      const horiz = grip.classList.contains('win-resize-e') || grip.classList.contains('win-resize-se');
      const vert = grip.classList.contains('win-resize-s') || grip.classList.contains('win-resize-se');

      grip.addEventListener('pointerdown', (e) => {
        if (win.maximized) return;
        e.preventDefault();
        const startX = e.clientX, startY = e.clientY;
        const origin = { ...win.rect };
        const stage = host().getBoundingClientRect();
        grip.setPointerCapture(e.pointerId);

        const move = (ev) => {
          if (horiz) win.rect.w = clamp(origin.w + ev.clientX - startX, 320, stage.width - win.rect.x);
          if (vert) win.rect.h = clamp(origin.h + ev.clientY - startY, 200, stage.height - win.rect.y);
          applyRect(win);
        };
        const up = () => {
          grip.removeEventListener('pointermove', move);
          grip.removeEventListener('pointerup', up);
        };
        grip.addEventListener('pointermove', move);
        grip.addEventListener('pointerup', up);
      });
    });
  }

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  window.XPWM = {
    open, close, focus, minimize, restore, toggle, toggleMax,
    list: () => [...wins.values()],
    active: () => activeId
  };
})();
