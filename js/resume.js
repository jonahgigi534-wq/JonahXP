/* My Resume, shown like XP's picture viewer: a printed page (styled after
   the Jake Gutierrez LaTeX resume) on a grey backdrop. The page is laid out at letter size (816px wide) and scaled to
   fit the window; Zoom, or a click on the page, shows it full size and
   keeps the clicked spot under the pointer. Save prints just the page, so
   the browser's "Save as PDF" gives a clean copy. */
(function () {
  const PAGE_W = 816;          // 8.5in at 96dpi
  const MARGIN = 24;           // grey border around the page when fitted
  const MAX_ZOOM = 1.6;        // cap for very wide windows
  const LETTER_H = 1056;       // 11in at 96dpi

  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* Small inline glyphs for the contact line (envelope, globe). */
  const GLYPH = {
    mail: '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M1 3.5h14v9H1zm1.3 1.2v.2L8 8.6l5.7-3.7v-.2zM2.3 6.3v5h11.4v-5L8 10z"/></svg>',
    globe: '<svg viewBox="0 0 16 16" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="8" cy="8" r="6.3"/><ellipse cx="8" cy="8" rx="2.8" ry="6.3"/><path d="M1.8 8h12.4M2.8 4.8h10.4M2.8 11.2h10.4"/></g></svg>'
  };

  const section = (title, body) => `<section class="rs-sec"><h2>${esc(title)}</h2>${body}</section>`;
  const bullets = (items) => `<ul class="rs-bullets">${items.map(b => `<li>${esc(b)}</li>`).join('')}</ul>`;

  /* Two-line entry: bold name and date, then italic role and place. */
  const entry = (name, right, sub, subRight, list) => `
    <div class="rs-entry">
      <div class="rs-line"><strong>${esc(name)}</strong><strong>${esc(right || '')}</strong></div>
      <div class="rs-line rs-sub"><em>${esc(sub || '')}</em><em>${esc(subRight || '')}</em></div>
      ${list ? bullets(list) : ''}
    </div>`;

  function pageMarkup(r) {
    const contact = r.contact.map(c =>
      `<a href="${esc(c.href)}" target="_blank" rel="noopener noreferrer">${GLYPH[c.icon] || ''}<span>${esc(c.text)}</span></a>`).join('');
    const projects = r.projects.map(p => `
      <div class="rs-entry">
        <div class="rs-line"><span><strong>${esc(p.name)}</strong> | <em>${esc(p.tech)}</em></span><strong>${esc(p.when)}</strong></div>
        ${bullets(p.bullets)}
      </div>`).join('');
    const skills = r.skills.map(s => `<div><strong>${esc(s.label)}</strong>: ${esc(s.items)}</div>`).join('');

    return `
      <article class="rs-page">
        <header class="rs-head">
          <h1 class="rs-name">${esc(r.name)}</h1>
          <div class="rs-contact">${contact}</div>
        </header>
        ${section('Education', r.education.map(e => entry(e.name, e.right, e.sub, e.subRight)).join(''))}
        ${section('Relevant Coursework', `<ul class="rs-cols">${r.coursework.map(c => `<li>${esc(c)}</li>`).join('')}</ul>`)}
        ${section('Experience', r.experience.map(x => entry(x.name, x.when, x.role, x.place, x.bullets)).join(''))}
        ${section('Projects', projects)}
        ${section('Technical Skills', `<div class="rs-skills">${skills}</div>`)}
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
