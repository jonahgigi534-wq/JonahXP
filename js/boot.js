/* Welcome screen: click the user tile to enter the desktop. */
(function () {
  const I = window.XPIcons;

  function enter() {
    const boot = document.getElementById('boot');
    boot.classList.add('is-leaving');
    document.getElementById('screen').hidden = false;
    setTimeout(() => { boot.hidden = true; }, 450);
  }

  function logOff() {
    XPWM.list().forEach(w => XPWM.close(w.id));
    const boot = document.getElementById('boot');
    boot.hidden = false;
    requestAnimationFrame(() => boot.classList.remove('is-leaving'));
    document.getElementById('screen').hidden = true;
  }

  function init() {
    document.getElementById('bootFlag').innerHTML = I.flag();
    document.getElementById('bootPic').innerHTML = I.avatar();
    document.getElementById('bootUser').addEventListener('click', enter);
  }

  window.XPBoot = { init, enter, logOff };
})();
