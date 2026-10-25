/* The windowed "applications": About, My Projects (grid + detail),
   Contact and Resume. Each app hands the window manager a view
   object of the shape { title, address, render(el, api) }. */
(function () {
  const I = window.XPIcons;
  const { projects, filters, profile } = window.XPData;

  const el = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  };

  /* ---------------- About Me ---------------- */
  /* Strokes for the round skill glyphs, drawn on a 16x16 grid. */
  const GLYPHS = {
    ml:    ['#d6457a', 'M6 5.5a2 2 0 00-1 3.5 2 2 0 002 2.5M10 5.5a2 2 0 011 3.5 2 2 0 01-2 2.5M8 4.5v7'],
    app:   ['#2f74d8', 'M4.5 5h7v6h-7zM4.5 7h7'],
    chip:  ['#3f9a22', 'M5.5 5.5h5v5h-5zM7 3.5v2M9 3.5v2M7 10.5v2M9 10.5v2'],
    wave:  ['#e8742a', 'M3.5 8c1-3 2-3 3 0s2 3 3 0 2-3 3 0'],
    chart: ['#139a9a', 'M4.5 11.5v-3M8 11.5v-6M11.5 11.5v-4.5'],
    bulb:  ['#c79a12', 'M6.3 10.5h3.4M6.8 12h2.4M8 4a2.8 2.8 0 00-1.7 5h3.4A2.8 2.8 0 008 4z']
  };

  const sideRow = (icon, text, href) => href
    ? `<a class="side-row" href="${href}" ${href.startsWith('mailto:') ? '' : 'target="_blank" rel="noopener noreferrer"'}>${icon}<span>${text}</span></a>`
    : `<div class="side-row">${icon}<span>${text}</span></div>`;

  function sideCard(id, title, rows, extraClass) {
    return `
      <div class="side-card${extraClass ? ' ' + extraClass : ''}" data-card="${id}">
        <button class="side-card-head" aria-expanded="true">
          <span>${title}</span><span class="side-card-toggle">${I.collapse(true)}</span>
        </button>
        <div class="side-card-body"><div class="side-card-inner">${rows.join('')}</div></div>
      </div>`;
  }

  function aboutSide() {
    const social = [
      sideRow(`<span class="side-ico side-ico-gh">${I.github()}</span>`, 'GitHub', profile.github),
      sideRow(`<span class="side-ico">${I.mail()}</span>`, 'Email', `mailto:${profile.email}`)
    ];
    if (profile.linkedin) social.push(sideRow(`<span class="side-ico side-ico-in">${I.linkedin()}</span>`, 'LinkedIn', profile.linkedin));

    const skills = profile.focus.map(f =>
      sideRow(`<span class="side-ico">${I.dot(GLYPHS[f.glyph][0], `<path d="${GLYPHS[f.glyph][1]}"/>`)}</span>`, f.label));
    const software = profile.software.map(s =>
      sideRow(`<span class="side-ico">${I.tile(...s.tile)}</span>`, s.label));

    return `<aside class="about-side">
      ${sideCard('social', 'Social Links', social, 'side-card-blue')}
      ${sideCard('skills', 'Skills', skills)}
      ${sideCard('software', 'Software', software)}
    </aside>`;
  }

  /* Cards fold up and down like XP's task panes. */
  function wireSideCards(root) {
    root.querySelectorAll('.side-card').forEach((card) => {
      const head = card.querySelector('.side-card-head');
      const body = card.querySelector('.side-card-body');
      head.addEventListener('click', () => {
        const open = head.getAttribute('aria-expanded') !== 'true';
        body.style.height = body.scrollHeight + 'px';
        requestAnimationFrame(() => { body.style.height = open ? body.scrollHeight + 'px' : '0px'; });
        head.setAttribute('aria-expanded', String(open));
        card.classList.toggle('is-collapsed', !open);
        head.querySelector('.side-card-toggle').innerHTML = I.collapse(open);
      });
      body.addEventListener('transitionend', () => {
        if (head.getAttribute('aria-expanded') === 'true') body.style.height = '';
      });
    });
  }

  const ABOUT_PICTURES = [
    () => `<img src="assets/avatar-figure.png?v=2" alt="" draggable="false">`,
    () => I.aboutCode(),
    () => I.aboutGauge()
  ];

  function aboutView() {
    return {
      title: 'About Me',
      address: 'About Me',
      render(root) {
        const page = el('div', 'about');
        page.innerHTML = `
          ${aboutSide()}
          <main class="about-main">
            <h1 class="about-title">About Me</h1>
            ${profile.about.map((p, i) => `
              <div class="about-row">
                <span class="about-pic">${ABOUT_PICTURES[i % ABOUT_PICTURES.length]()}</span>
                <p>${p}</p>
              </div>`).join('')}
          </main>`;
        root.appendChild(page);
        wireSideCards(page);
      }
    };
  }

  /* ---------------- My Projects ---------------- */
  /* A video-site style library: header with search and socials, a filter
     rail, and a card grid. Light/Dark in the toolbar flips its theme. */
  let activeFilter = 'all';
  const THEME_KEY = 'jonahxp.projectsTheme';
  let projTheme = (() => {
    try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  })();

  const visible = () =>
    activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  const matches = (p, q) => !q || `${p.title} ${p.tagline} ${p.meta} ${p.stack.join(' ')}`.toLowerCase().includes(q);

  /* White head-and-shoulders mark for the red logo badge. */
  const LOGO_FIGURE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2a4.6 4.6 0 00-4.6 4.9c0 2 .9 3.5 2 4.4-3.6.9-5.9 3.6-6.2 8.3h17.6c-.3-4.7-2.6-7.4-6.2-8.3 1.1-.9 2-2.4 2-4.4A4.6 4.6 0 0012 3.2z"/></svg>`;

  /* Header shared by the grid and detail pages. Enter in the search box
     opens the first matching project. */
  function shell(api) {
    const page = el('div', 'proj' + (projTheme === 'light' ? ' is-light' : ''));
    const socials = [
      profile.linkedin ? `<a href="${profile.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn">${I.linkedin()}</a>` : '',
      `<a href="${profile.github}" target="_blank" rel="noopener noreferrer" title="GitHub">${I.github()}</a>`,
      `<a href="mailto:${profile.email}" title="Email">${I.mailSmall()}</a>`
    ].join('');

    const top = el('header', 'proj-top', `
      <button class="proj-logo" title="All projects">
        <span class="proj-logo-mark">${LOGO_FIGURE}</span><span class="proj-logo-text">MyProjects</span>
      </button>
      <form class="proj-search" role="search">
        <input class="proj-search-input" type="text" placeholder="Search" aria-label="Search projects" autocomplete="off">
        <button class="proj-search-btn" type="submit" aria-label="Search">${I.search()}</button>
      </form>
      <span class="proj-social">${socials}</span>`);

    top.querySelector('.proj-logo').addEventListener('click', () => goHome(api));
    const input = top.querySelector('.proj-search-input');
    top.querySelector('.proj-search').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim().toLowerCase();
      const hit = projects.find(p => matches(p, q));
      if (hit) api.navigate(detailView(hit));
    });
    page.appendChild(top);
    return page;
  }

  function goHome(api) {
    activeFilter = 'all';
    api.navigate(projectsView());
  }

  function projectsView() {
    return {
      title: 'My Projects',
      address: 'https://www.myprojects.com',
      render(root, api) {
        const page = shell(api);
        const main = el('div', 'proj-main');
        const side = el('nav', 'proj-side');
        const rail = el('div', 'proj-rail');
        const grid = el('div', 'proj-grid');
        const input = page.querySelector('.proj-search-input');
        const query = () => input.value.trim().toLowerCase();

        filters.forEach((f) => {
          const btn = el('button', 'proj-side-btn' + (f.id === activeFilter ? ' is-active' : ''),
            `${I[f.icon]()}<span>${f.label}</span>`);
          btn.title = f.label;
          btn.addEventListener('click', () => {
            activeFilter = f.id;
            rail.querySelectorAll('.proj-side-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            paintGrid(grid, api, query());
          });
          rail.appendChild(btn);
        });
        input.addEventListener('input', () => paintGrid(grid, api, query()));

        side.appendChild(rail);
        paintGrid(grid, api, '');
        main.append(side, grid);
        page.appendChild(main);
        root.appendChild(page);
      }
    };
  }

  const cardInfo = (p) => `
    <span class="card-info">
      <span class="card-avatar">${XPAvatar.tile({ still: true })}</span>
      <span class="card-meta-text">
        <span class="card-title">${p.title}</span>
        <span class="card-sub">${p.views} &bull; ${p.age}</span>
      </span>
    </span>`;

  /* Cards that don't match the search stay in place but fade back. */
  function paintGrid(grid, api, q) {
    grid.innerHTML = '';
    const list = visible();
    list.forEach((p) => {
      const card = el('button', 'card' + (matches(p, q) ? '' : ' is-dimmed'), `
        <span class="card-thumb">${p.thumb()}<span class="card-badge">${p.badge}</span></span>
        ${cardInfo(p)}`);
      card.addEventListener('click', () => api.navigate(detailView(p)));
      grid.appendChild(card);
    });
    const shown = list.filter(p => matches(p, q)).length;
    api.setStatus(`${shown} project${shown === 1 ? '' : 's'}`);
  }

  /* ---------------- Project detail ---------------- */
  function detailView(p) {
    return {
      title: `${p.title} - My Projects`,
      address: `https://www.myprojects.com/${p.id}`,
      render(root, api) {
        const page = shell(api);
        const watch = el('div', 'watch', `
          <div class="watch-main">
            <div class="detail-hero">${p.thumb()}</div>
            <h1 class="watch-title">${p.title}</h1>
            <div class="watch-row">
              <span class="watch-owner">
                <span class="card-avatar watch-avatar">${XPAvatar.tile({ still: true })}</span>
                <span class="watch-who"><span class="watch-name">${profile.fullName}</span><span class="watch-badge">${p.badge}</span></span>
              </span>
              <span class="watch-actions">
                <a class="detail-btn primary" href="${p.repo}" target="_blank" rel="noopener noreferrer">${I.github()} View on GitHub</a>
                <a class="detail-btn" href="${p.repo}#readme" target="_blank" rel="noopener noreferrer">${I.external()} Read the docs</a>
              </span>
            </div>
            <div class="watch-desc">
              <div class="watch-desc-meta">${p.views}&nbsp;&nbsp;${p.age}&nbsp;&nbsp;<span class="watch-desc-stack">${p.meta}</span></div>
              ${p.summary.map(s => `<p>${s}</p>`).join('')}
              <h2>What it does</h2>
              <ul class="detail-list">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
              <h2>Built with</h2>
              <div class="detail-stack">${p.stack.map(s => `<span class="detail-tag">${s}</span>`).join('')}</div>
              <h2>Worth knowing</h2>
              <p>${p.notes}</p>
            </div>
          </div>
          <aside class="watch-next"><h2>More projects</h2></aside>`);

        const next = watch.querySelector('.watch-next');
        projects.filter(o => o.id !== p.id).forEach((o) => {
          const item = el('button', 'next-item', `
            <span class="next-thumb">${o.thumb()}</span>
            <span class="next-text"><span class="next-title">${o.title}</span><span class="next-sub">${o.views} &bull; ${o.age}</span></span>`);
          item.addEventListener('click', () => api.navigate(detailView(o)));
          next.appendChild(item);
        });

        page.appendChild(watch);
        root.appendChild(page);
        api.setStatus(p.tagline);
      }
    };
  }

  /* Toolbar actions for the My Projects window. */
  function projectsTool(id, api, btn) {
    if (id === 'home') goHome(api);
    else if (id === 'theme') {
      projTheme = projTheme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem(THEME_KEY, projTheme); } catch (e) { /* private mode: the choice just isn't remembered */ }
      api.win.bodyEl.querySelectorAll('.proj').forEach(n => n.classList.toggle('is-light', projTheme === 'light'));
    } else if (id === 'favorites') toggleFavorites(api, btn);
  }

  /* Favorites drops a small XP menu listing every project. */
  function toggleFavorites(api, btn) {
    const existing = api.win.el.querySelector('.fav-menu');
    if (existing) { existing.closeMenu(); return; }
    const menu = el('div', 'fav-menu', projects.map(p =>
      `<button class="fav-item" data-id="${p.id}">${I.star()}<span>${p.title}</span></button>`).join(''));
    const winBox = api.win.el.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    menu.style.left = (b.left - winBox.left) + 'px';
    menu.style.top = (b.bottom - winBox.top + 1) + 'px';

    const dismiss = (e) => {
      if (menu.contains(e.target) || btn.contains(e.target)) return;
      close();
    };
    const close = () => {
      menu.remove();
      document.removeEventListener('pointerdown', dismiss, true);
    };
    menu.closeMenu = close;
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.fav-item');
      if (!item) return;
      close();
      api.navigate(detailView(projects.find(p => p.id === item.dataset.id)));
    });
    api.win.el.appendChild(menu);
    document.addEventListener('pointerdown', dismiss, true);
  }

  function aboutTool(id) {
    if (id === 'projects') apps.projects();
    else if (id === 'resume') apps.resume();
    else if (id === 'contact') apps.contact();
  }

  /* ---------------- Contact ---------------- */
  function contactView() {
    return {
      title: 'Contact Me',
      address: 'Contact Me',
      render(root) {
        const page = el('div', 'contact');
        page.innerHTML = `
          <div class="contact-head">
            <h1>Contact Me</h1>
            <p>The quickest ways to reach me.</p>
          </div>
          <div class="contact-rows">
            <div class="contact-row">
              ${I.mail()}
              <span class="contact-row-label">Email</span>
              <a href="mailto:${profile.email}">${profile.email}</a>
            </div>
            <div class="contact-row">
              ${I.globe()}
              <span class="contact-row-label">GitHub</span>
              <a href="${profile.github}" target="_blank" rel="noopener noreferrer">${profile.github.replace('https://', '')}</a>
            </div>
          </div>
          <div class="contact-note">
            Happy to talk about any of these projects, how they were built, or what I would
            change. All the repos are public, so reading the code is the quickest way to see
            how I work.
          </div>`;
        root.appendChild(page);
      }
    };
  }

  /* ---------------- Resume (Notepad) ---------------- */
  function resumeView() {
    const text = window.XPData.resume.join('\n');

    return {
      title: 'Resume.txt - Notepad',
      address: 'Resume.txt',
      render(root) {
        const page = el('div', 'notepad');
        page.textContent = text;
        root.appendChild(page);
      }
    };
  }

  /* ---------------- Minecraft ---------------- */
  function gameView() {
    return {
      title: 'Minecraft',
      address: 'Minecraft',
      render(root, api) {
        const box = el('div', 'bc');
        root.appendChild(box);
        XPGame.mount(box, api);
      }
    };
  }

  /* ---------------- launchers ---------------- */
  const apps = {
    about: () => window.XPWM.open({
      id: 'about', title: 'About Me', icon: 'user', addressIcon: 'user',
      menu: ['File', 'View', 'Help'],
      toolbar: ['back', 'forward', 'sep',
        { id: 'projects', label: 'My Projects', icon: 'globe' },
        { id: 'resume', label: 'My Resume', icon: 'pdf' }, 'sep',
        { id: 'contact', icon: 'mail', title: 'Contact Me' }],
      onTool: aboutTool,
      width: 800, height: 620, status: 'Ready', statusRight: '', view: aboutView()
    }),

    projects: () => window.XPWM.open({
      id: 'projects', title: 'My Projects', icon: 'globe',
      toolbar: [{ id: 'home', label: 'Home', icon: 'home' }, 'sep', 'back', 'forward', 'sep',
        { id: 'favorites', label: 'Favorites', icon: 'star' }, 'sep',
        { id: 'theme', label: 'Light/Dark', icon: 'theme' }],
      onTool: projectsTool,
      width: 860, height: 760, statusRight: 'My Projects',
      view: projectsView()
    }),

    contact: () => window.XPWM.open({
      id: 'contact', title: 'Contact Me', icon: 'mail', chrome: 'simple',
      width: 620, height: 470, statusRight: 'My Computer', view: contactView()
    }),

    resume: () => window.XPWM.open({
      id: 'resume', title: 'Resume.txt - Notepad', icon: 'pdf', chrome: 'simple',
      width: 720, height: 640, statusRight: 'Notepad', view: resumeView()
    }),

    game: () => window.XPWM.open({
      id: 'game', title: 'Minecraft', icon: 'blocks', chrome: 'simple',
      menu: ['Game', 'Help'],
      toolbar: [{ id: 'newworld', label: 'New World', icon: 'blocks' }],
      onTool: (id) => { if (id === 'newworld') XPGame.newWorld(); },
      width: 860, height: 600, statusRight: 'Minecraft', view: gameView()
    }),

    /* Opens My Projects and jumps straight to one project. */
    project: (id) => {
      const p = projects.find(x => x.id === id);
      const win = apps.projects();
      if (p && win && win.api) win.api.navigate(detailView(p));
      return win;
    }
  };

  window.XPApps = apps;
})();
