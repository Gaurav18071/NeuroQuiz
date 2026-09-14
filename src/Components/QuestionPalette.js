/* ============================================================
   NeuroQuiz — QuestionPalette Component
   Grid of numbered buttons showing answered / active / skipped state.
============================================================ */

import { state } from "/Utils/state";
import { getAnswerFor } from "/Utils/quizEngine";

export function QuestionPalette() {
  const qIndex  = state.quiz.currentQuestion;

  const buttons = state.quiz.questions
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

  return `
    <div class="question-palette" role="group" aria-label="Question navigator">
      ${buttons}
    </div>
  `;
}
