/* ============================================================
   NeuroQuiz — Badge Component
   Reusable inline chip/tag element.
============================================================ */

/**
 * @param {{ text: string, variant?: "default"|"success"|"warning"|"danger"|"muted" }} opts
 */
export function Badge({ text, variant = "default" } = {}) {
  const cls = variant === "default" ? "badge" : `badge badge-${variant}`;
  return `<span class="${cls}">${text}</span>`;
}
