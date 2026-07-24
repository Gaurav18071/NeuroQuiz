/* ============================================================
   NeuroQuiz — localStorage Utilities
   Reusable, safe helpers for storage operations.
   All functions silently fail-over to defaults on error.
============================================================ */

/**
 * Save JSON-serializable data to localStorage.
 * @param {string} key
 * @param {any} data
 * @returns {boolean} success
 */
export function saveJSON(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error(`[Storage] Failed to save ${key}:`, err.message);
    return false;
  }
}

/**
 * Load JSON data from localStorage.
 * @param {string} key
 * @param {any} defaultValue fallback if not found or parse error
 * @returns {any} parsed data or default
 */
export function loadJSON(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`[Storage] Failed to load ${key}:`, err.message);
    return defaultValue;
  }
}

/**
 * Save a string to localStorage.
 * @param {string} key
 * @param {string} value
 * @returns {boolean} success
 */
export function saveString(key, value) {
  try {
    localStorage.setItem(key, String(value));
    return true;
  } catch (err) {
    console.error(`[Storage] Failed to save string ${key}:`, err.message);
    return false;
  }
}

/**
 * Load a string from localStorage.
 * @param {string} key
 * @param {string} defaultValue
 * @returns {string}
 */
export function loadString(key, defaultValue = "") {
  try {
    return localStorage.getItem(key) ?? defaultValue;
  } catch (err) {
    console.error(`[Storage] Failed to load string ${key}:`, err.message);
    return defaultValue;
  }
}

/**
 * Save a boolean to localStorage (as "true" or "false" string).
 * @param {string} key
 * @param {boolean} value
 * @returns {boolean} success
 */
export function saveBoolean(key, value) {
  return saveString(key, value ? "true" : "false");
}

/**
 * Load a boolean from localStorage.
 * @param {string} key
 * @param {boolean} defaultValue
 * @returns {boolean}
 */
export function loadBoolean(key, defaultValue = false) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return raw === "true";
  } catch (err) {
    console.error(`[Storage] Failed to load boolean ${key}:`, err.message);
    return defaultValue;
  }
}

/**
 * Remove an item from localStorage.
 * @param {string} key
 * @returns {boolean} success
 */
export function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (err) {
    console.error(`[Storage] Failed to remove ${key}:`, err.message);
    return false;
  }
}

/**
 * Check if a key exists in localStorage.
 * @param {string} key
 * @returns {boolean}
 */
export function exists(key) {
  try {
    return localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear all items from localStorage.
 * Use with caution — affects other apps sharing the same origin.
 * @returns {boolean} success
 */
export function clearAll() {
  try {
    localStorage.clear();
    return true;
  } catch (err) {
    console.error("[Storage] Failed to clear all:", err.message);
    return false;
  }
}
