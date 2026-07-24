/* ============================================================
   NeuroQuiz — Constants
   Centralized configuration, magic numbers, keys, and emojis.
   Production use: Single source of truth for all app constants.
============================================================ */

// ── Storage Keys ──────────────────────────────────────────────

export const STORAGE_KEYS = {
  USERS:        "neuroquiz-users",
  SESSION:      "neuroquiz-session",
  THEME:        "neuroquiz-theme",
  ACHIEVEMENTS: "neuroquiz-achievements",
  STATE:        "neuroquiz-state",
  SOUND:        "neuroquiz-sound",
};

// ── Quiz Configuration ────────────────────────────────────────

export const QUIZ = {
  TIME_PER_QUESTION:  30,
  MIN_QUESTIONS:      5,
  MAX_QUESTIONS:      50,
  DEFAULT_DIFFICULTY: "Easy",
  DEFAULT_CATEGORY:   "JavaScript",
  TIMER_WARNING_THRESHOLD: 10, // seconds before running out
};

export const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

export const CATEGORIES = [
  "JavaScript",
  "React",
  "CSS",
  "HTML",
  "Git",
  "TypeScript",
];

// ── Animations & Timings ─────────────────────────────────────

export const TIMINGS = {
  TOAST_DURATION_MS:    2800,
  LOADER_DURATION_MS:   900,
  MODAL_ENTRANCE_MS:    400,
  PAGE_TRANSITION_MS:   500,
  CONFETTI_DURATION_MS: 2400,
  RIPPLE_DURATION_MS:   550,
  ACHIEVEMENT_DELAY_MS: 600,
};

export const SOUND_DURATIONS = {
  CORRECT:  0.15,
  WRONG:    0.12,
  COMPLETE: 0.2,
  TICK:     0.08,
  WARNING:  0.18,
  CLICK:    0.05,
};

// ── Grade Thresholds (percentages) ────────────────────────────

export const GRADE_THRESHOLDS = {
  A: 90,  // 90%+
  B: 75,  // 75-89%
  C: 60,  // 60-74%
  D: 40,  // 40-59%
  F: 0,   // 0-39%
};

export const GRADE_COLORS = {
  A: "#22C55E", // green
  B: "#3B82F6", // blue
  C: "#FACC15", // yellow
  D: "#F97316", // orange
  F: "#EF4444", // red
};

// ── SVG & UI Measurements ────────────────────────────────────

export const UI = {
  SCORE_RING_CIRCUMFERENCE: 345,
  SCORE_RING_RADIUS:        55,
  CONFETTI_COUNT:           90,
  CONFETTI_HIGH_SCORE_COUNT: 120,
};

// ── Emojis ───────────────────────────────────────────────────

export const EMOJI = {
  BRAIN:          "🧠",
  TROPHY:         "🏆",
  STAR:           "⭐",
  FIRE:           "🔥",
  LIGHTNING:      "⚡",
  TARGET:         "🎯",
  SKULL:          "💀",
  MEDAL:          "🎖️",
  SPROUT:         "🌱",
  CHECKMARK:      "✓",
  CROSS:          "✕",
  HOURGLASS:      "⏳",
  GEAR:           "⚙️",
  SOUND_ON:       "🔊",
  SOUND_OFF:      "🔇",
  HOME:           "🏠",
  REPEAT:         "🔄",
  PLAY:           "▶️",
  PAUSE:          "⏸️",
  SETTINGS:       "⚙️",
  CLOSE:          "✕",
  MENU:           "☰",
};

// ── Color Palette ────────────────────────────────────────────

export const COLORS = {
  PRIMARY:        "#00E5FF",
  PRIMARY_DARK:   "#0891B2",
  SECONDARY:      "#7C3AED",
  SUCCESS:        "#22C55E",
  WARNING:        "#FACC15",
  DANGER:         "#EF4444",
  INFO:           "#3B82F6",
  MUTED:          "#6B7280",
  BG_DARK:        "#0F172A",
  BG_LIGHT:       "#F8FAFC",
  TEXT_DARK:      "#E2E8F0",
  TEXT_LIGHT:     "#1E293B",
  BORDER:         "rgba(255,255,255,.1)",
};

// ── Validation ────────────────────────────────────────────────

export const VALIDATION = {
  MIN_NAME_LENGTH:     2,
  MAX_NAME_LENGTH:     50,
  MIN_PASSWORD_LENGTH: 6,
  MOBILE_PATTERN:      /^[+\d][\d\s\-()]{6,}$/,
  EMAIL_PATTERN:       /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// ── Error Messages ────────────────────────────────────────────

export const ERROR_MESSAGES = {
  NO_QUESTIONS:         "No questions found for this category and difficulty.",
  INVALID_STATE:        "Quiz state is corrupted. Please restart.",
  STORAGE_FAILED:       "Failed to save progress. Please try again.",
  AUTH_FAILED:          "Authentication failed. Please check your credentials.",
  NETWORK_ERROR:        "Network error. Please check your connection.",
  THEME_FAILED:         "Failed to apply theme. Using default.",
  UNEXPECTED_ERROR:     "An unexpected error occurred. Please refresh the page.",
};

// ── Achievements ──────────────────────────────────────────────

export const ACHIEVEMENT_IDS = {
  FIRST_QUIZ:     "first_quiz",
  PERFECT_SCORE:  "perfect_score",
  SPEED_RUNNER:   "speed_runner",
  ACCURACY_MASTER: "accuracy_master",
  QUIZ_STREAK:    "quiz_streak",
  HARD_MODE:      "hard_mode",
  NO_SKIP:        "no_skip",
};

// ── Breakpoints ───────────────────────────────────────────────

export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
};
