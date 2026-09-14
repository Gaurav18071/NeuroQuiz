/* ============================================================
   NeuroQuiz — Home Page
============================================================ */

import { Navbar }       from "../Components/Navbar";
import { Hero }         from "../Components/Hero";
import { Features }     from "../Components/Features";
import { HowItWorks }   from "../Components/HowItWorks";
import { LiveStats }    from "../Components/LiveStats";
import { Testimonials } from "../Components/Testimonials";
import { CTA }          from "../Components/CTA";
import { Footer }       from "../Components/Footer";

export function HomePage() {
  return `
    <div class="background" aria-hidden="true">
      <div class="gradient gradient-1"></div>
      <div class="gradient gradient-2"></div>
      <div class="grid"></div>
    </div>

    <div class="noise" aria-hidden="true"></div>

    <div class="orb orb1" aria-hidden="true"></div>
    <div class="orb orb2" aria-hidden="true"></div>
    <div class="orb orb3" aria-hidden="true"></div>

    <div class="container">
      ${Navbar({ screen: "home" })}
      ${Hero()}
    </div>

    ${Features()}
    ${HowItWorks()}
    ${LiveStats()}
    ${Testimonials()}
    ${CTA()}
    ${Footer()}
  `;
}
