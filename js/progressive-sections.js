document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("aq-js-ready");

  const animatedSections = document.querySelectorAll("[data-animate]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "600px 0px",
        threshold: 0.01,
      }
    );

    animatedSections.forEach((section) => observer.observe(section));
  } else {
    animatedSections.forEach((section) => {
      section.classList.add("is-visible");
    });
  }

  let scrollTimer;

  window.addEventListener(
    "scroll",
    () => {
      document.body.classList.add("is-scrolling");

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 180);
    },
    { passive: true }
  );
});