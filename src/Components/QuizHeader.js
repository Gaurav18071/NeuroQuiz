/* ============================================================
   NeuroQuiz — QuizHeader Component
   Renders the top bar of the quiz: title, category, timer.
============================================================ */

import { state } from "../Utils/state";

/**
 * @param {{ timerClass: string, timeLeft: number }} opts
 */
export function QuizHeader({ timerClass = "safe", timeLeft = 30 } = {}) {
  return `
    <div class="quiz-header">
      <div class="quiz-meta">
        <h1>🧠 NeuroQuiz</h1>
        <p>${state.quiz.category} · ${state.quiz.difficulty}</p>
      </div>
      <div class="timer-widget" aria-live="polite" aria-atomic="true">
        <div class="timer ${timerClass}" id="quiz-timer" role="timer" aria-label="Time remaining">
          ⏱ ${timeLeft}s
        </div>
      </div>
    </div>
    <div class="timer-track" aria-hidden="true">
      <div class="timer-bar ${timerClass}" id="timer-bar" style="width:${(timeLeft / 30) * 100}%;"></div>
    </div>
  `;
}
