/* ============================================================
   NeuroQuiz — Result Handler  (Sprint 8)
   Wires:
     · Retake Quiz button
     · Home button
     · Review accordion (expand/collapse each item)
     · Review filter (all / correct / wrong / skipped)
     · Score ring animation
     · Confetti for high scores
     · Achievement evaluation & display
============================================================ */

import { resetQuiz, getQuizStats } from "../Utils/quizEngine";
import { animateScoreRing, triggerConfetti } from "../Js/pageAnimation";
import { evaluateAchievements } from "../Utils/achievement";
import { showAchievementToast } from "../Components/AchievementBadge";
import { state } from "../Utils/state";

export function attachResultEvents(renderApp) {

  // ── Achievement evaluation ──────────────────────────────────
  const stats = getQuizStats();
  const newAchievements = evaluateAchievements(stats);
  state.session.newAchievements = newAchievements;

  // Show toast for each new achievement with staggered timing
  newAchievements.forEach((achievement, idx) => {
    setTimeout(() => {
      showAchievementToast(achievement);
    }, 500 + idx * 600);
  });

  // ── Score ring animation ──────────────────────────────────
  animateScoreRing();

  // ── Confetti for great scores ─────────────────────────────
  const { percentage } = stats;
  if (percentage >= 75) {
    triggerConfetti(percentage >= 90 ? 120 : 70);
  }

  // ── Retake same quiz ──────────────────────────────────────
  document.querySelector("#btn-retake")?.addEventListener("click", () => {
    // Keep same category/difficulty/count — just re-run startQuiz via home
    resetQuiz();
    renderApp();
  });

  // ── Go home ───────────────────────────────────────────────
  document.querySelector("#btn-home")?.addEventListener("click", () => {
    resetQuiz();
    renderApp();
  });

  // ── Review accordion ─────────────────────────────────────
  document.querySelectorAll(".review-item-header").forEach((header) => {
    header.addEventListener("click",   () => _toggleReviewItem(header));
    header.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        _toggleReviewItem(header);
      }
    });
  });

  // ── Review filter buttons ─────────────────────────────────
  document.querySelectorAll(".review-filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      document.querySelectorAll(".review-filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      _applyReviewFilter(filter);
    });
  });

  // Expand first wrong/skipped item by default (helps recruiters see the feature)
  const firstWrong = document.querySelector(".review-item.wrong, .review-item.skipped");
  if (firstWrong) {
    const h = firstWrong.querySelector(".review-item-header");
    if (h) _toggleReviewItem(h);
  }
}

// ── Helpers ───────────────────────────────────────────────────

function _toggleReviewItem(header) {
  const item     = header.closest(".review-item");
  const body     = item?.querySelector(".review-item-body");
  if (!body) return;

  const isOpen = body.classList.toggle("open");
  header.setAttribute("aria-expanded", String(isOpen));
}

function _applyReviewFilter(filter) {
  document.querySelectorAll(".review-item").forEach((item) => {
    if (filter === "all") {
      item.style.display = "";
    } else {
      item.style.display = item.classList.contains(filter) ? "" : "none";
    }
  });
}
