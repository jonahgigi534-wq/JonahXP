/* Start menu: XP two-column layout, opened from the Start button. */
(function () {
  const I = window.XPIcons;
  const { profile, projects } = window.XPData;

  let open = false;

  const LEFT = [
    { icon: 'globe', title: 'My Projects', sub: 'View my work', bold: true, run: () => XPApps.projects() },
    { icon: 'mail',  title: 'Contact Me',  sub: 'Send me a message', bold: true, run: () => XPApps.contact() },
    { sep: true },
    { icon: 'user',  title: 'About Me',  run: () => XPApps.about() },
    { icon: 'pdf',   title: 'My Resume', run: () => XPApps.resume() }
  ];

  function build() {
    const menu = document.getElementById('startMenu');

    const item = (it) => {
      if (it.sep) return '<div class="sm-sep"></div>';
      const glyph = I[it.icon] ? I[it.icon]() : I.folder();
      const sub = it.sub ? '<span class="sm-item-sub">' + it.sub + '</span>' : '';
      return '<button class="sm-item" data-run="' + it.key + '">' + glyph +
        '<span class="sm-item-text"><span class="sm-item-title' + (it.bold ? ' bold' : '') + '">' +
        it.title + '</span>' + sub + '</span></button>';
    };

    // Right column lists the projects themselves, like XP's pinned shortcuts.
    const right = projects.map((p, i) => ({
      key: 'p' + i, icon: 'folder', title: p.title.split(' — ')[0],
      run: () => XPApps.project(p.id)
    }));

    const left = LEFT.map((it, i) => ({ ...it, key: 'l' + i }));
    const registry = {};
    [...left, ...right].forEach(it => { if (it.run) registry[it.key] = it.run; });

    menu.innerHTML =
      '<div class="sm-head"><span class="sm-head-pic">' + I.avatar() + '</span>' +
      '<span class="sm-head-name">' + profile.name + '</span></div>' +
      '<div class="sm-cols">' +
        '<div class="sm-col sm-col-left">' + left.map(item).join('') + '</div>' +
        '<div class="sm-col sm-col-right">' + right.map(item).join('') +
          '<div class="sm-sep"></div>' +
          '<a class="sm-item" href="' + profile.github + '" target="_blank" rel="noopener noreferrer">' +
            I.github() + '<span class="sm-item-text"><span class="sm-item-title">GitHub</span></span></a>' +
        '</div>' +
      '</div>' +
      '<div class="sm-foot">' +
        '<span class="sm-foot-btn" data-foot="logoff">' + I.logoff() + 'Log Off</span>' +
        '<span class="sm-foot-btn" data-foot="shutdown">' + I.power() + 'Shut Down</span>' +
      '</div>';

    menu.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-run]');
      if (btn && registry[btn.dataset.run]) { registry[btn.dataset.run](); hide(); return; }
      const foot = e.target.closest('[data-foot]');
      if (foot) { hide(); window.XPBoot.logOff(); return; }
      if (e.target.closest('a')) hide();
    });
  }

  function show() {
    open = true;
    XPAudio.play('menu');
    document.getElementById('startMenu').hidden = false;
    document.getElementById('startBtn').classList.add('is-open');
  }

  function hide() {
    open = false;
    document.getElementById('startMenu').hidden = true;
    document.getElementById('startBtn').classList.remove('is-open');
  }

  function init() {
    build();
    document.getElementById('startBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      open ? hide() : show();
    });
    document.addEventListener('click', (e) => {
      if (open && !e.target.closest('#startMenu')) hide();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) hide(); });
  }

  window.XPStartMenu = { init, hide };
})();
