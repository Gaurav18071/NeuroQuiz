/* ============================================================
   NeuroQuiz — Reviews Data & Storage Manager
============================================================ */

const STORAGE_KEY = "neuroquiz_user_reviews";

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    name: "Aarav Sharma",
    role: "Frontend Developer",
    avatar: "👨‍💻",
    rating: 5,
    review: "NeuroQuiz helped me improve my JavaScript fundamentals before my interview prep. The UI is clean, intuitive, and the instant feedback loop is amazing!",
    date: "Jul 20, 2026",
    verified: true,
  },
  {
    id: "rev-2",
    name: "Priya Verma",
    role: "Computer Science Student",
    avatar: "👩‍🎓",
    rating: 5,
    review: "I love the timed quizzes and detailed result breakdown section. It makes learning web dev engaging and keeps me daily motivated.",
    date: "Jul 22, 2026",
    verified: true,
  },
  {
    id: "rev-3",
    name: "Rahul Singh",
    role: "Full Stack Developer",
    avatar: "🚀",
    rating: 5,
    review: "A beautifully designed quiz platform with smooth GSAP animations and zero lag. The category filtering makes practice focused and fun.",
    date: "Jul 24, 2026",
    verified: true,
  },
  {
    id: "rev-4",
    name: "Ananya Patel",
    role: "React Specialist",
    avatar: "👩‍💻",
    rating: 5,
    review: "Hands down the cleanest developer quiz app! Tracking accuracy and streaks really pushes you to improve every session.",
    date: "Jul 24, 2026",
    verified: true,
  },
];

/**
 * Get all reviews (user created + default seed)
 * @returns {Array<{ id: string, name: string, role: string, avatar: string, rating: number, review: string, date: string, verified?: boolean }>}
 */
export function getReviews() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_REVIEWS;
  } catch (err) {
    console.warn("[getReviews] Error reading from localStorage:", err);
    return INITIAL_REVIEWS;
  }
}

/**
 * Add a new user review
 * @param {{ name: string, role: string, avatar: string, rating: number, review: string }} data
 */
export function addReview({ name, role, avatar, rating, review }) {
  const reviews = getReviews();

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newReview = {
    id: `rev-${Date.now()}`,
    name: name.trim() || "Anonymous Learner",
    role: role.trim() || "Web Developer",
    avatar: avatar || "🧠",
    rating: Number(rating) || 5,
    review: review.trim(),
    date: formattedDate,
    userSubmitted: true,
  };

  const updated = [newReview, ...reviews];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[addReview] Error saving review:", err);
  }

  return newReview;
}

/**
 * Get average rating and total count
 */
export function getAverageRating() {
  const reviews = getReviews();
  if (!reviews.length) return { average: "5.0", count: 0 };
  const total = reviews.reduce((sum, r) => sum + (r.rating || 5), 0);
  const avg = (total / reviews.length).toFixed(1);
  return { average: avg, count: reviews.length };
}
