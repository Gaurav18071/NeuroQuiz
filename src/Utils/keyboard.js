/* ============================================================
   NeuroQuiz — Keyboard Shortcuts Manager  (Sprint 8)

   Provides a clean, context-aware shortcut registry.
   Prevents stacking of duplicate listeners across re-renders.
   All shortcuts are no-ops while an input / textarea has focus,
   unless the shortcut is explicitly marked `global: true`.
============================================================ */

/** @type {Map<string, { handler: Function, global: boolean }>} */
const _registry = new Map();

let _active = false;

/** The single document-level listener — installed once */
function _onKeyDown(e) {
  // Ignore when typing in form fields (unless shortcut is global)
  const inInput = e.target.matches("input, textarea, select, [contenteditable]");

  for (const [key, { handler, global: isGlobal }] of _registry) {
    if (inInput && !isGlobal) continue;
    if (_matchKey(e, key)) {
      e.preventDefault();
      handler(e);
      return; // first match wins
    }
  }
}

/** Parse a shortcut string like "ctrl+enter", "arrowleft", "escape", "1" */
function _matchKey(e, shortcut) {
  const parts   = shortcut.toLowerCase().split("+");
  const key     = parts[parts.length - 1];
  const ctrl    = parts.includes("ctrl");
  const shift   = parts.includes("shift");
  const alt     = parts.includes("alt");

  return (
    e.key.toLowerCase()  === key   &&
    !!e.ctrlKey          === ctrl  &&
    !!e.shiftKey         === shift &&
    !!e.altKey           === alt
  );
}

// ── Public API ────────────────────────────────────────────────

/** Install the keyboard listener (idempotent) */
export function initKeyboard() {
  if (_active) return;
  document.addEventListener("keydown", _onKeyDown);
  _active = true;
}

/** Remove the keyboard listener and clear all shortcuts */
export function destroyKeyboard() {
  document.removeEventListener("keydown", _onKeyDown);
  _registry.clear();
  _active = false;
}

/**
 * Register a shortcut.
 * @param {string}   key      e.g. "arrowleft", "ctrl+enter", "escape", "1"
 * @param {Function} handler
 * @param {{ global?: boolean }} opts  global=true fires even inside inputs
 */
export function registerShortcut(key, handler, { global: isGlobal = false } = {}) {
  _registry.set(key.toLowerCase(), { handler, global: isGlobal });
}

/**
 * Remove a previously registered shortcut.
 * @param {string} key
 */
export function unregisterShortcut(key) {
  _registry.delete(key.toLowerCase());
}

/** Remove all shortcuts (call between screen transitions) */
export function clearShortcuts() {
  _registry.clear();
}
