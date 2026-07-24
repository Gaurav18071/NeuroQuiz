export function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: "⚙️",
            title: "Configure Quiz",
            description:
                "Choose your category, difficulty level, and number of questions to create a personalized challenge.",
        },
        {
            number: "02",
            icon: "📝",
            title: "Take the Quiz",
            description:
                "Answer timed questions with instant feedback while tracking your progress in real time.",
        },
        {
            number: "03",
            icon: "📈",
            title: "Analyze Results",
            description:
                "Review your answers, check your accuracy, and identify areas where you can improve.",
        },
    ];

    return `
    <section class="how-it-works">

      <div class="section-header">
        <span class="section-badge">How It Works</span>

        <h2>Three Simple Steps</h2>

        <p>
          Start learning in less than a minute with a smooth and intuitive experience.
        </p>
      </div>

      <div class="steps-container">

        ${steps
            .map(
                (step) => `
            <div class="step-card">

              <span class="step-number">${step.number}</span>

              <div class="step-icon">
                ${step.icon}
              </div>

              <h3>${step.title}</h3>

              <p>${step.description}</p>

            </div>
          `
            )
            .join("")}

      </div>

    </section>
  `;
}
