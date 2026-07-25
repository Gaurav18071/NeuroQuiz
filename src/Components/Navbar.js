/* ============================================================
   NeuroQuiz — Navbar Component
   Shows Login button (guest) or avatar dropdown (logged in).
============================================================ */

import { state } from "../Utils/state";

/**
 * @param {{ screen?: string }} opts
 */
export function Navbar({ screen = "home" } = {}) {

  const sunIcon = `
    <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1"  x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22"   x2="5.64"  y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1"  y1="12" x2="3"  y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
    </svg>`;

  const moonIcon = `
    <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>
    </svg>`;

  // ── Guest: show Login button ──────────────────────────────
  const guestControls = `
    <button
      class="btn-login"
      id="btn-login"
      aria-label="Login or create an account"
      title="Login / Sign Up"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
        <polyline points="10 17 15 12 10 7"/>
        <line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
      Login
    </button>
  `;

  // ── Logged-in: avatar + dropdown ──────────────────────────
  const user = state.auth;
  const loggedInControls = user ? `
    <div class="nav-user" id="nav-user">
      <button class="nav-avatar-btn" id="nav-avatar-btn"
              aria-haspopup="true" aria-expanded="false"
              aria-label="User menu for ${user.name}">
        <span class="nav-avatar" aria-hidden="true">${user.avatar}</span>
        <span class="nav-user-name">${user.name.split(" ")[0]}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"
             class="nav-chevron">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div class="nav-dropdown" id="nav-dropdown" hidden role="menu">
        <div class="nav-dropdown-header">
          <span class="nav-dropdown-avatar" aria-hidden="true">${user.avatar}</span>
          <div>
            <strong>${user.name}</strong>
            <span>${user.identifier}</span>
          </div>
        </div>
        <hr class="nav-dropdown-divider"/>
        <button class="nav-dropdown-item" id="btn-view-profile" role="menuitem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          My Profile
        </button>
        <button class="nav-dropdown-item nav-dropdown-item--danger" id="btn-logout" role="menuitem">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </div>
  ` : "";

  // show player name badge on quiz/result screens
  const playerBadge = screen !== "home" && state.player.name
    ? `<span class="nav-player" aria-label="Playing as ${state.player.name}">
         👤 ${state.player.name}
       </span>`
    : "";

  return `
    <header role="banner">
      <a class="logo" href="#" aria-label="NeuroQuiz home">
        <svg class="logo-icon" width="26" height="26" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="46" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00e5ff"/>
              <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
          </defs>
          <path fill="url(#logo-grad)"
            d="M25.946 44.938c-.664.845-2.021.375-2.021-.698V33.937a2.26 2.26 0 0 0-2.262-2.262H10.287c-.92 0-1.456-1.04-.92-1.788l7.48-10.471c1.07-1.497 0-3.578-1.842-3.578H1.237c-.92 0-1.456-1.04-.92-1.788L10.013.474c.214-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.471c-1.07 1.498 0 3.579 1.842 3.579h11.377c.943 0 1.473 1.088.89 1.83L25.947 44.94z"
          />
        </svg>
        <span class="logo-text">NeuroQuiz</span>
      </a>

      <nav class="nav-right" role="navigation" aria-label="Site navigation">
        ${playerBadge}

        <!-- Theme toggle -->
        <button class="theme-btn" id="theme-toggle"
                aria-label="Toggle colour theme" title="Toggle dark / light (T)">
          ${sunIcon}${moonIcon}
        </button>

        <!-- Auth controls -->
        ${user ? loggedInControls : guestControls}
      </nav>
    </header>
  `;
}
