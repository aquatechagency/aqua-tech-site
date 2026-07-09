    // ====== CONFIG — pulled from global AQUA_CONFIG set in <head> ======
    const WHATSAPP_NUMBER = (window.AQUA_CONFIG || {}).WHATSAPP_NUMBER || "962780932199";
    const CONTACT_EMAIL   = (window.AQUA_CONFIG || {}).CONTACT_EMAIL   || "info.aquatech.jo@gmail.com";
    const INSTAGRAM_URL = "https://www.instagram.com/aquatech.jo/";
    const FACEBOOK_URL = "https://www.facebook.com/share/1Bb7CYSMAQ/";
    const LINKEDIN_URL = "https://www.linkedin.com/company/aqua-teach/";
    const GITHUB_URL = "https://github.com/aquatechjo";

    function updateDynamicContactLinks(){
      const waUrl = AquaUtils.getWhatsAppUrl();
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
     AquaUtils.setHref("socialWA", AquaUtils.getWhatsAppUrl());
     AquaUtils.setHref("socialEmail", `mailto:${CONTACT_EMAIL}`);
     AquaUtils.setHref("socialIG", INSTAGRAM_URL);
     AquaUtils.setHref("socialFB", FACEBOOK_URL);
     AquaUtils.setHref("socialLI", LINKEDIN_URL);
     AquaUtils.setHref("socialGH", GITHUB_URL);

    // ===== Service CTA: scroll to contact + auto-fill service =====
    function scrollToContactWithOffset(){
      const contact = document.getElementById("contact");
      if(!contact) return;

      const header = document.querySelector("header");
      const offset = (header ? header.offsetHeight : 0) + 16;
      const top = contact.getBoundingClientRect().top + window.pageYOffset - offset;
         window.scrollTo({
          top,
             behavior: window.innerWidth < 768 ? "auto" : "smooth"
          });
    }

    // Pause animations when the tab is hidden (saves CPU/GPU)
    document.addEventListener("visibilitychange", ()=>{
      document.body.classList.toggle("is-paused", document.hidden);
    });
    // init
