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

  window.XPIcons = {
    flag, avatar, user, globe, pdf, mail, folder, terminal,
    closeX, arrow, go, minGlyph, maxGlyph, restoreGlyph, closeGlyph,
    trayNet, trayShield, trayInfo,
    github, linkedin, mailSmall, external,
    gAll, gChip, gBrain, gApp, power, logoff
  };
})();
