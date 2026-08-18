import $ from 'jquery';

$(document).ready(function ($) {
  
  /**
   * STEP 1: Core Line-Splitting Function
   * Measures text lines using dynamic word wrappers and offsetTop positions.
   */
  function splitTextIntoLines($element) {
    // 1A. Cache original text to allow clean recalculations on window resize
    if (!$element.data('original-text')) {
      $element.data('original-text', $element.text().trim());
    }

    const rawText = $element.data('original-text');
    if (!rawText) return;

    // 1B. Split paragraph into individual words
    const words = rawText.split(/\s+/);
    $element.empty();

    // 1C. Temporarily wrap each word in an inline <span> to measure its position
    const $wordSpans = words.map(function (word) {
      return $('<span>').text(word + ' ');
    });
    $element.append($wordSpans);

    // 1D. Group words by matching vertical offsets (offsetTop)
    const lines = [];
    let currentTop = null;
    let currentLine = [];

    $wordSpans.forEach(function ($span) {
      // Get exact vertical pixel position relative to parent
      const top = $span[0].offsetTop;

      if (currentTop === null || top === currentTop) {
        currentLine.push($span.text());
      } else {
        lines.push(currentLine);
        currentLine = [$span.text()];
      }
      currentTop = top;
    });

    // Push the final line
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    // 1E. Rebuild the HTML with .line-mask and .line-inner elements
    $element.empty();

    lines.forEach(function (lineWords, index) {
      const lineText = lineWords.join('').trim();

      const $lineMask = $('<span>', { class: 'line-mask' });
      const $lineInner = $('<span>', {
        class: 'line-inner',
        text: lineText
      }).css('--line-index', index); // Set custom CSS property

      $lineMask.append($lineInner);
      $element.append($lineMask);
    });
  }


  /**
   * STEP 2: Intersection Observer Setup
   * Triggers line splitting and animation when element enters viewport.
   */
  function initLineAnimations() {
    const $targets = $('.animate-lines');
    if (!$targets.length) return;

    // First pass: Split lines initially so dimensions are set
    $targets.each(function () {
      splitTextIntoLines($(this));
    });

    // Configure Observer threshold (10% visible triggers animation)
    const observerOptions = {
      root: null,
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Add visible class to trigger CSS transition
          $(entry.target).addClass('is-visible');
          
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Attach observer to each element
    $targets.each(function () {
      observer.observe(this);
    });
  }


  /**
   * STEP 3: Handle Window Resizing (Debounced)
   * Recalculates lines when browser width changes.
   */
  let resizeDebounceTimer;

  $(window).on('resize', function () {
    clearTimeout(resizeDebounceTimer);
    
    resizeDebounceTimer = setTimeout(function () {
      $('.animate-lines').each(function () {
        const $el = $(this);
        
        // Split lines again based on new layout bounds
        splitTextIntoLines($el);
      });
    }, 250); // Wait 250ms after resizing finishes
  });


  // Initialize on DOM ready
  initLineAnimations();
});