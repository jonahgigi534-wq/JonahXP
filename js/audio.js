/* Shell sounds, synthesised at runtime with the Web Audio API.

   Nothing is sampled or downloaded: every cue is built from oscillators
   here, so the site ships no audio files and borrows no one else's.

   Browsers block audio until the visitor interacts with the page, which
   suits us — the first gesture is the click on the login tile, and that is
   exactly when the start-up chime should sound. */
(function () {
  const STORE_KEY = 'jonahxp.muted';
  const MASTER = 0.5;

  let ctx = null;
  let master = null;
  let muted = read();

  function read() {
    try { return localStorage.getItem(STORE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function write(v) {
    try { localStorage.setItem(STORE_KEY, v ? '1' : '0'); } catch (e) { /* private mode */ }
  }

  /* The context can only be created inside a user gesture. */
  function unlock() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : MASTER;
    master.connect(ctx.destination);
    return ctx;
  }

  /* One voice: a sine partial with an exponential bell decay. */
  function voice(freq, at, dur, level, type, dest) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;

    const t0 = ctx.currentTime + at;
    const attack = Math.min(0.012, dur * 0.2);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(level, t0 + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    osc.connect(gain);
    gain.connect(master);
    if (dest) gain.connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /* A struck bell: fundamental plus a detuned octave and a fifth, which is
     what stops it sounding like a bare test tone. */
  function bell(freq, at, dur, level, dest) {
    voice(freq, at, dur, level, 'sine', dest);
    voice(freq * 2.01, at, dur * 0.66, level * 0.34, 'sine', dest);
    voice(freq * 2.99, at, dur * 0.4, level * 0.13, 'sine', dest);
  }

  /* A short echo bus (delay with filtered feedback) so the start-up cue
     sounds like it is in a room. Built once, on first use. */
  let echo = null;
  function echoBus() {
    if (echo) return echo;
    echo = ctx.createGain();
    echo.gain.value = 0.32;
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.21;
    const fb = ctx.createGain();
    fb.gain.value = 0.38;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2600;
    echo.connect(delay);
    delay.connect(tone);
    tone.connect(fb);
    fb.connect(delay);
    tone.connect(master);
    return echo;
  }

  /* A chord that blooms open: detuned saws through a low-pass filter whose
     cutoff rises then settles, with a slow attack and long tail. */
  function swell(freqs, at, dur, level) {
    const t0 = ctx.currentTime + at;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(320, t0);
    filter.frequency.exponentialRampToValueAtTime(2400, t0 + dur * 0.35);
    filter.frequency.exponentialRampToValueAtTime(700, t0 + dur);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(level, t0 + dur * 0.28);
    gain.gain.setValueAtTime(level, t0 + dur * 0.5);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    filter.connect(gain);
    gain.connect(master);
    gain.connect(echoBus());
    freqs.forEach((f) => {
      [-6, 6].forEach((cents) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        osc.detune.value = cents;
        osc.connect(filter);
        osc.start(t0);
        osc.stop(t0 + dur + 0.05);
      });
    });
  }

  /* Soft low pad underneath the start-up motif. */
  function pad(freq, at, dur, level) {
    voice(freq, at, dur, level, 'triangle');
    voice(freq * 1.005, at, dur, level * 0.6, 'triangle');
  }

  const CUES = {
    /* About four seconds: an E-flat chord blooms open, moves through A-flat
       and resolves home, with a rising sparkle of bells on top. Written for
       this site in the spirit of the XP start-up, not a copy of it. */
    startup() {
      const room = echoBus();
      swell([77.78, 155.56, 233.08, 311.13, 392.00], 0.00, 2.4, 0.022);   // Eb
      swell([103.83, 207.65, 261.63, 311.13, 415.30], 1.30, 1.9, 0.018);  // Ab/Eb
      swell([77.78, 155.56, 233.08, 311.13, 466.16], 2.30, 2.4, 0.020);   // Eb, home
      pad(77.78, 0, 4.6, 0.05);
      bell(622.25, 0.10, 1.4, 0.10, room);    // Eb5
      bell(783.99, 0.34, 1.4, 0.09, room);    // G5
      bell(932.33, 0.58, 1.6, 0.09, room);    // Bb5
      bell(1244.51, 0.86, 2.2, 0.08, room);   // Eb6
      bell(1046.50, 1.55, 1.6, 0.06, room);   // C6
      bell(932.33, 2.25, 1.8, 0.07, room);    // Bb5
      bell(1244.51, 2.55, 2.4, 0.07, room);   // Eb6
      bell(1567.98, 2.80, 2.0, 0.035, room);  // G6, shimmer
    },
    /* Tray balloon appearing: a small soft pop. */
    balloon() {
      bell(1318.51, 0, 0.12, 0.05);
      bell(1760.00, 0.05, 0.2, 0.04);
    },
    /* Descending farewell. */
    logoff() {
      pad(146.83, 0, 1.4, 0.05);
      bell(880.00, 0.00, 0.9, 0.13);
      bell(587.33, 0.14, 1.0, 0.13);
      bell(392.00, 0.28, 1.4, 0.12);
    },
    /* Window appears: quick step up. */
    open() {
      bell(659.25, 0, 0.26, 0.10);
      bell(987.77, 0.055, 0.32, 0.08);
    },
    /* Window folds away: quick step down. */
    minimize() {
      bell(784.00, 0, 0.2, 0.08);
      bell(523.25, 0.05, 0.26, 0.07);
    },
    close() {
      bell(523.25, 0, 0.18, 0.07);
      bell(392.00, 0.045, 0.24, 0.06);
    },
    /* Start menu: a single soft tick. */
    menu() {
      bell(1046.50, 0, 0.14, 0.07);
    },
    /* Kept for completeness; the classic two-tone alert. */
    error() {
      voice(311.13, 0, 0.18, 0.12, 'square');
      voice(233.08, 0.19, 0.3, 0.12, 'square');
    }
  };

  function play(name) {
    if (muted) return;
    const cue = CUES[name];
    if (!cue) return;
    if (!unlock()) return;          // no Web Audio support
    if (ctx.state === 'suspended') return;  // still awaiting a gesture
    try { cue(); } catch (e) { /* never let a sound break the shell */ }
  }

  function setMuted(v) {
    muted = !!v;
    write(muted);
    if (master) {
      master.gain.setTargetAtTime(muted ? 0 : MASTER, ctx.currentTime, 0.02);
    }
    document.dispatchEvent(new CustomEvent('xp:audio'));
  }

  window.XPAudio = {
    unlock, play, setMuted,
    toggle: () => setMuted(!muted),
    isMuted: () => muted
  };
})();
