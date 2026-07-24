/* ============================================================
   NeuroQuiz — Select Component
   Reusable dropdown select.
============================================================ */

/**
 * @param {{
 *   id: string,
 *   label?: string,
 *   options: Array<{ value: string, label: string, selected?: boolean }>
 * }} opts
 */
export function Select({ id, label = "", options = [] } = {}) {
  const labelHTML = label
    ? `<label for="${id}" class="input-label">${label}</label>`
    : "";

  const optionsHTML = options
    .map(
      (o) =>
        `<option value="${o.value}" ${o.selected ? "selected" : ""}>${o.label}</option>`
    )
    .join("");

  return `
    ${labelHTML}
    <select id="${id}" aria-label="${label || id}">
      ${optionsHTML}
    </select>
  `;
}
