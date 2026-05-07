    // ====== CONFIG — pulled from global AQUA_CONFIG set in <head> ======
    const WHATSAPP_NUMBER = (window.AQUA_CONFIG || {}).WHATSAPP_NUMBER || "962780932199";
    const CONTACT_EMAIL   = (window.AQUA_CONFIG || {}).CONTACT_EMAIL   || "info.aquatech.jo@gmail.com";
    const INSTAGRAM_URL = "https://www.instagram.com/aquatech.jo/";
    const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61564549784728";
    const LINKEDIN_URL = "https://www.linkedin.com/company/aqua-teach/";
    const GITHUB_URL = "https://github.com/aquatechjo";

    



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
    function getWhatsAppUrl(){
      const text = currentLang === "ar"
        ? "مرحبا، أريد الاستفسار عن خدمات Aqua.Tech"
        : "Hello, I want to ask about Aqua.Tech services";
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    }

    function updateDynamicContactLinks(){
      const waUrl = getWhatsAppUrl();
      [
        "waLinkHeader",
        "waLinkContact",
        "waLinkMobile",
        "socialWA",
      ].forEach((id)=>{
        const el = document.getElementById(id);
        if(el) el.href = waUrl;
      });

      document.querySelectorAll('a[href^="https://wa.me/"]').forEach((el)=>{
        if(!el.id || ["waLinkHeader", "waLinkContact", "waLinkMobile", "socialWA"].includes(el.id)){
          el.href = waUrl;
        }
      });

      const emailLink = document.getElementById("emailLink");
      if(emailLink) emailLink.href = `mailto:${CONTACT_EMAIL}`;
    }

    updateDynamicContactLinks();

    // Social links
    const setHref = (id, url) => {
      const el = document.getElementById(id);
      if(el) el.href = url;
    };

    setHref("socialWA", getWhatsAppUrl());
    setHref("socialEmail", `mailto:${CONTACT_EMAIL}`);
    setHref("socialIG", INSTAGRAM_URL);
    setHref("socialFB", FACEBOOK_URL);
    setHref("socialLI", LINKEDIN_URL);
    setHref("socialGH", GITHUB_URL);


    
    // ===== Service CTA: scroll to contact + auto-fill service =====
    function scrollToContactWithOffset(){
      const contact = document.getElementById("contact");
      if(!contact) return;

      const header = document.querySelector("header");
      const offset = (header ? header.offsetHeight : 0) + 16;
      const top = contact.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "auto" });
    }

    // Pause animations when the tab is hidden (saves CPU/GPU)
    document.addEventListener("visibilitychange", ()=>{
      document.body.classList.toggle("is-paused", document.hidden);
    });


// init
