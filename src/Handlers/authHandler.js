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
  isMobile,
} from "../Utils/auth";
import { showToast } from "../Components/Toast";
import { attachListener } from "../Utils/performance";

// ── Current modal mode ────────────────────────────────────────
let _mode     = "login";   // "login" | "signup"
let _method   = "email";   // "email" | "mobile"
let _openedAt = 0;
let _isOpening = false;

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

// ── Internal helpers ──────────────────────────────────────────

/** Open the auth modal */
function _openModal(renderApp, mode = _mode) {
  const existing = document.getElementById("auth-modal");

  // If already open in DOM or currently opening, do not duplicate
  if (existing) {
    if (_mode !== mode) {
      existing.remove();
    } else {
      return;
    }
  }

  if (_isOpening) return;
  _isOpening = true;
  setTimeout(() => { _isOpening = false; }, 400);

  _mode     = mode;
  _openedAt = Date.now();

  // Create fresh
  const div = document.createElement("div");
  div.innerHTML = AuthModal({ mode: _mode });
  document.body.appendChild(div.firstElementChild);

  const modal = document.getElementById("auth-modal");
  if (modal) modal.hidden = false;

  // ── Single delegated listener on the modal root ──────────
  // Handles ALL clicks inside the modal — no stacking risk
  modal.addEventListener("click", (e) => {
    // Ignore mobile ghost clicks / tap-through for 350ms after open
    if (Date.now() - _openedAt < 350) return;

    const target = e.target;

    // Close on backdrop
    if (target === modal) { _closeModal(); return; }

    // Close button
    if (target.closest("#auth-close")) { _closeModal(); return; }

    // Mode tabs
    const tab = target.closest(".auth-tab");
    if (tab?.dataset.mode) { _openModal(renderApp, tab.dataset.mode); return; }

    // Switch link
    const switchBtn = target.closest(".auth-switch-btn");
    if (switchBtn?.dataset.mode) { _openModal(renderApp, switchBtn.dataset.mode); return; }

    // Input method toggle
    const methodBtn = target.closest(".auth-method-btn");
    if (methodBtn?.dataset.method) {
      _method = methodBtn.dataset.method;
      modal.querySelectorAll(".auth-method-btn").forEach((b) => {
        b.classList.toggle("active", b === methodBtn);
        b.setAttribute("aria-pressed", String(b === methodBtn));
      });
      _updateIdentifierField();
      return;
    }

    // Password toggle
    if (target.closest("#auth-pw-toggle")) {
      const input = modal.querySelector("#auth-password");
      if (input) input.type = input.type === "password" ? "text" : "password";
      return;
    }

    // Forgot password
    if (target.closest("#auth-forgot")) {
      e.preventDefault();
      _showError("Password reset is not available in demo mode.");
      return;
    }
  });

  // Form submit (needs separate listener — "click" doesn't catch submit)
  modal.querySelector("#auth-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    _handleSubmit(renderApp);
  });

  // Close on Escape
  const onKey = (e) => {
    if (e.key === "Escape") { _closeModal(); document.removeEventListener("keydown", onKey); }
  };
  document.addEventListener("keydown", onKey);

  // Focus first input
  setTimeout(() => {
    modal.querySelector("input:not([tabindex='-1'])")?.focus();
  }, 60);
}

function _closeModal() {
  document.getElementById("auth-modal")?.remove();
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
    if (btn.dataset.wired) return;
    btn.dataset.wired = "true";

    attachListener(btn, "click", (e) => {
      e.preventDefault();
      e.stopPropagation();
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

