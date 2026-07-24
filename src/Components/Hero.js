/* ============================================================
   NeuroQuiz — Hero Component
   Left: headline, pills, secondary CTA
   Right: glass config card — name, category, difficulty, count
============================================================ */

import { state } from "../Utils/state";

export function Hero() {
  const playerName = state.player.name || state.auth?.name || "";

  return `
<section class="hero" id="hero" aria-label="Quiz configuration">

  <!-- ── Left: headline ──────────────────────────────────── -->
  <div class="hero-left">

    <span class="badge" role="note">
      🧠 AI-Powered Learning Platform
    </span>

    <h1 class="display-1">
      Master Knowledge.
      <span class="text-gradient">One Challenge at a Time.</span>
    </h1>

    <p class="lead">
      Challenge yourself with an immersive quiz experience designed to
      sharpen speed, accuracy, and confidence.
    </p>

    <div class="feature-pills" role="list" aria-label="Key features">
      <span class="pill" role="listitem">⚡ Instant Feedback</span>
      <span class="pill" role="listitem">🎯 Adaptive Difficulty</span>
      <span class="pill" role="listitem">📊 Smart Insights</span>
    </div>



  </div>

  <!-- ── Right: config card ───────────────────────────────── -->
  <div class="glass-card" role="form" aria-label="Quiz configuration form">

    <h2>Configure Your Challenge</h2>

    <label for="player-name" class="label" style="display:block;margin-bottom:6px;">
      Your Name
    </label>
    <input
      id="player-name"
      type="text"
      placeholder="e.g. Gaurav"
      value="${playerName}"
      autocomplete="given-name"
      maxlength="40"
      aria-required="true"
      aria-describedby="name-hint"
    />
    <span id="name-hint" style="display:none;">Enter your name to start the quiz</span>

    <label for="category" class="label" style="display:block;margin-bottom:6px;">
      Category
    </label>
    <select id="category" aria-label="Select quiz category">
      <option value="JavaScript">JavaScript</option>
      <option value="HTML">HTML</option>
      <option value="CSS">CSS</option>
    </select>

    <label for="difficulty" class="label" style="display:block;margin-bottom:6px;">
      Difficulty
    </label>
    <select id="difficulty" aria-label="Select difficulty level">
      <option value="Easy">Easy</option>
      <option value="Medium">Medium</option>
      <option value="Hard">Hard</option>
    </select>

    <label for="question-count" class="label" style="display:block;margin-bottom:6px;">
      Questions
    </label>
    <select id="question-count" aria-label="Select number of questions">
      <option value="5">5 Questions</option>
      <option value="10" selected>10 Questions</option>
      <option value="15">15 Questions</option>
    </select>

    <button class="btn-start" id="btn-start" type="button" aria-label="Start the quiz">
      Start Challenge →
    </button>

  </div>

</section>
`;
}
