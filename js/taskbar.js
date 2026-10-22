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
    const host = document.getElementById('trayIcons');
    const muted = XPAudio.isMuted();
    host.innerHTML =
      '<button class="tray-btn" id="traySound" title="' +
      (muted ? 'Sound off' : 'Sound on') + '">' +
      (muted ? I.traySpeakerOff() : I.traySpeaker()) + '</button>' +
      I.trayNet() + I.trayShield() +
      '<button class="tray-btn" id="trayWelcome" title="Welcome">' + I.trayInfo() + '</button>';

    document.getElementById('traySound').addEventListener('click', () => {
      XPAudio.unlock();
      XPAudio.toggle();
      if (!XPAudio.isMuted()) XPAudio.play('menu');
    });
    document.getElementById('trayWelcome').addEventListener('click', () => {
      if (balloon) hideBalloon();
      else showBalloon();
    });
  }

  /* ---------- welcome balloon ----------
     The XP notification bubble, pointing at the info icon in the tray.
     Shown once the desktop is up after each login, and again from the
     icon. It closes itself after a while, or with its X. */
  const BALLOON_MS = 15000;
  let balloon = null;
  let balloonTimer = 0;

  function showBalloon() {
    hideBalloon();
    balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.setAttribute('role', 'status');
    balloon.innerHTML = `
      <button class="balloon-close" aria-label="Close">&times;</button>
      <div class="balloon-head">${I.trayInfo()}<strong>Welcome to JonahXP</strong></div>
      <p>My portfolio, built as a Windows XP desktop.<br>
        - Double-click an icon to get started<br>
        - Or open a program from the Start menu</p>
      <div class="balloon-tip">Tip: My Projects has a Light/Dark switch in its toolbar.</div>`;
    balloon.querySelector('.balloon-close').addEventListener('click', hideBalloon);
    document.getElementById('screen').appendChild(balloon);
    placeBalloon();
    requestAnimationFrame(() => balloon && balloon.classList.add('is-shown'));
    XPAudio.play('balloon');
    balloonTimer = setTimeout(hideBalloon, BALLOON_MS);
  }

  /* Line the tail up with the info icon, wherever the tray puts it. */
  function placeBalloon() {
    const icon = document.getElementById('trayWelcome');
    if (!balloon || !icon) return;
    const screen = document.getElementById('screen').getBoundingClientRect();
    const r = icon.getBoundingClientRect();
    const tailX = Math.max(30, screen.right - (r.left + r.width / 2));
    balloon.style.setProperty('--tail-right', tailX + 'px');
  }

  function hideBalloon() {
    clearTimeout(balloonTimer);
    if (!balloon) return;
    const node = balloon;
    balloon = null;
    node.classList.remove('is-shown');
    setTimeout(() => node.remove(), 250);
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
    document.addEventListener('xp:audio', renderTray);
    window.addEventListener('resize', placeBalloon);
  }

  window.XPTaskbar = { init, showBalloon, hideBalloon };
})();
