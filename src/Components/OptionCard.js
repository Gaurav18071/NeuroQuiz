/* ============================================================
   NeuroQuiz — OptionCard Component
   Single answer option button.
============================================================ */

/**
 * @param {{
 *   index: number,
 *   text: string,
 *   state: "default"|"correct"|"wrong",
 *   disabled: boolean
 * }} opts
 */
export function OptionCard({ index, text, state: btnState = "default", disabled = false } = {}) {
  const letter = String.fromCharCode(65 + index);
  let cls = "option-btn";
  if (btnState === "correct") cls += " correct";
  if (btnState === "wrong")   cls += " wrong";

  return `
    <button
      class="${cls}"
      data-index="${index}"
      ${disabled ? "disabled" : ""}
      aria-label="Option ${letter}: ${text}"
    >
      <span class="option-letter" aria-hidden="true">${letter}</span>
      <span class="option-text">${text}</span>
    </button>
  `;
}
