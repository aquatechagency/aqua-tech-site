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

  setTimeout(()=>{
    try{
      name?.focus({ preventScroll: true });
    } catch(e){
      name?.focus();
    }
  }, 350);
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
