/* ============================================================
   NeuroQuiz — Achievement Badge Component  (Sprint 8)
   Two uses:
     1. showAchievementToast()  — floating notification on unlock
     2. AchievementGrid()       — renders all unlocked badges
============================================================ */

import { gsap }       from "gsap";
import { getUnlocked } from "../Utils/achievement";

// ── Toast notification ────────────────────────────────────────

const _queue  = [];
let   _showing = false;

/**
 * Queue a pop-up achievement unlock notification.
 * @param {{ emoji, title, description, color }} achievement
 */
export function showAchievementToast(achievement) {
  _queue.push(achievement);
  if (!_showing) _showNext();
}

function _showNext() {
  if (!_queue.length) { _showing = false; return; }
  _showing = true;
  const a = _queue.shift();

  const el = document.createElement("div");
  el.className = "achievement-toast";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.innerHTML = `
    <div class="achievement-toast-icon" style="color:${a.color}"
         aria-hidden="true">${a.emoji}</div>
    <div class="achievement-toast-body">
      <span class="achievement-toast-label">Achievement Unlocked!</span>
      <strong class="achievement-toast-title">${a.title}</strong>
      <span class="achievement-toast-desc">${a.description}</span>
    </div>
  `;

  document.body.appendChild(el);

  // Slide in from right
  gsap.fromTo(el,
    { x: "calc(100% + 2rem)", opacity: 0 },
    { x: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }
  );

  // Hold, then slide out
  setTimeout(() => {
    gsap.to(el, {
      x: "calc(100% + 2rem)", opacity: 0, duration: 0.35, ease: "power2.in",
      onComplete() { el.remove(); _showNext(); },
    });
  }, 3500);
}

// ── Result page grid ──────────────────────────────────────────

/**
 * Render a grid of all currently unlocked achievements.
 * Returns an HTML string — insert directly into Result page.
 * Returns empty string if no achievements are unlocked.
 */
export function AchievementGrid() {
  const unlocked = getUnlocked();
  if (!unlocked.length) return "";

  const badges = unlocked
    .map(
      (a) => `
        <div class="achievement-badge" title="${a.description}"
             style="--ach-color:${a.color}"
             aria-label="${a.title}: ${a.description}">
          <span class="achievement-badge-icon" aria-hidden="true">${a.emoji}</span>
          <span class="achievement-badge-title">${a.title}</span>
        </div>
      `
    )
    .join("");

  return `
    <div class="achievements-section">
      <h4 class="achievements-heading">
        <span aria-hidden="true">🎖️</span> Achievements Unlocked
      </h4>
      <div class="achievements-grid" role="list" aria-label="Unlocked achievements">
        ${badges}
      </div>
    </div>
  `;
}
