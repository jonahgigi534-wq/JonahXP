/* The "JonahXP" lockup: a waving four-pane flag plus wordmark.
   Used by the boot splash and the login screen. Drawn from scratch so the
   site carries no third-party logo artwork. */
(function () {

  /* Four curved panes in a rotated group, each with its own gradient and a
     gloss highlight across the upper half. */
  function flag(id) {
    const g = (name, a, b) =>
      `<linearGradient id="${id}-${name}" x1="0" y1="0" x2="0.9" y2="1">
         <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
       </linearGradient>`;

    return `<svg viewBox="0 0 128 112" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <defs>
        ${g('r', '#f98b2f', '#d8410d')}
        ${g('g', '#a6e05a', '#4d9c12')}
        ${g('b', '#5bb4f2', '#1160c4')}
        ${g('y', '#ffd24a', '#e8a005')}
        <linearGradient id="${id}-gloss" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff" stop-opacity=".55"/>
          <stop offset="1" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <g transform="rotate(-11 64 56)">
        <path d="M14,30 C30,20 45,16 60,16 L61,52 C46,52 30,57 16,66 Z" fill="url(#${id}-r)"/>
        <path d="M68,16 C84,16 100,12 114,5 L115,41 C101,48 85,52 69,52 Z" fill="url(#${id}-g)"/>
        <path d="M16,72 C30,63 46,58 61,58 L62,94 C47,94 31,99 17,108 Z" fill="url(#${id}-b)"/>
        <path d="M69,58 C85,58 101,54 115,47 L116,83 C102,90 86,94 70,94 Z" fill="url(#${id}-y)"/>
        <g fill="url(#${id}-gloss)">
          <path d="M14,30 C30,20 45,16 60,16 L60,30 C45,30 30,34 15,43 Z"/>
          <path d="M68,16 C84,16 100,12 114,5 L114,19 C100,26 84,30 68,30 Z"/>
          <path d="M16,72 C30,63 46,58 61,58 L61,71 C46,71 31,76 17,85 Z"/>
          <path d="M69,58 C85,58 101,54 115,47 L115,60 C101,67 85,71 69,71 Z"/>
        </g>
      </g>
    </svg>`;
  }

  /* Full lockup. `tone` picks white-on-dark (boot) or the same on blue. */
  function lockup(name, sub, id) {
    id = id || 'lk';
    return `<span class="brand">
      <span class="brand-flag">${flag(id)}</span>
      <span class="brand-text">
        <span class="brand-name">${name}<sup>xp</sup></span>
        <span class="brand-sub">${sub}</span>
      </span>
    </span>`;
  }

  window.XPBrand = { flag, lockup };
})();
