/* ============================================================
   NeuroQuiz — Quiz Engine
   Core quiz lifecycle: init, navigate, answer, timer, stats.
============================================================ */

import { questions as questionBank } from "../Data/questions";
import { state } from "./state";
import { clearState } from "./storage";
import { QUIZ } from "./constants";

// ── Helpers ──────────────────────────────────────────────────

/** Fisher-Yates-ish shuffle (good enough for quiz ordering) */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// ── Quiz lifecycle ────────────────────────────────────────────

/**
 * Filter, shuffle, and slice questions then reset all quiz state.
 * Called once when the player clicks Start.
 */
export function startQuiz() {
  const filtered = questionBank.filter(
    (q) => q.category === state.quiz.category && q.difficulty === state.quiz.difficulty
  );

  state.quiz.questions       = shuffle(filtered).slice(0, state.quiz.questionCount);
  state.quiz.currentQuestion = 0;
  state.quiz.score           = 0;
  state.quiz.answers         = [];
  state.quiz.timeLeft        = QUIZ.TIME_PER_QUESTION;
  state.quiz.timeTaken       = 0;
  state.quiz.startedAt       = Date.now();
  state.quiz.isSubmitted     = false;
}

/** Return the question object for the current index */
export function getCurrentQuestion() {
  return state.quiz.questions[state.quiz.currentQuestion];
}

/**
 * Record the player's answer for the current question.
 * @param {number|null} selectedOption  null = skipped / timed-out
 * @returns {boolean} isCorrect
 */
export function submitAnswer(selectedOption) {
  const q = getCurrentQuestion();
  if (!q) return false;

  const isCorrect = selectedOption !== null && selectedOption === q.correctAnswer;

  state.quiz.answers.push({
    questionId:     q.id,
    selectedOption, // null if skipped
    isCorrect,
  });

  if (isCorrect) state.quiz.score++;

  return isCorrect;
}

/** Return the recorded answer for a given question id, or undefined */
export function getAnswerFor(questionId) {
  return state.quiz.answers.find((a) => a.questionId === questionId);
}

// ── Navigation ────────────────────────────────────────────────

export function nextQuestion() {
  if (state.quiz.currentQuestion < state.quiz.questions.length - 1) {
    state.quiz.currentQuestion++;
    state.quiz.timeLeft = 30;
  }
}

export function previousQuestion() {
  if (state.quiz.currentQuestion > 0) {
    state.quiz.currentQuestion--;
    state.quiz.timeLeft = 30;
  }
}

export function jumpToQuestion(index) {
  state.quiz.currentQuestion = index;
  state.quiz.timeLeft        = 30;
}

export function isLastQuestion() {
  return state.quiz.currentQuestion === state.quiz.questions.length - 1;
}

// ── Finish / Reset ────────────────────────────────────────────

/**
 * Finalise the quiz: record timeTaken, set isSubmitted, route to result.
 */
export function finishQuiz() {
  if (state.quiz.isSubmitted) return; // idempotent guard

  stopTimer();

  state.quiz.timeTaken   = state.quiz.startedAt
    ? Math.round((Date.now() - state.quiz.startedAt) / 1000)
    : 0;
  state.quiz.isSubmitted = true;
  state.screen           = "result";
}

export function resetQuiz() {
  stopTimer();

  state.screen             = "home";
  state.player.name        = state.auth?.name ?? "";

  state.quiz.category        = "JavaScript";
  state.quiz.difficulty      = "Easy";
  state.quiz.questionCount   = 10;
  state.quiz.questions       = [];
  state.quiz.currentQuestion = 0;
  state.quiz.score           = 0;
  state.quiz.answers         = [];
  state.quiz.timeLeft        = 30;
  state.quiz.timeTaken       = 0;
  state.quiz.startedAt       = null;
  state.quiz.isSubmitted     = false;

  clearState();
}

// ── Stats helpers ─────────────────────────────────────────────

/**
 * Full stats object — consumed by Result page.
 * @returns {{
 *   total, correct, wrong, skipped, accuracy,
 *   score, percentage, timeTaken, formattedTime,
 *   category, difficulty,
 *   categoryBreakdown: { [cat]: { total, correct } },
 *   difficultyBreakdown: { [diff]: { total, correct } }
 * }}
 */
export function getQuizStats() {
  const { questions, answers, score, timeTaken, category, difficulty } = state.quiz;

  const total    = questions.length;
  const correct  = score;
  const answered = answers.filter((a) => a.selectedOption !== null).length;
  const wrong    = answered - correct;
  const skipped  = total - answered;
  const accuracy = answered ? Math.round((correct / answered) * 100) : 0;
  const pct      = total    ? Math.round((correct / total)    * 100) : 0;

  // Per-category breakdown
  const categoryBreakdown = {};
  const difficultyBreakdown = {};

  questions.forEach((q) => {
    const a = answers.find((ans) => ans.questionId === q.id);

    // category
    if (!categoryBreakdown[q.category]) categoryBreakdown[q.category] = { total: 0, correct: 0 };
    categoryBreakdown[q.category].total++;
    if (a?.isCorrect) categoryBreakdown[q.category].correct++;

    // difficulty
    if (!difficultyBreakdown[q.difficulty]) difficultyBreakdown[q.difficulty] = { total: 0, correct: 0 };
    difficultyBreakdown[q.difficulty].total++;
    if (a?.isCorrect) difficultyBreakdown[q.difficulty].correct++;
  });

  return {
    total, correct, wrong, skipped,
    accuracy, score,
    percentage: pct,
    timeTaken,
    formattedTime: timeTaken < 60 ? `${timeTaken}s` : `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`,
    category,
    difficulty,
    categoryBreakdown,
    difficultyBreakdown,
  };
}

// ── Timer ─────────────────────────────────────────────────────
// DOM-patch approach: updates only .timer-bar and .timer each tick.
// Full re-render is triggered ONLY on timeout or user navigation.

let _timerInterval = null;

/** Patch the timer DOM nodes without re-rendering the whole page */
function _patchTimerDOM() {
  const t = state.quiz.timeLeft;
  const cls = t <= 5 ? "danger" : t <= 10 ? "warning" : "safe";

  const timerEl = document.querySelector(".timer");
  if (timerEl) {
    timerEl.textContent = `⏱ ${t}s`;
    timerEl.className   = `timer ${cls}`;
  }

  const barEl = document.querySelector(".timer-bar");
  if (barEl) {
    barEl.style.width = `${(t / 30) * 100}%`;
    barEl.className   = `timer-bar ${cls}`;
  }
}

/**
 * Start the countdown for the current question.
 * Calls onTimeout() when timeLeft reaches 0.
 * Never resets timeLeft here — callers must set it beforehand.
 */
export function startTimer(onTimeout) {
  clearInterval(_timerInterval);
  _patchTimerDOM(); // render initial state immediately

  _timerInterval = setInterval(() => {
    state.quiz.timeLeft--;
    _patchTimerDOM();

    if (state.quiz.timeLeft <= 0) {
      clearInterval(_timerInterval);
      _timerInterval = null;
      onTimeout?.();
    }
  }, 1000);
}

export function stopTimer() {
  clearInterval(_timerInterval);
  _timerInterval = null;
}
