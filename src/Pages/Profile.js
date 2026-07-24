/* ============================================================
   NeuroQuiz — Profile Page
   Displays user dashboard with achievements, badges, and stats.
============================================================ */

import { Navbar } from "../Components/Navbar";
import { UserProfile } from "../Components/UserProfile";
import { state } from "../Utils/state";

export function ProfilePage() {
  if (!state.auth) {
    return `
      <div style="display:flex;align-items:center;justify-content:center;
                  min-height:100vh;flex-direction:column;gap:1rem;text-align:center;">
        <h1 style="font-size:2rem;">Please log in first</h1>
        <p>You need to be logged in to view your profile.</p>
        <button onclick="location.reload()" class="btn btn-primary">Go Back</button>
      </div>
    `;
  }

  return `
    <div class="page">
      ${Navbar({ screen: "profile" })}
      ${UserProfile({ user: state.auth })}
    </div>
  `;
}
