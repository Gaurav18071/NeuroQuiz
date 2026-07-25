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
              <svg class="footer-logo-icon" width="22" height="22" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <defs>
                  <linearGradient id="footer-logo-grad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stop-color="#00e5ff"/>
                    <stop offset="100%" stop-color="#7c3aed"/>
                  </linearGradient>
                </defs>
                <path fill="url(#footer-logo-grad)"
                  d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
              </svg>
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
            © ${year} <strong>NeuroQuiz</strong> • Built with ⚡ by <span>Gaurav Mishra</span>
          </div>

          <button class="back-to-top" id="back-to-top" aria-label="Scroll to top" title="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
          </button>
        </div>

      </div>
    </footer>
  `;
}