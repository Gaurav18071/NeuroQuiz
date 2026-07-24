/* ============================================================
   NeuroQuiz — Font Loading Optimization
   Preload critical fonts, use font-display: swap for fast rendering.
============================================================ */

/**
 * Preload Google Fonts with high priority.
 * Call this early in boot sequence.
 */
export function preloadFonts() {
  if (document.fonts && document.fonts.ready) {
    // The fonts specified in CSS have font-display: swap
    // so they'll use system fonts while loading
    document.fonts.ready.then(() => {
      console.log('[Fonts] Google Fonts loaded');
      // Mark that custom fonts are ready
      document.documentElement.classList.add('fonts-loaded');
    });
  }
}

/**
 * Check if fonts have loaded.
 * Useful for delaying heavy animations until fonts render.
 */
export function fontsReady() {
  return document.documentElement.classList.contains('fonts-loaded') ||
         (document.fonts && document.fonts.status === 'loaded');
}
