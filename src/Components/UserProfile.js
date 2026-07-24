/* ============================================================
   NeuroQuiz — User Profile Dashboard
   Shows user stats, achievements, badges, progress calendar,
   and unlocked/locked achievements (like LeetCode).
============================================================ */

import { getUnlocked, ACHIEVEMENTS } from "../Utils/achievement";
import { getProgress } from "../Utils/auth";
import { EMOJI, GRADE_THRESHOLDS } from "../Utils/constants";

export function UserProfile({ user, onLogout }) {
  if (!user) return "";

  const unlockedIds = new Set(getUnlocked().map((a) => a.id));
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !unlockedIds.has(a.id));
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedIds.has(a.id));
  const progress = getProgress();

  // Calculate stats
  const totalQuizzes = progress.length;
  const totalScore = progress.reduce((sum, p) => sum + p.score, 0);
  const totalQuestions = progress.reduce((sum, p) => sum + p.total, 0);
  const avgAccuracy = totalQuestions > 0
    ? ((totalScore / totalQuestions) * 100).toFixed(1)
    : 0;

  // Category breakdown
  const categoryStats = {};
  progress.forEach((p) => {
    if (!categoryStats[p.category]) {
      categoryStats[p.category] = { solved: 0, total: 0, accuracy: 0 };
    }
    categoryStats[p.category].solved += p.score;
    categoryStats[p.category].total += p.total;
  });

  Object.keys(categoryStats).forEach((cat) => {
    const stat = categoryStats[cat];
    stat.accuracy = stat.total > 0 ? ((stat.solved / stat.total) * 100).toFixed(1) : 0;
  });

  // Streak calculation
  const today = new Date().toLocaleDateString();
  const lastQuizDate = progress.length > 0 ? progress[0].date : null;
  const isStreakActive = lastQuizDate === today;

  return `
    <div class="user-profile-page">
      <!-- Left Sidebar: User Info -->
      <div class="profile-sidebar">
        <div class="profile-header">
          <div class="profile-avatar" style="font-size: 3rem;">${user.avatar}</div>
          <div class="profile-info">
            <h2>${user.name}</h2>
            <p class="profile-email">${user.identifier}</p>
          </div>
          <button class="btn-logout" onclick="window.dispatchEvent(new CustomEvent('logout'))">
            ${EMOJI.CLOSE} Logout
          </button>
        </div>

        <div class="profile-stats-card">
          <div class="stat-row">
            <span class="stat-label">Total Quizzes</span>
            <span class="stat-value">${totalQuizzes}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Questions Solved</span>
            <span class="stat-value">${totalScore}/${totalQuestions}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Avg Accuracy</span>
            <span class="stat-value">${avgAccuracy}%</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Achievements</span>
            <span class="stat-value">${unlockedAchievements.length}/${ACHIEVEMENTS.length}</span>
          </div>
        </div>

        <div class="profile-section">
          <h3>Community Stats</h3>
          <div class="community-stats">
            <div class="community-stat">
              <span class="stat-icon">👀</span>
              <span>Views: 0</span>
            </div>
            <div class="community-stat">
              <span class="stat-icon">✓</span>
              <span>Solutions: ${totalQuizzes}</span>
            </div>
            <div class="community-stat">
              <span class="stat-icon">💬</span>
              <span>Discuss: 0</span>
            </div>
            <div class="community-stat">
              <span class="stat-icon">⭐</span>
              <span>Reputation: 0</span>
            </div>
          </div>
        </div>

        <div class="profile-section">
          <h3>Categories</h3>
          <div class="categories-list">
            ${Object.entries(categoryStats)
              .map(
                ([cat, stat]) => `
                <div class="category-item">
                  <div class="category-name">${cat}</div>
                  <div class="category-solved">${stat.solved}/${stat.total}</div>
                  <div class="category-bar">
                    <div class="category-fill" style="width: ${stat.accuracy}%"></div>
                  </div>
                  <div class="category-accuracy">${stat.accuracy}%</div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>
      </div>

      <!-- Right Section: Achievements & Badges -->
      <div class="profile-main">
        <!-- Badges Section -->
        <div class="badges-section">
          <div class="section-title">
            <h3>Badges</h3>
            <span class="badge-count">${unlockedAchievements.length}</span>
          </div>
          <div class="badges-grid">
            ${unlockedAchievements
              .map(
                (achievement) => `
                <div class="badge-card unlocked" title="${achievement.title}">
                  <div class="badge-emoji" style="background-color: ${achievement.color}44;">
                    ${achievement.emoji}
                  </div>
                  <div class="badge-title">${achievement.title}</div>
                  <div class="badge-desc">${achievement.description}</div>
                  <div class="badge-unlocked">
                    ${EMOJI.CHECKMARK} Unlocked
                  </div>
                </div>
              `
              )
              .join("")}
          </div>
        </div>

        <!-- Locked Badges Section -->
        ${lockedAchievements.length > 0
          ? `
          <div class="badges-section locked">
            <div class="section-title">
              <h3>Locked Achievements</h3>
              <span class="badge-count">${lockedAchievements.length}</span>
            </div>
            <div class="badges-grid">
              ${lockedAchievements
                .map(
                  (achievement) => `
                  <div class="badge-card locked" title="${achievement.title}">
                    <div class="badge-emoji locked-emoji">
                      🔒
                    </div>
                    <div class="badge-title">${achievement.title}</div>
                    <div class="badge-desc">${achievement.description}</div>
                    <div class="badge-locked">
                      Locked
                    </div>
                  </div>
                `
                )
                .join("")}
            </div>
          </div>
        `
          : ""}

        <!-- Recent Activity -->
        <div class="activity-section">
          <div class="section-title">
            <h3>Recent Quizzes</h3>
          </div>
          ${progress.length > 0
            ? `
            <div class="activity-list">
              ${progress
                .slice(0, 5)
                .map(
                  (p) => `
                  <div class="activity-item">
                    <div class="activity-date">${p.date}</div>
                    <div class="activity-info">
                      <div class="activity-category">${p.category} - ${p.difficulty}</div>
                      <div class="activity-score">
                        ${p.score}/${p.total} correct (${p.accuracy.toFixed(1)}%)
                      </div>
                    </div>
                    <div class="activity-time">${p.timeTaken}s</div>
                  </div>
                `
                )
                .join("")}
            </div>
          `
            : `
            <div class="empty-state">
              <p>No quizzes completed yet. Start a quiz to track your progress!</p>
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
