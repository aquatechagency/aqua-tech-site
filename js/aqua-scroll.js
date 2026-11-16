/*!
 * Aqua.Tech - shared scroll scheduler
 * One passive scroll listener, one resize listener and one rAF per frame for
 * every scroll-driven layer (navigation, motion system, depth pipeline, core).
 *
 * Layout reads and writes are kept apart:
 *   measure(m)  reads layout (offsets, heights) and caches numbers. Runs once
 *               up front and again only when the page's width or content
 *               height really changed (debounced), never per scroll frame.
 *               Must not write to the DOM.
 *   update(m)   runs every scroll frame with the cached numbers and the single
 *               scroll position read for that frame. Must not read layout.
 *
 * HP20: no frame is scheduled while the page is idle (only scroll, a
 * measurement request, or a subscriber's request() schedules one). Resizes
 * that only change the height - the mobile URL bar showing and hiding - do not
 * re-measure, and width changes, content-height changes and load are debounced
 * so a burst costs one measurement instead of one per event.
 */
(function () {
  "use strict";

  var MEASURE_DEBOUNCE_MS = 150;

  var subscribers = [];
  var metrics = { y: 0, vh: 1, docH: 0 };
  var frame = 0;
  var measureDue = true;
  var measureTimer = 0;
  var lastWidth = window.innerWidth;

  function runMeasure() {
    measureDue = false;
    metrics.docH = document.documentElement.scrollHeight;

    subscribers.forEach(function (sub) {
      if (sub.measure) sub.measure(metrics);
    });
  }

  function tick() {
    frame = 0;

    /* Read phase: every layout read of the frame happens here, before any
       subscriber writes a style. */
    if (measureDue) runMeasure();
    metrics.y = window.scrollY;
    metrics.vh = window.innerHeight || 1;

    /* Write phase: subscribers only compute from the numbers above. */
    subscribers.forEach(function (sub) {
      sub.update(metrics);
    });
  }

  function request() {
    if (frame) return;
    frame = window.requestAnimationFrame(tick);
  }

  function requestMeasure() {
    measureDue = true;
    request();
  }

  function requestMeasureSoon() {
    window.clearTimeout(measureTimer);
    measureTimer = window.setTimeout(requestMeasure, MEASURE_DEBOUNCE_MS);
  }

  function onResize() {
    var width = window.innerWidth;

    if (width === lastWidth) {
      /* Height only (URL bar): offsets are unchanged, just refresh vh. */
      request();
      return;
    }

    lastWidth = width;
    requestMeasureSoon();
  }

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("load", requestMeasure, { passive: true });

  /* Content height changes without a window resize (fonts, translated text,
     the FAQ accordion, sections skipped by content-visibility being laid out),
     which moves every cached offset. Debounced: one measurement per burst. */
  if ("ResizeObserver" in window) {
    new ResizeObserver(requestMeasureSoon).observe(document.documentElement);
  }

  window.AquaScroll = {
    /* Starts receiving frames; the first one measures and updates. */
    add: function (sub) {
      subscribers.push(sub);
      requestMeasure();
    },
    /* Run update() on the next frame without a scroll event. */
    request: request,
    requestMeasure: requestMeasure
  };
})();
