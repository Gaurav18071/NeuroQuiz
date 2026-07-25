/* ============================================================
   NeuroQuiz — QuizHeader Component
   Renders the top bar of the quiz: title, category, timer.
============================================================ */

import { state } from "/Utils/state";

/**
 * @param {{ timerClass: string, timeLeft: number }} opts
 */
export function QuizHeader({ timerClass = "safe", timeLeft = 30 } = {}) {
  return `
    <div class="quiz-header">
      <div class="quiz-meta">
        <a class="quiz-logo" href="#" aria-label="NeuroQuiz home">
          <svg width="22" height="22" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="quiz-logo-grad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#00e5ff"/>
                <stop offset="100%" stop-color="#7c3aed"/>
              </linearGradient>
            </defs>
            <path fill="url(#quiz-logo-grad)"
              d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
          </svg>
          <span>NeuroQuiz</span>
        </a>
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
