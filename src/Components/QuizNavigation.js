/* ============================================================
   NeuroQuiz — QuizNavigation Component
   Previous / Next / Submit buttons + keyboard hints.
============================================================ */

import { state } from "../Utils/state";
import { isLastQuestion } from "../Utils/quizEngine";

export function QuizNavigation() {
  const qIndex = state.quiz.currentQuestion;
  const isLast = isLastQuestion();

  return `
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

    <div class="kbd-hints" aria-label="Keyboard shortcuts">
      <span class="kbd-hint"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> Select</span>
      <span class="kbd-hint"><kbd>→</kbd> Next</span>
      <span class="kbd-hint"><kbd>←</kbd> Previous</span>
      <span class="kbd-hint"><kbd>S</kbd> Skip</span>
      <span class="kbd-hint"><kbd>T</kbd> Theme</span>
    </div>
  `;
}
