import $ from 'jquery';

$(document).ready(function () {
  const $textElements = $('.scroll-reveal-text');
  
  // Exit early if no elements exist on the page
  if (!$textElements.length) return;

  // We still use a native Set to track elements because it's much faster 
  // than searching through jQuery arrays on every scroll tick
  const activeElements = new Set();
  let isListeningToScroll = false;
  let ticking = false;

  // The math engine: calculates progress for active elements
  const updateScrollProgress = () => {
    const windowHeight = $(window).height();
    
    // Set your animation trigger zones (85% to 40% of the screen)
    const startReveal = windowHeight * 0.85;
    const endReveal = windowHeight * 0.40;
    const distance = startReveal - endReveal;

    activeElements.forEach((el) => {
      // Native getBoundingClientRect is used here because it is significantly 
      // faster than jQuery's .offset() which triggers browser layout recalculations
      const rect = el.getBoundingClientRect();
      
      // Calculate how far the element has moved through the trigger zone
      let progress = (startReveal - rect.top) / distance;
      
      // Clamp the value between 0 (not started) and 1 (fully revealed)
      progress = Math.max(0, Math.min(1, progress));
      
      // Convert progress to background position (100% down to 0%)
      const positionY = 100 - (progress * 100);
      
      // Apply the style using jQuery
      $(el).css('background-position', `0 ${positionY}%`);
    });

    // Reset the requestAnimationFrame lock
    ticking = false;
  };

  // The scroll handler: throttled using requestAnimationFrame
  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  };

  // The Observer: Manages WHICH elements are currently active
  const observer = new IntersectionObserver((entries) => {
    let stateChanged = false;

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeElements.add(entry.target);
        stateChanged = true;
      } else {
        activeElements.delete(entry.target);
        stateChanged = true;
      }
    });

    // Toggle the scroll listener on/off for performance
    if (stateChanged) {
      if (activeElements.size > 0 && !isListeningToScroll) {
        // Bind the scroll event using jQuery
        $(window).on('scroll.revealText', onScroll);
        isListeningToScroll = true;
        
        // Force an immediate calculation so things don't jump
        onScroll(); 
      } else if (activeElements.size === 0 && isListeningToScroll) {
        // Unbind the scroll event to save CPU when elements are off-screen
        $(window).off('scroll.revealText');
        isListeningToScroll = false;
      }
    }
  }, {
    // Look slightly above and below the viewport to ensure 
    // smooth handoffs before the element physically enters the screen
    rootMargin: "20% 0px 20% 0px"
  });

  // Attach the observer to all elements in the jQuery collection
  $textElements.each(function () {
    // 'this' refers to the native DOM element inside a jQuery .each() loop
    observer.observe(this);
  });
});