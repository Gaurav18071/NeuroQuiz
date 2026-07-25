/* ============================================================
   NeuroQuiz — Quiz Page  (Sprint 5.4)
   Includes: timer bar, question palette, options with
   correct/wrong reveal, submit confirmation modal,
   skip tracking, keyboard hint bar.
============================================================ */

import { getCurrentQuestion, getAnswerFor, isLastQuestion } from "../Utils/quizEngine";
import { state } from "../Utils/state";
import { Navbar } from "../Components/Navbar";

export function QuizPage() {
  // Guard: questions not loaded
  if (!state.quiz.questions?.length) {
    return `
      <section class="page">
        <div class="quiz-page">
          <div class="quiz-card" style="text-align:center;padding:4rem 2rem;">
            <p style="font-size:2rem;margin-bottom:1rem;">⚠️</p>
            <h2>No Questions Found</h2>
            <p style="margin:1rem 0 2rem;">
              No questions available for
              <strong>${state.quiz.category}</strong> /
              <strong>${state.quiz.difficulty}</strong>.
              Go back and choose a different combination.
            </p>
            <button class="btn btn-ghost restart">← Back to Home</button>
          </div>
        </div>
      </section>
    `;
  }

  const question    = getCurrentQuestion();
  const t           = state.quiz.timeLeft;
  const timerClass  = t <= 5 ? "danger" : t <= 10 ? "warning" : "safe";
  const timerPct    = (t / 30) * 100;
  const qIndex      = state.quiz.currentQuestion;
  const total       = state.quiz.questions.length;
  const progressPct = ((qIndex + 1) / total) * 100;
  const answered    = state.quiz.answers.filter((a) => a.selectedOption !== null).length;
  const isLast      = isLastQuestion();

  // ── Palette ───────────────────────────────────────────────
  const paletteHTML = state.quiz.questions
    .map((q, i) => {
      const ans       = getAnswerFor(q.id);
      const isActive  = i === qIndex;
      const isAnswered = ans && ans.selectedOption !== null;
      const isSkipped  = ans && ans.selectedOption === null;

      let cls = "palette-btn";
      if (isActive)   cls += " active";
      if (isAnswered) cls += " answered";
      if (isSkipped)  cls += " skipped";

      return `
        <button
          class="${cls}"
          data-question="${i}"
          aria-label="Go to question ${i + 1}"
          aria-current="${isActive ? "true" : "false"}"
        >${i + 1}</button>
      `;
    })
    .join("");

  // ── Options ───────────────────────────────────────────────
  const existingAnswer = getAnswerFor(question.id);
  const isLocked       = existingAnswer !== undefined;

  const optionsHTML = question.options
    .map((opt, i) => {
      let cls = "option-btn";
      if (isLocked) {
        if (i === question.correctAnswer)             cls += " correct";
        else if (i === existingAnswer?.selectedOption) cls += " wrong";
      }

      return `
        <button
          class="${cls}"
          data-index="${i}"
          ${isLocked ? "disabled" : ""}
          aria-label="Option ${String.fromCharCode(65 + i)}: ${opt}"
        >
          <span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span>
          <span class="option-text">${opt}</span>
        </button>
      `;
    })
    .join("");

  // ── Modal (rendered but hidden — quizHandler shows it) ───
  const unanswered = total - answered;
  const modalHTML = `
    <div class="modal-overlay" id="submit-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" hidden>
      <div class="modal">
        <div class="modal-icon">📋</div>
        <h2 id="modal-title">Submit Quiz?</h2>
        <p>Once submitted, you cannot change your answers.</p>

        <div class="modal-stats" aria-label="Quiz summary">
          <div class="modal-stat">
            <span style="color:#22c55e">${answered}</span>
            <span>Answered</span>
          </div>
          <div class="modal-stat">
            <span style="color:#facc15">${unanswered}</span>
            <span>Unanswered</span>
          </div>
          <div class="modal-stat">
            <span>${total}</span>
            <span>Total</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-cancel" id="modal-cancel" aria-label="Cancel and return to quiz">Keep Going</button>
          <button class="btn-confirm" id="modal-confirm" aria-label="Confirm quiz submission">Submit Now</button>
        </div>
      </div>
    </div>
  `;

  return `
    <section class="page" id="quiz-page">
      ${Navbar({ playerName: state.player.name, screen: "quiz" })}

      <div class="quiz-page">
        <div class="quiz-card" role="main">

          <!-- Header: title + timer -->
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
                ⏱ ${t}s
              </div>
            </div>
          </div>

          <!-- Timer progress bar -->
          <div class="timer-track" aria-hidden="true">
            <div class="timer-bar ${timerClass}" id="timer-bar" style="width:${timerPct}%;"></div>
          </div>

          <!-- Question progress -->
          <div class="quiz-progress" aria-label="Quiz progress">
            <div class="quiz-progress-label">
              <span>Question ${qIndex + 1} of ${total}</span>
              <span>${answered} answered</span>
            </div>
            <div class="progress-track" role="progressbar" aria-valuenow="${qIndex + 1}" aria-valuemin="1" aria-valuemax="${total}">
              <div class="progress-fill" style="width:${progressPct}%;"></div>
            </div>
          </div>

          <!-- Question palette -->
          <div class="question-palette" role="group" aria-label="Question navigator">
            ${paletteHTML}
          </div>

          <!-- Question -->
          <div class="question-card" id="question-card">
            <p class="question-number">Question ${qIndex + 1}</p>
            <p class="question-text">${question.question}</p>

            <div class="options" role="group" aria-label="Answer options">
              ${optionsHTML}
            </div>
          </div>

          <!-- Navigation -->
          <div class="quiz-actions">
            <button
              class="btn-prev"
              id="btn-prev"
              ${qIndex === 0 ? "disabled" : ""}
              aria-label="Previous question"
            >← Previous</button>

            ${isLast
              ? `<button class="btn-finish" id="btn-finish" aria-label="Submit quiz">Submit Quiz ✓</button>`
              : `<button class="btn-next"   id="btn-next"   aria-label="Next question">Next →</button>`
            }
          </div>

          <!-- Keyboard hints -->
          <div class="kbd-hints" aria-label="Keyboard shortcuts">
            <span class="kbd-hint"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> Select option</span>
            <span class="kbd-hint"><kbd>→</kbd> Next</span>
            <span class="kbd-hint"><kbd>←</kbd> Previous</span>
            <span class="kbd-hint"><kbd>S</kbd> Skip</span>
            <span class="kbd-hint"><kbd>T</kbd> Theme</span>
          </div>

        </div>
      </div>

      ${modalHTML}
    </section>
  `;
}
