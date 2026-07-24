/* ============================================================
   NeuroQuiz — Result Page  (Sprint 5.5 + 5.6)
   · SVG circular progress ring
   · Grade badge + performance message
   · 4-stat grid (correct, wrong, skipped, accuracy)
   · Category & difficulty breakdowns with progress bars
   · Time taken
   · Full review mode with answer accordion + explanations
============================================================ */

import { state } from "../Utils/state";
import { getQuizStats } from "../Utils/quizEngine";
import { getGrade, getRingOffset, getRingColor, getDifficultyColor } from "../Utils/score";
import { Navbar } from "../Components/Navbar";

export function Result() {
  const stats  = getQuizStats();
  const grade  = getGrade(stats.percentage);
  const offset = getRingOffset(stats.percentage);
  const ringColor = getRingColor(stats.percentage);

  // ── Score ring SVG ────────────────────────────────────────
  const ringHTML = `
    <div class="score-ring-wrap" aria-label="Score: ${stats.percentage}%">
      <svg viewBox="0 0 120 120" role="img" aria-hidden="true">
        <circle class="score-ring-bg"   cx="60" cy="60" r="55" stroke-width="8"/>
        <circle
          class="score-ring-fill"
          cx="60" cy="60" r="55"
          stroke-width="8"
          stroke="${ringColor}"
          data-offset="${offset}"
          style="stroke-dashoffset:${offset};"
        />
      </svg>
      <div class="score-ring-label" aria-hidden="true">
        <span class="score-ring-pct">${stats.percentage}%</span>
        <span class="score-ring-pct-label">Score</span>
      </div>
    </div>
  `;

  // ── Breakdown rows helper ─────────────────────────────────
  function breakdownRow(label, correct, total, color) {
    const pct = total ? Math.round((correct / total) * 100) : 0;
    return `
      <div class="breakdown-row">
        <span class="breakdown-label">${label}</span>
        <div class="breakdown-bar-wrap">
          <div class="breakdown-bar" style="width:${pct}%; background:${color};"></div>
        </div>
        <span class="breakdown-count">${correct}/${total}</span>
      </div>
    `;
  }

  const categoryRows = Object.entries(stats.categoryBreakdown)
    .map(([cat, d]) => breakdownRow(cat, d.correct, d.total, "#00E5FF"))
    .join("");

  const difficultyRows = Object.entries(stats.difficultyBreakdown)
    .map(([diff, d]) => breakdownRow(diff, d.correct, d.total, getDifficultyColor(diff)))
    .join("");

  // ── Review list ───────────────────────────────────────────
  const reviewItems = state.quiz.questions
    .map((q, i) => {
      const ans = state.quiz.answers.find((a) => a.questionId === q.id);
      const isSkipped  = !ans || ans.selectedOption === null;
      const isCorrect  = ans?.isCorrect === true;
      const statusCls  = isSkipped ? "skipped" : isCorrect ? "correct" : "wrong";
      const statusText = isSkipped ? "Skipped" : isCorrect ? "Correct" : "Incorrect";

      const userOptionText = isSkipped
        ? "Not answered"
        : q.options[ans.selectedOption] ?? "—";

      const correctText = q.options[q.correctAnswer];

      const wrongAnswerRow = (!isSkipped && !isCorrect)
        ? `<div class="review-answer-row correct-ans">
             <span class="answer-label">Correct answer</span>
             <span class="answer-value">✓ ${correctText}</span>
           </div>`
        : "";

      const explanationBlock = q.explanation
        ? `<div class="review-explanation">
             <strong>Explanation:</strong> ${q.explanation}
           </div>`
        : "";

      return `
        <div class="review-item ${statusCls}" data-review-index="${i}">
          <div class="review-item-header" role="button" tabindex="0" aria-expanded="false" aria-controls="review-body-${i}">
            <span class="review-item-number" aria-hidden="true">${i + 1}</span>
            <p class="review-item-q">${q.question}</p>
            <span class="review-item-status">${statusText}</span>
          </div>
          <div class="review-item-body" id="review-body-${i}" role="region">
            <div class="review-answers">
              <div class="review-answer-row ${isCorrect ? "user-correct" : "user-wrong"}">
                <span class="answer-label">Your answer</span>
                <span class="answer-value">${userOptionText}</span>
              </div>
              ${wrongAnswerRow}
            </div>
            ${explanationBlock}
          </div>
        </div>
      `;
    })
    .join("");

  return `
    <section class="page" id="result-page">
      ${Navbar({ playerName: state.player.name, screen: "result" })}

      <div class="result-page">
        <div class="result-card" role="main">

          <!-- Hero: ring + grade -->
          <div class="result-hero">
            ${ringHTML}

            <div class="result-grade">
              <span class="grade-badge ${grade.badgeClass}" aria-label="Grade: ${grade.label}">
                ${grade.emoji} ${grade.label}
              </span>

              <h2>
                ${state.player.name
                  ? `Great job, ${state.player.name}!`
                  : grade.message}
              </h2>

              <p>${state.player.name ? grade.message : ""}</p>

              <div class="result-meta">
                <span class="result-meta-item">
                  📁 <strong>${stats.category}</strong>
                </span>
                <span class="result-meta-item">
                  🎯 <strong>${stats.difficulty}</strong>
                </span>
                <span class="result-meta-item">
                  ⏱ <strong>${stats.formattedTime}</strong>
                </span>
              </div>
            </div>
          </div>

          <!-- 4-stat grid -->
          <div class="result-stats-grid" aria-label="Quiz statistics">
            <div class="result-stat-card stat-correct">
              <span class="result-stat-icon">✅</span>
              <span class="stat-value">${stats.correct}</span>
              <span class="stat-label">Correct</span>
            </div>
            <div class="result-stat-card stat-wrong">
              <span class="result-stat-icon">❌</span>
              <span class="stat-value">${stats.wrong}</span>
              <span class="stat-label">Wrong</span>
            </div>
            <div class="result-stat-card stat-skipped">
              <span class="result-stat-icon">⏭</span>
              <span class="stat-value">${stats.skipped}</span>
              <span class="stat-label">Skipped</span>
            </div>
            <div class="result-stat-card stat-accuracy">
              <span class="result-stat-icon">🎯</span>
              <span class="stat-value">${stats.accuracy}%</span>
              <span class="stat-label">Accuracy</span>
            </div>
          </div>

          <!-- Breakdowns -->
          <div class="breakdown-grid">
            <div class="breakdown-card">
              <h4>Category Breakdown</h4>
              ${categoryRows || "<p style='color:var(--text-muted);font-size:.875rem;'>N/A</p>"}
            </div>
            <div class="breakdown-card">
              <h4>Difficulty Breakdown</h4>
              ${difficultyRows || "<p style='color:var(--text-muted);font-size:.875rem;'>N/A</p>"}
            </div>
          </div>

          <!-- Actions -->
          <div class="result-actions">
            <button class="btn btn-primary" id="btn-retake" aria-label="Retake this quiz">
              🔄 Retake Quiz
            </button>
            <button class="btn btn-ghost"    id="btn-home"   aria-label="Return to home page">
              🏠 Home
            </button>
          </div>

          <!-- Review Section -->
          <div class="review-section">
            <div class="review-header">
              <h3>📖 Review Answers</h3>
              <div class="review-filter" role="group" aria-label="Filter review answers">
                <button class="review-filter-btn active" data-filter="all">All</button>
                <button class="review-filter-btn" data-filter="correct">Correct</button>
                <button class="review-filter-btn" data-filter="wrong">Wrong</button>
                <button class="review-filter-btn" data-filter="skipped">Skipped</button>
              </div>
            </div>

            <div class="review-list" id="review-list" aria-label="Answer review list">
              ${reviewItems}
            </div>
          </div>

        </div>
      </div>
    </section>
  `;
}
