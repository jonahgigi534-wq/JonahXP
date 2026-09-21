/* Portfolio content. Single source of truth for the shell's apps.
   Project details are drawn from each repository's own README. */
(function () {
  const svg = (body) =>
    `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${body}</svg>`;

  /* --- Generated cover art, one per project --- */
  const thumbPdf = () => svg(`
    <defs>
      <linearGradient id="tp-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2b3550"/><stop offset="1" stop-color="#151a29"/></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#tp-bg)"/>
    <g transform="translate(96 24)">
      <rect x="0" y="0" width="128" height="140" rx="4" fill="#fdfdfd"/>
      <rect x="0" y="0" width="128" height="20" rx="4" fill="#e8e8e8"/>
      <circle cx="11" cy="10" r="3" fill="#ff5f57"/><circle cx="22" cy="10" r="3" fill="#febc2e"/><circle cx="33" cy="10" r="3" fill="#28c840"/>
      <rect x="10" y="32" width="74" height="6" rx="3" fill="#c9cede"/>
      <rect x="10" y="46" width="108" height="5" rx="2.5" fill="#e3e6ee"/>
      <rect x="10" y="58" width="108" height="5" rx="2.5" fill="#e3e6ee"/>
      <rect x="10" y="70" width="86" height="5" rx="2.5" fill="#e3e6ee"/>
      <rect x="10" y="90" width="108" height="5" rx="2.5" fill="#e3e6ee"/>
      <rect x="10" y="102" width="62" height="5" rx="2.5" fill="#e3e6ee"/>
      <rect x="62" y="112" width="56" height="20" rx="3" fill="#d8232a"/>
      <text x="90" y="126" font-family="Tahoma,sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">PDF</text>
    </g>
    <g fill="#8fa2c9" opacity=".85">
      <rect x="26" y="52" width="42" height="9" rx="4.5"/>
      <rect x="26" y="70" width="34" height="9" rx="4.5"/>
      <rect x="26" y="88" width="46" height="9" rx="4.5"/>
      <rect x="26" y="106" width="30" height="9" rx="4.5"/>
    </g>
    <rect x="18" y="38" width="62" height="96" rx="5" fill="none" stroke="#54648c" stroke-width="1.5"/>`);

  const thumbSolar = () => svg(`
    <defs>
      <radialGradient id="ts-sun" cx="50%" cy="50%"><stop offset="0" stop-color="#fff3c4"/><stop offset="45%" stop-color="#ffb200"/><stop offset="100%" stop-color="#ff5b1a"/></radialGradient>
      <linearGradient id="ts-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#090c1c"/><stop offset="1" stop-color="#1b1030"/></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#ts-bg)"/>
    <g fill="#fff" opacity=".55">
      <circle cx="28" cy="26" r="1.2"/><circle cx="74" cy="14" r="1"/><circle cx="132" cy="30" r="1.3"/>
      <circle cx="210" cy="18" r="1"/><circle cx="268" cy="36" r="1.2"/><circle cx="296" cy="72" r="1"/>
      <circle cx="46" cy="96" r="1"/><circle cx="18" cy="140" r="1.1"/>
    </g>
    <circle cx="238" cy="58" r="66" fill="#ff8a1a" opacity=".13"/>
    <circle cx="238" cy="58" r="44" fill="#ff8a1a" opacity=".18"/>
    <circle cx="238" cy="58" r="30" fill="url(#ts-sun)"/>
    <path d="M238 28a30 30 0 0121 51l14 15a50 50 0 00-35-86z" fill="#ffd166" opacity=".35"/>
    <path d="M10 150 L44 150 L58 138 L72 142 L88 118 L104 126 L120 96 L136 108 L152 64 L166 100 L182 116 L200 112 L226 134 L252 130 L286 146 L310 144"
          fill="none" stroke="#4ade80" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10 150 L44 150 L58 138 L72 142 L88 118 L104 126 L120 96 L136 108 L152 64 L166 100 L182 116 L200 112 L226 134 L252 130 L286 146 L310 144 L310 180 L10 180 Z"
          fill="#4ade80" opacity=".12"/>
    <circle cx="152" cy="64" r="4.5" fill="#fff"/>
    <circle cx="152" cy="64" r="9" fill="none" stroke="#fff" stroke-width="1.3" opacity=".6"/>
    <text x="163" y="52" font-family="Tahoma,sans-serif" font-size="11" font-weight="bold" fill="#fff">X-class</text>
    <g stroke="#3b4a6b" stroke-width="1" opacity=".55">
      <path d="M10 120h300M10 90h300M10 60h300"/>
    </g>`);

  const thumbWifi = () => svg(`
    <defs>
      <linearGradient id="tw-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071a2b"/><stop offset="1" stop-color="#04101d"/></linearGradient>
    </defs>
    <rect width="320" height="180" fill="url(#tw-bg)"/>
    <g stroke="#0e3350" stroke-width="1">
      <path d="M0 140 L320 140M0 112 L320 112M0 166 L320 166"/>
      <path d="M40 90 L10 180M110 90 L96 180M210 90 L224 180M280 90 L310 180"/>
    </g>
    <g fill="none" stroke="#22d3ee" stroke-linecap="round">
      <circle cx="62" cy="96" r="18" stroke-width="2" opacity=".85"/>
      <circle cx="62" cy="96" r="34" stroke-width="1.8" opacity=".6"/>
      <circle cx="62" cy="96" r="52" stroke-width="1.5" opacity=".38"/>
      <circle cx="62" cy="96" r="72" stroke-width="1.2" opacity=".2"/>
    </g>
    <g fill="none" stroke="#a855f7" stroke-linecap="round">
      <circle cx="262" cy="74" r="16" stroke-width="2" opacity=".8"/>
      <circle cx="262" cy="74" r="32" stroke-width="1.6" opacity=".5"/>
      <circle cx="262" cy="74" r="50" stroke-width="1.3" opacity=".28"/>
    </g>
    <rect x="52" y="86" width="20" height="14" rx="2.5" fill="#0b2740" stroke="#22d3ee" stroke-width="1.5"/>
    <rect x="252" y="64" width="20" height="14" rx="2.5" fill="#160b28" stroke="#a855f7" stroke-width="1.5"/>
    <g transform="translate(150 54)">
      <circle cx="12" cy="10" r="10" fill="#f8fafc"/>
      <path d="M12 22c-11 0-18 8-18 20v38h36V42c0-12-7-20-18-20z" fill="#f8fafc"/>
      <path d="M-6 46l-14 22M30 46l14 22" stroke="#f8fafc" stroke-width="7" stroke-linecap="round"/>
      <g fill="none" stroke="#38bdf8" stroke-width="1.6" opacity=".9">
        <circle cx="12" cy="10" r="14"/><circle cx="12" cy="48" r="26"/>
      </g>
    </g>
    <circle cx="162" cy="64" r="46" fill="#38bdf8" opacity=".07"/>`);

  const projects = [
    {
      id: 'pdf-pilot',
      title: 'PDF Pilot',
      tagline: 'Offline desktop PDF editor for Windows 11',
      category: 'apps',
      badge: 'Desktop app',
      meta: 'Electron · JavaScript',
      repo: 'https://github.com/jonahgigi534-wq/PDF-Pilot',
      thumb: thumbPdf,
      summary: [
        'A free, open-source desktop PDF editor for Windows 11 — similar in spirit to Adobe Acrobat, but with no license keys, no subscriptions, no accounts and no cloud.',
        'Everything runs locally on the machine. There is no telemetry and no network round-trip for editing, so the whole feature set works on a disconnected laptop. The app ships MIT-licensed with MIT/Apache dependencies throughout.'
      ],
      features: [
        'Text editing with font matching against the source document',
        'OCR for scanned pages, with denoise / deskew / upscale preprocessing',
        'Annotations — highlights, sticky notes and freehand drawing',
        'Form creation and form filling',
        'Visual digital signatures',
        'Page operations: rotate, merge, split, compress and redact',
        'PDF to Word conversion through an optional LibreOffice integration',
        'Full undo/redo, plus delta self-updates from GitHub releases'
      ],
      stack: ['Electron', 'Node.js 20+', 'PDF.js', 'pdf-lib', '@cantoo/pdf-lib', 'PaddleOCR', 'ONNX Runtime', 'LibreOffice (optional)'],
      notes: 'The OCR engine is a Python sidecar process, so the core editor stays dependency-light and most features work without it installed.'
    },
    {
      id: 'helios',
      title: 'Helios — Solar Weather Predictor',
      tagline: 'Self-training solar flare forecasting from live NOAA data',
      category: 'ml',
      badge: 'Machine learning',
      meta: 'Python · FastAPI · scikit-learn',
      repo: 'https://github.com/jonahgigi534-wq/solar_weather_predictor',
      thumb: thumbSolar,
      summary: [
        'A self-training solar-flare forecasting system. It learns from magnetic-field data, classifies current solar activity from live NOAA measurements, and issues flare probabilities at 12, 24 and 48-hour lead times with explicit X-class warnings.',
        'The interesting constraint is that a model trained on SHARP magnetic parameters cannot literally consume X-ray flux. Rather than paper over that, the system runs three independent forecasting tracks over separate feature spaces and ensembles their outputs — which keeps the training/live split honest instead of leaking.'
      ],
      features: [
        'Three independent tracks — SHARP ML model, X-ray flux nowcast, NOAA region forecast — combined into one ensemble',
        'HistGradientBoosting classifier over 24 SHARP magnetic parameters',
        'Isotonic calibration and balanced sample weighting for heavy class imbalance',
        'Leakage-free validation split; TSS around 0.77 on smoke-test data',
        'Resilient live data fetching with caching and climatological fallbacks',
        'Web dashboard showing current forecasts and live GOES X-ray flux charts'
      ],
      stack: ['Python', 'FastAPI', 'scikit-learn', 'SWAN-SF dataset', 'NOAA GOES X-ray flux', 'HTML/JS dashboard'],
      notes: 'Separate feature spaces for training versus live prediction are a deliberate architectural choice, not a limitation to work around.'
    },
    {
      id: 'wifi-densepose',
      title: 'DensePose with WiFi Radio Waves',
      tagline: 'Presence, motion and position sensing from WiFi CSI alone',
      category: 'hardware',
      badge: 'Embedded / RF',
      meta: 'ESP32-S3 · C · Python · React',
      repo: 'https://github.com/jonahgigi534-wq/DensePoseWithWifiRadioWaves',
      thumb: thumbWifi,
      summary: [
        'The radio waves a WiFi router emits constantly act as a sort of liquid, bouncing off everything they touch in a ripple-like pattern — including you. Using CSI (Channel State Information) from those radio waves, this system determines a person’s position without a camera or any wearable.',
        'ESP32-S3 nodes capture CSI and stream it to a Python backend, which processes the signal and pushes results over WebSocket to a live 3D room dashboard.'
      ],
      features: [
        'Reliable presence detection — occupied versus empty room',
        'Motion and activity-level monitoring',
        'Zone-level position estimation via RSSI trilateration',
        'Multi-node support for improved accuracy',
        'Live 3D room visualisation in the browser'
      ],
      stack: ['ESP-IDF (C)', 'ESP32-S3', 'Python', 'FastAPI', 'WebSocket', 'React', 'Vite', 'Three.js'],
      notes: 'Honest about its limits: position accuracy is roughly 1-2 m, and vital-sign detection is experimental and unreliable on this hardware — real heart-rate sensing needs far more expensive RF equipment than an ESP32. The firmware was rewritten from the upstream RuView project to fix a node-identity corruption bug.'
    }
  ];

  const filters = [
    { id: 'all', label: 'All', icon: 'gAll' },
    { id: 'ml', label: 'Machine learning', icon: 'gBrain' },
    { id: 'apps', label: 'Applications', icon: 'gApp' },
    { id: 'hardware', label: 'Hardware', icon: 'gChip' }
  ];

  const profile = {
    name: 'Jonah',
    role: 'Developer',
    github: 'https://github.com/jonahgigi534-wq',
    email: 'gigijoseph10@gmail.com',
    linkedin: '',
    about: [
      'I build things end to end — desktop applications, machine-learning systems and embedded hardware. I tend to pick projects where the hard part is real: offline document editing without a cloud crutch, flare forecasting that refuses to leak its own labels, pose sensing from nothing but stray WiFi.',
      'Most of what I ship is open source and MIT-licensed. I care about software that works without an account, without a subscription and without phoning home — the projects below run entirely on your own machine.',
      'The common thread is being honest about limits. Each of these repos documents what it genuinely does well and where it falls short, because a forecast or a sensor reading you cannot trust the error bars on is not worth much.'
    ],
    skills: [
      'Python', 'JavaScript', 'C', 'Electron', 'FastAPI', 'React', 'Three.js',
      'scikit-learn', 'ONNX Runtime', 'ESP-IDF', 'Node.js', 'Vite',
      'Signal processing', 'ML calibration', 'Desktop packaging'
    ]
  };

  window.XPData = Object.freeze({ projects, filters, profile });
})();
