import $ from 'jquery';
import { animate, inView, scroll, stagger } from "motion";

$(document).ready(function () {
  $('.menu-toggle-button').on('click', function () {
    $('#main-header').toggleClass('menu-open');
  });
});

animate(
  ".hero-title",
  { opacity: [0, 1], y: [-20, 0] },
  { duration: 0.8 }
);

animate(
  ".hero-sub",
  { opacity: [0, 1] },
  { duration: 0.8, delay: 0.2 }
);

// 2. Staggered Grid Cards Entrance
inView(".card-grid", () => {
  animate(
    ".card",
    { opacity: [0, 1], y: [30, 0] },
    { delay: stagger(0.15), duration: 0.5 }
  );
});

// 3. Hover Micro-interactions on Cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    animate(card, { scale: 1.05, backgroundColor: "#334155" }, { duration: 0.2 });
  });

  card.addEventListener("mouseleave", () => {
    animate(card, { scale: 1, backgroundColor: "#1e293b" }, { duration: 0.2 });
  });
});

// 4. Scroll Reveal Element
inView(".reveal-box", (element) => {
  animate(
    element,
    { opacity: [0, 1], scale: [0.9, 1] },
    { duration: 0.6 }
  );
});

// 5. Scroll-linked Progress Bar
scroll(
  animate(".progress-bar", { scaleX: [0, 1] })
);