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
              <h1>🧠 NeuroQuiz</h1>
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
