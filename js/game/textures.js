/* BlockCraft block textures, painted pixel by pixel at start-up into one
   small atlas canvas. Nothing is downloaded: each 16x16 tile is drawn from
   a seeded random so it looks the same on every visit. */
(function () {
  const TILE = 16;
  const COLS = 4;

  /* Atlas slots. Order matters: BLOCKS below refers to these indexes. */
  const T = {
    grassTop: 0, grassSide: 1, dirt: 2, stone: 3,
    sand: 4, logSide: 5, logTop: 6, leaves: 7,
    planks: 8, cobble: 9, glass: 10
  };

  /* Block ids. 0 is air. `faces` is [top, bottom, side]. Transparent
     blocks let neighbouring faces show through them. */
  const BLOCKS = [
    null,
    { name: 'Grass',       faces: [T.grassTop, T.dirt, T.grassSide] },
    { name: 'Dirt',        faces: [T.dirt, T.dirt, T.dirt] },
    { name: 'Stone',       faces: [T.stone, T.stone, T.stone] },
    { name: 'Sand',        faces: [T.sand, T.sand, T.sand] },
    { name: 'Wood',        faces: [T.logTop, T.logTop, T.logSide] },
    { name: 'Leaves',      faces: [T.leaves, T.leaves, T.leaves], transparent: true },
    { name: 'Planks',      faces: [T.planks, T.planks, T.planks] },
    { name: 'Cobblestone', faces: [T.cobble, T.cobble, T.cobble] },
    { name: 'Glass',       faces: [T.glass, T.glass, T.glass], transparent: true }
  ];

  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));

  /* Paint one tile. `fn(x, y, r)` returns [hexColour, brightnessJitter,
     alpha?] or null for a fully transparent pixel. */
  function paint(img, slot, seed, fn) {
    const r = rng(seed);
    const ox = (slot % COLS) * TILE;
    const oy = Math.floor(slot / COLS) * TILE;
    for (let y = 0; y < TILE; y++) {
      for (let x = 0; x < TILE; x++) {
        const i = ((oy + y) * COLS * TILE + ox + x) * 4;
        const px = fn(x, y, r);
        if (!px) { img.data[i + 3] = 0; continue; }
        const [h, jitter, alpha] = px;
        const [cr, cg, cb] = hex(h);
        const d = (r() - 0.5) * 2 * jitter;
        img.data[i] = clamp(cr + d);
        img.data[i + 1] = clamp(cg + d);
        img.data[i + 2] = clamp(cb + d);
        img.data[i + 3] = alpha == null ? 255 : alpha;
      }
    }
  }

  function dirtPx(x, y, r) {
    const v = r();
    if (v < 0.08) return ['#5d4330', 8];
    if (v > 0.93) return ['#9c7556', 8];
    return ['#866043', 14];
  }

  function build() {
    const canvas = document.createElement('canvas');
    canvas.width = COLS * TILE;
    canvas.height = COLS * TILE;
    const g = canvas.getContext('2d');
    const img = g.createImageData(canvas.width, canvas.height);

    paint(img, T.grassTop, 11, (x, y, r) => (r() < 0.12 ? ['#77b84a', 10] : ['#5c9c33', 16]));
    paint(img, T.dirt, 12, dirtPx);
    // Grass overhang: 3 rows of green, dripping a pixel or two further.
    const drip = Array.from({ length: TILE }, (_, i) => 3 + ((i * 7) % 5 === 0 ? 2 : (i * 3) % 4 === 0 ? 1 : 0));
    paint(img, T.grassSide, 13, (x, y, r) => (y < drip[x] ? ['#5c9c33', 16] : dirtPx(x, y, r)));
    paint(img, T.stone, 14, (x, y, r) => {
      const v = r();
      if (v < 0.1) return ['#626262', 8];
      if (v > 0.92) return ['#9a9a9a', 6];
      return ['#7f7f7f', 12];
    });
    paint(img, T.sand, 15, (x, y, r) => (r() < 0.1 ? ['#c9bf87', 6] : ['#dcd4a0', 9]));
    paint(img, T.logSide, 16, (x) => ((x % 4 === 0) ? ['#4e3a22', 10] : ['#6b5131', 14]));
    paint(img, T.logTop, 17, (x, y) => {
      const ring = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
      if (ring > 6.5) return ['#6b5131', 12];
      return Math.floor(ring) % 2 ? ['#9c7c4a', 8] : ['#b8975e', 8];
    });
    paint(img, T.leaves, 18, (x, y, r) => {
      const v = r();
      if (v < 0.22) return null;
      return v > 0.85 ? ['#2f6419', 10] : ['#3f8124', 18];
    });
    paint(img, T.planks, 19, (x, y) => {
      if (y % 4 === 3) return ['#6e5530', 6];
      const seam = (Math.floor(y / 4) % 2) ? 3 : 11;
      if (x === seam) return ['#7d6238', 6];
      return ['#a3834e', 12];
    });
    paint(img, T.cobble, 20, (x, y, r) => {
      // Rough stones: darker mortar on a jittered grid.
      const gx = (x + ((y >> 2) % 2) * 2) % 5;
      const gy = (y + ((x >> 2) % 3)) % 5;
      if (gx === 0 || gy === 0) return ['#4f4f4f', 10];
      return r() < 0.15 ? ['#a5a5a5', 8] : ['#828282', 16];
    });
    paint(img, T.glass, 21, (x, y) => {
      const edge = x === 0 || y === 0 || x === TILE - 1 || y === TILE - 1;
      if (edge) return ['#dfeffa', 4];
      if ((x === y || x === y + 1) && x > 3 && x < 8) return ['#ffffff', 0, 200];
      return null;
    });

    g.putImageData(img, 0, 0);
    return canvas;
  }

  window.XPBlockTextures = { TILE, COLS, T, BLOCKS, build };
})();
