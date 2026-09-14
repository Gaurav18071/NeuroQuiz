/* ============================================================
   NeuroQuiz — Performance Metrics & Core Web Vitals
   Monitor: LCP, FID, CLS, FCP, TTFB
============================================================ */

const metrics = {
  fcp: null,   // First Contentful Paint
  lcp: null,   // Largest Contentful Paint
  fid: null,   // First Input Delay
  cls: 0,      // Cumulative Layout Shift
  ttfb: null,  // Time to First Byte
};

/**
 * Measure Core Web Vitals.
 * Call once on app boot.
 */
export function measureCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // ── FCP & LCP via PerformanceObserver ──────────────────────
  if ('PerformanceObserver' in window) {
    try {
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            metrics.fcp = entry.startTime;
            console.log(`[CWV] FCP: ${metrics.fcp.toFixed(2)}ms`);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('[Metrics] Paint observer failed:', e.message);
    }

    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        console.log(`[CWV] LCP: ${metrics.lcp.toFixed(2)}ms`);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('[Metrics] LCP observer failed:', e.message);
    }

    // ── CLS via PerformanceObserver ────────────────────────────
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            metrics.cls += entry.value;
            console.log(`[CWV] CLS: ${metrics.cls.toFixed(4)}`);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('[Metrics] CLS observer failed:', e.message);
    }
  }

  // ── TTFB via navigationTiming ──────────────────────────────
  if (performance && performance.timing) {
    window.addEventListener('load', () => {
      const timing = performance.timing;
      metrics.ttfb = timing.responseStart - timing.navigationStart;
      console.log(`[CWV] TTFB: ${metrics.ttfb.toFixed(2)}ms`);
    });
  }

  // ── FID (First Input Delay) via PerformanceObserver ────────
  if ('PerformanceObserver' in window) {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.fid = entries[0].processingStart - entries[0].startTime;
          console.log(`[CWV] FID: ${metrics.fid.toFixed(2)}ms`);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('[Metrics] FID observer failed:', e.message);
    }
  }
}

