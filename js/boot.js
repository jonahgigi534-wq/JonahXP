/* Start-up sequence: boot splash -> login screen -> desktop.

   Timings mirror the real thing closely enough to feel right without
   making a visitor wait: the splash holds for a beat, fades through
   black, then the welcome screen waits for a click. */
(function () {
  const I = window.XPIcons;
  const B = window.XPBrand;

  const SPLASH_MS = 2600;   // how long the marquee runs
  const FADE_MS = 500;      // must match the CSS transition

  const $ = (id) => document.getElementById(id);

  /* A returning visitor within the same tab skips straight to the login. */
  const seen = () => {
    try { return sessionStorage.getItem('jonahxp.booted') === '1'; }
    catch (e) { return false; }
  };
  const markSeen = () => {
    try { sessionStorage.setItem('jonahxp.booted', '1'); } catch (e) { /* private mode */ }
  };

  function paint() {
    $('splashBrand').innerHTML = B.lockup('Jonah', 'Developer', 'sp');
    $('bootBrand').innerHTML = B.lockup('Jonah', 'Developer', 'bt');
    $('bootPic').innerHTML = I.avatar();
    $('bootRestartIcon').innerHTML = B.flag('restart');
  }

  function showLogin() {
    const splash = $('splash');
    splash.classList.add('is-leaving');
    document.body.classList.remove('is-booting');
    setTimeout(() => {
      splash.hidden = true;
      $('boot').hidden = false;
      markSeen();
    }, FADE_MS);
  }

  /* Click the user tile -> desktop. */
  function enter() {
    // First real gesture of the session: this is where audio becomes legal.
    XPAudio.unlock();
    XPAudio.play('startup');
    const boot = $('boot');
    boot.classList.add('is-leaving');
    $('screen').hidden = false;
    setTimeout(() => { boot.hidden = true; }, FADE_MS);
  }

  /* Start menu "Log Off" / "Shut Down" returns here. */
  function logOff() {
    XPAudio.play('logoff');
    XPWM.list().forEach(w => XPWM.close(w.id, true));
    XPStartMenu.hide();
    const boot = $('boot');
    boot.hidden = false;
    requestAnimationFrame(() => boot.classList.remove('is-leaving'));
    $('screen').hidden = true;
  }

  /* "Restart JonahXP" replays the splash from the top. */
  function restart() {
    const splash = $('splash');
    $('boot').hidden = true;
    splash.hidden = false;
    document.body.classList.add('is-booting');
    requestAnimationFrame(() => splash.classList.remove('is-leaving'));
    setTimeout(showLogin, SPLASH_MS);
  }

  function init() {
    paint();
    $('bootUser').addEventListener('click', enter);
    $('bootRestart').addEventListener('click', restart);

    if (seen()) {
      $('splash').hidden = true;
      $('splash').classList.add('is-leaving');
      document.body.classList.remove('is-booting');
      $('boot').hidden = false;
    } else {
      setTimeout(showLogin, SPLASH_MS);
    }
  }

  window.XPBoot = { init, enter, logOff, restart };
})();
