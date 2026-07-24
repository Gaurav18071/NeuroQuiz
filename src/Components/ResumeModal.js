/* ============================================================
   NeuroQuiz — Resume Quiz Modal  (Sprint 8)
   Shown when a saved, unfinished quiz is detected on home load.
============================================================ */

import { gsap } from "gsap";

let _overlay = null;

/**
 * Show the Resume Modal.
 * @param {{
 *   category:        string,
 *   difficulty:      string,
 *   currentQuestion: number,
 *   total:           number,
 *   playerName:      string,
 *   onResume:        Function,
 *   onNew:           Function,
 * }} opts
 */
export function showResumeModal({
  category        = "",
  difficulty      = "",
  currentQuestion = 0,
  total           = 0,
  playerName      = "",
  onResume        = () => {},
  onNew           = () => {},
} = {}) {
  if (_overlay) return;

  const progress = total ? Math.round(((currentQuestion) / total) * 100) : 0;

  _overlay = document.createElement("div");
  _overlay.id        = "nq-resume-modal";
  _overlay.className = "modal-overlay";
  _overlay.setAttribute("role",             "dialog");
  _overlay.setAttribute("aria-modal",       "true");
  _overlay.setAttribute("aria-labelledby",  "resume-title");
  _overlay.innerHTML = `
    <div class="modal resume-modal" id="resume-modal-box">
      <div class="modal-icon" aria-hidden="true">📂</div>

      <h2 id="resume-title">Resume Previous Quiz?</h2>

      <p>
        ${playerName ? `<strong>${playerName}</strong>, you` : "You"} have an
        unfinished <strong>${category}</strong> quiz on
        <strong>${difficulty}</strong> difficulty.
      </p>

      <div class="resume-meta" aria-label="Quiz progress">
        <div class="resume-meta-item">
          <span class="resume-meta-label">Progress</span>
          <span class="resume-meta-value">${currentQuestion} / ${total}</span>
        </div>
        <div class="resume-meta-item">
          <span class="resume-meta-label">Category</span>
          <span class="resume-meta-value">${category}</span>
        </div>
        <div class="resume-meta-item">
          <span class="resume-meta-label">Difficulty</span>
          <span class="resume-meta-value">${difficulty}</span>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="resume-bar-track" aria-hidden="true">
        <div class="resume-bar-fill" style="width:0%"
             data-target="${progress}"></div>
      </div>
      <span class="resume-bar-label" aria-hidden="true">${progress}% completed</span>

      <div class="modal-actions" style="margin-top:var(--space-7);">
        <button class="btn-cancel"  id="resume-new"    aria-label="Discard saved quiz and start new">
          Start New
        </button>
        <button class="btn-confirm" id="resume-continue" aria-label="Continue from where you left off">
          ▶ Continue
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(_overlay);

  // Animate in
  gsap.fromTo(_overlay,                { opacity: 0 }, { opacity: 1, duration: 0.25 });
  gsap.fromTo("#resume-modal-box",
    { scale: 0.88, y: 24, opacity: 0 },
    { scale: 1,    y: 0,  opacity: 1, duration: 0.4, ease: "back.out(1.5)", delay: 0.05 }
  );

  // Animate progress bar after entrance
  setTimeout(() => {
    const bar = _overlay?.querySelector(".resume-bar-fill");
    if (bar) gsap.to(bar, { width: `${progress}%`, duration: 1, ease: "power2.out", delay: 0.2 });
  }, 100);

  // Wire buttons
  _overlay.querySelector("#resume-continue")?.addEventListener("click", () => {
    _close();
    onResume();
  });

  _overlay.querySelector("#resume-new")?.addEventListener("click", () => {
    _close();
    onNew();
  });

  // Backdrop click → start new
  _overlay.addEventListener("click", (e) => {
    if (e.target === _overlay) { _close(); onNew(); }
  });

  // Escape → start new
  const onKey = (e) => {
    if (e.key === "Escape") {
      _close(); onNew();
      document.removeEventListener("keydown", onKey);
    }
  };
  document.addEventListener("keydown", onKey);

  // Focus Continue button
  setTimeout(() => _overlay?.querySelector("#resume-continue")?.focus(), 80);
}

export function hideResumeModal() { _close(); }

function _close() {
  if (!_overlay) return;
  gsap.to(_overlay, {
    opacity: 0, duration: 0.2, onComplete: () => {
      _overlay?.remove();
      _overlay = null;
    },
  });
}
