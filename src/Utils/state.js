/* ============================================================
   NeuroQuiz — Global State  (Sprint 8 updated)
   Single mutable object shared across all modules.
============================================================ */

export const state = {
  /** Current screen: "home" | "quiz" | "result" */
  screen: "home",

  /**
   * Logged-in user session.
   * null = guest | { identifier, name, avatar } = authenticated
   */
  auth: null,

  player: {
    name: "",
  },

  quiz: {
    category:        "JavaScript",
    difficulty:      "Easy",
    questionCount:   10,

    /** Loaded question objects */
    questions:       [],

    /** 0-based index of the currently displayed question */
    currentQuestion: 0,

    /** Number of correct answers */
    score:           0,

    /**
     * Answer objects: { questionId, selectedOption, isCorrect }
     * selectedOption === null → skipped / timed-out
     */
    answers:         [],

    /** Seconds remaining for the current question */
    timeLeft:        30,

    /** Total seconds spent across all questions */
    timeTaken:       0,

    /** Unix ms timestamp when the quiz started */
    startedAt:       null,

    /** Prevents double-submit */
    isSubmitted:     false,
  },

  /** Sprint 8 — session-level stats & gamification */
  session: {
    /** How many quizzes completed this browser session */
    quizCount: 0,

    /** ISO date string of last quiz attempt, for streak tracking */
    lastPlayed: null,

    /**
     * Achievement ids newly unlocked this result screen.
     * Cleared on each new quiz start.
     */
    newAchievements: [],
  },

  /** UI preferences */
  prefs: {
    /** "dark" | "light" */
    theme: "dark",

    /** Whether sound effects are enabled */
    sound: true,
  },
};
