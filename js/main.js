/* Boot order for the shell. */
(function () {
  function start() {
    XPBoot.init();
    XPDesktop.render();
    XPTaskbar.init();
    XPStartMenu.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
