(function () {
  "use strict";

  const hero = document.querySelector(".aqua-signature-hero");
  if (!hero) return;

  const root = document.documentElement;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const runtimeWindow = hero.querySelector(".aqua-runtime-window");
  const flowTracer = hero.querySelector(".aqua-flow-tracer");
  const flowTracerMotion = hero.querySelector(".aqua-flow-tracer-motion");

  const showTerminalImmediately = () => {
    hero
      .querySelectorAll(
        ".aqua-runtime-command, .aqua-flow-stack li, .aqua-runtime-status",
      )
      .forEach((element) => element.classList.add("is-terminal-visible"));

    hero
      .querySelectorAll(".aqua-flow-node")
      .forEach((node) => node.classList.add("is-flow-node-visible"));
  };

  if (reduceMotion) {
    showTerminalImmediately();
    return;
  }

  root.classList.add("aqua-hero-motion");

  /* The draw-in needs each path's length, and getTotalLength() forces a full
     style + layout pass. Read here, during parse, it pulled the page's first
     layout into this script (~500ms on a throttled phone). Phones hide the
     flow map (aqua-techflux.css, max-width: 767px), so nothing is measured
     there. Elsewhere each path is hidden with a zero-length dash now (a
     write, no read) and measured in the first frame, whose layout happens
     anyway; the dash values are the same as before. */
  const flowMapHidden = window.matchMedia("(max-width: 767px)").matches;
  const flowPaths = flowMapHidden
    ? []
    : Array.from(hero.querySelectorAll(".aqua-hero-flow-path")).filter(
        (path) => typeof path.getTotalLength === "function",
      );

  flowPaths.forEach((path) => {
    path.style.strokeDasharray = "0 100000";
  });

  let flowPathsMeasured = false;

  const measureFlowPaths = () => {
    if (flowPathsMeasured) return;
    flowPathsMeasured = true;

    const lengths = flowPaths.map((path) => path.getTotalLength());

    flowPaths.forEach((path, index) => {
      path.style.strokeDasharray = `${lengths[index]}`;
      path.style.strokeDashoffset = `${lengths[index]}`;
    });
  };

  let heroEntered = false;

  const enterHero = () => {
    if (heroEntered) return;
    heroEntered = true;

    /* Normally done in the first frame; the setTimeout fallback below can
       get here first in a background tab. */
    measureFlowPaths();

    root.classList.add("is-hero-entered");

    flowPaths.forEach((path, index) => {
      window.setTimeout(() => {
        path.style.transition = `stroke-dashoffset ${
          index === 0 ? 1500 : 1900
        }ms cubic-bezier(0.22, 1, 0.36, 1)`;
        path.style.strokeDashoffset = "0";
      }, index === 0 ? 180 : 420);
    });

    hero.querySelectorAll(".aqua-flow-node").forEach((node, index) => {
      window.setTimeout(
        () => node.classList.add("is-flow-node-visible"),
        1160 + index * 260,
      );
    });

    const command = hero.querySelector(".aqua-runtime-command");
    const steps = Array.from(hero.querySelectorAll(".aqua-flow-stack li"));
    const status = hero.querySelector(".aqua-runtime-status");

    window.setTimeout(
      () => command?.classList.add("is-terminal-visible"),
      620,
    );

    steps.forEach((step, index) => {
      window.setTimeout(
        () => {
          step.classList.add("is-terminal-visible", "is-flow-active");

          window.setTimeout(
            () => step.classList.remove("is-flow-active"),
            520,
          );
        },
        850 + index * 210,
      );
    });

    window.setTimeout(
      () => {
        status?.classList.add("is-terminal-visible", "is-flow-online");
        flowTracer?.classList.add("is-flow-tracer-online");

        if (typeof flowTracerMotion?.beginElement === "function") {
          try {
            flowTracerMotion.beginElement();
          } catch (_error) {
            flowTracer?.classList.remove("is-flow-tracer-online");
          }
        }

        hero.dataset.motionState = "online";
      },
      850 + steps.length * 210 + 170,
    );
  };

  window.requestAnimationFrame(() => {
    measureFlowPaths();
    window.requestAnimationFrame(enterHero);
  });

  /* requestAnimationFrame is frozen — not merely throttled — while a tab is
     hidden, so a page opened in a background tab would hold the headline at
     opacity 0 until it is focused. setTimeout still fires when hidden, so it
     backs the reveal up; enterHero is idempotent, whichever wins. */
  window.setTimeout(enterHero, 1200);

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (supportsFinePointer) {
    let frameId = 0;
    let pendingEvent = null;

    const applyPointerMotion = () => {
      frameId = 0;
      if (!pendingEvent) return;

      const rect = hero.getBoundingClientRect();
      hero.classList.add("is-pointer-active");
      const normalizedX = Math.max(
        -1,
        Math.min(1, ((pendingEvent.clientX - rect.left) / rect.width - 0.5) * 2),
      );
      const normalizedY = Math.max(
        -1,
        Math.min(1, ((pendingEvent.clientY - rect.top) / rect.height - 0.5) * 2),
      );

      hero.style.setProperty("--aqua-shift-x", `${normalizedX * 13}px`);
      hero.style.setProperty("--aqua-shift-y", `${normalizedY * 9}px`);
      hero.style.setProperty(
        "--aqua-shift-x-soft",
        `${normalizedX * -5}px`,
      );
      hero.style.setProperty(
        "--aqua-shift-y-soft",
        `${normalizedY * -4}px`,
      );
      hero.style.setProperty(
        "--aqua-shift-x-inverse",
        `${normalizedX * -9.4}px`,
      );
      hero.style.setProperty(
        "--aqua-shift-y-inverse",
        `${normalizedY * -6.5}px`,
      );
      hero.style.setProperty(
        "--aqua-runtime-rotate-x",
        `${normalizedY * -1.3}deg`,
      );
      hero.style.setProperty(
        "--aqua-runtime-rotate-y",
        `${normalizedX * 1.7}deg`,
      );
      hero.style.setProperty(
        "--aqua-pointer-x",
        `${pendingEvent.clientX - rect.left}px`,
      );
      hero.style.setProperty(
        "--aqua-pointer-y",
        `${pendingEvent.clientY - rect.top}px`,
      );

      if (runtimeWindow) {
        const runtimeRect = runtimeWindow.getBoundingClientRect();
        const runtimeX = Math.max(
          0,
          Math.min(runtimeRect.width, pendingEvent.clientX - runtimeRect.left),
        );
        const runtimeY = Math.max(
          0,
          Math.min(runtimeRect.height, pendingEvent.clientY - runtimeRect.top),
        );

        hero.style.setProperty("--aqua-runtime-pointer-x", `${runtimeX}px`);
        hero.style.setProperty("--aqua-runtime-pointer-y", `${runtimeY}px`);
      }
    };

    hero.addEventListener(
      "pointermove",
      (event) => {
        pendingEvent = event;
        if (frameId) return;
        frameId = window.requestAnimationFrame(applyPointerMotion);
      },
      { passive: true },
    );

    hero.addEventListener("pointerleave", () => {
      pendingEvent = null;
      hero.classList.remove("is-pointer-active");
      hero.style.setProperty("--aqua-shift-x", "0px");
      hero.style.setProperty("--aqua-shift-y", "0px");
      hero.style.setProperty("--aqua-shift-x-soft", "0px");
      hero.style.setProperty("--aqua-shift-y-soft", "0px");
      hero.style.setProperty("--aqua-shift-x-inverse", "0px");
      hero.style.setProperty("--aqua-shift-y-inverse", "0px");
      hero.style.setProperty("--aqua-runtime-rotate-x", "0deg");
      hero.style.setProperty("--aqua-runtime-rotate-y", "0deg");
      hero.style.setProperty("--aqua-pointer-x", "50%");
      hero.style.setProperty("--aqua-pointer-y", "50%");
      hero.style.setProperty("--aqua-runtime-pointer-x", "50%");
      hero.style.setProperty("--aqua-runtime-pointer-y", "50%");
    });
  }

  hero.querySelectorAll(".aqua-hero-btn").forEach((button) => {
    button.addEventListener(
      "pointermove",
      (event) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty(
          "--aqua-btn-x",
          `${event.clientX - rect.left}px`,
        );
        button.style.setProperty(
          "--aqua-btn-y",
          `${event.clientY - rect.top}px`,
        );
      },
      { passive: true },
    );

    button.addEventListener("pointerleave", () => {
      button.style.setProperty("--aqua-btn-x", "50%");
      button.style.setProperty("--aqua-btn-y", "50%");
    });
  });
})();
