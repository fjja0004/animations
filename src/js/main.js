import { scroll, animate } from "motion";

document.addEventListener("DOMContentLoaded", () => {
  const textElements = document.querySelectorAll(".scroll-reveal-text");

  textElements.forEach((el) => {
    // We animate the Y position of the background from 100% to 0%
    scroll(animate(el, { backgroundPositionY: ["100%", "0%"] }), {
      // The element we are tracking
      target: el,
      
      // "start 85%" -> Animation begins when the top of the element hits 85% of the viewport height
      // "start 40%" -> Animation completes when the top of the element hits 40% of the viewport height
      offset: ["start 85%", "start 40%"] 
    });
  });
});