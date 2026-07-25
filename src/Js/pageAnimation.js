/* ============================================================
   NeuroQuiz — Page Transition Animations  (Sprint 8)
   Route-aware GSAP transitions:
     home   → quiz   : slide-left  + scale-in card
     quiz   → result : slide-up    + fade
     result → home   : fade-out    + fade-in
   Generic fallback for any unlisted route change.
============================================================ */

import { gsap } from "gsap";

// ── Page entrance ─────────────────────────────────────────────

/**
 * Run the entrance animation for the current screen.
 * @param {"home"|"quiz"|"result"} screen
 */
export function animatePage(screen = "home") {
  // Fade the page wrapper in only if it exists (home screen has no .page)
  const pageEl = document.querySelector(".page");
  if (pageEl) {
    gsap.fromTo(
      pageEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }

  switch (screen) {
    case "quiz":
      _animateQuizEntrance();
      break;
    case "result":
      _animateResultEntrance();
      break;
    default:
      _animateHomeEntrance();
  }
}

// ── Home entrance ─────────────────────────────────────────────

function _animateHomeEntrance() {
  // .quiz-card and .result-card only exist on quiz/result screens;
  // nullTargetWarn is disabled globally via gsap.config() in animation.js
  gsap.fromTo(
    ".quiz-card, .result-card",
    { opacity: 0, scale: 0.96, y: 16 },
    { opacity: 1, scale: 1,    y: 0,
      duration: 0.45, delay: 0.05, ease: "back.out(1.3)" }
  );
}

// ── Quiz entrance ─────────────────────────────────────────────

function _animateQuizEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Card slides in from right
  tl.fromTo(
    ".quiz-card",
    { opacity: 0, x: 60, scale: 0.96 },
    { opacity: 1, x: 0,  scale: 1, duration: 0.5, ease: "back.out(1.2)" }
  );

  // Header fades down
  tl.fromTo(
    ".quiz-header",
    { opacity: 0, y: -16 },
    { opacity: 1, y: 0,   duration: 0.35 },
    "-=0.3"
  );

  // Timer bar expands
  tl.fromTo(
    ".timer-track",
    { scaleX: 0, transformOrigin: "left" },
    { scaleX: 1, duration: 0.4 },
    "-=0.25"
  );

  // Progress fills
  tl.fromTo(
    ".quiz-progress",
    { opacity: 0, y: 8 },
    { opacity: 1, y: 0, duration: 0.3 },
    "-=0.2"
  );

  // Palette buttons stagger in
  tl.fromTo(
    ".palette-btn",
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 0.25, stagger: 0.03 },
    "-=0.15"
  );

  // Question text slides up
  tl.fromTo(
    ".question-text",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0,  duration: 0.4 },
    "-=0.1"
  );

  // Options stagger in from left
  tl.fromTo(
    ".option-btn",
    { opacity: 0, x: -24 },
    { opacity: 1, x: 0,   duration: 0.35, stagger: 0.07 },
    "-=0.2"
  );

  // Nav buttons pop in
  tl.fromTo(
    ".quiz-actions button",
    { opacity: 0, y: 10 },
    { opacity: 1, y: 0,   duration: 0.3, stagger: 0.08 },
    "-=0.15"
  );
}

// ── Result entrance ───────────────────────────────────────────

function _animateResultEntrance() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // Card slides up
  tl.fromTo(
    ".result-card",
    { opacity: 0, y: 40, scale: 0.95 },
    { opacity: 1, y: 0,  scale: 1, duration: 0.55 }
  );

  // Score ring
  tl.fromTo(
    ".score-ring-wrap",
    { opacity: 0, scale: 0.6, rotation: -90 },
    { opacity: 1, scale: 1,   rotation: 0, duration: 0.6, ease: "back.out(1.5)" },
    "-=0.3"
  );

  // Grade badge
  tl.fromTo(
    ".grade-badge",
    { opacity: 0, y: -10 },
    { opacity: 1, y: 0,   duration: 0.35 },
    "-=0.35"
  );

  // Result grade text
  tl.fromTo(
    ".result-grade h2, .result-grade p",
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0,  duration: 0.4, stagger: 0.1 },
    "-=0.3"
  );

  // Stats cards pop in
  tl.fromTo(
    ".result-stat-card",
    { opacity: 0, y: 28, scale: 0.85 },
    { opacity: 1, y: 0,  scale: 1, duration: 0.4, stagger: 0.08, ease: "back.out(1.4)" },
    "-=0.1"
  );

  // Breakdown cards
  tl.fromTo(
    ".breakdown-card",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0,  duration: 0.45, stagger: 0.1 },
    "-=0.1"
  );

  // Action buttons
  tl.fromTo(
    ".result-actions .btn",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0,  duration: 0.3, stagger: 0.08 },
    "-=0.1"
  );

  // Achievements section (if present)
  tl.fromTo(
    ".achievements-section",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.4 },
    "-=0.1"
  );
}

