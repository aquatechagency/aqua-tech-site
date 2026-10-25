/*!
 * Aqua.Tech - Depth interactions
 * Owns the spatial behaviour layer: full-screen navigation, cursor-tracked
 * card lighting and tilt, the scroll-driven process pipeline, the trust step
 * sequence, and the accessible FAQ accordion.
 *
 * Runs after aqua-motion-system.js so the entrance reveal stays authoritative
 * until it completes, then depth takes over the transform.
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.setAttribute("aria-hidden", "true");
    return node;
  }

  /* Decoration that nothing reads during load runs when the main thread is
     idle, so it stays out of the tasks that count toward blocking time. */
  function whenIdle(task) {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(task, { timeout: 1500 });
    } else {
      window.setTimeout(task, 200);
    }
  }

  /* ------------------------------------------------- 1. Hero core flagging */

  var hero = document.querySelector(".aqua-signature-hero");
  var coreHost = document.querySelector("[data-aqua-core]");

  if (hero && coreHost) {
    /* aqua-core.js sets the state attribute synchronously when it boots, but
       it may bail to fallback later (context loss), so watch for changes. */
    var syncCoreState = function () {
      hero.classList.toggle(
        "has-aqua-core",
        coreHost.getAttribute("data-aqua-core-state") === "live"
      );
    };

    syncCoreState();

    if ("MutationObserver" in window) {
      new MutationObserver(syncCoreState).observe(coreHost, {
        attributes: true,
        attributeFilter: ["data-aqua-core-state"]
      });
    }
  }

  /* ------------------------------------------------ 2. Navigation progress */

  var navBar = document.querySelector("body > header .aqua-top-pill");

  if (navBar && !navBar.querySelector(".aqua-nav-progress")) {
    navBar.appendChild(el("span", "aqua-nav-progress"));
  }

  /* ----------------------------------------------- 3. Full-screen menu */

  var menuToggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  if (menuToggle && mobileMenu) {
    var menuPanel = mobileMenu.firstElementChild;
    var menuLinks = Array.prototype.slice.call(mobileMenu.querySelectorAll("a"));

    if (menuPanel && !mobileMenu.querySelector(".aqua-menu-grid")) {
      mobileMenu.insertBefore(el("span", "aqua-menu-grid"), menuPanel);
    }

    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-controls", "mobileMenu");

    menuLinks.forEach(function (link, index) {
      link.style.setProperty("--aqua-menu-index", String(index));

      /* The index marker is drawn with a CSS counter rather than injected.
         These links carry data-i18n, and the i18n layer rewrites their
         textContent on every language switch, which would delete any child
         element we put inside them. */
    });

    var setMenuState = function (open) {
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
      menuToggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("aqua-menu-open", open);

      var iconOpen = document.getElementById("menuIconOpen");
      var iconClose = document.getElementById("menuIconClose");
      if (iconOpen) iconOpen.classList.toggle("hidden", open);
      if (iconClose) iconClose.classList.toggle("hidden", !open);

      /* Links behind a closed overlay must not be tab-reachable. */
      menuLinks.forEach(function (link) {
        if (open) link.removeAttribute("tabindex");
        else link.setAttribute("tabindex", "-1");
      });
    };

    /* The inline bootstrap script already binds a click handler that toggles
       is-open. Replacing the node drops that binding so state lives here. */
    var freshToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(freshToggle, menuToggle);
    menuToggle = freshToggle;

    menuToggle.addEventListener("click", function () {
      setMenuState(!mobileMenu.classList.contains("is-open"));
    });

    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!mobileMenu.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        setMenuState(false);
        menuToggle.focus();
        return;
      }

      if (event.key !== "Tab") return;

      /* Keep focus inside the overlay while it covers the page. The close
         button lives in the header rather than the panel, so it is part of
         the loop. */
      var focusables = [menuToggle].concat(menuLinks);
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;

      if (focusables.indexOf(active) === -1) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    /* Never leave the overlay open across a breakpoint change. */
    var desktopQuery = window.matchMedia("(min-width: 1024px)");
    var onBreakpoint = function (event) {
      if (event.matches) setMenuState(false);
    };

    if (typeof desktopQuery.addEventListener === "function") {
      desktopQuery.addEventListener("change", onBreakpoint);
    } else if (typeof desktopQuery.addListener === "function") {
      desktopQuery.addListener(onBreakpoint);
    }

    setMenuState(false);
  }

  /* ------------------------------------------------- 4. Card depth system */

  var DEPTH_SELECTOR = ".aqua-service-path, .aqua-product-card, .aqua-trust-card";
  var depthCards = Array.prototype.slice.call(
    document.querySelectorAll(DEPTH_SELECTOR)
  );

  depthCards.forEach(function (card) {
    card.classList.add("aqua-depth-card");
  });

  /* The cursor spotlight and its edge only exist for a hovering pointer.
     Touch and no-hover devices get neither the spans nor any listener. */
  if (finePointer) {
    whenIdle(function () {
      depthCards.forEach(function (card) {
        if (!card.querySelector(":scope > .aqua-depth-card__spot")) {
          card.insertBefore(el("span", "aqua-depth-card__spot"), card.firstChild);
        }

        if (!card.querySelector(":scope > .aqua-depth-card__edge")) {
          card.insertBefore(el("span", "aqua-depth-card__edge"), card.firstChild);
        }
      });
    });
  }

  whenIdle(function () {
    /* Services get an internal technical grid and an icon glow, so each card
       reads as a small system rather than a styled box. */
    document.querySelectorAll(".aqua-service-path").forEach(function (card) {
      if (!card.querySelector(".aqua-service-path__grid")) {
        card.insertBefore(el("span", "aqua-service-path__grid"), card.firstChild);
      }

      var icon = card.querySelector(".aqua-service-path__icon");
      if (icon && !icon.querySelector(".aqua-service-path__icon-glow")) {
        icon.appendChild(el("span", "aqua-service-path__icon-glow"));
      }
    });

    /* Products get a live readout badge on their preview window. */
    document.querySelectorAll(".aqua-product-card").forEach(function (card) {
      var visual = card.querySelector(".aqua-product-card__visual");
      if (!visual || visual.querySelector(".aqua-product-card__signal")) return;

      var signal = el("span", "aqua-product-card__signal");
      var dot = document.createElement("i");
      var label = document.createElement("b");

      /* Deliberately not translatable: a status readout, not body copy. */
      label.textContent = "LIVE";
      signal.appendChild(dot);
      signal.appendChild(label);
      visual.appendChild(signal);
    });
  });

  var spotFrame = 0;
  var spotQueue = [];

  function flushSpots() {
    spotFrame = 0;

    spotQueue.forEach(function (entry) {
      var card = entry.card;
      var rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var x = entry.x - rect.left;
      var y = entry.y - rect.top;

      card.style.setProperty("--aqua-spot-x", x + "px");
      card.style.setProperty("--aqua-spot-y", y + "px");

      if (!reduceMotion && finePointer) {
        var normX = (x / rect.width - 0.5) * 2;
        var normY = (y / rect.height - 0.5) * 2;

        card.style.setProperty("--aqua-tilt-y", (normX * 3.4).toFixed(2) + "deg");
        card.style.setProperty("--aqua-tilt-x", (normY * -2.6).toFixed(2) + "deg");
        card.style.setProperty("--aqua-lift", "-6px");
      }
    });

    spotQueue.length = 0;
  }

  function queueSpot(card, event) {
    spotQueue.push({ card: card, x: event.clientX, y: event.clientY });
    if (spotFrame) return;
    spotFrame = window.requestAnimationFrame(flushSpots);
  }

  function resetCard(card) {
    card.classList.remove("is-aqua-spot");
    card.style.setProperty("--aqua-tilt-x", "0deg");
    card.style.setProperty("--aqua-tilt-y", "0deg");
    card.style.setProperty("--aqua-lift", "0px");
  }

  if (finePointer) {
    depthCards.forEach(function (card) {
      card.addEventListener(
        "pointerenter",
        function () {
          card.classList.add("is-aqua-spot");
        },
        { passive: true }
      );

      card.addEventListener(
        "pointermove",
        function (event) {
          queueSpot(card, event);
        },
        { passive: true }
      );

      card.addEventListener(
        "pointerleave",
        function () {
          resetCard(card);
        },
        { passive: true }
      );
    });
  }

  /* --------------------------------------------- 5. Contact command centre */

  var contactPanel = document.querySelector("#contact form");
  var commandFrame = contactPanel
    ? contactPanel.closest(".glass-card") || contactPanel
    : null;

  if (commandFrame) {
    commandFrame.classList.add("aqua-command-frame");

    if (finePointer && !reduceMotion) {
      if (!commandFrame.querySelector(".aqua-command-frame__light")) {
        commandFrame.insertBefore(
          el("span", "aqua-command-frame__light"),
          commandFrame.firstChild
        );
      }

      var commandFrameId = 0;
      var commandEvent = null;

      var applyCommandLight = function () {
        commandFrameId = 0;
        if (!commandEvent) return;

        var rect = commandFrame.getBoundingClientRect();
        commandFrame.style.setProperty(
          "--aqua-spot-x",
          commandEvent.clientX - rect.left + "px"
        );
        commandFrame.style.setProperty(
          "--aqua-spot-y",
          commandEvent.clientY - rect.top + "px"
        );
      };

      commandFrame.addEventListener(
        "pointerenter",
        function () {
          commandFrame.classList.add("is-aqua-spot");
        },
        { passive: true }
      );

      commandFrame.addEventListener(
        "pointermove",
        function (event) {
          commandEvent = event;
          if (commandFrameId) return;
          commandFrameId = window.requestAnimationFrame(applyCommandLight);
        },
        { passive: true }
      );

      commandFrame.addEventListener(
        "pointerleave",
        function () {
          commandEvent = null;
          commandFrame.classList.remove("is-aqua-spot");
        },
        { passive: true }
      );
    }
  }

  /* ------------------------------------------------- 6. Process pipeline */

  var pipeline = document.querySelector(".aqua-flow-method");

  if (pipeline) {
    if (!pipeline.querySelector(".aqua-flow-method__stream")) {
      var stream = el("span", "aqua-flow-method__stream");
      stream.appendChild(el("span", "aqua-flow-method__fill"));
      stream.appendChild(el("span", "aqua-flow-method__packet"));
      pipeline.appendChild(stream);
    }

    var pipelineSteps = Array.prototype.slice.call(
      pipeline.querySelectorAll(":scope > li")
    );

    var pipelineFrame = 0;

    var updatePipeline = function () {
      pipelineFrame = 0;

      var rect = pipeline.getBoundingClientRect();
      var viewport = window.innerHeight || 1;

      /* Progress runs from the moment the list enters the lower third of the
         viewport to the moment its end passes the upper third. */
      var start = viewport * 0.82;
      var end = viewport * 0.26;
      var travelled = start - rect.top;
      var span = Math.max(rect.height + (start - end), 1);
      var progress = Math.min(Math.max(travelled / span, 0), 1);

      pipeline.style.setProperty("--aqua-pipeline", progress.toFixed(4));

      var liveCount = Math.round(progress * pipelineSteps.length);
      pipelineSteps.forEach(function (step, index) {
        step.classList.toggle("is-aqua-node-live", index < liveCount);
      });
    };

    var requestPipelineUpdate = function () {
      if (pipelineFrame) return;
      pipelineFrame = window.requestAnimationFrame(updatePipeline);
    };

    if (reduceMotion) {
      pipeline.style.setProperty("--aqua-pipeline", "1");
      pipelineSteps.forEach(function (step) {
        step.classList.add("is-aqua-node-live");
      });
    } else {
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              pipeline.classList.toggle(
                "is-aqua-pipeline-live",
                entry.isIntersecting
              );
            });
          },
          { threshold: 0 }
        ).observe(pipeline);
      } else {
        pipeline.classList.add("is-aqua-pipeline-live");
      }

      /* First measurement on the next frame: called inline it forced a
         ~100ms layout while the page was still parsing. */
      requestPipelineUpdate();
      window.addEventListener("scroll", requestPipelineUpdate, { passive: true });
      window.addEventListener("resize", requestPipelineUpdate, { passive: true });
    }
  }

  /* ------------------------------------------------ 7. Trust step sequence */

  var trustCards = Array.prototype.slice.call(
    document.querySelectorAll(".aqua-trust-card")
  );

  if (trustCards.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      trustCards.forEach(function (card) {
        card.classList.add("is-aqua-step-live");
      });
    } else {
      var trustObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            var index = trustCards.indexOf(entry.target);
            window.setTimeout(function () {
              entry.target.classList.add("is-aqua-step-live");
            }, Math.max(index, 0) * 140);

            trustObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.3 }
      );

      trustCards.forEach(function (card) {
        trustObserver.observe(card);
      });
    }
  }

  /* ---------------------------------------------------- 8. FAQ accordion */

  var faqItems = Array.prototype.slice.call(document.querySelectorAll(".faq-item"));

  faqItems.forEach(function (item, index) {
    var button = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    if (!button || !answer) return;

    if (!item.querySelector(".faq-item__rail")) {
      item.insertBefore(el("span", "faq-item__rail"), item.firstChild);
    }

    var answerId = answer.id || "aqua-faq-answer-" + (index + 1);
    var buttonId = button.id || "aqua-faq-question-" + (index + 1);

    answer.id = answerId;
    button.id = buttonId;
    button.setAttribute("aria-controls", answerId);
    answer.setAttribute("role", "region");
    answer.setAttribute("aria-labelledby", buttonId);

    /* The bootstrap script toggled a `hidden` class; the accordion now
       animates height instead, so that class must not linger. */
    answer.classList.remove("hidden");

    var setOpen = function (open) {
      item.setAttribute("data-aqua-faq-open", String(open));
      button.setAttribute("aria-expanded", String(open));

      var icon = button.querySelector(".material-symbols-outlined");
      if (icon) icon.textContent = "add";
    };

    setOpen(false);

    button.addEventListener("click", function () {
      setOpen(item.getAttribute("data-aqua-faq-open") !== "true");
    });
  });

  /* --------------------------------------------------- 9. Magnetic buttons */

  if (finePointer && !reduceMotion) {
    var magnetSelector = [
      ".aqua-hero-btn",
      ".aqua-service-path__cta",
      ".aqua-service-paths__decision-cta",
      ".aqua-complexity-flow__cta",
      ".aqua-product-card__cta",
      "#sendLead"
    ].join(", ");

    document.querySelectorAll(magnetSelector).forEach(function (button) {
      button.classList.add("aqua-magnetic");

      var magnetFrame = 0;
      var magnetEvent = null;

      var applyMagnet = function () {
        magnetFrame = 0;
        if (!magnetEvent) return;

        var rect = button.getBoundingClientRect();
        var offsetX = magnetEvent.clientX - (rect.left + rect.width / 2);
        var offsetY = magnetEvent.clientY - (rect.top + rect.height / 2);
        var strength = Math.min(rect.width, 220) / 220;

        button.style.setProperty(
          "--aqua-magnet-x",
          (offsetX * 0.16 * strength).toFixed(2) + "px"
        );
        button.style.setProperty(
          "--aqua-magnet-y",
          (offsetY * 0.22 * strength).toFixed(2) + "px"
        );
      };

      button.addEventListener(
        "pointerenter",
        function () {
          button.classList.add("is-aqua-magnet-active");
        },
        { passive: true }
      );

      button.addEventListener(
        "pointermove",
        function (event) {
          magnetEvent = event;
          if (magnetFrame) return;
          magnetFrame = window.requestAnimationFrame(applyMagnet);
        },
        { passive: true }
      );

      button.addEventListener(
        "pointerleave",
        function () {
          magnetEvent = null;
          button.classList.remove("is-aqua-magnet-active");
          button.style.setProperty("--aqua-magnet-x", "0px");
          button.style.setProperty("--aqua-magnet-y", "0px");
        },
        { passive: true }
      );
    });
  }

  root.classList.add("aqua-depth-ready");

  if (coarsePointer) root.classList.add("aqua-depth-touch");
})();
