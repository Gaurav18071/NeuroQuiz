/* ============================================================
   NeuroQuiz — Achievement Engine
   Evaluates quiz results and unlocks achievements.
   Persists achievements in localStorage.
============================================================ */

import { STORAGE_KEYS, EMOJI, ACHIEVEMENT_IDS } from "./constants";
import { loadJSON, saveJSON } from "./localStorage";

// ── Achievement definitions ───────────────────────────────────
export const ACHIEVEMENTS = [
  {
    id:          ACHIEVEMENT_IDS.PERFECT_SCORE,
    emoji:       EMOJI.TROPHY,
    title:       "Perfect Score",
    description: "Answer every question correctly.",
    color:       "#FFD700",
  },
  {
    id:          ACHIEVEMENT_IDS.SPEED_RUNNER,
    emoji:       EMOJI.LIGHTNING,
    title:       "Speed Runner",
    description: "Complete a quiz in under 60 seconds.",
    color:       "#00E5FF",
  },
  {
    id:          ACHIEVEMENT_IDS.ACCURACY_MASTER,
    emoji:       EMOJI.TARGET,
    title:       "Accuracy Master",
    description: "Achieve 90%+ accuracy on a quiz.",
    color:       "#22C55E",
  },
  {
    id:          ACHIEVEMENT_IDS.QUIZ_STREAK,
    emoji:       EMOJI.FIRE,
    title:       "Quiz Streak",
    description: "Complete 3 quizzes in a single session.",
    color:       "#EF4444",
  },
  {
    id:          ACHIEVEMENT_IDS.HARD_MODE,
    emoji:       EMOJI.SKULL,
    title:       "Hard Mode Hero",
    description: "Score 70%+ on a Hard difficulty quiz.",
    color:       "#7C3AED",
  },
  {
    id:          ACHIEVEMENT_IDS.NO_SKIP,
    emoji:       EMOJI.MEDAL,
    title:       "No Surrender",
    description: "Complete a quiz without skipping any question.",
    color:       "#5EEAD4",
  },
  {
    id:          ACHIEVEMENT_IDS.FIRST_QUIZ,
    emoji:       EMOJI.SPROUT,
    title:       "First Steps",
    description: "Complete your very first quiz.",
    color:       "#86EFAC",
  },
];

// ── Persistence ───────────────────────────────────────────────

/** @returns {Set<string>} set of unlocked achievement ids */
function _load() {
  const data = loadJSON(STORAGE_KEYS.ACHIEVEMENTS, []);
  return new Set(data);
}

function _save(unlocked) {
  saveJSON(STORAGE_KEYS.ACHIEVEMENTS, [...unlocked]);
}

/** Get all unlocked achievement objects */
export function getUnlocked() {
  const ids = _load();
  return ACHIEVEMENTS.filter((a) => ids.has(a.id));
}

/** Check whether a specific achievement is already unlocked */
export function isUnlocked(id) {
  return _load().has(id);
}

// ── Evaluation ────────────────────────────────────────────────

/**
 * Evaluate a completed quiz and unlock any new achievements.
 *
 * @param {{
 *   correct: number,
 *   total: number,
 *   accuracy: number,
 *   timeTaken: number,
 *   skipped: number,
 *   difficulty: string,
 *   sessionQuizCount: number,
 * }} stats
 *
 * @returns {Achievement[]}  array of newly unlocked achievements (empty if none)
 */
export function evaluateAchievements(stats) {
  const {
    correct, total, accuracy,
    timeTaken, skipped, difficulty,
    sessionQuizCount,
  } = stats;

  const pct       = total ? Math.round((correct / total) * 100) : 0;
  const unlocked  = _load();
  const newlyWon  = [];

  function _check(id, condition) {
    if (condition && !unlocked.has(id)) {
      unlocked.add(id);
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (def) newlyWon.push(def);
    }
  }

  _check(ACHIEVEMENT_IDS.FIRST_QUIZ,     true);
  _check(ACHIEVEMENT_IDS.PERFECT_SCORE,   pct === 100);
  _check(ACHIEVEMENT_IDS.SPEED_RUNNER,    timeTaken > 0 && timeTaken < 60);
  _check(ACHIEVEMENT_IDS.ACCURACY_MASTER, accuracy >= 90);
  _check(ACHIEVEMENT_IDS.QUIZ_STREAK,     sessionQuizCount >= 3);
  _check(ACHIEVEMENT_IDS.HARD_MODE,       difficulty === "Hard" && pct >= 70);
  _check(ACHIEVEMENT_IDS.NO_SKIP,         skipped === 0 && total > 0);

  if (newlyWon.length) _save(unlocked);

  return newlyWon;
}

