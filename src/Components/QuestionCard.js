/* ============================================================
   NeuroQuiz — QuestionCard Component
   Renders the current question and its answer options.
============================================================ */

import { getCurrentQuestion, getAnswerFor } from "/Utils/quizEngine";
import { state } from "/Utils/state";

export function QuestionCard() {
  const qIndex   = state.quiz.currentQuestion;
  const question = getCurrentQuestion();
  if (!question) return "";

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

  return `
    <div class="question-card" id="question-card">
      <p class="question-number">Question ${qIndex + 1}</p>
      <p class="question-text">${question.question}</p>
      <div class="options" role="group" aria-label="Answer options">
        ${optionsHTML}
      </div>
    </div>
  `;
}
