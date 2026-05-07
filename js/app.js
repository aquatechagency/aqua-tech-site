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

    function prefillService(serviceKey){
      const select = document.getElementById("fService");
      const details = document.getElementById("fDetails");
      const name = document.getElementById("fName");

      if(select){
        const option = Array.from(select.options).find(opt => opt.value === serviceKey);
        if(option){
          select.value = serviceKey;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }

      if(details && select){
        const label = (select.options[select.selectedIndex]?.textContent || "").trim();
        const prefix = (currentLang === "ar") ? "أرغب بخدمة:" : "I'm interested in:";
        const line = `${prefix} ${label}`.trim();
        const existing = (details.value || "").trim();

        if(!existing){
          details.value = line + "\n";
        } else if(existing.startsWith(prefix)){
          const parts = existing.split("\n");
          parts[0] = line;
          details.value = parts.join("\n");
        } else {
          details.value = line + "\n" + existing;
        }
      }

      setTimeout(()=>{ try{ name?.focus({ preventScroll: true }); } catch(e){ name?.focus(); } }, 350);
    }

    function bindServiceCtas(){
      document.querySelectorAll(".js-service-cta").forEach((a)=>{
        a.addEventListener("click", (e)=>{
          e.preventDefault();
          const service = a.getAttribute("data-service") || "";
          scrollToContactWithOffset();
          prefillService(service);
          try { history.replaceState(null, "", "#contact"); } catch(e) {}
        });
      });
    }

    bindServiceCtas();

// Smart form helper for Social Media Management
function updateDetailsPlaceholderByService(){
  const serviceSelect = document.getElementById("fService");
  const detailsField = document.getElementById("fDetails");
  if(!serviceSelect || !detailsField) return;

  if(serviceSelect.value === "social_media_management"){
    detailsField.placeholder = currentLang === "ar"
      ? "اكتب لنا عدد الحسابات، نوع النشاط، هل لديك محتوى جاهز، وكم منشور/ريلز تحتاج شهريًا."
      : "Tell us how many accounts you have, your business type, if content is ready, and how many posts/reels you need monthly.";
  } else {
    const dict = I18N[currentLang] || I18N.ar;
    detailsField.placeholder = dict["form.detailsPh"] || "";
  }
}

document.getElementById("fService")?.addEventListener("change", updateDetailsPlaceholderByService);

// ===== Form send (Google Sheets only) =====
    const formEl = document.getElementById("contactForm");
    const statusEl = document.getElementById("formStatus");
    const btnSend = document.getElementById("sendLead");

    const successModal = document.getElementById("successModal");
const successModalText = document.getElementById("successModalText");
const successModalClose = document.getElementById("successModalClose");

function showSuccessModal(message){
  if(!successModal) return;
  if(successModalText && message) successModalText.textContent = message;
  successModal.classList.add("is-open");
  successModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function hideSuccessModal(){
  if(!successModal) return;
  successModal.classList.remove("is-open");
  successModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if(successModalClose){
  successModalClose.addEventListener("click", hideSuccessModal);
}

if(successModal){
  successModal.addEventListener("click", function(e){
    if(e.target === successModal) hideSuccessModal();
  });
}

document.addEventListener("keydown", function(e){
  if(e.key === "Escape") hideSuccessModal();
});

function getFormData() {
  const email = document.getElementById("fEmail")?.value?.trim() || "";
  const countryCode = document.getElementById("fCountryCode")?.value?.trim() || "+962";
  const phone = document.getElementById("fPhone")?.value?.trim() || "";
  const cleanPhone = phone.replace(/\D/g, "").replace(/^0+/, "");
  const fullPhone = cleanPhone ? `${countryCode.replace("+", "")}${cleanPhone}` : "";
  const fullPhoneEl = document.getElementById("fFullPhone");
  if(fullPhoneEl) fullPhoneEl.value = fullPhone;

  return {
    name: document.getElementById("fName")?.value?.trim() || "",
    email,
    country_code: countryCode,
    phone,
    full_phone: fullPhone,
    service: document.getElementById("fService")?.value?.trim() || "",
    budget: document.getElementById("fBudget")?.value?.trim() || "",
    timeline: document.getElementById("fTimeline")?.value?.trim() || "",
    details: document.getElementById("fDetails")?.value?.trim() || ""
  };
}

    function getLeadPayload(){
      const d = getFormData();
      const website = document.getElementById("fWebsite")?.value?.trim() || "";
      return {
        name: d.name,
        email: d.email,
        country_code: d.country_code,
        phone: d.phone,
        full_phone: d.full_phone,
        contact: d.email || d.full_phone,
        service: d.service,
        budget: d.budget,
        timeline: d.timeline,
        details: d.details,
        website,          // honeypot (should stay empty)
        lang: currentLang,
        page: location.href,
        referrer: document.referrer || "",
        ua: navigator.userAgent || "",
        ts: new Date().toISOString()
      };
    }

    function buildMessage(lang, data){
      const m = (I18N[lang] || I18N.ar).msg;
      return `${m.name}: ${data.name}
${m.contact}: ${data.email || data.full_phone || "-"}
${m.service}: ${data.service || "-"}
${m.budget}: ${data.budget || "-"}
${m.timeline}: ${data.timeline || "-"}
${m.details}:
${data.details || "-"}

— Aqua.Tech`;
    }

    function setStatus(text){
      if(!statusEl) return;
      statusEl.textContent = text;
    }

    function setBusy(on){
      [btnSend].forEach(b=>{
        if(!b) return;
        b.disabled = !!on;
        b.classList.toggle("opacity-60", !!on);
        b.classList.toggle("cursor-not-allowed", !!on);
      });
    }

    function setFieldError(id, on){
      const el = document.getElementById(id);
      if(!el) return;
      el.classList.toggle("ring-2", on);
      el.classList.toggle("ring-red-500/40", on);
      el.classList.toggle("border-red-500/40", on);
    }

    function validate(data){
      // reset
      ["fName","fEmail","fPhone","fDetails"].forEach(id => setFieldError(id,false));

      const hasName = !!data.name;
      const hasDetails = (data.details || "").trim().length >= 10; // تفاصيل مفهومة
      const hasEmail = !!data.email;
      const hasPhone = !!data.full_phone;
      const hasContact = hasEmail || hasPhone;

      if(!hasName) setFieldError("fName", true);
      if(!hasContact){
        setFieldError("fEmail", true);
        setFieldError("fPhone", true);
      }
      if(!hasDetails && !hasContact){
        setFieldError("fDetails", true);
      }

      return hasName && hasContact;
    }
    // Pause animations when the tab is hidden (saves CPU/GPU)
    document.addEventListener("visibilitychange", ()=>{
      document.body.classList.toggle("is-paused", document.hidden);
    });


// init
