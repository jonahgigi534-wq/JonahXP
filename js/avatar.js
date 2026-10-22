/* The user picture: a sky, a slow loop of clouds drifting behind, and the
   person cut out on top (assets/avatar-figure.png, made by
   scripts/make_avatar.py).

   The clouds are a strip twice the tile's width holding two identical
   halves, so sliding it left by exactly half loops with no visible seam. */
(function () {
  const FIGURE = 'assets/avatar-figure.png?v=2';

  /* One tile's worth of clouds, in a 100x100 box. Kept to the sides and
     low corners, where the figure leaves sky showing. */
  const CLOUDS = `
    <g class="avatar-cloud">
      <ellipse cx="10" cy="34" rx="12" ry="5.5"/>
      <circle cx="6" cy="31" r="5"/><circle cx="12" cy="28" r="6.5"/><circle cx="18" cy="31" r="4.5"/>
    </g>
    <g class="avatar-cloud">
      <ellipse cx="84" cy="24" rx="13" ry="5"/>
      <circle cx="79" cy="21" r="5.5"/><circle cx="86" cy="18" r="7"/><circle cx="93" cy="22" r="4.5"/>
    </g>
    <g class="avatar-cloud">
      <ellipse cx="14" cy="76" rx="9" ry="4"/>
      <circle cx="11" cy="74" r="4"/><circle cx="16" cy="72" r="4.8"/>
    </g>
    <g class="avatar-cloud">
      <ellipse cx="62" cy="9" rx="7" ry="3"/>
      <circle cx="60" cy="7" r="3.4"/><circle cx="65" cy="6.5" r="3"/>
    </g>`;

  /* Each tile gets its own gradient id: a shared one would resolve to the
     first copy, which lives on the login screen and is hidden after login. */
  let seq = 0;

  const strip = (gid) =>
    `<svg class="avatar-clouds" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
       <defs>
         <linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0" stop-color="#ffffff"/>
           <stop offset="1" stop-color="#dcebf8"/>
         </linearGradient>
       </defs>
       <g fill="url(#${gid})">${CLOUDS}<g transform="translate(100 0)">${CLOUDS}</g></g>
     </svg>`;

  /* `still` skips the drift: used where many small copies share the screen. */
  function tile(opts) {
    const still = opts && opts.still;
    return `<span class="avatar${still ? ' is-still' : ''}">
      ${strip('avc' + (++seq))}
      <img class="avatar-figure" src="${FIGURE}" alt="" draggable="false"
           onerror="XPAvatar.fallback(this)">
    </span>`;
  }

  /* If the cut-out is missing, fall back to the drawn avatar so the tile is
     never empty. */
  function fallback(img) {
    const span = document.createElement('span');
    span.className = 'avatar-figure avatar-figure-drawn';
    span.innerHTML = window.XPIcons.avatar();
    img.replaceWith(span);
  }

  window.XPAvatar = { tile, fallback };
})();
