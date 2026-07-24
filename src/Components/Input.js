/* ============================================================
   NeuroQuiz — Input Component
   Reusable text input.
============================================================ */

/**
 * @param {{
 *   id: string,
 *   placeholder?: string,
 *   label?: string,
 *   type?: string,
 *   required?: boolean,
 *   maxlength?: number
 * }} opts
 */
export function Input({
  id,
  placeholder = "",
  label       = "",
  type        = "text",
  required    = false,
  maxlength   = 100,
} = {}) {
  const labelHTML = label
    ? `<label for="${id}" class="input-label">${label}</label>`
    : "";

  return `
    ${labelHTML}
    <input
      id="${id}"
      type="${type}"
      placeholder="${placeholder}"
      ${required ? "required aria-required='true'" : ""}
      maxlength="${maxlength}"
    />
  `;
}
