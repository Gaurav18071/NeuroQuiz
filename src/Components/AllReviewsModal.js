/* ============================================================
   NeuroQuiz — See All Reviews Modal Component
============================================================ */

import { gsap } from "gsap";
import { getReviews, getAverageRating } from "../Utils/reviews";
import { showReviewModal } from "./ReviewModal";

let _overlay = null;

/**
 * Show the See All Reviews Modal
 * @param {Function} onReviewAdded - callback to trigger re-render if review added
 */
export function showAllReviewsModal(onReviewAdded = () => {}) {
  if (_overlay) _overlay.remove();

  const reviews = getReviews();
  const { average, count } = getAverageRating();

  _overlay = document.createElement("div");
  _overlay.id = "nq-all-reviews-modal";
  _overlay.className = "modal-overlay";
  _overlay.setAttribute("role", "dialog");
  _overlay.setAttribute("aria-modal", "true");
  _overlay.setAttribute("aria-labelledby", "all-reviews-title");

  _overlay.innerHTML = `
    <div class="modal all-reviews-modal" id="all-reviews-modal-box">
      <button class="auth-close" id="all-reviews-close" aria-label="Close modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Header with score & Write Review CTA -->
      <div class="all-reviews-header">
        <div>
          <h2 id="all-reviews-title">Learner Reviews</h2>
          <div class="rating-summary-badge">
            <span class="rating-score">⭐ ${average}</span>
            <span class="rating-count">(${count} review${count !== 1 ? "s" : ""})</span>
          </div>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-modal-add-review">
          ✏️ Write Review
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="reviews-filter-bar">
        <input
          type="text"
          id="review-search-input"
          class="review-search-input"
          placeholder="Search reviews by keyword or author..."
        />
      </div>

      <!-- Scrollable Reviews List -->
      <div class="all-reviews-list" id="all-reviews-list-container">
        ${_renderReviewCards(reviews)}
      </div>
    </div>
  `;

  document.body.appendChild(_overlay);

  // GSAP Entrance
  gsap.fromTo(_overlay, { opacity: 0 }, { opacity: 1, duration: 0.2 });
  gsap.fromTo(
    "#all-reviews-modal-box",
    { scale: 0.9, y: 20, opacity: 0 },
    { scale: 1, y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.4)" }
  );

  // Search filtering
  const searchInput = _overlay.querySelector("#review-search-input");
  const listContainer = _overlay.querySelector("#all-reviews-list-container");

  searchInput?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = reviews.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.review.toLowerCase().includes(q)
    );
    if (listContainer) {
      listContainer.innerHTML = filtered.length
        ? _renderReviewCards(filtered)
        : `<div class="empty-reviews-state">No reviews match "${e.target.value}"</div>`;
    }
  });

  // Write review button inside modal
  _overlay.querySelector("#btn-modal-add-review")?.addEventListener("click", () => {
    closeAllReviewsModal();
    showReviewModal(() => {
      onReviewAdded();
      showAllReviewsModal(onReviewAdded);
    });
  });

  // Close handlers
  _overlay.querySelector("#all-reviews-close")?.addEventListener("click", closeAllReviewsModal);
  _overlay.addEventListener("click", (e) => {
    if (e.target === _overlay) closeAllReviewsModal();
  });

  const onKey = (e) => {
    if (e.key === "Escape") {
      closeAllReviewsModal();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);
}

export function closeAllReviewsModal() {
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

function _renderReviewCards(reviews) {
  return reviews
    .map(
      (item) => `
    <div class="full-review-card">
      <div class="full-review-header">
        <div class="full-review-author">
          <span class="full-review-avatar">${item.avatar}</span>
          <div>
            <h4>${item.name}</h4>
            <span class="full-review-role">${item.role}</span>
          </div>
        </div>
        <div class="full-review-rating">
          <div class="stars-display">
            ${"★".repeat(item.rating || 5)}${"☆".repeat(5 - (item.rating || 5))}
          </div>
          <span class="full-review-date">${item.date || "Recent"}</span>
        </div>
      </div>
      <p class="full-review-text">"${item.review}"</p>
    </div>
  `
    )
    .join("");
}