// ── Score ring SVG animation ──────────────────────────────────

/**
 * Animate the SVG stroke-dashoffset of the score ring.
 * Reads `data-offset` set by Result.js.
 */
export function animateScoreRing() {
  const ring = document.querySelector(".score-ring-fill");
  if (!ring) return;

  const target = parseFloat(ring.dataset.offset ?? 345);

  gsap.fromTo(
    ring,
    { strokeDashoffset: 345 },
    {
      strokeDashoffset: target,
      duration:  1.6,
      ease:      "power2.out",
      delay:     0.5,
    }
  );
}

// ── Confetti ──────────────────────────────────────────────────

/**
 * Premium GSAP confetti burst.
 * @param {number} count   number of particles (default 90)
 * @param {"top"|"center"} origin  launch position
 */
export function triggerConfetti(count = 90, origin = "top") {
  const COLORS  = ["#00E5FF","#7C3AED","#22C55E","#FACC15","#EF4444","#F472B6","#FB923C","#A78BFA"];
  const SHAPES  = ["circle","square","rect","diamond"];
  const container = document.body;

  for (let i = 0; i < count; i++) {
    const el    = document.createElement("div");
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const size  = Math.random() * 11 + 5;
    const startX = origin === "center"
      ? 30 + Math.random() * 40
      : Math.random() * 100;
    const startY = origin === "center" ? 40 : -2;

    let borderRadius = "2px";
    if (shape === "circle")  borderRadius = "50%";
    if (shape === "diamond") borderRadius = "0";

    const width  = shape === "rect" ? size * 2.2 : size;
    const height = size;

    el.style.cssText = `
      position:fixed;
      top:${startY}vh;
      left:${startX}vw;
      width:${width}px;
      height:${height}px;
      background:${color};
      border-radius:${borderRadius};
      pointer-events:none;
      z-index:9999;
      transform:rotate(${Math.random() * 360}deg);
    `;

    if (shape === "diamond") {
      el.style.transform = `rotate(45deg)`;
    }

    container.appendChild(el);

    gsap.to(el, {
      y:        `${70 + Math.random() * 45}vh`,
      x:        `${(Math.random() - 0.5) * 35}vw`,
      rotation: Math.random() * 900 - 450,
      opacity:  0,
      scale:    Math.random() * 0.5 + 0.3,
      duration: 2.4 + Math.random() * 1.4,
      delay:    Math.random() * 0.7,
      ease:     "power1.in",
      onComplete() { el.remove(); },
    });
  }
}

// ── Micro-interactions ────────────────────────────────────────

/**
 * Ripple effect on any element.
 * @param {HTMLElement} el
 * @param {MouseEvent}  e
 */
export function addRipple(el, e) {
  const rect   = el.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  const x      = (e?.clientX ?? rect.left + rect.width  / 2) - rect.left - size / 2;
  const y      = (e?.clientY ?? rect.top  + rect.height / 2) - rect.top  - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple-circle";
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;

  el.style.position = "relative";
  el.style.overflow = "hidden";
  el.appendChild(ripple);

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.4 },
    {
      scale:    2.8,
      opacity:  0,
      duration: 0.55,
      ease:     "power2.out",
      onComplete() { ripple.remove(); },
    }
  );
}

/**
 * Card lift hover — call once after DOM is ready.
 * @param {string} selector  CSS selector for cards
 */
export function initCardLifts(selector = ".surface-card, .feature-card, .step-card") {
  document.querySelectorAll(selector).forEach((card) => {
    card.addEventListener("mouseenter", () =>
      gsap.to(card, { y: -6, boxShadow: "0 20px 50px rgba(0,0,0,.35)", duration: 0.3 })
    );
    card.addEventListener("mouseleave", () =>
      gsap.to(card, { y: 0,  boxShadow: "none", duration: 0.3 })
    );
  });
}
