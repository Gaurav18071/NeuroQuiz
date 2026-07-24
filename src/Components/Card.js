/* ============================================================
   NeuroQuiz — Card Component
   Generic surface card wrapper.
============================================================ */

/**
 * @param {{ content: string, className?: string }} opts
 */
export function Card({ content, className = "" } = {}) {
  return `<div class="surface-card ${className}">${content}</div>`;
}
