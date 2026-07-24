/* ============================================================
   NeuroQuiz — Auth Handler
   Wires all auth modal interactions:
     · Open / close modal
     · Tab switch (login ↔ signup)
     · Input method toggle (email ↔ mobile)
     · Password show / hide
     · Form submit (register + login)
     · Avatar dropdown open / close
     · Logout
     · My Progress panel
============================================================ */

import { state }    from "../Utils/state";
import { AuthModal } from "../Components/AuthModal";
import {
  register,
  login,
  logout,
  getProgress,
  isMobile,
} from "../Utils/auth";
import { showToast } from "../Components/Toast";
import { attachListener } from "../Utils/performance";

// ── Current modal mode ────────────────────────────────────────
let _mode   = "login";   // "login" | "signup"
let _method = "email";   // "email" | "mobile"

// ── Public API ────────────────────────────────────────────────

/**
 * Call after every renderApp() — wires every auth-related element
 * that exists in the current DOM.
 * @param {Function} renderApp
 */
export function attachAuthEvents(renderApp) {
  _wireLoginButton(renderApp);
  _wireNavDropdown(renderApp);
}

/**
 * Inject the AuthModal HTML into the document body once.
 * Called from main.js at boot.
 */
export function mountAuthModal() {
  if (document.getElementById("auth-modal")) return; // already mounted
  const div = document.createElement("div");
  div.innerHTML = AuthModal({ mode: _mode });
  document.body.appendChild(div.firstElementChild);
  _bindModalInternals(null); // bind with no renderApp yet — will rebind on use
}

// ── Internal helpers ──────────────────────────────────────────

/** Open the auth modal */
function _openModal(renderApp, mode = _mode) {
  _mode = mode;

  // Re-render modal content for the correct mode
  const existing = document.getElementById("auth-modal");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.innerHTML = AuthModal({ mode: _mode });
  document.body.appendChild(div.firstElementChild);

  const modal = document.getElementById("auth-modal");
  modal.hidden = false;
  _bindModalInternals(renderApp);

  // Focus first input
  setTimeout(() => {
    const first = modal.querySelector("input:not([tabindex='-1'])");
    first?.focus();
  }, 60);

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) _closeModal();
  });

  // Close on Escape
  const onKey = (e) => {
    if (e.key === "Escape") { _closeModal(); document.removeEventListener("keydown", onKey); }
  };
  document.addEventListener("keydown", onKey);
}

function _closeModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.hidden = true;
}

/** Bind all interactions inside the modal */
function _bindModalInternals(renderApp) {
  // Close button
  const closeBtn = document.getElementById("auth-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", _closeModal);
  }

  // Mode tabs (Login / Sign Up)
  document.querySelectorAll(".auth-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      _openModal(renderApp, tab.dataset.mode);
    });
  });

  // Switch link at bottom
  document.querySelectorAll(".auth-switch-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      _openModal(renderApp, btn.dataset.mode);
    });
  });

  // Input method toggle (Email / Mobile)
  document.querySelectorAll(".auth-method-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      _method = btn.dataset.method;
      document.querySelectorAll(".auth-method-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      _updateIdentifierField();
    });
  });

  // Password visibility toggle
  const pwToggle = document.getElementById("auth-pw-toggle");
  if (pwToggle) {
    pwToggle.addEventListener("click", () => {
      const input = document.getElementById("auth-password");
      if (!input) return;
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
    });
  }

  // Form submit
  const form = document.getElementById("auth-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      _handleSubmit(renderApp);
    });
  }

  // Forgot password (UI only — no backend)
  const forgotBtn = document.getElementById("auth-forgot");
  if (forgotBtn) {
    forgotBtn.addEventListener("click", (e) => {
      e.preventDefault();
      _showError("Password reset is not available in demo mode. Check your stored credentials.");
    });
  }
}

/** Swap identifier field between email and mobile */
function _updateIdentifierField() {
  const input    = document.getElementById("auth-identifier");
  const label    = document.getElementById("auth-id-label");
  if (!input || !label) return;

  if (_method === "mobile") {
    input.type        = "tel";
    input.inputMode   = "tel";
    input.placeholder = "+91 98765 43210";
    input.autocomplete = "tel";
    label.textContent  = "Mobile Number";
  } else {
    input.type        = "email";
    input.inputMode   = "email";
    input.placeholder = "you@example.com";
    input.autocomplete = "email";
    label.textContent  = "Email Address";
  }
}

/** Handle Login / Register form submit */
function _handleSubmit(renderApp) {
  const identifier = document.getElementById("auth-identifier")?.value.trim() ?? "";
  const password   = document.getElementById("auth-password")?.value ?? "";
  const name       = document.getElementById("auth-name")?.value.trim() ?? "";

  _clearError();
  _setLoading(true);

  // Small tick so the spinner appears before sync work
  requestAnimationFrame(() => {
    let result;

    if (_mode === "signup") {
      result = register({ identifier, name, password });
    } else {
      result = login({ identifier, password });
    }

    _setLoading(false);

    if (!result.ok) {
      _showError(result.error);
      // Shake the relevant input
      const idInput = document.getElementById("auth-identifier");
      if (idInput) { idInput.classList.add("error"); setTimeout(() => idInput.classList.remove("error"), 500); }
      return;
    }

    // Success — update state and re-render
    state.auth = result.user;
    if (result.user?.name) {
      state.player.name = result.user.name;
      const nameInput = document.querySelector("#player-name");
      if (nameInput) nameInput.value = result.user.name;
    }

    _closeModal();
    showToast(
      _mode === "signup"
        ? `Welcome, ${result.user.name}! 🎉`
        : `Welcome back, ${result.user.name}! 👋`,
      "success"
    );

    renderApp?.();
  });
}

