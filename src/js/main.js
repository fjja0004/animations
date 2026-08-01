import $ from 'jquery';

$(document).ready(function () {
  $('.menu-toggle-button').on('click', function () {
    $('#main-header').toggleClass('menu-open');
  });
});

/* document.addEventListener("DOMContentLoaded", () => {
  const textElement = document.querySelector('.scroll-reveal-text');

  // Calculates the scroll percentage and updates the CSS variable
  const updateScrollProgress = () => {
    const rect = textElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // DEFINE THE TRIGGER ZONE
    // Start revealing when the text is 85% down the screen
    const startReveal = windowHeight * 0.85;
    // Finish revealing when the text reaches 40% down the screen
    const endReveal = windowHeight * 0.40;

    // Calculate the current progress between 0 and 1
    let progress = (startReveal - rect.top) / (startReveal - endReveal);

    // Clamp the progress so it never goes below 0 or above 1
    progress = Math.max(0, Math.min(1, progress));

    // Pass the value to our CSS
    // textElement.style.setProperty('--progress', progress);
    const positionY = 100 - (progress * 100);
    textElement.style.backgroundPosition = `0 ${positionY}%`;
  };

  // PERFORMANCE BOOST: 
  // Only listen for scroll events when the element is actually on screen
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      window.addEventListener('scroll', updateScrollProgress, { passive: true });
      updateScrollProgress(); // Run once immediately to set initial state
    } else {
      window.removeEventListener('scroll', updateScrollProgress);
    }
  });

  observer.observe(textElement);
}); */

/* $(document).ready(function () {
  const $textElement = $('.scroll-reveal-text');

  // Cancel if the element doesn't exist on this specific page
  if (!$textElement.length) return;

  const updateScrollProgress = () => {
    // getBoundingClientRect is native, so we access the raw DOM element with [0]
    const rect = $textElement[0].getBoundingClientRect();
    const windowHeight = $(window).height();

    const startReveal = windowHeight * 0.85;
    const endReveal = windowHeight * 0.40;

    let progress = (startReveal - rect.top) / (startReveal - endReveal);
    progress = Math.max(0, Math.min(1, progress));

    const positionY = 100 - (progress * 100);

    // Apply the inline style using jQuery's .css() method
    $textElement.css('background-position', `0 ${positionY}%`);
  };

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      // Use a jQuery event namespace ('.reveal') so we only unbind this specific scroll event
      $(window).on('scroll.reveal', updateScrollProgress);
      updateScrollProgress();
    } else {
      $(window).off('scroll.reveal');
    }
  });

  observer.observe($textElement[0]);
}); */

$(document).ready(function() {
  const $textElements = $('.scroll-reveal-text');
  if (!$textElements.length) return;

  // This Set will store only the elements that are currently on screen
  const activeElements = new Set();
  
  // A flag to ensure we only attach the scroll listener once
  let isListeningToScroll = false;

  const updateScrollProgress = () => {
    const windowHeight = $(window).height();
    const startReveal = windowHeight * 0.85;
    const endReveal = windowHeight * 0.40;

    // Loop through ONLY the elements that are actively in the viewport
    activeElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      
      let progress = (startReveal - rect.top) / (startReveal - endReveal);
      progress = Math.max(0, Math.min(1, progress));
      
      const positionY = 100 - (progress * 100);
      
      // Update the background position for this specific element
      $(el).css('background-position', `0 ${positionY}%`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add the element to our active list when it enters the screen
        activeElements.add(entry.target);
      } else {
        // Remove it from the list when it leaves the screen
        activeElements.delete(entry.target);
      }
    });

    // If we have at least one element on screen, turn on the scroll listener
    if (activeElements.size > 0 && !isListeningToScroll) {
      $(window).on('scroll.reveal', updateScrollProgress);
      isListeningToScroll = true;
      updateScrollProgress(); // Run immediately to catch the initial state
    } 
    // If NO elements are on screen, turn the scroll listener off to save CPU
    else if (activeElements.size === 0 && isListeningToScroll) {
      $(window).off('scroll.reveal');
      isListeningToScroll = false;
    }
  });

  // Attach the observer to EVERY '.scroll-reveal-text' element on the page
  $textElements.each(function() {
    observer.observe(this);
  });
});