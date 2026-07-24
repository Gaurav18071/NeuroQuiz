export function Features() {
    const features = [
        {
            icon: "⚡",
            title: "Instant Feedback",
            description:
                "Get immediate feedback after every question to improve faster.",
        },
        {
            icon: "🎯",
            title: "Adaptive Difficulty",
            description:
                "Choose Easy, Medium, or Hard quizzes based on your skill level.",
        },
        {
            icon: "📊",
            title: "Performance Analytics",
            description:
                "Track your accuracy, score, and progress after every quiz.",
        },
        {
            icon: "🏆",
            title: "Challenge Yourself",
            description:
                "Practice daily and push yourself to achieve better scores.",
        },
        {
            icon: "📚",
            title: "Multiple Categories",
            description:
                "Explore quizzes on JavaScript, HTML, CSS, React, and more.",
        },
        {
            icon: "⏱",
            title: "Timed Quizzes",
            description:
                "Simulate real interview and exam environments with countdown timers.",
        },
    ];

    return `
    <section class="features-section">

      <div class="section-header">
        <span class="section-badge">Why Choose NeuroQuiz?</span>

        <h2>Learn Smarter. Perform Better.</h2>

        <p>
          Everything you need to improve your programming knowledge,
          prepare for interviews, and track your learning journey.
        </p>
      </div>

      <div class="features-grid">

        ${features
            .map(
                (feature) => `
              <div class="feature-card">

                <div class="feature-icon">
                  ${feature.icon}
                </div>

                <h3>${feature.title}</h3>

                <p>${feature.description}</p>

              </div>
            `
            )
            .join("")}

      </div>

    </section>
  `;
}
