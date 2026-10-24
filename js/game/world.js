/* BlockCraft world: a fixed-size island of blocks, its terrain generator,
   the mesher that turns a 16x16 column of blocks into triangles, and the
   ray cast used to pick the block under the crosshair. */
(function () {
  const { BLOCKS, COLS } = window.XPBlockTextures;

  const SIZE = 64;      // world is SIZE x SIZE blocks
  const HEIGHT = 40;
  const CHUNK = 16;
  const SEA = 13;       // ground at or below this turns to sand
  const B = { AIR: 0, GRASS: 1, DIRT: 2, STONE: 3, SAND: 4, WOOD: 5, LEAVES: 6 };

  /* ---------- terrain ---------- */
  function hash(seed, x, z) {
    let h = Math.imul(x, 374761393) + Math.imul(z, 668265263) + Math.imul(seed, 982451653);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  function valueNoise(seed, x, z) {
    const x0 = Math.floor(x), z0 = Math.floor(z);
    const fx = x - x0, fz = z - z0;
    const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
    const a = hash(seed, x0, z0), b = hash(seed, x0 + 1, z0);
    const c = hash(seed, x0, z0 + 1), d = hash(seed, x0 + 1, z0 + 1);
    return (a + (b - a) * sx) * (1 - sz) + (c + (d - c) * sx) * sz;
  }

  function heightAt(seed, x, z) {
    const n = valueNoise(seed, x / 22, z / 22) * 0.65 +
      valueNoise(seed + 7, x / 9, z / 9) * 0.25 +
      valueNoise(seed + 13, x / 4, z / 4) * 0.1;
    // Fall off toward the edges so the world reads as an island.
    const dx = (x - SIZE / 2) / (SIZE / 2), dz = (z - SIZE / 2) / (SIZE / 2);
    const edge = Math.max(0, Math.hypot(dx, dz) - 0.7) * 14;
    return Math.max(4, Math.round(9 + n * 14 - edge));
  }

  function create(seed) {
    const data = new Uint8Array(SIZE * HEIGHT * SIZE);
    const idx = (x, y, z) => (y * SIZE + z) * SIZE + x;
    const inside = (x, y, z) => x >= 0 && z >= 0 && y >= 0 && x < SIZE && z < SIZE && y < HEIGHT;
    const get = (x, y, z) => (inside(x, y, z) ? data[idx(x, y, z)] : B.AIR);
    const set = (x, y, z, id) => { if (inside(x, y, z)) data[idx(x, y, z)] = id; };

    const heights = [];
    for (let z = 0; z < SIZE; z++) {
      for (let x = 0; x < SIZE; x++) {
        const h = heightAt(seed, x, z);
        heights.push(h);
        for (let y = 0; y <= h; y++) {
          let id = B.STONE;
          if (y === h) id = h <= SEA ? B.SAND : B.GRASS;
          else if (y > h - 3) id = h <= SEA ? B.SAND : B.DIRT;
          set(x, y, z, id);
        }
      }
    }

    // Trees on grass, kept apart and away from the edge.
    for (let z = 3; z < SIZE - 3; z++) {
      for (let x = 3; x < SIZE - 3; x++) {
        const h = heights[z * SIZE + x];
        if (get(x, h, z) !== B.GRASS || hash(seed + 99, x, z) > 0.018) continue;
        plantTree(set, get, x, h + 1, z, 4 + Math.floor(hash(seed + 5, x, z) * 2));
      }
    }

    return { seed, data, get, set, inside, heights, SIZE, HEIGHT, CHUNK };
  }

  function plantTree(set, get, x, y, z, trunk) {
    for (let dy = trunk - 2; dy <= trunk + 1; dy++) {
      const r = dy >= trunk ? 1 : 2;
      for (let dz = -r; dz <= r; dz++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) === r && Math.abs(dz) === r && dy !== trunk - 1) continue;
          if (get(x + dx, y + dy, z + dz) === B.AIR) set(x + dx, y + dy, z + dz, B.LEAVES);
        }
      }
    }
    for (let dy = 0; dy < trunk; dy++) set(x, y + dy, z, B.WOOD);
  }

  /* ---------- meshing ---------- */
  /* Each face: neighbour offset, which tile ([top, bottom, side] index),
     brightness, and four corners ordered bottom-left, top-left,
     top-right, bottom-right as seen from outside. */
  const FACES = [
    { n: [1, 0, 0],  tile: 2, light: 0.8,  c: [[1, 0, 1], [1, 1, 1], [1, 1, 0], [1, 0, 0]] },
    { n: [-1, 0, 0], tile: 2, light: 0.8,  c: [[0, 0, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]] },
    { n: [0, 0, 1],  tile: 2, light: 0.65, c: [[0, 0, 1], [0, 1, 1], [1, 1, 1], [1, 0, 1]] },
    { n: [0, 0, -1], tile: 2, light: 0.65, c: [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 0]] },
    { n: [0, 1, 0],  tile: 0, light: 1.0,  c: [[0, 1, 1], [0, 1, 0], [1, 1, 0], [1, 1, 1]] },
    { n: [0, -1, 0], tile: 1, light: 0.5,  c: [[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]] }
  ];
  const UV = [[0, 1], [0, 0], [1, 0], [1, 1]];
  const TRI = [0, 1, 2, 0, 2, 3];
  const INSET = 0.02;   // stops neighbouring atlas tiles bleeding at the edges

  function showsFace(id, other) {
    if (other === B.AIR) return true;
    const o = BLOCKS[other];
    return !!(o && o.transparent && other !== id);
  }

  /* Interleaved floats per vertex: x, y, z, u, v, light. */
  function buildChunk(world, cx, cz) {
    const out = [];
    const x0 = cx * CHUNK, z0 = cz * CHUNK;
    for (let y = 0; y < HEIGHT; y++) {
      for (let z = z0; z < z0 + CHUNK; z++) {
        for (let x = x0; x < x0 + CHUNK; x++) {
          const id = world.get(x, y, z);
          if (id === B.AIR) continue;
          const tiles = BLOCKS[id].faces;
          for (const f of FACES) {
            if (!showsFace(id, world.get(x + f.n[0], y + f.n[1], z + f.n[2]))) continue;
            const slot = tiles[f.tile];
            const tu = slot % COLS, tv = Math.floor(slot / COLS);
            for (const k of TRI) {
              const c = f.c[k];
              const u = (tu + INSET + UV[k][0] * (1 - 2 * INSET)) / COLS;
              const v = (tv + INSET + UV[k][1] * (1 - 2 * INSET)) / COLS;
              out.push(x + c[0], y + c[1], z + c[2], u, v, f.light);
            }
          }
        }
      }
    }
    return new Float32Array(out);
  }

  /* ---------- picking ---------- */
  /* Voxel walk (Amanatides & Woo) from `o` along unit `d`. Returns the
     first solid block and the empty cell just before it, or null. */
  function raycast(world, o, d, maxDist) {
    let x = Math.floor(o[0]), y = Math.floor(o[1]), z = Math.floor(o[2]);
    const step = d.map(v => (v > 0 ? 1 : -1));
    const tDelta = d.map(v => (v === 0 ? Infinity : Math.abs(1 / v)));
    const tMax = d.map((v, i) => {
      if (v === 0) return Infinity;
      const cell = Math.floor(o[i]);
      return (v > 0 ? cell + 1 - o[i] : o[i] - cell) * tDelta[i];
    });
    let prev = [x, y, z];
    let t = 0;
    while (t <= maxDist) {
      if (world.get(x, y, z) !== B.AIR) return { hit: [x, y, z], before: prev };
      prev = [x, y, z];
      if (tMax[0] < tMax[1] && tMax[0] < tMax[2]) { x += step[0]; t = tMax[0]; tMax[0] += tDelta[0]; }
      else if (tMax[1] < tMax[2]) { y += step[1]; t = tMax[1]; tMax[1] += tDelta[1]; }
      else { z += step[2]; t = tMax[2]; tMax[2] += tDelta[2]; }
    }
    return null;
  }

  window.XPBlockWorld = { create, buildChunk, raycast, B, SIZE, HEIGHT, CHUNK };
})();
