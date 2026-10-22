/* Start-up sequence: boot splash -> login screen -> desktop.

   Timings mirror the real thing closely enough to feel right without
   making a visitor wait: the splash holds for a beat, fades through
   black, then the welcome screen waits for a click. */
(function () {
  const I = window.XPIcons;
  const B = window.XPBrand;

  const SPLASH_MS = 2600;   // how long the marquee runs
  const WELCOME_MS = 2200;  // how long "welcome" holds before the desktop
  const FADE_MS = 500;      // must match the CSS transition

  let entering = false;

  const $ = (id) => document.getElementById(id);

  /* A returning visitor within the same tab skips straight to the login. */
  const seen = () => {
    try { return sessionStorage.getItem('jonahxp.booted') === '1'; }
    catch (e) { return false; }
  };
  const markSeen = () => {
    try { sessionStorage.setItem('jonahxp.booted', '1'); } catch (e) { /* private mode */ }
  };

  /* CRT/VHS overlay (css/crt.css): on for the boot screens, faded out once
     the desktop is up. `powerOn` adds the brief warm-up glitch. */
  const body = document.body;
  function crtOn(powerOn) {
    body.classList.remove('crt-fading');
    body.classList.add('crt-on');
    if (powerOn) {
      body.classList.add('crt-turning-on');
      setTimeout(() => body.classList.remove('crt-turning-on'), 320);
    }
  }
  function crtOff() {
    body.classList.add('crt-fading');
    setTimeout(() => {
      // Only drop it if nothing switched it back on during the fade.
      if (body.classList.contains('crt-fading')) {
        body.classList.remove('crt-on', 'crt-fading');
      }
    }, FADE_MS);
  }

  function paint() {
    $('splashBrand').innerHTML = B.lockup('Jonah', 'Developer', 'sp');
    $('bootBrand').innerHTML = B.lockup('Jonah', 'Developer', 'bt');
    $('bootPic').innerHTML = XPAvatar.tile();
    $('bootRestartIcon').innerHTML = I.restart();
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

  /* Click the user tile -> "welcome" -> desktop.
     The desktop is revealed underneath and the welcome screen fades off it,
     so the two cross-fade rather than cutting through black. */
  function enter() {
    if (entering) return;
    entering = true;

    // First real gesture of the session: this is where audio becomes legal.
    // The context stays running, so the chime can wait for the desktop.
    XPAudio.unlock();

    const boot = $('boot');
    boot.classList.add('is-welcome');

    setTimeout(() => {
      $('screen').hidden = false;
      boot.classList.add('is-leaving');
      crtOff();
      XPAudio.play('startup');
      setTimeout(() => {
        boot.hidden = true;
        boot.classList.remove('is-welcome');
        entering = false;
      }, FADE_MS);
    }, WELCOME_MS);
  }

  /* Start menu "Log Off" / "Shut Down" returns here. */
  function logOff() {
    XPAudio.play('logoff');
    XPWM.list().forEach(w => XPWM.close(w.id, true));
    XPStartMenu.hide();
    const boot = $('boot');
    boot.hidden = false;
    crtOn(true);
    requestAnimationFrame(() => boot.classList.remove('is-leaving'));
    $('screen').hidden = true;
  }

  /* "Restart JonahXP" replays the splash from the top. */
  function restart() {
    const splash = $('splash');
    $('boot').hidden = true;
    splash.hidden = false;
    document.body.classList.add('is-booting');
    crtOn(true);
    requestAnimationFrame(() => splash.classList.remove('is-leaving'));
    setTimeout(showLogin, SPLASH_MS);
  }

  function init() {
    paint();
    crtOn(true);
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
