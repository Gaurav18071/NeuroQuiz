/* ============================================================
   NeuroQuiz — Auth Modal Component
   Renders the Login / Sign Up modal HTML.
   Two modes: "login" | "signup"
   Two input methods: "email" | "mobile"
============================================================ */

/**
 * @param {{ mode?: "login"|"signup" }} opts
 */
export function AuthModal({ mode = "login" } = {}) {
  const isSignup = mode === "signup";

  return `
    <div class="auth-overlay" id="auth-modal" role="dialog"
         aria-modal="true" aria-labelledby="auth-title" hidden>

      <div class="auth-modal">

        <!-- Close button -->
        <button class="auth-close" id="auth-close" aria-label="Close authentication modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5"
               stroke-linecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6"  y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="auth-header">
          <div class="auth-logo" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="auth-logo-grad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stop-color="#00e5ff"/>
                  <stop offset="100%" stop-color="#7c3aed"/>
                </linearGradient>
              </defs>
              <path fill="url(#auth-logo-grad)"
                d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"/>
            </svg>
          </div>
          <h2 id="auth-title">${isSignup ? "Create Account" : "Welcome Back"}</h2>
          <p>${isSignup ? "Sign up to save your quiz progress." : "Login to access your saved progress."}</p>
        </div>

        <!-- Mode tabs -->
        <div class="auth-tabs" role="tablist" aria-label="Login or Sign up">
          <button
            class="auth-tab ${!isSignup ? "active" : ""}"
            id="tab-login"
            role="tab"
            aria-selected="${!isSignup}"
            data-mode="login"
          >Login</button>
          <button
            class="auth-tab ${isSignup ? "active" : ""}"
            id="tab-signup"
            role="tab"
            aria-selected="${isSignup}"
            data-mode="signup"
          >Sign Up</button>
        </div>

        <!-- Input method toggle -->
        <div class="auth-method-toggle" role="group" aria-label="Choose input method">
          <button class="auth-method-btn active" data-method="email" aria-pressed="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            Email
          </button>
          <button class="auth-method-btn" data-method="mobile" aria-pressed="false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="2"/>
              <path d="M12 18h.01"/>
            </svg>
            Mobile
          </button>
        </div>

        <!-- Form -->
        <form class="auth-form" id="auth-form" novalidate autocomplete="on">

          <!-- Name (signup only) -->
          <div class="auth-field ${isSignup ? "" : "hidden"}" id="field-name">
            <label for="auth-name" class="auth-label">Full Name</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              <input
                id="auth-name"
                type="text"
                class="auth-input"
                placeholder="e.g. Gaurav Mishra"
                autocomplete="name"
                maxlength="50"
                ${isSignup ? "" : "tabindex='-1'"}
              />
            </div>
          </div>

          <!-- Email / Mobile identifier -->
          <div class="auth-field">
            <label for="auth-identifier" class="auth-label" id="auth-id-label">Email Address</label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" id="auth-id-icon" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                id="auth-identifier"
                type="email"
                class="auth-input"
                placeholder="you@example.com"
                autocomplete="email"
                inputmode="email"
                aria-labelledby="auth-id-label"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="auth-field">
            <label for="auth-password" class="auth-label">
              Password
              ${!isSignup ? `<a class="auth-forgot" href="#" id="auth-forgot" tabindex="0">Forgot password?</a>` : ""}
            </label>
            <div class="auth-input-wrap">
              <svg class="auth-input-icon" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="auth-password"
                type="password"
                class="auth-input"
                placeholder="${isSignup ? "Min. 6 characters" : "Enter your password"}"
                autocomplete="${isSignup ? "new-password" : "current-password"}"
                required
              />
              <button
                type="button"
                class="auth-pw-toggle"
                id="auth-pw-toggle"
                aria-label="Toggle password visibility"
                tabindex="0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <div class="auth-error" id="auth-error" role="alert" aria-live="assertive" hidden></div>

          <!-- Submit -->
          <button type="submit" class="auth-submit" id="auth-submit">
            <span class="auth-submit-text">${isSignup ? "Create Account" : "Login"}</span>
            <span class="auth-submit-spinner" hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2.5" aria-hidden="true"
                   style="animation:spin .7s linear infinite">
                <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
              </svg>
            </span>
          </button>

        </form>

        <!-- Footer switch -->
        <p class="auth-switch">
          ${isSignup
            ? `Already have an account? <button class="auth-switch-btn" data-mode="login">Login</button>`
            : `Don't have an account? <button class="auth-switch-btn" data-mode="signup">Sign Up</button>`
          }
        </p>

      </div>
    </div>
  `;
}
