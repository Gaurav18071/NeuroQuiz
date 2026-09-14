/* ============================================================
   NeuroQuiz — Performance Utilities
   Event delegation, listener cleanup, DOM batching, debounce/throttle.
============================================================ */

// ── Event Registry ────────────────────────────────────────────
// Track all listeners for cleanup on screen changes

const _listeners = new Map();

/**
 * Attach listener with automatic cleanup tracking.
 * @param {HTMLElement} el
 * @param {string} event
 * @param {function} handler
 * @param {object} opts
 */
export function attachListener(el, event, handler, opts = {}) {
  if (!el || !handler) {
    console.warn("[attachListener] Missing element or handler", { el, event, handler });
    return;
  }

  const elKey = el.id || el.className || "unknown";
  const key = `${elKey}:${event}`;
  if (!_listeners.has(key)) {
    _listeners.set(key, []);
  }

  el.addEventListener(event, handler, opts);
  _listeners.get(key).push({ el, event, handler, opts });
}

/**
 * Remove all tracked listeners (call on screen change).
 */
export function cleanupAllListeners() {
  _listeners.forEach((handlers) => {
    handlers.forEach(({ el, event, handler, opts }) => {
      el.removeEventListener(event, handler, opts);
    });
  });
  _listeners.clear();
}

// ── Debounce & Throttle ───────────────────────────────────────

/**
 * Debounce: delay execution until N ms have passed without calls.
 * Useful for resize, scroll, input events.
 */
export function debounce(fn, delayMs = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delayMs);
  };
}

/**
 * Throttle: limit execution to once every N ms.
 * Useful for animation frame-synced operations.
 */
export function throttle(fn, delayMs = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delayMs) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

