/* ============================================================
   NeuroQuiz — Ultra Clean Minimal Footer Component
============================================================ */

export function Footer() {
  const year = new Date().getFullYear();

  return `
    <footer class="footer" id="footer" role="contentinfo">
      <div class="footer-container">
        
        <div class="footer-main">
          <!-- Brand Info -->
          <div class="footer-brand">
            <a href="#hero" class="footer-logo" aria-label="NeuroQuiz home">
              <span class="footer-logo-icon">🧠</span>
              <span class="footer-logo-text">NeuroQuiz</span>
            </a>
            <p class="footer-description">
              Modern quiz platform for developers to practice, learn, and master programming skills.
            </p>
          </div>

          <!-- Contact Email -->
          <div class="footer-contact">
            <a href="mailto:its.gaurav.2705@gmail.com" class="footer-email-link" aria-label="Email Gaurav Mishra">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <span>its.gaurav.2705@gmail.com</span>
            </a>
          </div>
        </div>

        <!-- Bottom Copyright Row -->
        <div class="footer-bottom-bar">
          <div class="footer-copyright">
            © ${year} <strong>NeuroQuiz</strong> • Built  by <span>Gaurav Mishra</span>
          </div>

          <button class="back-to-top" id="back-to-top" aria-label="Scroll to top" title="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </button>
        </div>

      </div>
    </footer>
  `;
}