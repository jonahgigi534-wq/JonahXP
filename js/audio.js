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
  function voice(freq, at, dur, level, type) {
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
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  /* A struck bell: fundamental plus a detuned octave and a fifth, which is
     what stops it sounding like a bare test tone. */
  function bell(freq, at, dur, level) {
    voice(freq, at, dur, level, 'sine');
    voice(freq * 2.01, at, dur * 0.66, level * 0.34, 'sine');
    voice(freq * 2.99, at, dur * 0.4, level * 0.13, 'sine');
  }

  /* Soft low pad underneath the start-up motif. */
  function pad(freq, at, dur, level) {
    voice(freq, at, dur, level, 'triangle');
    voice(freq * 1.005, at, dur, level * 0.6, 'triangle');
  }

  const CUES = {
    /* Four rising notes over a warm pad. */
    startup() {
      pad(110, 0, 2.6, 0.06);
      pad(164.81, 0.05, 2.5, 0.045);
      bell(440.00, 0.00, 1.5, 0.16);   // A4
      bell(587.33, 0.16, 1.5, 0.15);   // D5
      bell(880.00, 0.32, 1.7, 0.14);   // A5
      bell(1174.66, 0.50, 2.0, 0.10);  // D6
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
