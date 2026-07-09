    // Adaptive performance mode for mobile
    if (window.innerWidth < 768) {
      document.body.classList.add("lite-mode");
    }

    // Pause heavy animations when hero is out of view
    const heroTop = document.querySelector("#top");
    if (heroTop && "IntersectionObserver" in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.body.classList.remove("is-paused");
          } else {
            document.body.classList.add("is-paused");
          }
        });
      }, { threshold: 0.05 });

      animationObserver.observe(heroTop);
    }

    // year
    const yearEl = document.getElementById('y');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // ===== Scroll-spy: highlight active nav link =====
    (function(){
      const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#'], .mobile-nav-link[href^='#']"));
      if(!navLinks.length) return;

      const sectionIds = [...new Set(navLinks.map(a => a.getAttribute("href").slice(1)))];
      const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

      function setActive(id){
        navLinks.forEach(a => {
          const matches = a.getAttribute("href") === "#" + id;
          a.classList.toggle("is-active", matches);
        });
      }

      if("IntersectionObserver" in window){
        const obs = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if(entry.isIntersecting) setActive(entry.target.id);
          });
        }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
        sections.forEach(s => obs.observe(s));
      }
    })();

    // ===== Scroll-triggered section animations =====
    (function(){
      if (!('IntersectionObserver' in window)) {
        // Fallback: just show everything immediately
        document.querySelectorAll('[data-animate]').forEach(function(el){
          el.classList.add('is-visible');
        });
        return;
      }
      var animateObserver = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animateObserver.unobserve(entry.target); // animate once only
          }
        });
      }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('[data-animate]').forEach(function(el){
        animateObserver.observe(el);
      });
    })();