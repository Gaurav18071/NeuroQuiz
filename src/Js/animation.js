/* ============================================================
   NeuroQuiz — Home Page GSAP Animations
   Runs once after the home screen HTML is injected into #app.
============================================================ */

import { gsap } from "gsap";

/**
 * Animate the home page in.
 * Safe to call even if some elements don't exist — GSAP skips
 * empty NodeLists without throwing.
 */
export function startAnimation() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  // ── Header slides down ────────────────────────────────────
  tl.fromTo(
    "header",
    { y: -56, opacity: 0 },
    { y: 0,   opacity: 1, duration: 0.8 }
  );

  // ── Hero left — staggered children ────────────────────────
  tl.fromTo(
    ".hero-left > *",
    { opacity: 0, y: 36 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
    "-=0.4"
  );

  // ── Glass card floats in ──────────────────────────────────
  tl.fromTo(
    ".glass-card",
    { opacity: 0, scale: 0.88, y: 24 },
    { opacity: 1, scale: 1,    y: 0,  duration: 0.7, ease: "back.out(1.4)" },
    "-=0.5"
  );

  // ── Stats cards stagger up ────────────────────────────────
  tl.fromTo(
    ".stat",
    { opacity: 0, y: 48 },
    { opacity: 1, y: 0,  duration: 0.6, stagger: 0.14 },
    "-=0.2"
  );

  // ── Scroll-triggered sections (IntersectionObserver fallback) ──
  _observeSections([
    ".features-section",
    ".how-it-works",
    ".live-stats",
    ".testimonials",
    ".cta-section",
  ]);
}

/**
 * Lightweight IntersectionObserver to fade-up section children
 * when they enter the viewport (no ScrollTrigger dependency).
 */
function _observeSections(selectors) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);

        const children = entry.target.querySelectorAll(
          ".feature-card, .step-card, .stats-card, .testimonial-card, .cta-card, .section-header"
        );

        if (children.length) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out" }
          );
        } else {
          gsap.fromTo(
            entry.target,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }
          );
        }
      });
    },
    { threshold: 0.1 }
  );

  selectors.forEach((sel) => {
    const el = document.querySelector(sel);
    if (el) io.observe(el);
  });
}
