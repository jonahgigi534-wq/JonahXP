/* Portfolio content. Single source of truth for the shell's apps.
   Project details are drawn from each repository's own README. */
(function () {
  /* Real screenshots, cropped to fill the frame. `pos` picks which part
     of the image stays in view when the frame's shape differs from it. */
  const photo = (src, alt, pos) => () =>
    `<img class="thumb-photo" src="${src}" alt="${alt}" loading="lazy" draggable="false" style="object-position:${pos}">`;

  const thumbPdf = photo(
    'assets/projects/pdf-pilot.webp',
    'PDF Pilot editing a one-page PDF that reads Gone are the days of paying for Adobe Acrobat, with the tool list on the left and a page thumbnail',
    'center 20%');

  const thumbHelios = photo(
    'assets/projects/helios.webp',
    'Helios dashboard: a world map with the auroral oval in green, the night side shaded, and a 75% chance of a G1 geomagnetic storm in the next 24 hours',
    'center 72%');

  const thumbWifi = photo(
    'assets/projects/csi-presence.webp',
    'CSI Presence Detection dashboard: two sensor nodes online, motion intensity, heart rate and breathing readouts, and a 3D room grid with a detected person',
    'center 62%');

  const projects = [
    {
      id: 'pdf-pilot',
      title: 'PDF Pilot',
      tagline: 'Offline desktop PDF editor for Windows 11',
      category: 'apps',
      badge: 'Desktop app',
      meta: 'Electron · JavaScript',
      views: '3.4K views', age: '2 months ago',
      repo: 'https://github.com/jonahgigi534-wq/PDF-Pilot',
      thumb: thumbPdf,
      summary: [
        'A free, open-source PDF editor for Windows 11. Think Adobe Acrobat, minus the license keys, subscriptions, accounts and cloud.',
        'Everything runs on your own machine. There is no telemetry and editing never touches the network, so it all works on a laptop with the WiFi off. The app is MIT-licensed, and every dependency is MIT or Apache.'
      ],
      features: [
        'Text editing with font matching against the source document',
        'OCR for scanned pages, which get denoised, straightened and upscaled first',
        'Highlights, sticky notes and freehand drawing',
        'Build forms or fill them in',
        'Visual digital signatures',
        'Page operations: rotate, merge, split, compress and redact',
        'PDF to Word conversion, if LibreOffice is installed',
        'Full undo and redo, and it updates itself from GitHub releases by downloading only what changed'
      ],
      stack: ['Electron', 'Node.js 20+', 'PDF.js', 'pdf-lib', '@cantoo/pdf-lib', 'PaddleOCR', 'ONNX Runtime', 'LibreOffice (optional)'],
      notes: 'OCR runs as a separate Python process. The editor itself stays light, and most of it works fine without OCR installed.'
    },
    {
      id: 'helios',
      title: 'Helios: Solar Weather Predictor',
      tagline: 'Self-training solar flare forecasting from live NOAA data',
      category: 'ml',
      badge: 'Machine learning',
      meta: 'Python · FastAPI · scikit-learn',
      views: '2.1K views', age: '1 month ago',
      repo: 'https://github.com/jonahgigi534-wq/solar_weather_predictor',
      thumb: thumbHelios,
      summary: [
        'Helios forecasts solar flares and retrains itself as new data comes in. It learns from magnetic-field data, reads current solar activity from live NOAA measurements, and gives flare probabilities 12, 24 and 48 hours ahead, with a separate warning for X-class flares.',
        'The tricky part is that the model trains on SHARP magnetic parameters, but the live feed is X-ray flux, and one cannot stand in for the other. So Helios runs three separate forecasts, each on the kind of data it was built for, and combines them at the end.'
      ],
      features: [
        "Three forecasts combined into one: a SHARP-trained ML model, an X-ray flux nowcast, and NOAA's own forecast for each active region",
        'HistGradientBoosting classifier on 24 SHARP magnetic parameters',
        'Isotonic calibration, plus balanced sample weights because big flares are rare',
        'A validation split with no leakage between training and test; TSS of about 0.77 on smoke-test data',
        'Live data is cached, and when a feed goes down it falls back to long-run averages',
        'A dashboard with the current forecast and live GOES X-ray flux',
        'World maps of HF radio blackout and the auroral oval, flat or on a 3D globe',
        'A separate model for the chance of a G1 or stronger geomagnetic storm in the next 24 hours'
      ],
      stack: ['Python', 'FastAPI', 'scikit-learn', 'SWAN-SF dataset', 'NOAA GOES X-ray flux', 'HTML/JS dashboard'],
      notes: 'Training and live prediction use different data on purpose. The model learns from magnetograms, but the live feed only has X-ray flux, so each forecast sticks to the data it was trained on.'
    },
    {
      id: 'csi-presence',
      title: 'CSI Presence Detection',
      tagline: 'Presence, motion and position sensing from WiFi CSI alone',
      category: 'hardware',
      badge: 'Embedded / RF',
      meta: 'ESP32-S3 · C · Python · React',
      views: '5.8K views', age: '3 weeks ago',
      repo: 'https://github.com/jonahgigi534-wq/DensePoseWithWifiRadioWaves',
      thumb: thumbWifi,
      summary: [
        'Your WiFi router is always sending out radio waves, and they bounce off everything in the room, you included, a bit like ripples in water. This system reads the Channel State Information (CSI) from those signals to work out where a person is. No camera, and nothing to wear.',
        'ESP32-S3 boards capture the CSI and stream it to a Python backend. The backend cleans up the signal and pushes results over WebSocket to a live 3D view of the room.'
      ],
      features: [
        'Tells an occupied room from an empty one, reliably',
        'Motion and activity levels',
        'Rough position by zone, using RSSI trilateration',
        'Works with several nodes at once, and each one adds accuracy',
        'A live 3D view of the room in the browser'
      ],
      stack: ['ESP-IDF (C)', 'ESP32-S3', 'Python', 'FastAPI', 'WebSocket', 'React', 'Vite', 'Three.js'],
      notes: 'Position is only good to about 1 to 2 metres. The heart rate and breathing readouts are experimental and not reliable on this hardware; measuring them properly takes RF equipment that costs far more than an ESP32. The firmware is a rewrite of the upstream RuView firmware, done to fix a bug that corrupted node IDs.'
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
    fullName: 'Jonathan Gigi',
    role: 'Developer',
    github: 'https://github.com/jonahgigi534-wq',
    email: 'jonahgigi534@gmail.com',
    linkedin: '',
    about: [
      'I build desktop apps, machine-learning systems and embedded hardware, usually start to finish. I like projects where the hard part is actually hard: editing PDFs with no cloud behind them, forecasting solar flares without the model peeking at the answers, finding people in a room with nothing but WiFi.',
      'Most of what I make is open source under MIT. I like software that works without an account or a subscription, and everything below runs on your own computer.',
      'Each repo says plainly what works and what does not. A forecast or a sensor reading is only useful if you know how far to trust it.'
    ],
    /* About Me side cards. `glyph` keys into apps.js GLYPHS; `tile` is
       [background, text colour, label] for a small lettered icon. */
    focus: [
      { label: 'Machine Learning', glyph: 'ml' },
      { label: 'Desktop Apps', glyph: 'app' },
      { label: 'Embedded Hardware', glyph: 'chip' },
      { label: 'Signal Processing', glyph: 'wave' },
      { label: 'Data Dashboards', glyph: 'chart' },
      { label: 'Problem Solving', glyph: 'bulb' }
    ],
    software: [
      { label: 'Python', tile: ['#3572a5', '#ffd43b', 'Py'] },
      { label: 'JavaScript', tile: ['#f0db4f', '#222', 'JS'] },
      { label: 'C / ESP-IDF', tile: ['#c4302b', '#fff', 'C'] },
      { label: 'Electron', tile: ['#2b2e3a', '#9feaf9', 'El'] },
      { label: 'React', tile: ['#20232a', '#61dafb', 'Re'] },
      { label: 'FastAPI', tile: ['#059487', '#fff', 'API'] },
      { label: 'VS Code', tile: ['#0065a9', '#fff', 'VS'] },
      { label: 'Claude Code', tile: ['#d97757', '#fff', 'CC'] }
    ],
    skills: [
      'Python', 'JavaScript', 'C', 'Electron', 'FastAPI', 'React', 'Three.js',
      'scikit-learn', 'ONNX Runtime', 'ESP-IDF', 'Node.js', 'Vite',
      'Signal processing', 'ML calibration', 'Desktop packaging'
    ]
  };

  /* My Resume: laid out as a printed page by js/resume.js. Street address
     and phone are left off on purpose: this page is public. */
  const resume = {
    name: 'Jonathan Gigi',
    title: 'Student Developer',
    summary: 'High school developer building machine learning, embedded and full-stack projects, from solar flare forecasting to automated sales tools for small businesses.',
    contact: ['Cypress, Texas', 'jonahgigi534@gmail.com', 'jonahgigi534-wq.github.io/JonahXP'],
    side: [
      { heading: 'Languages', items: ['Java', 'Python', 'JavaScript', 'HTML / CSS', 'SQL'] },
      { heading: 'Software/Tools', items: ['VS Code', 'IntelliJ', 'Claude Code', 'Google Antigravity', 'Git / GitHub', 'Framer'] },
      { heading: 'Frameworks', items: ['React.js', 'Node.js', 'Express.js', 'OpenAI API', 'Twilio API', 'Linux', 'Raspberry Pi', 'ESP32'] }
    ],
    experience: [
      { role: 'Founder', org: 'ContractorFlow, Cypress, Texas', when: '2025',
        bullets: [
          'On average added $98,000 top line revenue over a 2 month period per client.',
          "Implemented an AI lead nurturing system using OpenAI/Twilio SMS APIs to automate contractors' sales.",
          'Ran Meta ad campaigns generating inbound leads for roofing contractors in Dallas-Fort Worth, and Houston.'
        ] },
      { role: 'Lead Instructor & Java Curriculum Developer', org: 'Lone Star College, Houston, Texas', when: 'Aug - Sep 2026',
        bullets: ['Wrote original Codeforces-style competitive programming problems and created Java curriculum materials.'] },
      { role: 'Head of Membership', org: 'Future Business Leaders of America (FBLA)', when: '2026 - Present',
        bullets: ["Built and managed the chapter's membership hub, tracking member points and participation through Google App Scripts automations."] },
      { role: 'Webmaster', org: 'Key Club, Cypress, Texas', when: 'Present',
        bullets: ['Built a Python reminder system that tracks volunteer hours for 1,000+ students and sends weekly automated alerts.'] },
      { role: 'National Semifinalist (1 of 15 Nationwide)', org: 'NASA Radioisotope Power Systems Contest', when: '',
        bullets: ['Wrote an essay proposing an original NASA mission powered by radioisotope power systems (RPS).'] }
    ],
    projects: [
      { name: 'Helios: Solar Flare Prediction Platform', when: '2026 - Present',
        text: 'A live web app with an AI model that predicts solar flares, built for the ISEF-affiliated Houston science fair, with a continuous-training (MLOps) pipeline for messy real-world data.' },
      { name: 'Membership Management App for FBLA', when: '2026',
        text: 'Full-stack membership hub (SQLite, Express, React, Node) that tracks member points and supports admin CSV uploads.' },
      { name: 'Embedded Traffic Control System', when: '',
        text: 'Ultrasonic-sensor traffic controller on a Raspberry Pi Pico W, using state machine logic, non-blocking control, LEDs and an LCD.' },
      { name: 'Vital Signs Detector', when: '',
        text: 'ESP32-S3 prototype that reads and reports vital signs from on-board sensors.' },
      { name: 'Cryptocurrency Trading Bot', when: '2025',
        text: 'Bitcoin bot on Coinbase data using an SMA crossover, with trend and sideways-market filters, stop-loss, take-profit and position sizing.' }
    ],
    education: [
      { name: 'Cypress Woods High School', detail: '3.96 GPA, Class Rank 1/980', when: 'Class of 2029',
        note: 'AP Physics 1, AP Computer Science A, AP Precalculus' }
    ]
  };

  window.XPData = Object.freeze({ projects, filters, profile, resume });
})();
