/* ============================================================
   NeuroQuiz — Quiz Handler  (Sprint 5.4)
   Wires all quiz interactivity:
     · Timer (DOM-patch, no re-render per tick)
     · Option selection
     · Previous / Next / Submit
     · Question palette
     · Submit confirmation modal
     · Keyboard shortcuts: 1–4 answer, ←→ nav, S skip, T theme
============================================================ */

import { state } from "../Utils/state";
import {
  startTimer,
  stopTimer,
  submitAnswer,
  nextQuestion,
  previousQuestion,
  jumpToQuestion,
  finishQuiz,
  isLastQuestion,
  getCurrentQuestion,
} from "../Utils/quizEngine";
import { showToast } from "../Components/Toast";
import { toggleTheme } from "../Utils/theme";

// ── Module-level keyboard handler reference (for cleanup) ──
let _keyHandler = null;

export function attachQuizEvents(renderApp) {

  // ── 1. Start timer ────────────────────────────────────────
  startTimer(() => {
    showToast("⏰ Time's up!", "warning");

    // Auto-record a skip for the current question if not answered
    const q = getCurrentQuestion();
    if (q && !state.quiz.answers.find((a) => a.questionId === q.id)) {
      submitAnswer(null); // null = skipped / timed-out
    }

    if (isLastQuestion()) {
      finishQuiz();
    } else {
      nextQuestion();
    }
    renderApp();
  });

  // ── 2. Option selection ───────────────────────────────────
  document.querySelectorAll(".option-btn:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = Number(btn.dataset.index);
      const ok  = submitAnswer(idx);

      // Ripple effect
      _addRipple(btn, e);

      showToast(ok ? "✅ Correct!" : "❌ Wrong answer!", ok ? "success" : "error");

      // Re-render to show correct/wrong — timer keeps running
      renderApp();
    });
  });

  // ── 3. Palette navigation ─────────────────────────────────
  document.querySelectorAll(".palette-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      stopTimer();
      jumpToQuestion(Number(btn.dataset.question));
      renderApp();
    });
  });

  // ── 4. Previous button ────────────────────────────────────
  document.querySelector("#btn-prev")?.addEventListener("click", () => {
    stopTimer();
    previousQuestion();
    renderApp();
  });

  // ── 5. Next button ────────────────────────────────────────
  document.querySelector("#btn-next")?.addEventListener("click", () => {
    stopTimer();
    nextQuestion();
    renderApp();
  });

  // ── 6. Finish / Submit button → show modal ────────────────
  document.querySelector("#btn-finish")?.addEventListener("click", () => {
    stopTimer();
    _showModal();
  });

  // ── 7. Modal: Cancel ─────────────────────────────────────
  document.querySelector("#modal-cancel")?.addEventListener("click", () => {
    _hideModal();
    // Restart timer for current question
    startTimer(() => {
      showToast("⏰ Time's up!", "warning");
      const q = getCurrentQuestion();
      if (q && !state.quiz.answers.find((a) => a.questionId === q.id)) {
        submitAnswer(null);
      }
      if (isLastQuestion()) { finishQuiz(); } else { nextQuestion(); }
      renderApp();
    });
  });

  // ── 8. Modal: Confirm submit ──────────────────────────────
  document.querySelector("#modal-confirm")?.addEventListener("click", () => {
    _hideModal();
    finishQuiz();
    renderApp();
  });

  // ── 9. Keyboard shortcuts ─────────────────────────────────
  // Remove any previous listener first (prevents stacking on re-render)
  if (_keyHandler) document.removeEventListener("keydown", _keyHandler);

  _keyHandler = (e) => {
    // Don't hijack when user is typing in an input
    if (e.target.matches("input, textarea, select")) return;
    // Don't fire when modal is open
    const modalOpen = !document.querySelector("#submit-modal")?.hidden;
    if (modalOpen) {
      if (e.key === "Escape") _hideModal();
      return;
    }

    switch (e.key) {
      // Answer options 1–4
      case "1": case "2": case "3": case "4": {
        const idx = Number(e.key) - 1;
        const optBtn = document.querySelector(`.option-btn:not([disabled])[data-index="${idx}"]`);
        optBtn?.click();
        break;
      }
      // Navigation — ArrowRight only (Enter reserved for option buttons / forms)
      case "ArrowRight": {
        e.preventDefault();
        if (isLastQuestion()) {
          document.querySelector("#btn-finish")?.click();
        } else {
          document.querySelector("#btn-next")?.click();
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        document.querySelector("#btn-prev")?.click();
        break;
      }
      // Skip current question
      case "s":
      case "S": {
        const q = getCurrentQuestion();
        if (q && !state.quiz.answers.find((a) => a.questionId === q.id)) {
          submitAnswer(null);
          showToast("⏭ Question skipped", "info");
          stopTimer();
          if (isLastQuestion()) { finishQuiz(); renderApp(); }
          else { nextQuestion(); renderApp(); }
        }
        break;
      }
      // Theme toggle
      case "t":
      case "T": {
        toggleTheme();
        break;
      }
    }
  };

  document.addEventListener("keydown", _keyHandler);
}

// ── Modal helpers ─────────────────────────────────────────────

function _showModal() {
  const modal = document.querySelector("#submit-modal");
  if (!modal) return;
  modal.hidden = false;
  // Focus first button for accessibility
  setTimeout(() => modal.querySelector(".btn-cancel")?.focus(), 50);
}

function _hideModal() {
  const modal = document.querySelector("#submit-modal");
  if (modal) modal.hidden = true;
}

// ── Ripple helper ─────────────────────────────────────────────

function _addRipple(btn, e) {
  const rect   = btn.getBoundingClientRect();
  const circle = document.createElement("span");
  const size   = Math.max(rect.width, rect.height);
  const x      = e.clientX - rect.left - size / 2;
  const y      = e.clientY - rect.top  - size / 2;

  circle.className = "ripple-circle";
  circle.style.cssText = `
    width:${size}px; height:${size}px;
    left:${x}px; top:${y}px;
  `;

  btn.style.position = "relative";
  btn.style.overflow = "hidden";
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 600);
}
