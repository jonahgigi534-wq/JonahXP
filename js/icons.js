/* Inline SVG icon set. Everything is hand-drawn so the site ships no
   third-party or Microsoft artwork and needs no image files. */
(function () {
  const wrap = (vb, body) =>
    `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${body}</svg>`;

  /* --- Shell marks --- */
  const flag = () => wrap('0 0 24 22', `
    <defs>
      <linearGradient id="fgR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff8a3d"/><stop offset="1" stop-color="#e2521a"/></linearGradient>
      <linearGradient id="fgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8ed957"/><stop offset="1" stop-color="#3f9a22"/></linearGradient>
      <linearGradient id="fgB" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fa8f7"/><stop offset="1" stop-color="#1361d8"/></linearGradient>
      <linearGradient id="fgY" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd34d"/><stop offset="1" stop-color="#f0a713"/></linearGradient>
    </defs>
    <g transform="rotate(-9 12 11)">
      <path d="M2 3.6 Q6 2 10.6 3.1 L10.6 10 Q6 8.9 2 10.4 Z" fill="url(#fgR)"/>
      <path d="M12.2 3.3 Q17 4.3 21.6 2.6 L21.6 9.6 Q17 11.2 12.2 10.2 Z" fill="url(#fgG)"/>
      <path d="M2 11.8 Q6 10.3 10.6 11.4 L10.6 18.4 Q6 17.3 2 18.8 Z" fill="url(#fgB)"/>
      <path d="M12.2 11.6 Q17 12.6 21.6 11 L21.6 18 Q17 19.6 12.2 18.5 Z" fill="url(#fgY)"/>
    </g>`);

  const avatar = () => wrap('0 0 64 64', `
    <defs><linearGradient id="avbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0ff"/><stop offset="1" stop-color="#7fb6ef"/></linearGradient></defs>
    <rect width="64" height="64" fill="url(#avbg)"/>
    <circle cx="32" cy="58" r="22" fill="#2f6fd0"/>
    <path d="M14 64c0-10 8-16 18-16s18 6 18 16z" fill="#3f86e0"/>
    <circle cx="32" cy="27" r="13" fill="#f0c191"/>
    <path d="M19 26c0-9 6-14 13-14s13 5 13 14c0-4-5-6-13-6s-13 2-13 6z" fill="#3b2a1d"/>
    <circle cx="27" cy="27" r="1.6" fill="#2b1d12"/><circle cx="37" cy="27" r="1.6" fill="#2b1d12"/>
    <path d="M28 33q4 3 8 0" stroke="#b9753f" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);

  /* --- Desktop / app icons --- */
  const user = () => wrap('0 0 48 48', `
    <defs><linearGradient id="ug" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fc4f5"/><stop offset="1" stop-color="#1a63cc"/></linearGradient></defs>
    <circle cx="24" cy="24" r="21" fill="url(#ug)" stroke="#0d4a9e" stroke-width="1.5"/>
    <circle cx="24" cy="19" r="8" fill="#fff"/>
    <path d="M9 42c1-10 7-15 15-15s14 5 15 15z" fill="#fff"/>`);

  const globe = () => wrap('0 0 48 48', `
    <defs><radialGradient id="gg" cx="35%" cy="28%"><stop offset="0" stop-color="#9fd8fb"/><stop offset="1" stop-color="#0f5fc4"/></radialGradient></defs>
    <circle cx="24" cy="24" r="20" fill="url(#gg)" stroke="#0a3f8e" stroke-width="1.5"/>
    <ellipse cx="24" cy="24" rx="20" ry="8" fill="none" stroke="#e8f4ff" stroke-width="1.4" opacity=".85"/>
    <ellipse cx="24" cy="24" rx="9" ry="20" fill="none" stroke="#e8f4ff" stroke-width="1.4" opacity=".85"/>
    <path d="M4 24h40M24 4v40" stroke="#e8f4ff" stroke-width="1.2" opacity=".6"/>`);

  const pdf = () => wrap('0 0 48 48', `
    <path d="M10 3h20l10 10v32H10z" fill="#fefefe" stroke="#9a9a9a" stroke-width="1.4"/>
    <path d="M30 3l10 10H30z" fill="#dcdcdc" stroke="#9a9a9a" stroke-width="1.4"/>
    <rect x="4" y="16" width="30" height="15" rx="2.5" fill="#d8232a"/>
    <text x="19" y="27" font-family="Tahoma,sans-serif" font-size="10" font-weight="bold" fill="#fff" text-anchor="middle">PDF</text>
    <path d="M16 36h16M16 40h11" stroke="#b9b9b9" stroke-width="1.6" stroke-linecap="round"/>`);

  const mail = () => wrap('0 0 48 48', `
    <defs><linearGradient id="mg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d7e6f7"/></linearGradient></defs>
    <rect x="4" y="11" width="40" height="27" rx="2.5" fill="url(#mg)" stroke="#5a86bb" stroke-width="1.5"/>
    <path d="M4.5 12.5 24 26 43.5 12.5" fill="none" stroke="#5a86bb" stroke-width="1.8"/>
    <path d="M4.5 37 18 25M43.5 37 30 25" fill="none" stroke="#9db8d8" stroke-width="1.3"/>
    <circle cx="37" cy="33" r="10" fill="#3f9a22" stroke="#2a6f16" stroke-width="1.2"/>
    <path d="M32 33.5l3.5 3.5 6.5-7" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);

  const folder = () => wrap('0 0 48 48', `
    <defs><linearGradient id="fdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffdf8a"/><stop offset="1" stop-color="#eda92a"/></linearGradient></defs>
    <path d="M4 12a2 2 0 012-2h12l4 4h20a2 2 0 012 2v22a2 2 0 01-2 2H6a2 2 0 01-2-2z" fill="url(#fdg)" stroke="#b9801a" stroke-width="1.4"/>`);

  const terminal = () => wrap('0 0 48 48', `
    <rect x="4" y="8" width="40" height="32" rx="2" fill="#0d0d0d" stroke="#555" stroke-width="1.4"/>
    <path d="M11 18l6 5-6 5" stroke="#d8d8d8" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22 30h14" stroke="#d8d8d8" stroke-width="2.2" stroke-linecap="round"/>`);

  /* --- Small chrome glyphs --- */
  const closeX = () => wrap('0 0 24 24', `<path d="M5 5l14 14M19 5L5 19" stroke="#d23b13" stroke-width="3.4" stroke-linecap="round"/>`);
  const arrow = (dir) => {
    const d = dir === 'left' ? 'M14.5 5.5L8 12l6.5 6.5' : 'M9.5 5.5L16 12l-6.5 6.5';
    return wrap('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="#4aa54f" stroke="#2b7530" stroke-width="1.2"/><path d="${d}" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  };
  const go = () => wrap('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="#4aa54f" stroke="#2b7530" stroke-width="1.2"/><path d="M9 5.5L15.5 12 9 18.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  const minGlyph = () => wrap('0 0 12 12', `<path d="M2.5 9h7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`);
  const maxGlyph = () => wrap('0 0 12 12', `<rect x="2" y="2.5" width="8" height="7.5" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M2 4.2h8" stroke="#fff" stroke-width="1.8"/>`);
  const restoreGlyph = () => wrap('0 0 12 12', `<rect x="1.5" y="4" width="6.5" height="6" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M4 4V2h6.5v6H8.5" fill="none" stroke="#fff" stroke-width="1.5"/>`);
  const closeGlyph = () => wrap('0 0 12 12', `<path d="M2.6 2.6l6.8 6.8M9.4 2.6L2.6 9.4" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>`);

  /* --- Tray --- */
  const trayNet = () => wrap('0 0 16 16', `<rect x="1" y="4" width="7" height="6" rx="1" fill="#e6f2ff" stroke="#0a4a9e"/><rect x="7" y="7" width="8" height="6" rx="1" fill="#cfe4ff" stroke="#0a4a9e"/>`);
  const trayShield = () => wrap('0 0 16 16', `<path d="M8 1.3l5.6 2v4.4c0 3.3-2.4 6-5.6 7-3.2-1-5.6-3.7-5.6-7V3.3z" fill="#3f9a22" stroke="#26651a"/><path d="M5.4 8l2 2 3.4-4" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);
  const trayInfo = () => wrap('0 0 16 16', `<circle cx="8" cy="8" r="6.7" fill="#1e88e5" stroke="#0d4f97"/><path d="M8 6.8v4.2" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="4.6" r="1.1" fill="#fff"/>`);

  const traySpeaker = () => wrap('0 0 16 16', `<path d="M3 6.2h2.6L8.8 3.4v9.2L5.6 9.8H3z" fill="#e9f3ff" stroke="#0a4a9e" stroke-width="1.1" stroke-linejoin="round"/><path d="M10.6 5.6a4 4 0 0 1 0 4.8M12.4 4a6.4 6.4 0 0 1 0 8" stroke="#0a4a9e" stroke-width="1.2" fill="none" stroke-linecap="round"/>`);
  const traySpeakerOff = () => wrap('0 0 16 16', `<path d="M3 6.2h2.6L8.8 3.4v9.2L5.6 9.8H3z" fill="#e9f3ff" stroke="#0a4a9e" stroke-width="1.1" stroke-linejoin="round"/><path d="M11 6l3.4 4M14.4 6L11 10" stroke="#d8232a" stroke-width="1.5" fill="none" stroke-linecap="round"/>`);

  /* Green tile with a white burst, for "Restart" on the login screen. */
  const restart = () => wrap('0 0 32 32', `
    <defs><linearGradient id="rsg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#5cc45c"/><stop offset="1" stop-color="#22862b"/>
    </linearGradient></defs>
    <rect x="1" y="1" width="30" height="30" rx="4" fill="url(#rsg)" stroke="#0f5a17"/>
    <rect x="2" y="2" width="28" height="28" rx="3" fill="none" stroke="#ffffff" stroke-opacity=".35"/>
    <g stroke="#ffffff" stroke-width="2.2" stroke-linecap="round">
      <path d="M16 6.5v4M16 21.5v4M6.5 16h4M21.5 16h4M9.3 9.3l2.8 2.8M19.9 19.9l2.8 2.8M9.3 22.7l2.8-2.8M19.9 12.1l2.8-2.8"/>
    </g>`);

  /* --- Social --- */
  const github = () => wrap('0 0 24 24', `<path fill="currentColor" d="M12 .5C5.7.5.6 5.6.6 11.9c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6a11.4 11.4 0 007.8-10.8C23.4 5.6 18.3.5 12 .5z"/>`);
  const linkedin = () => wrap('0 0 24 24', `<path fill="currentColor" d="M20.4 0H3.6A3.6 3.6 0 000 3.6v16.8A3.6 3.6 0 003.6 24h16.8a3.6 3.6 0 003.6-3.6V3.6A3.6 3.6 0 0020.4 0zM7.3 20.4H3.6V9h3.7zM5.4 7.4a2.1 2.1 0 110-4.3 2.1 2.1 0 010 4.3zM20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.9-3s-2.1 1.5-2.1 2.9v5.7H9.2V9h3.5v1.6h.05a3.8 3.8 0 013.4-1.9c3.7 0 4.3 2.4 4.3 5.5z"/>`);
  const mailSmall = () => wrap('0 0 24 24', `<path fill="currentColor" d="M2 5.5A1.5 1.5 0 013.5 4h17A1.5 1.5 0 0122 5.5v13a1.5 1.5 0 01-1.5 1.5h-17A1.5 1.5 0 012 18.5zM4 6.6v.3l8 5.4 8-5.4v-.3z"/>`);
  const external = () => wrap('0 0 24 24', `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5"/>`);

  /* --- Sidebar filter glyphs --- */
  const gAll = () => wrap('0 0 24 24', `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>`);
  const gChip = () => wrap('0 0 24 24', `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 7h10v10H7zM9.5 3v4M14.5 3v4M9.5 17v4M14.5 17v4M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/>`);
  const gBrain = () => wrap('0 0 24 24', `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4a3 3 0 00-3 3 3 3 0 00-2 5.2A3 3 0 009 18a3 3 0 003 2 3 3 0 003-2 3 3 0 002-5.8A3 3 0 0015 7a3 3 0 00-3-3zM12 4v16"/>`);
  const gApp = () => wrap('0 0 24 24', `<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 9h18"/>`);

  const power = () => wrap('0 0 24 24', `<circle cx="12" cy="12" r="10" fill="#e2521a" stroke="#fff" stroke-width="1.4"/><path d="M12 6.5v6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M8 9a5.5 5.5 0 108 0" stroke="#fff" stroke-width="2.1" fill="none" stroke-linecap="round"/>`);
  const logoff = () => wrap('0 0 24 24', `<circle cx="12" cy="12" r="10" fill="#f0a713" stroke="#fff" stroke-width="1.4"/><path d="M14.5 8.5H9.5a1 1 0 00-1 1v5a1 1 0 001 1h5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M13 12h5m0 0l-2-2m2 2l-2 2" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`);

  /* --- Explorer toolbar --- */
  const home = () => wrap('0 0 24 24', `
    <defs><linearGradient id="hmr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6a04d"/><stop offset="1" stop-color="#cf5d16"/></linearGradient></defs>
    <path d="M5 11.5V20.5h14V11.5" fill="#f7f1df" stroke="#8a7a55" stroke-width="1"/>
    <path d="M2.5 12.5 12 4l9.5 8.5" fill="none" stroke="url(#hmr)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="10" y="14.5" width="4" height="6" fill="#7b5a2e"/>
    <rect x="15.5" y="13" width="2.5" height="2.5" fill="#7fb6ef" stroke="#5a7fa8" stroke-width=".6"/>`);
  const star = () => wrap('0 0 24 24', `
    <defs><linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset="1" stop-color="#f2b821"/></linearGradient></defs>
    <path d="M12 2.5l2.8 6 6.5.7-4.9 4.4 1.4 6.4L12 16.7 6.2 20l1.4-6.4L2.7 9.2l6.5-.7z" fill="url(#stg)" stroke="#c18a12" stroke-width="1" stroke-linejoin="round"/>`);
  const theme = () => wrap('0 0 24 24', `
    <rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="#1d2b6b" stroke="#c49a2a" stroke-width="1.2"/>
    <path d="M12 4.5v15a7.5 7.5 0 010-15z" fill="#ffd34d"/>
    <path d="M12 4.5a7.5 7.5 0 010 15z" fill="#0b1440"/>
    <path d="M14.2 8.2a4 4 0 104.2 6.4 4.6 4.6 0 01-4.2-6.4z" fill="#e8eefc"/>`);
  const caret = () => wrap('0 0 12 12', `<path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`);
  const search = () => wrap('0 0 24 24', `<circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`);

  /* Round "collapse" button on the About side cards; `open` points the
     chevrons up. */
  const collapse = (open) => wrap('0 0 16 16', `
    <circle cx="8" cy="8" r="7" fill="#fff" stroke="#8aa3d8" stroke-width="1"/>
    <path d="${open ? 'M5 7.5l3-3 3 3M5 11l3-3 3 3' : 'M5 5l3 3 3-3M5 8.5l3 3 3-3'}" fill="none" stroke="#1b3f9c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`);

  /* Small list glyphs for the About side cards. `tile` is a rounded square
     with a short label, used for software so no product logos ship. */
  const tile = (bg, fg, text) => wrap('0 0 16 16', `
    <rect x=".5" y=".5" width="15" height="15" rx="3.5" fill="${bg}"/>
    <text x="8" y="11.2" font-family="Tahoma,sans-serif" font-size="${text.length > 2 ? 6 : 7.5}" font-weight="bold" fill="${fg}" text-anchor="middle">${text}</text>`);
  const dot = (color, body) => wrap('0 0 16 16', `<circle cx="8" cy="8" r="7.2" fill="${color}"/><g fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${body}</g>`);

  /* Larger pictures beside the About paragraphs. */
  const aboutCode = () => wrap('0 0 64 64', `
    <defs><linearGradient id="acg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dbe6f5"/></linearGradient></defs>
    <rect x="6" y="9" width="52" height="40" rx="4" fill="#2d3b55" stroke="#141d2e" stroke-width="1.5"/>
    <rect x="10" y="13" width="44" height="31" rx="1.5" fill="url(#acg)"/>
    <path d="M22 22l-6 6.5 6 6.5M42 22l6 6.5-6 6.5" fill="none" stroke="#1f6fd6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M35 20l-6 17" stroke="#e2521a" stroke-width="3" stroke-linecap="round"/>
    <path d="M24 49h16l3 7H21z" fill="#9aa6b8" stroke="#5d6879" stroke-width="1.2"/>`);
  const aboutGauge = () => wrap('0 0 64 64', `
    <defs><linearGradient id="agg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e2521a"/><stop offset=".5" stop-color="#f2b821"/><stop offset="1" stop-color="#3f9a22"/></linearGradient></defs>
    <circle cx="32" cy="36" r="25" fill="#f7f7f2" stroke="#3a4660" stroke-width="2"/>
    <path d="M13 40a19 19 0 0138 0" fill="none" stroke="url(#agg)" stroke-width="6" stroke-linecap="round"/>
    <path d="M32 40 43 24" stroke="#20283a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="40" r="4" fill="#20283a"/>
    <path d="M20 52h24" stroke="#a4adbd" stroke-width="2.4" stroke-linecap="round"/>`);

  /* Isometric grass block, for BlockCraft. */
  const blocks = () => wrap('0 0 48 48', `
    <path d="M24 5 43 15 24 25 5 15z" fill="#6cb43f" stroke="#2f5d17" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5 15 24 25v19L5 34z" fill="#8a6343" stroke="#3f2b1b" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M43 15 24 25v19l19-10z" fill="#6f4f35" stroke="#3f2b1b" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M5 15 24 25l0 5-3.5-1.8v2.6L17 29l0-2.4-4-2v3l-3.5-1.8V22L5 20z" fill="#5c9c33"/>
    <path d="M43 15 24 25v5l4-2v2.5l3.5-1.8V26l4-2v2.8L39 25v-3l4-2z" fill="#4c8a29"/>
    <path d="M14 34l3 1.5M10 27l2 1M33 34l3-1.5M30 40l2.5-1.2" stroke="#5d4330" stroke-width="1.6" stroke-linecap="round"/>`);

  /* Picture-viewer toolbar (My Resume). */
  const zoom = () => wrap('0 0 24 24', `
    <circle cx="10" cy="10" r="6.5" fill="#dff0ff" stroke="#2f6fbf" stroke-width="2"/>
    <path d="M7 10h6M10 7v6" stroke="#2f6fbf" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M15 15l6 6" stroke="#8a5a1c" stroke-width="3.2" stroke-linecap="round"/>`);
  const save = () => wrap('0 0 24 24', `
    <rect x="2.5" y="2.5" width="19" height="19" rx="2" fill="#3d63c9" stroke="#1d3a86"/>
    <rect x="6" y="3" width="12" height="7" fill="#f4f6fb"/>
    <rect x="14" y="4.2" width="2.2" height="4.4" fill="#3d63c9"/>
    <rect x="5.5" y="13.5" width="13" height="8" rx="1" fill="#c9d4ee"/>`);
  const print = () => wrap('0 0 24 24', `
    <rect x="6" y="2.5" width="12" height="7" fill="#fff" stroke="#777"/>
    <rect x="2.5" y="9" width="19" height="9" rx="2" fill="#c9c9c9" stroke="#6d6d6d"/>
    <rect x="6" y="14.5" width="12" height="7" fill="#fff" stroke="#777"/>
    <circle cx="18" cy="12" r="1" fill="#4caf50"/>`);
  const contact = () => wrap('0 0 24 24', `
    <path d="M4 12a8 8 0 0113.7-5.6" fill="none" stroke="#2f8be0" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M18.8 3v4.6h-4.6" fill="none" stroke="#2f8be0" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20 12a8 8 0 01-13.7 5.6" fill="none" stroke="#3faf46" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M5.2 21v-4.6h4.6" fill="none" stroke="#3faf46" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`);

  window.XPIcons = {
    zoom, save, print, contact,
    blocks,
    home, star, theme, caret, search, collapse, tile, dot, aboutCode, aboutGauge,
    flag, avatar, user, globe, pdf, mail, folder, terminal,
    closeX, arrow, go, minGlyph, maxGlyph, restoreGlyph, closeGlyph,
    trayNet, trayShield, trayInfo, traySpeaker, traySpeakerOff, restart,
    github, linkedin, mailSmall, external,
    gAll, gChip, gBrain, gApp, power, logoff
  };
})();
