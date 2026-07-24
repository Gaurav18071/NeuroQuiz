/* ============================================================
   NeuroQuiz — Button Component
   Reusable button element with variants.
============================================================ */

/**
 * @param {{
 *   text: string,
 *   variant?: "primary"|"ghost"|"danger",
 *   id?: string,
 *   disabled?: boolean,
 *   ariaLabel?: string,
 *   type?: string
 * }} opts
 */
export function Button({
  text,
  variant   = "primary",
  id        = "",
  disabled  = false,
  ariaLabel = "",
  type      = "button",
} = {}) {
  const cls      = `btn btn-${variant}`;
  const idAttr   = id        ? `id="${id}"`               : "";
  const ariaAttr = ariaLabel ? `aria-label="${ariaLabel}"` : "";
  const disAttr  = disabled  ? "disabled"                  : "";

  return `
    <button class="${cls}" type="${type}" ${idAttr} ${ariaAttr} ${disAttr}>
      ${text}
    </button>
  `;
}