function _showError(msg) {
  const el = document.getElementById("auth-error");
  if (!el) return;
  el.textContent = msg;
  el.hidden = false;
}

function _clearError() {
  const el = document.getElementById("auth-error");
  if (el) { el.textContent = ""; el.hidden = true; }
}

function _setLoading(on) {
  const btn     = document.getElementById("auth-submit");
  const text    = btn?.querySelector(".auth-submit-text");
  const spinner = btn?.querySelector(".auth-submit-spinner");
  if (!btn) return;
  btn.disabled     = on;
  if (text)    text.hidden    = on;
  if (spinner) spinner.hidden = !on;
}

// ── Login button (guest) ──────────────────────────────────────

function _wireLoginButton(renderApp) {
  const btn = document.getElementById("btn-login");
  if (btn) {
    attachListener(btn, "click", (e) => {
      e.preventDefault();
      _openModal(renderApp, "login");
    });
  }
}

// ── Avatar dropdown ───────────────────────────────────────────

function _wireNavDropdown(renderApp) {
  const avatarBtn  = document.getElementById("nav-avatar-btn");
  const dropdown   = document.getElementById("nav-dropdown");
  const logoutBtn  = document.getElementById("btn-logout");
  const profileBtn = document.getElementById("btn-view-profile");
  
  if (!avatarBtn || !dropdown) return;

  // Toggle dropdown
  const handleAvatarClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = !dropdown.hidden;
    dropdown.hidden = isOpen;
    avatarBtn.setAttribute("aria-expanded", String(!isOpen));
  };
  attachListener(avatarBtn, "click", handleAvatarClick);

  // Prevent clicks inside the dropdown container from triggering document outside-click
  attachListener(dropdown, "click", (e) => {
    e.stopPropagation();
  });

  // Close dropdown on outside click
  const closeDropdown = (e) => {
    if (!dropdown.hidden && !avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.hidden = true;
      avatarBtn.setAttribute("aria-expanded", "false");
    }
  };
  attachListener(document, "click", closeDropdown);

  // Logout
  if (logoutBtn) {
    const handleLogout = (e) => {
      e.preventDefault();
      e.stopPropagation();
      logout();
      state.auth = null;
      state.player.name = "";
      dropdown.hidden = true;
      showToast("You've been logged out.", "info");
      renderApp?.();
    };
    attachListener(logoutBtn, "click", handleLogout);
  }

  // My Profile
  if (profileBtn) {
    const handleProfile = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.hidden = true;
      avatarBtn.setAttribute("aria-expanded", "false");
      state.screen = "profile";
      renderApp?.();
    };
    attachListener(profileBtn, "click", handleProfile);
  }
}

// ── Progress panel ────────────────────────────────────────────

function _showProgressPanel() {
  // Remove any existing progress modal
  document.getElementById("progress-modal-overlay")?.remove();

  const records = getProgress();

  const rows = records.length
    ? records.map((r) => {
        const pct   = r.total ? Math.round((r.score / r.total) * 100) : 0;
        const cls   = pct >= 75 ? "progress-score-good" : pct >= 50 ? "progress-score-avg" : "progress-score-poor";
        return `
          <tr>
            <td>${r.date}</td>
            <td>${r.category}</td>
            <td>${r.difficulty}</td>
            <td class="${cls}">${r.score}/${r.total} (${pct}%)</td>
            <td>${r.accuracy}%</td>
            <td>${r.timeTaken}s</td>
          </tr>
        `;
      }).join("")
    : "";

  const content = records.length
    ? `<table class="progress-table">
         <thead>
           <tr>
             <th>Date</th><th>Category</th><th>Difficulty</th>
             <th>Score</th><th>Accuracy</th><th>Time</th>
           </tr>
         </thead>
         <tbody>${rows}</tbody>
       </table>`
    : `<div class="progress-empty">
         <p style="font-size:2rem;margin-bottom:.5rem">📊</p>
         <p>No quiz results yet.<br>Complete a quiz to see your progress here.</p>
       </div>`;

  const overlay = document.createElement("div");
  overlay.id        = "progress-modal-overlay";
  overlay.className = "auth-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "progress-title");
  overlay.innerHTML = `
    <div class="auth-modal progress-modal">
      <button class="auth-close" id="progress-close" aria-label="Close progress panel">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6"  y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <div class="auth-header">
        <div class="auth-logo">📊</div>
        <h2 id="progress-title">My Progress</h2>
        <p>${state.auth?.name ?? ""} · ${records.length} quiz${records.length !== 1 ? "zes" : ""} completed</p>
      </div>
      ${content}
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handlers
  document.getElementById("progress-close")
    ?.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });

  const onKey = (e) => {
    if (e.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", onKey); }
  };
  document.addEventListener("keydown", onKey);
}
