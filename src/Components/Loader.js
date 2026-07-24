/* ============================================================
   NeuroQuiz — Loading Screen  (Sprint 8)
   Shown briefly when transitioning from Home → Quiz.
   Programmatically mounted/unmounted — NOT part of #app HTML.
============================================================ */

import { gsap } from "gsap";

let _overlay = null;
let _barTween = null;

/**
 * Show the loading screen and animate progress bar.
 * Automatically calls `onDone` when the animation completes.
 *
 * @param {Function} onDone  Called after the loader finishes
 * @param {number}   duration  Total display time in ms (default 900)
 */
export function showLoader(onDone, duration = 900) {
  // Prevent double-mount
  if (_overlay) { onDone?.(); return; }

  _overlay = document.createElement("div");
  _overlay.id        = "nq-loader";
  _overlay.className = "nq-loader-overlay";
  _overlay.setAttribute("role",       "progressbar");
  _overlay.setAttribute("aria-label", "Loading quiz");
  _overlay.setAttribute("aria-live",  "polite");
  _overlay.innerHTML = `
    <div class="nq-loader-card">
      <div class="nq-loader-logo" aria-hidden="true">🧠</div>
      <h2 class="nq-loader-title">NeuroQuiz</h2>
      <p  class="nq-loader-sub"  id="nq-loader-msg">Preparing your questions…</p>
      <div class="nq-loader-track" aria-hidden="true">
        <div class="nq-loader-bar" id="nq-loader-bar"></div>
      </div>
      <span class="nq-loader-pct" id="nq-loader-pct" aria-hidden="true">0%</span>
    </div>
  `;

  document.body.appendChild(_overlay);

  // Animate in
  gsap.fromTo(
    _overlay,
    { opacity: 0 },
    { opacity: 1, duration: 0.2, ease: "power2.out" }
  );

  gsap.fromTo(
    ".nq-loader-card",
    { scale: 0.88, y: 20, opacity: 0 },
    { scale: 1,    y: 0,  opacity: 1, duration: 0.35, ease: "back.out(1.6)", delay: 0.05 }
  );

  // Animate bar 0 → 100%
  const bar     = _overlay.querySelector("#nq-loader-bar");
  const pctEl   = _overlay.querySelector("#nq-loader-pct");
  const msgEl   = _overlay.querySelector("#nq-loader-msg");
  const secs    = duration / 1000;

  const messages = [
    "Preparing your questions…",
    "Shuffling the deck…",
    "Almost ready…",
  ];
  let msgIdx = 0;
  const msgTimer = setInterval(() => {
    msgIdx = (msgIdx + 1) % messages.length;
    if (msgEl) msgEl.textContent = messages[msgIdx];
  }, duration / messages.length);

  const obj = { pct: 0 };
  _barTween = gsap.to(obj, {
    pct:      100,
    duration: secs,
    ease:     "power1.inOut",
    onUpdate() {
      const v = Math.round(obj.pct);
      if (bar)   bar.style.width  = `${v}%`;
      if (pctEl) pctEl.textContent = `${v}%`;
    },
    onComplete() {
      clearInterval(msgTimer);
      // Fade out then remove
      gsap.to(_overlay, {
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete() {
          _overlay?.remove();
          _overlay  = null;
          _barTween = null;
          onDone?.();
        },
      });
    },
  });
}

/**
 * Immediately hide the loader without waiting (e.g. on error).
 */
export function hideLoader() {
  if (!_overlay) return;
  _barTween?.kill();
  _overlay.remove();
  _overlay  = null;
  _barTween = null;
}
