/* ============================================================
   NeuroQuiz — Sound Effects
   Uses Web Audio API (no external files).
   Respects user sound preference in localStorage.
============================================================ */

import { STORAGE_KEYS, SOUND_DURATIONS } from "./constants";
import { loadBoolean, saveBoolean } from "./localStorage";

let _ctx = null;

function _getCtx() {
  if (_ctx) return _ctx;
  try {
    _ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    _ctx = null;
  }
  return _ctx;
}

/** Resume context after a user gesture (browsers require it) */
function _resume() {
  const ctx = _getCtx();
  if (ctx?.state === "suspended") ctx.resume();
  return ctx;
}

// ── Preference ────────────────────────────────────────────────

export function isSoundEnabled() {
  return loadBoolean(STORAGE_KEYS.SOUND, true);
}

export function setSoundEnabled(on) {
  saveBoolean(STORAGE_KEYS.SOUND, on);
}

export function toggleSound() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

// ── Synthesizer helpers ───────────────────────────────────────

function _beep({ frequency = 440, type = "sine", duration = 0.12, gain = 0.18, delay = 0 } = {}) {
  if (!isSoundEnabled()) return;
  const ctx = _resume();
  if (!ctx) return;

  const osc    = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type      = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);

  gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

// ── Sound effects ─────────────────────────────────────────────

/** Played when user selects the correct answer */
export function playCorrect() {
  _beep({ frequency: 523, type: "sine",     duration: SOUND_DURATIONS.CORRECT, gain: 0.15 });
  _beep({ frequency: 659, type: "sine",     duration: SOUND_DURATIONS.CORRECT, gain: 0.12, delay: 0.08 });
  _beep({ frequency: 784, type: "triangle", duration: SOUND_DURATIONS.COMPLETE, gain: 0.1,  delay: 0.16 });
}

/** Played when user selects the wrong answer */
export function playWrong() {
  _beep({ frequency: 200, type: "sawtooth", duration: 0.18, gain: 0.12 });
  _beep({ frequency: 160, type: "sawtooth", duration: 0.22, gain: 0.1,  delay: 0.1 });
}

/** Played when quiz is completed / submitted */
export function playComplete() {
  [0, 0.1, 0.2, 0.3, 0.4].forEach((delay, i) => {
    _beep({ frequency: [523, 659, 784, 1047, 1319][i], type: "sine", duration: 0.2, gain: 0.12, delay });
  });
}

/** Timer tick — subtle click each second */
export function playTick() {
  _beep({ frequency: 880, type: "square", duration: 0.04, gain: 0.05 });
}

/** Warning beep when timer is under 10s */
export function playTimerWarning() {
  _beep({ frequency: 440, type: "square", duration: 0.06, gain: 0.08 });
}

/** UI click / button press */
export function playClick() {
  _beep({ frequency: 600, type: "sine", duration: 0.06, gain: 0.08 });
}
