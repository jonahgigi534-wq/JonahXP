/* Desktop icon grid. Single click selects, double click (or Enter) opens. */
(function () {
  const I = window.XPIcons;

  const ITEMS = [
    { id: 'about',    label: 'About Me',    icon: 'user',   open: () => XPApps.about() },
    { id: 'resume',   label: 'My Resume',   icon: 'pdf',    open: () => XPApps.resume() },
    { id: 'projects', label: 'My Projects', icon: 'globe',  open: () => XPApps.projects() },
    { id: 'contact',  label: 'Contact Me',  icon: 'mail',   open: () => XPApps.contact() }
  ];

  function render() {
    const host = document.getElementById('desktopIcons');
    host.innerHTML = '';

    ITEMS.forEach((item) => {
      const btn = document.createElement('button');
      btn.className = 'dicon';
      btn.dataset.id = item.id;
      btn.innerHTML = I[item.icon]() + '<span class="dicon-label">' + item.label + '</span>';

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        select(host, btn);
      });
      btn.addEventListener('dblclick', item.open);
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.open(); }
      });

      host.appendChild(btn);
    });

    // Clicking bare desktop clears the selection.
    document.querySelector('.wallpaper').addEventListener('click', () => select(host, null));
  }

  function select(host, btn) {
    host.querySelectorAll('.dicon').forEach(b => b.classList.remove('is-selected'));
    if (btn) btn.classList.add('is-selected');
  }

  window.XPDesktop = { render };
})();
