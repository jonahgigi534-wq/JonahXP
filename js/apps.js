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
  function aboutView() {
    return {
      title: 'About Me',
      address: 'About Me',
      render(root) {
        const page = el('div', 'about');
        page.innerHTML = `
          <div class="about-head">${I.user()}<h1>About Me</h1></div>
          ${profile.about.map(p => `<p>${p}</p>`).join('')}
          <h2>What I work with</h2>
          <div class="about-skills">
            ${profile.skills.map(s => `<span class="about-chip">${s}</span>`).join('')}
          </div>
          <h2>Find me</h2>
          <div class="about-links">
            <a class="about-link" href="${profile.github}" target="_blank" rel="noopener noreferrer">${I.github()} GitHub</a>
            <a class="about-link" href="mailto:${profile.email}">${I.mailSmall()} Email</a>
          </div>`;
        root.appendChild(page);
      }
    };
  }

  /* ---------------- My Projects ---------------- */
  let activeFilter = 'all';

  const visible = () =>
    activeFilter === 'all' ? projects : projects.filter(p => p.category === activeFilter);

  function projectsView() {
    return {
      title: 'My Projects',
      address: 'https://www.myprojects.com',
      render(root, api) {
        const page = el('div', 'proj');

        page.appendChild(el('div', 'proj-top', `
          <span class="proj-brand">${I.globe()} MyProjects</span>
          <span class="proj-top-spacer"></span>
          <span class="proj-social">
            <a href="${profile.github}" target="_blank" rel="noopener noreferrer" title="GitHub">${I.github()}</a>
            <a href="mailto:${profile.email}" title="Email">${I.mailSmall()}</a>
          </span>`));

        const main = el('div', 'proj-main');
        const side = el('nav', 'proj-side');
        const grid = el('div', 'proj-grid');

        filters.forEach((f) => {
          const btn = el('button', 'proj-side-btn' + (f.id === activeFilter ? ' is-active' : ''),
            `${I[f.icon]()}<span>${f.label}</span>`);
          btn.addEventListener('click', () => {
            activeFilter = f.id;
            side.querySelectorAll('.proj-side-btn').forEach(b => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            paintGrid(grid, api);
          });
          side.appendChild(btn);
        });

        paintGrid(grid, api);
        main.append(side, grid);
        page.appendChild(main);
        root.appendChild(page);
      }
    };
  }

  function paintGrid(grid, api) {
    grid.innerHTML = '';
    visible().forEach((p) => {
      const card = el('button', 'card', `
        <span class="card-thumb">${p.thumb()}<span class="card-badge">${p.badge}</span></span>
        <span class="card-meta">
          <span class="card-avatar">${I.avatar()}</span>
          <span class="card-meta-text">
            <span class="card-title">${p.title}</span>
            <span class="card-sub">${p.tagline}<br>${p.meta}</span>
          </span>
        </span>`);
      card.addEventListener('click', () => api.navigate(detailView(p)));
      grid.appendChild(card);
    });
    api.setStatus(`${visible().length} item(s)`);
  }

  /* ---------------- Project detail ---------------- */
  function detailView(p) {
    return {
      title: `${p.title} — My Projects`,
      address: `https://www.myprojects.com/${p.id}`,
      render(root, api) {
        const page = el('div', 'proj');
        const body = el('div', 'detail');

        const back = el('button', 'detail-back', `${I.arrow('left')} Back to projects`);
        back.addEventListener('click', () => api.back());

        body.appendChild(back);
        body.insertAdjacentHTML('beforeend', `
          <div class="detail-hero">${p.thumb()}</div>
          <h1>${p.title}</h1>
          <div class="detail-sub">${p.badge} · ${p.meta}</div>
          <div class="detail-actions">
            <a class="detail-btn primary" href="${p.repo}" target="_blank" rel="noopener noreferrer">${I.github()} View on GitHub</a>
            <a class="detail-btn" href="${p.repo}#readme" target="_blank" rel="noopener noreferrer">${I.external()} Read the docs</a>
          </div>
          <div class="detail-panel">${p.summary.map(s => `<p>${s}</p>`).join('')}</div>
          <h2>What it does</h2>
          <ul class="detail-list">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
          <h2>Built with</h2>
          <div class="detail-stack">${p.stack.map(s => `<span class="detail-tag">${s}</span>`).join('')}</div>
          <h2>Worth knowing</h2>
          <div class="detail-panel"><p>${p.notes}</p></div>`);

        page.appendChild(body);
        root.appendChild(page);
        api.setStatus(p.tagline);
      }
    };
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
            Happy to talk about any of the projects here — how they were built, what I would
            change, or where they fall short. Every repository is public, so the fastest way to
            get a feel for how I work is to read the source.
          </div>`;
        root.appendChild(page);
      }
    };
  }

  /* ---------------- Resume (Notepad) ---------------- */
  function resumeView() {
    const text = [
      '=========================================',
      ` ${profile.name.toUpperCase()} — ${profile.role.toUpperCase()}`,
      '=========================================',
      '',
      `GitHub : ${profile.github}`,
      `Email  : ${profile.email}`,
      '',
      '-- PROFILE ------------------------------',
      '',
      profile.about[0],
      '',
      '-- SELECTED PROJECTS --------------------',
      '',
      ...projects.flatMap(p => [
        `${p.title}`,
        `  ${p.tagline}`,
        `  Stack: ${p.stack.join(', ')}`,
        `  Repo : ${p.repo}`,
        ''
      ]),
      '-- SKILLS -------------------------------',
      '',
      profile.skills.join(' · '),
      ''
    ].join('\n');

    return {
      title: 'Resume.txt — Notepad',
      address: 'Resume.txt',
      render(root) {
        const page = el('div', 'notepad');
        page.textContent = text;
        root.appendChild(page);
      }
    };
  }

  /* ---------------- launchers ---------------- */
  const apps = {
    about: () => window.XPWM.open({
      id: 'about', title: 'About Me', icon: 'user', chrome: 'simple',
      width: 820, height: 560, statusRight: 'My Computer', view: aboutView()
    }),

    projects: () => window.XPWM.open({
      id: 'projects', title: 'My Projects', icon: 'globe',
      width: 960, height: 640, maximized: true, statusRight: 'My Projects',
      view: projectsView()
    }),

    contact: () => window.XPWM.open({
      id: 'contact', title: 'Contact Me', icon: 'mail', chrome: 'simple',
      width: 620, height: 470, statusRight: 'My Computer', view: contactView()
    }),

    resume: () => window.XPWM.open({
      id: 'resume', title: 'Resume.txt — Notepad', icon: 'pdf', chrome: 'simple',
      width: 640, height: 560, statusRight: 'Notepad', view: resumeView()
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
