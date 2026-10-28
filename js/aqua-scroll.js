/*!
 * Aqua.Tech - shared scroll scheduler
 * One passive scroll listener, one resize listener and one rAF per frame for
 * every scroll-driven layer (navigation, motion system, depth pipeline, core).
 *
 * Layout reads and writes are kept apart:
 *   measure(m)  reads layout (offsets, heights) and caches numbers. Runs once
 *               up front and again only when the page size changes, never per
 *               scroll frame. Must not write to the DOM.
 *   update(m)   runs every scroll frame with the cached numbers and the single
 *               scroll position read for that frame. Must not read layout.
 */
(function () {
  "use strict";

  var subscribers = [];
  var metrics = { y: 0, vh: 1, docH: 0 };
  var frame = 0;
  var measureDue = true;

  function runMeasure() {
    measureDue = false;
    metrics.vh = window.innerHeight || 1;
    metrics.docH = document.documentElement.scrollHeight;

    subscribers.forEach(function (sub) {
      if (sub.measure) sub.measure(metrics);
    });
  }

  function tick() {
    frame = 0;

    if (measureDue) runMeasure();
    metrics.y = window.scrollY;

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

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", requestMeasure, { passive: true });
  window.addEventListener("load", requestMeasure, { passive: true });

  /* Content height changes without a window resize (fonts, translated text,
     the FAQ accordion), which moves every cached offset. */
  if ("ResizeObserver" in window) {
    new ResizeObserver(requestMeasure).observe(document.documentElement);
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
