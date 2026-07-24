/* ============================================================
   NeuroQuiz — Testimonials Component (Dynamic & Interactive)
============================================================ */

import { getReviews, getAverageRating } from "../Utils/reviews";

export function Testimonials() {
  const reviews = getReviews();
  const { average, count } = getAverageRating();

  // Display top 3 reviews on home section
  const displayReviews = reviews.slice(0, 3);

  return `
    <section class="testimonials" id="testimonials" aria-label="Learner testimonials">

      <!-- Section Header -->
      <div class="section-header">

        <span class="section-badge">
          💬 Testimonials
        </span>

        <h2>What Learners Say</h2>

        <p>
          Thousands of learners trust NeuroQuiz to sharpen their programming skills.
        </p>

        <!-- Summary Rating & Action Controls -->
        <div class="testimonials-controls">
          <div class="testimonials-rating-pill">
            <span class="rating-stars">★★★★★</span>
            <span class="rating-text"><strong>${average}</strong> / 5.0 (${count} review${count !== 1 ? "s" : ""})</span>
          </div>

          <div class="testimonials-btn-group">
            <button class="btn btn-secondary btn-sm" id="btn-write-review" aria-label="Write a review">
              ✏️ Write a Review
            </button>
            <button class="btn btn-primary btn-sm" id="btn-see-all-reviews" aria-label="See all reviews">
              See All Reviews (${count}) →
            </button>
          </div>
        </div>

      </div>

      <!-- Testimonials Grid -->
      <div class="testimonial-grid">

        ${displayReviews
          .map(
            (item) => `
            <div class="testimonial-card">

              <div class="testimonial-card-header">
                <span class="testimonial-avatar" aria-hidden="true">${item.avatar}</span>
                <div class="testimonial-stars">
                  ${"★".repeat(item.rating || 5)}${"☆".repeat(5 - (item.rating || 5))}
                </div>
              </div>

              <p class="testimonial-review">
                "${item.review}"
              </p>

              <div class="testimonial-author">
                <h3>${item.name}</h3>
                <span>${item.role}</span>
              </div>

            </div>
          `
          )
          .join("")}

      </div>

    </section>
  `;
}
