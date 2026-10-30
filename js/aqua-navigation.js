(() => {
  "use strict";

  const header = document.querySelector("body > header");
  const headerBar = header?.querySelector("nav");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const navLinks = Array.from(
    document.querySelectorAll("header [data-aqua-nav][href^='#']"),
  );
  const sectionIds = Array.from(
    new Set(navLinks.map((link) => link.getAttribute("href")?.slice(1))),
  ).filter(Boolean);
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const getHeaderOffset = () => {
    const barHeight = headerBar?.getBoundingClientRect().height || 80;
    return Math.ceil(barHeight + 16);
  };

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  /* Offsets are measured by the shared scroll scheduler (js/aqua-scroll.js)
     when the page size changes, not on every scroll frame. */
  let headerOffset = 80 + 16;
  let sectionTops = [];
  /* --aqua-header-offset (scroll-padding) is written on first load and on
     resize, as before; the live offset below also follows the bar shrinking
     once the page is scrolled, which the active-section marker depends on. */
  let writeOffsetVar = true;
  let activeId = null;
  let scrolled = null;

  const measureNavigation = () => {
    headerOffset = getHeaderOffset();
    sectionTops = sections.map((section) => section.offsetTop);
  };

  const updateNavigationState = (metrics) => {
    if (writeOffsetVar) {
      writeOffsetVar = false;
      document.documentElement.style.setProperty(
        "--aqua-header-offset",
        `${headerOffset}px`,
      );
    }

    const marker = metrics.y + headerOffset + metrics.vh * 0.2;
    let nextId = "";

    sections.forEach((section, index) => {
      if (sectionTops[index] <= marker) nextId = section.id;
    });

    const documentBottom = metrics.y + metrics.vh >= metrics.docH - 4;

    if (documentBottom && sections.length) {
      nextId = sections[sections.length - 1].id;
    }

    if (nextId !== activeId) {
      activeId = nextId;
      setActiveSection(nextId);
    }

    const nextScrolled = metrics.y > 12;

    if (nextScrolled !== scrolled) {
      scrolled = nextScrolled;
      header?.classList.toggle("is-aqua-header-scrolled", nextScrolled);

      /* The bar changes size with this class (and while it transitions), so
         the cached header offset is measured again once it has settled. */
      window.AquaScroll.requestMeasure();
      window.setTimeout(window.AquaScroll.requestMeasure, 450);
    }
  };

  /* Sections below the first screen are skipped by layout until they are near
     the viewport (css/aqua-perf.css), so a target far down is first computed
     from estimated heights. Once the scroll ends the sections along the way
     have been laid out; land exactly on the target then. */
  const settleOnTarget = (target) => {
    let settled = false;

    const settle = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("scrollend", settle);

      const delta = target.getBoundingClientRect().top - getHeaderOffset();
      if (Math.abs(delta) > 2) window.scrollBy({ top: delta, behavior: "auto" });
    };

    if ("onscrollend" in window) {
      window.addEventListener("scrollend", settle);
      /* No scroll happened (already there): drop the listener. */
      window.setTimeout(() => {
        settled = true;
        window.removeEventListener("scrollend", settle);
      }, 2500);
    } else {
      window.setTimeout(settle, 1200);
    }
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();

      const targetTop =
        href === "#top"
          ? 0
          : Math.max(
              target.getBoundingClientRect().top +
                window.scrollY -
                getHeaderOffset(),
              0,
            );

      window.scrollTo({
        top: targetTop,
        behavior: reducedMotion ? "auto" : "smooth",
      });

      if (href !== "#top") settleOnTarget(target);
    });
  });

  window.addEventListener(
    "resize",
    () => {
      writeOffsetVar = true;
    },
    { passive: true },
  );

  window.AquaScroll.add({
    measure: measureNavigation,
    update: updateNavigationState,
  });
})();
