/* My Resume, shown like XP's picture viewer: a printed page on a grey
   backdrop. The page is laid out at letter size (816px wide) and scaled to
   fit the window; Zoom, or a click on the page, shows it full size and
   keeps the clicked spot under the pointer. Save prints just the page, so
   the browser's "Save as PDF" gives a clean copy. */
(function () {
  const PAGE_W = 816;          // 8.5in at 96dpi
  const MARGIN = 24;           // grey border around the page when fitted
  const MAX_ZOOM = 1.6;        // cap for very wide windows
  const LETTER_H = 1056;       // 11in at 96dpi

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function sideMarkup(r) {
    const contact = r.contact.map(c => `<li>${esc(c)}</li>`).join('');
    const groups = r.side.map(g => `
      <section class="rs-side-group">
        <h3>${esc(g.heading)}</h3>
        <ul>${g.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
      </section>`).join('');
    return `
      <aside class="rs-side">
        <div class="rs-photo">${XPAvatar.tile({ still: true })}</div>
        <section class="rs-side-group"><h3>Contact</h3><ul>${contact}</ul></section>
        ${groups}
      </aside>`;
  }

  const heading = (text) => `<h2 class="rs-h"><span>${esc(text)}</span></h2>`;
  const when = (w) => (w ? `<span class="rs-when">${esc(w)}</span>` : '');

  function mainMarkup(r) {
    const jobs = r.experience.map(j => `
      <div class="rs-item">
        <div class="rs-row"><strong>${esc(j.role)}</strong>${when(j.when)}</div>
        <div class="rs-org">${esc(j.org)}</div>
        <ul class="rs-bullets">${j.bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`).join('');
    const projects = r.projects.map(p => `
      <div class="rs-item rs-item-tight">
        <div class="rs-row"><strong>${esc(p.name)}</strong>${when(p.when)}</div>
        <p>${esc(p.text)}</p>
      </div>`).join('');
    const school = r.education.map(e => `
      <div class="rs-item rs-item-tight">
        <div class="rs-row"><strong>${esc(e.name)}</strong>${when(e.when)}</div>
        <div class="rs-org">${esc(e.detail)}</div>
        <p>${esc(e.note)}</p>
      </div>`).join('');
    return `
      <main class="rs-main">
        <h2 class="rs-h rs-title"><span>${esc(r.title)}</span></h2>
        <p class="rs-summary">${esc(r.summary)}</p>
        ${heading('Work Experience')}${jobs}
        ${heading('Independent Projects')}${projects}
        ${heading('Education')}${school}
      </main>`;
  }

  function pageMarkup(r) {
    return `
      <article class="rs-page">
        <h1 class="rs-name">${esc(r.name.toUpperCase())}</h1>
        <div class="rs-body">${sideMarkup(r)}${mainMarkup(r)}</div>
      </article>`;
  }

  /* ---------- the window view ---------- */
  let current = null;   // { toggleZoom, save } for the open viewer

  function view() {
    return {
      title: 'My Resume',
      address: 'My Resume',
      render(root, api) {
        const stage = document.createElement('div');
        stage.className = 'rs-stage';
        stage.innerHTML = `<div class="rs-frame">${pageMarkup(window.XPData.resume)}</div>`;
        root.appendChild(stage);
        current = viewer(stage, api);
      }
    };
  }

  function viewer(stage, api) {
    const frame = stage.querySelector('.rs-frame');
    const page = stage.querySelector('.rs-page');
    let zoomed = false;

    const fitScale = () => Math.max(0.2, (stage.clientWidth - MARGIN * 2) / PAGE_W);
    const fullScale = () => Math.min(MAX_ZOOM, Math.max(1, fitScale() * 1.6));

    function apply() {
      const s = zoomed ? fullScale() : fitScale();
      page.style.transform = `scale(${s})`;
      frame.style.width = PAGE_W * s + 'px';
      frame.style.height = page.offsetHeight * s + 'px';
      stage.classList.toggle('is-zoomed', zoomed);
      api.setStatus(zoomed ? 'Click the page to zoom out' : 'Click the page to zoom in');
    }

    /* Zoom about a point (fractions of the page), so what you clicked on
       stays where your pointer is. */
    function toggleZoom(fx, fy, px, py) {
      zoomed = !zoomed;
      apply();
      if (fx == null) return;
      const box = frame.getBoundingClientRect();
      const host = stage.getBoundingClientRect();
      stage.scrollLeft += box.left - host.left + fx * box.width - px;
      stage.scrollTop += box.top - host.top + fy * box.height - py;
    }

    page.addEventListener('click', (e) => {
      const box = page.getBoundingClientRect();
      const host = stage.getBoundingClientRect();
      toggleZoom((e.clientX - box.left) / box.width, (e.clientY - box.top) / box.height,
        e.clientX - host.left, e.clientY - host.top);
    });

    const ro = new ResizeObserver(() => { if (stage.isConnected) apply(); else ro.disconnect(); });
    ro.observe(stage);
    apply();

    return { toggleZoom: () => toggleZoom(), save };
  }

  /* Print a copy of the page on its own; the print stylesheet hides the
     desktop while body has .rs-printing. */
  function save() {
    const sheet = document.createElement('div');
    sheet.className = 'rs-print';
    sheet.innerHTML = pageMarkup(window.XPData.resume);
    // Shrink to one letter sheet: the on-screen page is laid out at print width.
    const shown = document.querySelector('.rs-stage .rs-page');
    const h = shown ? shown.offsetHeight : LETTER_H;
    sheet.firstElementChild.style.zoom = String(Math.min(1, LETTER_H / h));
    document.body.appendChild(sheet);
    document.body.classList.add('rs-printing');
    const done = () => {
      document.body.classList.remove('rs-printing');
      sheet.remove();
      window.removeEventListener('afterprint', done);
    };
    window.addEventListener('afterprint', done);
    window.print();
  }

  function tool(id) {
    if (!current) return;
    if (id === 'zoom') current.toggleZoom();
    else if (id === 'save') current.save();
    else if (id === 'contact') window.XPApps.contact();
  }

  window.XPResume = { view, tool };
})();
