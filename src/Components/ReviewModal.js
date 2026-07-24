/* ============================================================
   NeuroQuiz — Add Review Modal Component
============================================================ */

import { gsap } from "gsap";
import { state } from "../Utils/state";
import { addReview } from "../Utils/reviews";
import { showToast } from "./Toast";

let _overlay = null;
let _selectedRating = 5;
let _selectedAvatar = "👨‍💻";

const AVATARS = ["👨‍💻", "👩‍💻", "🚀", "👩‍🎓", "🧠", "⚡", "💻", "🎯"];

/**
 * Show the Write a Review Modal
 * @param {Function} onSuccess - callback after successful review submission
 */
export function showReviewModal(onSuccess = () => {}) {
  if (_overlay) return;

  _selectedRating = 5;
  _selectedAvatar = "👨‍💻";

  const defaultName = state.player.name || state.auth?.name || "";

  _overlay = document.createElement("div");
  _overlay.id = "nq-review-modal";
  _overlay.className = "modal-overlay";
  _overlay.setAttribute("role", "dialog");
  _overlay.setAttribute("aria-modal", "true");
  _overlay.setAttribute("aria-labelledby", "review-modal-title");

  _overlay.innerHTML = `
    <div class="modal review-form-modal" id="review-modal-box">
      <button class="auth-close" id="review-modal-close" aria-label="Close review modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="modal-header-centered">
        <div class="modal-badge-icon">⭐</div>
        <h2 id="review-modal-title">Share Your Experience</h2>
        <p>Your feedback helps thousands of learners on NeuroQuiz.</p>
      </div>

      <form id="review-submit-form" class="review-form">
        <!-- Rating Stars Selection -->
        <div class="form-group text-center">
          <label class="form-label-centered">Your Rating</label>
          <div class="star-rating-select" id="star-rating-picker" role="radiogroup" aria-label="Rating stars">
            ${[1, 2, 3, 4, 5]
              .map(
                (star) => `
                <button type="button" class="star-btn ${star <= 5 ? "active" : ""}" data-star="${star}" aria-label="${star} stars">
                  ★
                </button>
              `
              )
              .join("")}
          </div>
        </div>

        <!-- Avatar Selection -->
        <div class="form-group">
          <label class="form-label">Choose Avatar</label>
          <div class="avatar-picker" id="avatar-picker">
            ${AVATARS.map(
              (emoji, idx) => `
              <button type="button" class="avatar-option ${idx === 0 ? "selected" : ""}" data-avatar="${emoji}">
                ${emoji}
              </button>
            `
            ).join("")}
          </div>
        </div>

        <!-- 2-Column Name & Role Inputs -->
        <div class="form-row-2col">
          <div class="form-group">
            <label for="review-author-name" class="form-label">Your Name</label>
            <input
              id="review-author-name"
              type="text"
              class="form-input"
              placeholder="e.g. Gaurav Mishra"
              value="${defaultName}"
              required
              maxlength="50"
            />
          </div>

          <div class="form-group">
            <label for="review-author-role" class="form-label">Your Role / Title</label>
            <input
              id="review-author-role"
              type="text"
              class="form-input"
              placeholder="e.g. Frontend Developer"
              required
              maxlength="60"
            />
          </div>
        </div>

        <!-- Review Content Textarea -->
        <div class="form-group">
          <label for="review-content" class="form-label">Your Review</label>
          <textarea
            id="review-content"
            class="form-textarea"
            placeholder="What do you think about NeuroQuiz? How has it helped your learning journey?"
            required
            rows="2"
            maxlength="300"
          ></textarea>
        </div>

        <!-- Submit & Cancel Actions -->
        <div class="modal-actions mt-4">
          <button type="button" class="btn-cancel" id="review-cancel-btn">Cancel</button>
          <button type="submit" class="btn-confirm" id="review-submit-btn">
            Submit Review ✨
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(_overlay);

  // GSAP Entrance
  gsap.fromTo(_overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(
    "#review-modal-box",
    { scale: 0.9, y: 20, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" }
  );

  // ── Star Picker Logic ──
  const starBtns = _overlay.querySelectorAll(".star-btn");
  starBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      _selectedRating = Number(btn.dataset.star);
      starBtns.forEach((b) => {
        const starVal = Number(b.dataset.star);
        b.classList.toggle("active", starVal <= _selectedRating);
      });
    });
  });

  // ── Avatar Picker Logic ──
  const avatarBtns = _overlay.querySelectorAll(".avatar-option");
  avatarBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      _selectedAvatar = btn.dataset.avatar;
      avatarBtns.forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });

  // ── Form Submission ──
  const form = _overlay.querySelector("#review-submit-form");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = _overlay.querySelector("#review-author-name")?.value.trim() ?? "";
    const role = _overlay.querySelector("#review-author-role")?.value.trim() ?? "";
    const reviewText = _overlay.querySelector("#review-content")?.value.trim() ?? "";

    if (!reviewText) {
      showToast("Please enter a review message!", "error");
      return;
    }

    addReview({
      name,
      role,
      avatar: _selectedAvatar,
      rating: _selectedRating,
      review: reviewText,
    });

    closeReviewModal();
    showToast("Thank you for your review! 🎉", "success");
    onSuccess();
  });

  // ── Close Buttons & Backdrop ──
  _overlay.querySelector("#review-modal-close")?.addEventListener("click", closeReviewModal);
  _overlay.querySelector("#review-cancel-btn")?.addEventListener("click", closeReviewModal);
  _overlay.addEventListener("click", (e) => {
    if (e.target === _overlay) closeReviewModal();
  });

  const onKey = (e) => {
    if (e.key === "Escape") {
      closeReviewModal();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

export function closeReviewModal() {
  if (!_overlay) return;
  gsap.to(_overlay, {
    opacity: 0,
    duration: 0.2,
    onComplete: () => {
      _overlay?.remove();
      _overlay = null;
    },
  });
}
