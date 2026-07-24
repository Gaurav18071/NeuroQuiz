/* ============================================================
   NeuroQuiz — Client-Side Auth
   No backend. Users are stored in localStorage.
   Passwords are hashed with a simple deterministic hash
   (NOT cryptographically secure — this is a portfolio project).
============================================================ */

import { STORAGE_KEYS, VALIDATION } from "./constants";
import { saveJSON, loadJSON } from "./localStorage";

// ── Types ─────────────────────────────────────────────────────
/**
 * UserRecord shape:
 * {
 *   identifier: string,   // email or mobile (normalised)
 *   name: string,
 *   passwordHash: string,
 *   avatar: string,       // emoji initial avatar
 *   createdAt: number,
 *   progress: ProgressRecord[]
 * }
 *
 * ProgressRecord:
 * { date, category, difficulty, score, total, accuracy, timeTaken }
 */

// ── Helpers ───────────────────────────────────────────────────

/** Deterministic string hash — good enough for a portfolio demo */
function _hash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

/** Pick an emoji avatar from the first char of the name */
const AVATARS = ["🧠", "🚀", "⚡", "🎯", "🏆", "📚", "🌟", "🔥", "💡", "🎓"];
function _avatar(name) {
  const code = name.trim().charCodeAt(0) || 0;
  return AVATARS[code % AVATARS.length];
}

/** Normalise identifier: trim, lowercase, remove spaces */
function _norm(id) {
  return id.trim().toLowerCase().replace(/\s+/g, "");
}

/** Detect whether the identifier looks like a mobile number */
export function isMobile(id) {
  return VALIDATION.MOBILE_PATTERN.test(id.trim());
}

/** Detect email */
export function isEmail(id) {
  return VALIDATION.EMAIL_PATTERN.test(id.trim());
}

// ── Storage helpers ───────────────────────────────────────────

function _getUsers() {
  return loadJSON(STORAGE_KEYS.USERS, {});
}

function _saveUsers(users) {
  saveJSON(STORAGE_KEYS.USERS, users);
}

// ── Auth API ──────────────────────────────────────────────────

/**
 * Register a new user.
 * @returns {{ ok: true, user } | { ok: false, error: string }}
 */
export function register({ identifier, name, password }) {
  if (!identifier || !name || !password) {
    return { ok: false, error: "All fields are required." };
  }

  if (!isEmail(identifier) && !isMobile(identifier)) {
    return { ok: false, error: "Enter a valid email or mobile number." };
  }

  if (name.trim().length < 2) {
    return { ok: false, error: "Name must be at least 2 characters." };
  }

  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const users = _getUsers();
  const key   = _norm(identifier);

  if (users[key]) {
    return { ok: false, error: "An account with this email / mobile already exists." };
  }

  const user = {
    identifier:   key,
    name:         name.trim(),
    passwordHash: _hash(password + key),
    avatar:       _avatar(name),
    createdAt:    Date.now(),
    progress:     [],
  };

  users[key] = user;
  _saveUsers(users);

  // Auto-login after register
  const session = { identifier: key, name: user.name, avatar: user.avatar };
  saveJSON(STORAGE_KEYS.SESSION, session);

  return { ok: true, user: session };
}

/**
 * Login an existing user.
 * @returns {{ ok: true, user } | { ok: false, error: string }}
 */
export function login({ identifier, password }) {
  if (!identifier || !password) {
    return { ok: false, error: "All fields are required." };
  }

  const users = _getUsers();
  const key   = _norm(identifier);
  const user  = users[key];

  if (!user) {
    return { ok: false, error: "No account found. Please sign up first." };
  }

  if (user.passwordHash !== _hash(password + key)) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  const session = { identifier: key, name: user.name, avatar: user.avatar };
  saveJSON(STORAGE_KEYS.SESSION, session);

  return { ok: true, user: session };
}

/** Logout — clear session */
export function logout() {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

/**
 * Load current session.
 * @returns {{ identifier, name, avatar } | null}
 */
export function getSession() {
  return loadJSON(STORAGE_KEYS.SESSION, null);
}

/**
 * Save a quiz result to the logged-in user's progress.
 * @param {{ category, difficulty, score, total, accuracy, timeTaken }} result
 */
export function saveProgress(result) {
  const session = getSession();
  if (!session) return;

  const users = _getUsers();
  const user  = users[session.identifier];
  if (!user) return;

  user.progress.unshift({
    date:       new Date().toLocaleDateString(),
    category:   result.category,
    difficulty: result.difficulty,
    score:      result.score,
    total:      result.total,
    accuracy:   result.accuracy,
    timeTaken:  result.timeTaken,
  });

  // Keep last 50 results
  user.progress = user.progress.slice(0, 50);
  users[session.identifier] = user;
  _saveUsers(users);
}

/**
 * Get progress history for the current user.
 * @returns {ProgressRecord[]}
 */
export function getProgress() {
  const session = getSession();
  if (!session) return [];

  const users = _getUsers();
  return users[session.identifier]?.progress ?? [];
}
