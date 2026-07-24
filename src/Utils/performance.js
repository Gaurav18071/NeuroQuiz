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

// ── DOM Batching ───────────────────────────────────────────────

/**
 * Batch multiple DOM writes and reads.
 * Prevent layout thrashing by reading first, then writing.
 * @param {function} readFn - read DOM properties
 * @param {function} writeFn - write to DOM
 */
export function batchDOMOperations(readFn, writeFn) {
  if (readFn) readFn();
  if (typeof requestAnimationFrame !== "undefined") {
    requestAnimationFrame(() => {
      if (writeFn) writeFn();
    });
  } else if (writeFn) {
    writeFn();
  }
}

/**
 * Safe DOM query with fallback.
 * Prevents errors if element doesn't exist.
 */
export function safeQuerySelector(selector) {
  try {
    return document.querySelector(selector);
  } catch {
    return null;
  }
}

/**
 * Safe DOM query all.
 */
export function safeQuerySelectorAll(selector) {
  try {
    return document.querySelectorAll(selector);
  } catch {
    return [];
  }
}

// ── Animation Performance ──────────────────────────────────────

/**
 * Check if reduced motion is preferred.
 * Disable animations for accessibility + performance.
 */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Measure operation performance.
 * @param {string} label
 * @param {function} fn
 * @returns {any} result of fn
 */
export function measurePerformance(label, fn) {
  if (typeof performance === "undefined") return fn();

  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (duration > 16) { // > 1 frame at 60fps
    console.warn(`[Perf] ${label}: ${duration.toFixed(2)}ms (slow)`);
  } else if (duration > 100) {
    console.log(`[Perf] ${label}: ${duration.toFixed(2)}ms`);
  }

  return result;
}
