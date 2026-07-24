export function LiveStats() {
    const stats = [
        {
            value: "50K+",
            label: "Quizzes Completed",
            icon: "📝",
        },
        {
            value: "15K+",
            label: "Active Learners",
            icon: "👨‍💻",
        },
        {
            value: "100+",
            label: "Topics Covered",
            icon: "📚",
        },
        {
            value: "95%",
            label: "Success Rate",
            icon: "🏆",
        },
    ];

    return `
    <section class="live-stats">

      <div class="section-header">
        <span class="section-badge">Our Impact</span>

        <h2>Trusted by Learners</h2>

        <p>
          Thousands of learners use NeuroQuiz to improve their technical skills every day.
        </p>
      </div>

      <div class="stats-grid">

        ${stats
            .map(
                (stat) => `
              <div class="stats-card">

                <div class="stats-icon">
                  ${stat.icon}
                </div>

                <h2>${stat.value}</h2>

                <p>${stat.label}</p>

              </div>
            `
            )
            .join("")}

      </div>

    </section>
  `;
}
