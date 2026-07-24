/* ============================================================
   NeuroQuiz — Toast Notification
   Types: success | error | warning | info
   Accessible: aria-live polite region
============================================================ */

const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
  info:    "ℹ️",
};

const DURATION = 2800;

/** Single live region mounted once, reused for all toasts */
let _liveRegion = null;

function _ensureLiveRegion() {
  if (_liveRegion) return;
  _liveRegion = document.createElement("div");
  _liveRegion.setAttribute("aria-live",   "polite");
  _liveRegion.setAttribute("aria-atomic", "true");
  _liveRegion.style.cssText =
    "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;";
  document.body.appendChild(_liveRegion);
}

/**
 * Show a non-blocking toast notification.
 * @param {string} message
 * @param {"success"|"error"|"warning"|"info"} type
 */
export function showToast(message, type = "info") {
  _ensureLiveRegion();

  // Remove any existing toast
  document.querySelector(".toast")?.remove();

  const icon  = ICONS[type] ?? "ℹ️";
  const toast = document.createElement("div");
  toast.className    = `toast ${type}`;
  toast.setAttribute("role", "status");
  toast.innerHTML    = `<span aria-hidden="true">${icon}</span><span>${message}</span>`;

  document.body.appendChild(toast);

  // Announce to screen readers via live region
  _liveRegion.textContent = "";
  requestAnimationFrame(() => { _liveRegion.textContent = message; });

  // Slide in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  // Slide out + remove
  const timer = setTimeout(() => _dismiss(toast), DURATION);

  // Allow manual dismiss on click
  toast.addEventListener("click", () => {
    clearTimeout(timer);
    _dismiss(toast);
  });
}

function _dismiss(toast) {
  toast.classList.remove("show");
  toast.addEventListener("transitionend", () => toast.remove(), { once: true });
}
