/* Taskbar: one button per open window, system tray and clock. */
(function () {
  const I = window.XPIcons;

  function renderTasks() {
    const host = document.getElementById('taskList');
    const active = XPWM.active();
    host.innerHTML = '';

    XPWM.list().forEach((win) => {
      const btn = document.createElement('button');
      btn.className = 'task-btn' + (win.id === active && !win.minimized ? ' is-active' : '');
      const glyph = I[win.opts.icon] ? I[win.opts.icon]() : I.folder();
      btn.innerHTML = glyph + '<span>' + currentTitle(win) + '</span>';
      btn.title = currentTitle(win);
      btn.addEventListener('click', () => XPWM.toggle(win.id));
      host.appendChild(btn);
    });
  }

  function currentTitle(win) {
    const view = win.views[win.viewIndex];
    return (view && view.title) || win.opts.title;
  }

  function renderTray() {
    document.getElementById('trayIcons').innerHTML =
      I.trayNet() + I.trayShield() + I.trayInfo();
  }

  function startClock() {
    const node = document.getElementById('clock');
    const tick = () => {
      node.textContent = new Date()
        .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };
    tick();
    setInterval(tick, 15000);
  }

  function init() {
    document.getElementById('startFlag').innerHTML = XPBrand.flag('start');
    renderTray();
    renderTasks();
    startClock();
    document.addEventListener('xp:windows', renderTasks);
  }

  window.XPTaskbar = { init };
})();
