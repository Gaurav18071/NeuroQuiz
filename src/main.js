/* ============================================================
   NeuroQuiz — App Entry Point  (Sprint 8)
   Boot sequence:
     1. Restore theme + auth session
     2. Init keyboard manager
     3. Restore quiz state (home only)
     4. Render first screen
   Each renderApp() call:
     • Clears shortcuts, re-registers for the new screen
     • Runs screen-appropriate entrance animation
     • Auto-saves progress on result screen (if logged in)
============================================================ */

import "./Styles/index.css";

import { HomePage }           from "./Pages/Home";
import { QuizPage }           from "./Pages/Quiz";
import { Result }             from "./Pages/Result";
import { ProfilePage }        from "./Pages/Profile";

import { startAnimation }     from "./Js/animation";
import { animatePage, initCardLifts } from "./Js/pageAnimation";

import { state }              from "./Utils/state";
import { saveState, loadState } from "./Utils/storage";
import { loadTheme, toggleTheme } from "./Utils/theme";
import { stopTimer, getQuizStats } from "./Utils/quizEngine";
import { getSession, saveProgress, logout } from "./Utils/auth";
import { isSoundEnabled, toggleSound } from "./Utils/sound";
import { initKeyboard, clearShortcuts, registerShortcut } from "./Utils/keyboard";
import { cleanupAllListeners, attachListener, prefersReducedMotion } from "./Utils/performance";
import { preloadFonts } from "./Utils/fonts";
import { measureCoreWebVitals } from "./Utils/metrics";

import { attachHomeEvents }   from "./Handlers/homeHandler";
import { attachQuizEvents }   from "./Handlers/quizHandler";
import { attachResultEvents } from "./Handlers/resultHandler";
import { attachAuthEvents }   from "./Handlers/authHandler";
import { showToast }          from "./Components/Toast";

// ── Boot: register service worker ─────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/public/service-worker.js')
    .then((reg) => console.log('[SW] Registered'))
    .catch((err) => console.warn('[SW] Registration failed:', err.message));
}

// ── Boot: auth session ────────────────────────────────────────
const session = getSession();
if (session) {
  state.auth = session;
  if (!state.player.name) state.player.name = session.name;
}

// ── Boot: restore quiz state (home screen only) ───────────────
const saved = loadState();
if (saved?.screen === "home") {
  Object.assign(state, saved);
  state.auth = session ?? null; // always use live session over persisted
}

// ── Boot: theme ───────────────────────────────────────────────
loadTheme();

// ── Boot: keyboard manager ────────────────────────────────────
initKeyboard();

// ── Boot: preload fonts ───────────────────────────────────────
preloadFonts();

// ── Boot: measure performance metrics ──────────────────────────
measureCoreWebVitals();

// ── Global shortcuts (fire on every screen) ───────────────────
function _registerGlobalShortcuts() {
  // T → toggle theme (only when NOT in an input)
  registerShortcut("t", () => {
    toggleTheme();
    showToast("Theme changed", "info");
  }, { global: false }); // NOT global — respect input focus
}

// ── Core render function ──────────────────────────────────────

export function renderApp() {
  const app = document.querySelector("#app");
  if (!app) return;

  stopTimer();
  saveState(state);

  // Clean up all old listeners before re-rendering
  cleanupAllListeners();

  // Clear per-screen shortcuts; keep global ones registered after
  clearShortcuts();
  _registerGlobalShortcuts();

  switch (state.screen) {

    case "home":
      app.innerHTML = HomePage();
      animatePage("home");
      startAnimation();
      initCardLifts();
      attachHomeEvents(renderApp);
      break;

    case "quiz":
      app.innerHTML = QuizPage();
      animatePage("quiz");
      attachQuizEvents(renderApp);
      break;

    case "profile":
      app.innerHTML = ProfilePage();
      animatePage("result");
      if (!state.auth) {
        state.screen = "home";
        renderApp();
      } else {
        // Wire profile page logout button
        const logoutBtn = document.querySelector(".btn-logout");
        if (logoutBtn) {
          attachListener(logoutBtn, "click", () => {
            logout();
            state.auth = null;
            state.player.name = "";
            showToast("You've been logged out.", "info");
            renderApp();
          });
        }
      }
      break;

    case "result": {
      app.innerHTML = Result();
      animatePage("result");
      attachResultEvents(renderApp);

      // Auto-save progress to auth account
      if (state.auth) {
        try {
          const stats = getQuizStats();
          saveProgress({
            category:   stats.category,
            difficulty: stats.difficulty,
            score:      stats.correct,
            total:      stats.total,
            accuracy:   stats.accuracy,
            timeTaken:  stats.timeTaken,
          });
        } catch { /* non-fatal */ }
      }

      // Increment session quiz count
      state.session.quizCount++;
      state.session.lastPlayed = new Date().toISOString();
      break;
    }

    default:
      app.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;
                    min-height:100vh;flex-direction:column;gap:1rem;">
          <h1 style="font-size:4rem;">404</h1>
          <p>Page not found.</p>
          <button onclick="location.reload()" class="btn btn-primary">Go Home</button>
        </div>`;
  }

  // Wire theme toggle (present in Navbar on every screen)
  const themeBtn = document.querySelector("#theme-toggle");
  if (themeBtn) {
    attachListener(themeBtn, "click", () => {
      toggleTheme();
      showToast("Theme changed", "info");
    });
  }

  // Wire sound toggle if present
  const soundBtn = document.querySelector("#sound-toggle");
  if (soundBtn) {
    attachListener(soundBtn, "click", () => {
      const enabled = toggleSound();
      soundBtn.classList.toggle("muted", !enabled);
      soundBtn.setAttribute("aria-label", enabled ? "Mute sound effects" : "Enable sound effects");
      soundBtn.textContent = enabled ? "🔊" : "🔇";
      showToast(enabled ? "Sound effects on" : "Sound effects off", "info");
    });
  }

  // Wire auth events (login button / dropdown on every screen)
  attachAuthEvents(renderApp);

  // Wire logo click to navigate home
  const logo = document.querySelector(".logo");
  if (logo) {
    attachListener(logo, "click", (e) => {
      e.preventDefault();
      if (state.screen !== "home") {
        state.screen = "home";
        renderApp();
      }
    });
  }
}

// ── Boot ──────────────────────────────────────────────────────
renderApp();
