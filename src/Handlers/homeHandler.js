/* ============================================================
   NeuroQuiz — Home Handler  (Sprint 8)
   Reads the config form, validates, then boots the quiz.
   Also detects unfinished quizzes and offers resume.
============================================================ */

import { state }           from "../Utils/state";
import { startQuiz }       from "../Utils/quizEngine";
import { showToast }       from "../Components/Toast";
import { showResumeModal, hideResumeModal } from "../Components/ResumeModal";
import { showReviewModal }     from "../Components/ReviewModal";
import { showAllReviewsModal }  from "../Components/AllReviewsModal";

export function attachHomeEvents(renderApp) {
  // ── Handle start quiz (extracted so it can be reused) ────────
  function _handleStart() {
    const nameInput    = document.querySelector("#player-name");
    const categoryEl   = document.querySelector("#category");
    const difficultyEl = document.querySelector("#difficulty");
    const countEl      = document.querySelector("#question-count");

    const playerName    = nameInput?.value.trim() ?? "";
    const category      = categoryEl?.value      || state.quiz.category;
    const difficulty    = difficultyEl?.value    || state.quiz.difficulty;
    const questionCount = Number(countEl?.value  || state.quiz.questionCount);

    // ── Validation ──────────────────────────────────────────
    if (!playerName) {
      showToast("Please enter your name to start!", "error");
      nameInput?.focus();
      nameInput?.classList.add("input-error");
      setTimeout(() => nameInput?.classList.remove("input-error"), 1500);
      return;
    }

    // ── Apply to state ──────────────────────────────────────
    state.player.name        = playerName;
    state.quiz.category      = category;
    state.quiz.difficulty    = difficulty;
    state.quiz.questionCount = questionCount;

    // ── Start loading state on button ───────────────────────
    startBtn.disabled    = true;
    startBtn.textContent = "Loading…";

    // Small tick to let the DOM update before heavy work
    requestAnimationFrame(() => {
      startQuiz();

      if (!state.quiz.questions.length) {
        showToast(`No ${category} / ${difficulty} questions found.`, "error");
        startBtn.disabled    = false;
        startBtn.textContent = "Start Challenge →";
        return;
      }

      state.screen = "quiz";
      renderApp();
    });
  }

  // ── Check for unfinished quiz on home load ────────────────
  function _checkForResume() {
    // Unfinished = quiz questions loaded, but not yet submitted
    const isUnfinished = state.quiz.questions.length > 0
                      && state.quiz.answers.length < state.quiz.questions.length
                      && !state.quiz.isSubmitted;

    if (!isUnfinished) return;

    const total    = state.quiz.questions.length;
    const answered = state.quiz.answers.filter((a) => a.selectedOption !== null).length;
    const percent  = Math.round((answered / total) * 100);

    showResumeModal({
      progress:    percent,
      category:    state.quiz.category,
      difficulty:  state.quiz.difficulty,
      answered,
      total,
      onResume() {
        hideResumeModal();
        state.screen = "quiz";
        renderApp();
      },
      onStart() {
        hideResumeModal();
        // Reset quiz state for a fresh start
        state.quiz.questions = [];
        state.quiz.currentQuestion = 0;
        state.quiz.score = 0;
        state.quiz.answers = [];
        state.quiz.startedAt = null;
        state.quiz.isSubmitted = false;
        _handleStart();
      },
    });
  }

  // ── Wire up event listeners ────────────────────────────────
  _checkForResume();

  const startBtn = document.querySelector("#btn-start");
  if (!startBtn) return;

  startBtn.addEventListener("click", _handleStart);

  // Also allow pressing Enter in the name field to start
  document.querySelector("#player-name")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") _handleStart();
  });

  // ── Learn More / Explore Features button ──────────────────
  const learnMoreBtn = document.querySelector("#btn-learn-more");
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector("#features");
      target?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ── Testimonials event listeners ─────────────────────────
  const writeReviewBtn = document.querySelector("#btn-write-review");
  if (writeReviewBtn) {
    writeReviewBtn.addEventListener("click", () => {
      showReviewModal(() => renderApp());
    });
  }

  const seeAllReviewsBtn = document.querySelector("#btn-see-all-reviews");
  if (seeAllReviewsBtn) {
    seeAllReviewsBtn.addEventListener("click", () => {
      showAllReviewsModal(() => renderApp());
    });
  }

  // ── Footer event listeners ─────────────────────────────────
  const backToTopBtn = document.querySelector("#back-to-top");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const newsletterForm = document.querySelector("#footer-newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector(".newsletter-input");
      if (input) input.value = "";
      showToast("Thanks for subscribing to NeuroQuiz! 🎉", "success");
    });
  }
}
