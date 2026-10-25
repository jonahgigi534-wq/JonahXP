/* BlockCraft: a small first-person block game inside a JonahXP window.
   Plain WebGL 1, no libraries. Click the view to capture the mouse, then
   WASD to walk, Space to jump, left click to dig, right click to place,
   1-9 or the wheel to pick a block, Esc to let go of the mouse.

   While the mouse is free the camera slowly turns, so the window doubles
   as an attract screen. */
(function () {
  const TX = window.XPBlockTextures;
  const W = window.XPBlockWorld;

  const HOTBAR = [1, 2, 3, 8, 7, 5, 6, 9, 4];   // block ids, see textures.js
  const SKY = [0.53, 0.77, 1.0];
  const FOG = [26, 60];          // fog start / end, in blocks
  const REACH = 6;
  const PLAYER = { w: 0.6, h: 1.8, eye: 1.62 };
  const PHYS = { gravity: 28, jump: 8.6, walk: 4.3, sprint: 6.4, maxFall: 40 };
  const MOUSE = 0.0024;          // radians per pixel
  const MAX_DT = 0.05;

  const VERT = `
    attribute vec3 aPos; attribute vec2 aUv; attribute float aLight;
    uniform mat4 uMvp; uniform vec3 uEye;
    varying vec2 vUv; varying float vLight; varying float vDist;
    void main() {
      vUv = aUv; vLight = aLight; vDist = distance(aPos, uEye);
      gl_Position = uMvp * vec4(aPos, 1.0);
    }`;
  const FRAG = `
    precision mediump float;
    uniform sampler2D uTex; uniform vec3 uSky; uniform vec2 uFog;
    varying vec2 vUv; varying float vLight; varying float vDist;
    void main() {
      vec4 c = texture2D(uTex, vUv);
      if (c.a < 0.5) discard;
      float f = smoothstep(uFog.x, uFog.y, vDist);
      gl_FragColor = vec4(mix(c.rgb * vLight, uSky, f), 1.0);
    }`;
  const LINE_VERT = `attribute vec3 aPos; uniform mat4 uMvp; void main() { gl_Position = uMvp * vec4(aPos, 1.0); }`;
  const LINE_FRAG = `precision mediump float; void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.75); }`;

  /* ---------- small matrix kit (column-major, like GL) ---------- */
  function perspective(fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2);
    const m = new Float32Array(16);
    m[0] = f / aspect; m[5] = f; m[11] = -1;
    m[10] = (far + near) / (near - far);
    m[14] = (2 * far * near) / (near - far);
    return m;
  }

  function lookAt(eye, dir) {
    const z = norm([-dir[0], -dir[1], -dir[2]]);
    const x = norm(cross([0, 1, 0], z));
    const y = cross(z, x);
    return new Float32Array([
      x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
      -dot(x, eye), -dot(y, eye), -dot(z, eye), 1
    ]);
  }

  function multiply(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        let s = 0;
        for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
        o[c * 4 + r] = s;
      }
    }
    return o;
  }

  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };

  /* ---------- GL setup ---------- */
  function compile(gl, vs, fs) {
    const prog = gl.createProgram();
    [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]].forEach(([type, src]) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh));
      gl.attachShader(prog, sh);
    });
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    return prog;
  }

  function uploadAtlas(gl, canvas) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  }

  /* Twelve edges of a unit cube, nudged out a hair so they sit on top. */
  function outlineVerts() {
    const e = 0.005, lo = -e, hi = 1 + e;
    const p = [[lo, lo, lo], [hi, lo, lo], [hi, lo, hi], [lo, lo, hi], [lo, hi, lo], [hi, hi, lo], [hi, hi, hi], [lo, hi, hi]];
    const edges = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
    return new Float32Array(edges.flatMap(i => p[i]));
  }

  /* ---------- HUD markup ---------- */
  function hudMarkup(atlasUrl) {
    const n = TX.COLS;
    const slots = HOTBAR.map((id, i) => {
      const tile = TX.BLOCKS[id].faces[2];
      const pos = `${(tile % n) * 100 / (n - 1)}% ${Math.floor(tile / n) * 100 / (n - 1)}%`;
      return `<span class="bc-slot" data-slot="${i}" title="${TX.BLOCKS[id].name}">
        <span class="bc-slot-ico" style="background-image:url(${atlasUrl});background-size:${n * 100}% ${n * 100}%;background-position:${pos}"></span>
        <span class="bc-slot-num">${i + 1}</span></span>`;
    }).join('');
    return `
      <canvas class="bc-canvas"></canvas>
      <div class="bc-cross" aria-hidden="true"></div>
      <div class="bc-name" aria-live="polite"></div>
      <div class="bc-hotbar">${slots}</div>
      <div class="bc-overlay">
        <div class="bc-card">
          <h1>Minecraft</h1>
          <p class="bc-go">Click to play</p>
          <ul>
            <li><b>W A S D</b> walk, <b>Shift</b> sprint, <b>Space</b> jump</li>
            <li><b>Left click</b> dig, <b>Right click</b> place</li>
            <li><b>1 to 9</b> or the <b>wheel</b> to pick a block</li>
            <li><b>Esc</b> lets go of the mouse</li>
          </ul>
        </div>
      </div>`;
  }

  /* ---------- one running game ---------- */
  function Game(root, api) {
    const atlas = TX.build();
    root.innerHTML = hudMarkup(atlas.toDataURL());
    const canvas = root.querySelector('.bc-canvas');
    const overlay = root.querySelector('.bc-overlay');
    const nameEl = root.querySelector('.bc-name');
    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) {
      root.querySelector('.bc-go').textContent = 'This browser cannot run WebGL, so Minecraft cannot start.';
      return null;
    }

    const prog = compile(gl, VERT, FRAG);
    const lineProg = compile(gl, LINE_VERT, LINE_FRAG);
    const loc = {
      pos: gl.getAttribLocation(prog, 'aPos'), uv: gl.getAttribLocation(prog, 'aUv'),
      light: gl.getAttribLocation(prog, 'aLight'), mvp: gl.getUniformLocation(prog, 'uMvp'),
      eye: gl.getUniformLocation(prog, 'uEye'), sky: gl.getUniformLocation(prog, 'uSky'),
      fog: gl.getUniformLocation(prog, 'uFog'),
      linePos: gl.getAttribLocation(lineProg, 'aPos'), lineMvp: gl.getUniformLocation(lineProg, 'uMvp')
    };
    uploadAtlas(gl, atlas);
    const lineBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, outlineVerts(), gl.STATIC_DRAW);
    gl.enable(gl.DEPTH_TEST);

    const state = {
      world: null, chunks: [], dirty: new Set(),
      pos: [0, 0, 0], vel: [0, 0, 0], yaw: 0.6, pitch: -0.25, onGround: false,
      keys: new Set(), slot: 0, target: null, last: 0, nameTimer: 0,
      locked: false, playing: false, drag: false, press: null
    };

    /* ----- world + meshes ----- */
    const perSide = W.SIZE / W.CHUNK;
    const chunkKey = (cx, cz) => cz * perSide + cx;

    function rebuild(key) {
      const cx = key % perSide, cz = Math.floor(key / perSide);
      const verts = W.buildChunk(state.world, cx, cz);
      let c = state.chunks[key];
      if (!c) c = state.chunks[key] = { buf: gl.createBuffer(), count: 0 };
      gl.bindBuffer(gl.ARRAY_BUFFER, c.buf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.DYNAMIC_DRAW);
      c.count = verts.length / 6;
    }

    function newWorld(seed) {
      state.world = W.create(seed);
      for (let k = 0; k < perSide * perSide; k++) rebuild(k);
      spawn();
      api.setStatus(`World seed ${seed}`);
    }

    /* Start near the middle, on the closest column with open sky above
       the ground, so you never begin inside a tree. */
    function spawn() {
      const w = state.world, mid = W.SIZE / 2;
      let best = [mid, mid];
      search: for (let r = 0; r < mid; r++) {
        for (let dz = -r; dz <= r; dz++) {
          for (let dx = -r; dx <= r; dx++) {
            const x = mid + dx, z = mid + dz;
            const h = w.heights[z * W.SIZE + x];
            if (w.get(x, h + 1, z) === W.B.AIR && w.get(x, h + 2, z) === W.B.AIR) { best = [x, z]; break search; }
          }
        }
      }
      const [x, z] = best;
      state.pos = [x + 0.5, w.heights[z * W.SIZE + x] + 1.01, z + 0.5];
      state.vel = [0, 0, 0];
    }

    /* A changed block can expose faces in the next chunk over too. */
    function markDirty(x, z) {
      const cx = Math.floor(x / W.CHUNK), cz = Math.floor(z / W.CHUNK);
      state.dirty.add(chunkKey(cx, cz));
      const lx = x % W.CHUNK, lz = z % W.CHUNK;
      if (lx === 0 && cx > 0) state.dirty.add(chunkKey(cx - 1, cz));
      if (lx === W.CHUNK - 1 && cx < perSide - 1) state.dirty.add(chunkKey(cx + 1, cz));
      if (lz === 0 && cz > 0) state.dirty.add(chunkKey(cx, cz - 1));
      if (lz === W.CHUNK - 1 && cz < perSide - 1) state.dirty.add(chunkKey(cx, cz + 1));
    }

    /* ----- physics ----- */
    function solidAt(x, y, z) {
      if (x < 0 || z < 0 || x >= W.SIZE || z >= W.SIZE) return true;   // invisible walls
      return state.world.get(x, y, z) !== W.B.AIR;
    }

    function collides(p) {
      const hw = PLAYER.w / 2, eps = 1e-4;
      for (let y = Math.floor(p[1]); y <= Math.floor(p[1] + PLAYER.h - eps); y++) {
        for (let z = Math.floor(p[2] - hw); z <= Math.floor(p[2] + hw - eps); z++) {
          for (let x = Math.floor(p[0] - hw); x <= Math.floor(p[0] + hw - eps); x++) {
            if (y >= 0 && solidAt(x, y, z)) return true;
          }
        }
      }
      return false;
    }

    function moveAxis(axis, d) {
      if (!d) return;
      const p = state.pos.slice();
      p[axis] += d;
      if (!collides(p)) { state.pos = p; return; }
      if (axis === 1) {
        // Land on top of the block, or stop just under a ceiling.
        state.pos[1] = d < 0 ? Math.floor(p[1]) + 1 : Math.floor(p[1] + PLAYER.h) - PLAYER.h - 1e-3;
        if (d < 0) state.onGround = true;
        state.vel[1] = 0;
      }
    }

    function step(dt) {
      const k = state.keys;
      const fwd = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
      const side = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      const speed = k.has('ShiftLeft') || k.has('ShiftRight') ? PHYS.sprint : PHYS.walk;
      const sy = Math.sin(state.yaw), cy = Math.cos(state.yaw);
      let mx = -sy * fwd + cy * side, mz = -cy * fwd - sy * side;
      const len = Math.hypot(mx, mz) || 1;
      mx = (mx / len) * speed; mz = (mz / len) * speed;
      if (!fwd && !side) { mx = 0; mz = 0; }

      if (k.has('Space') && state.onGround) state.vel[1] = PHYS.jump;
      state.vel[1] = Math.max(state.vel[1] - PHYS.gravity * dt, -PHYS.maxFall);
      state.onGround = false;
      moveAxis(0, mx * dt);
      moveAxis(2, mz * dt);
      moveAxis(1, state.vel[1] * dt);
      if (state.pos[1] < -20) spawn();
    }

    /* ----- looking and editing ----- */
    const lookDir = () => [
      -Math.sin(state.yaw) * Math.cos(state.pitch), Math.sin(state.pitch), -Math.cos(state.yaw) * Math.cos(state.pitch)
    ];
    const eye = () => [state.pos[0], state.pos[1] + PLAYER.eye, state.pos[2]];

    function dig() {
      const t = state.target;
      if (!t || t.hit[1] === 0) return;            // bottom layer stays, so you can't fall out
      state.world.set(t.hit[0], t.hit[1], t.hit[2], W.B.AIR);
      markDirty(t.hit[0], t.hit[2]);
      XPAudio.play('dig');
    }

    function place() {
      const t = state.target;
      if (!t) return;
      const [x, y, z] = t.before;
      if (!state.world.inside(x, y, z)) return;
      state.world.set(x, y, z, HOTBAR[state.slot]);
      if (collides(state.pos)) { state.world.set(x, y, z, W.B.AIR); return; }   // not inside yourself
      markDirty(x, z);
      XPAudio.play('place');
    }

    function selectSlot(i) {
      state.slot = (i + HOTBAR.length) % HOTBAR.length;
      root.querySelectorAll('.bc-slot').forEach((s, n) => s.classList.toggle('is-on', n === state.slot));
      nameEl.textContent = TX.BLOCKS[HOTBAR[state.slot]].name;
      nameEl.classList.add('is-shown');
      clearTimeout(state.nameTimer);
      state.nameTimer = setTimeout(() => nameEl.classList.remove('is-shown'), 1200);
    }

    /* ----- input -----
       Normally the mouse is captured (pointer lock). Where the browser
       refuses that, the game falls back to drag mode: drag to look, click
       without dragging to dig, right click to place, Esc to stop. */
    const DRAG_SLOP = 4;   // px of movement before a press counts as a drag

    function setPlaying(on) {
      state.playing = on;
      overlay.hidden = on;
      if (!on) { state.keys.clear(); state.drag = false; }
    }

    function onKey(e) {
      if (!state.playing || XPWM.active() !== 'game') return;
      if (e.type === 'keydown') {
        if (e.code === 'Escape' && state.drag) { setPlaying(false); return; }
        state.keys.add(e.code);
        if (/^Digit[1-9]$/.test(e.code)) selectSlot(Number(e.code.slice(5)) - 1);
      } else state.keys.delete(e.code);
      e.preventDefault();
    }
    function turn(dx, dy) {
      state.yaw -= dx * MOUSE;
      state.pitch = Math.max(-1.55, Math.min(1.55, state.pitch - dy * MOUSE));
    }
    function onMouseMove(e) {
      if (state.locked) { turn(e.movementX, e.movementY); return; }
      if (!state.drag || !state.press) return;
      const dx = e.clientX - state.press.x, dy = e.clientY - state.press.y;
      if (Math.hypot(e.clientX - state.press.x0, e.clientY - state.press.y0) > DRAG_SLOP) state.press.moved = true;
      turn(dx * 1.6, dy * 1.6);
      state.press.x = e.clientX; state.press.y = e.clientY;
    }
    function onMouseDown(e) {
      if (!state.playing) return;
      if (e.button === 2) { place(); return; }
      if (e.button !== 0) return;
      if (state.locked) { dig(); return; }
      state.press = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, moved: false };
    }
    function onMouseUp(e) {
      if (state.press && e.button === 0 && !state.press.moved) dig();
      state.press = null;
    }
    function onWheel(e) {
      if (!state.playing) return;
      e.preventDefault();
      selectSlot(state.slot + (e.deltaY > 0 ? 1 : -1));
    }
    function onLockChange() {
      state.locked = document.pointerLockElement === canvas;
      if (!state.drag) setPlaying(state.locked);
    }
    function onLockError() {
      state.drag = true;
      setPlaying(true);
      api.setStatus('Drag to look, click to dig, right click to place, Esc to stop');
    }
    function start() {
      if (state.playing) return;
      try {
        const req = canvas.requestPointerLock();
        if (req && req.catch) req.catch(onLockError);
      } catch (err) { onLockError(); }
    }

    overlay.addEventListener('click', start);
    canvas.addEventListener('click', start);
    canvas.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', e => e.preventDefault());
    canvas.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKey);
    document.addEventListener('pointerlockchange', onLockChange);
    document.addEventListener('pointerlockerror', onLockError);

    function dispose() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('keyup', onKey);
      document.removeEventListener('pointerlockchange', onLockChange);
      document.removeEventListener('pointerlockerror', onLockError);
      if (document.pointerLockElement === canvas) document.exitPointerLock();
      const lose = gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    }

    /* ----- drawing ----- */
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
    }

    function draw() {
      resize();
      const e = eye(), d = lookDir();
      const mvp = multiply(perspective(1.22, canvas.width / canvas.height, 0.05, 140), lookAt(e, d));
      gl.clearColor(SKY[0], SKY[1], SKY[2], 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(prog);
      gl.uniformMatrix4fv(loc.mvp, false, mvp);
      gl.uniform3fv(loc.eye, e);
      gl.uniform3fv(loc.sky, SKY);
      gl.uniform2fv(loc.fog, FOG);
      gl.enableVertexAttribArray(loc.pos);
      gl.enableVertexAttribArray(loc.uv);
      gl.enableVertexAttribArray(loc.light);
      state.chunks.forEach((c) => {
        if (!c.count) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, c.buf);
        gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(loc.uv, 2, gl.FLOAT, false, 24, 12);
        gl.vertexAttribPointer(loc.light, 1, gl.FLOAT, false, 24, 20);
        gl.drawArrays(gl.TRIANGLES, 0, c.count);
      });
      gl.disableVertexAttribArray(loc.uv);
      gl.disableVertexAttribArray(loc.light);

      if (state.target && state.playing) {
        const [x, y, z] = state.target.hit;
        const t = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
        gl.useProgram(lineProg);
        gl.uniformMatrix4fv(loc.lineMvp, false, multiply(mvp, t));
        gl.bindBuffer(gl.ARRAY_BUFFER, lineBuf);
        gl.enableVertexAttribArray(loc.linePos);
        gl.vertexAttribPointer(loc.linePos, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINES, 0, 24);
      }
    }

    function frame(now) {
      if (!canvas.isConnected) { dispose(); return; }   // window closed
      requestAnimationFrame(frame);
      const dt = Math.min((now - state.last) / 1000 || 0, MAX_DT);
      state.last = now;
      if (!canvas.clientWidth) return;                  // minimised
      if (state.playing) step(dt);
      else state.yaw += dt * 0.08;
      state.dirty.forEach(rebuild);
      state.dirty.clear();
      state.target = W.raycast(state.world, eye(), lookDir(), REACH);
      draw();
    }

    newWorld(1 + Math.floor(Math.random() * 99999));
    selectSlot(0);
    nameEl.classList.remove('is-shown');
    requestAnimationFrame(frame);

    return {
      newWorld: () => newWorld(1 + Math.floor(Math.random() * 99999))
    };
  }

  /* The window keeps one game; New World reuses it. */
  let current = null;
  function mount(root, api) {
    current = Game(root, api);
    return current;
  }
  function newWorld() { if (current) current.newWorld(); }

  window.XPGame = { mount, newWorld };
})();
