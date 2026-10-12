/* ============================================================
   NeuroQuiz — Score & Performance Helpers
   Grade thresholds, badge classes, motivational messages,
   SVG ring offset calculator.
============================================================ */

/** Circumference of the SVG score ring (r=55 → 2π×55 ≈ 345.4) */
const RING_CIRCUMFERENCE = 345;

/**
 * Derive a performance grade from a percentage score.
 * @param {number} pct 0–100
 * @returns {{ label, emoji, badgeClass, message, color }}
 */
export function getGrade(pct) {
  if (pct >= 90) return {
    label:      "Excellent",
    emoji:      "🏆",
    badgeClass: "excellent",
    message:    "Outstanding performance! You're a true expert.",
    color:      "#22C55E",
  };
  if (pct >= 75) return {
    label:      "Great",
    emoji:      "🌟",
    badgeClass: "great",
    message:    "Great work! You clearly know your stuff.",
    color:      "#22C55E",
  };
  if (pct >= 60) return {
    label:      "Good",
    emoji:      "👏",
    badgeClass: "good",
    message:    "Solid effort! A little more practice and you'll ace it.",
    color:      "#00E5FF",
  };
  if (pct >= 40) return {
    label:      "Average",
    emoji:      "📈",
    badgeClass: "average",
    message:    "Keep going! Review the topics you missed and try again.",
    color:      "#FACC15",
  };
  return {
    label:      "Keep Practicing",
    emoji:      "📚",
    badgeClass: "poor",
    message:    "Don't give up — every expert was once a beginner.",
    color:      "#EF4444",
  };
}

/**
 * Calculate the SVG stroke-dashoffset for the score ring.
 * dashoffset = circumference × (1 - pct/100)
 * @param {number} pct 0–100
 * @returns {number}
 */
export function getRingOffset(pct) {
  return RING_CIRCUMFERENCE * (1 - Math.min(pct, 100) / 100);
}

/**
 * Derive the stroke colour for the ring based on percentage.
 * @param {number} pct
 * @returns {string} CSS colour
 */
export function getRingColor(pct) {
  if (pct >= 75) return "#22C55E";
  if (pct >= 50) return "#00E5FF";
  if (pct >= 30) return "#FACC15";
  return "#EF4444";
}

/**
 * Map a difficulty string to a display colour.
 * @param {"Easy"|"Medium"|"Hard"} diff
 * @returns {string} CSS colour
 */
export function getDifficultyColor(diff) {
  const map = { Easy: "#22C55E", Medium: "#FACC15", Hard: "#EF4444" };
  return map[diff] ?? "#94A3B8";
}
