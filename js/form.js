(function () {
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function getLang() {
    const lang =
      localStorage.getItem("aqua_lang") ||
      document.documentElement.lang ||
      "ar";

    return lang.toLowerCase().startsWith("en") ? "en" : "ar";
  }

  const COPY = {
    ar: {
      sending: "جارٍ إرسال الطلب...",
      success: "تم استلام طلبك بنجاح. سنتواصل معك قريبًا.",
      error: "تعذر إرسال الطلب حاليًا. حاول مرة أخرى أو تواصل معنا عبر واتساب.",
      required: "يرجى تعبئة الاسم وطريقة التواصل والخدمة المطلوبة.",
      cooldown: "تم إرسال طلب قبل قليل. انتظر لحظات ثم حاول مرة أخرى.",
    },
    en: {
      sending: "Sending your request...",
      success: "Your request has been received. We will contact you soon.",
      error:
        "We could not send your request right now. Please try again or contact us on WhatsApp.",
      required:
        "Please fill in your name, contact method, and required service.",
      cooldown:
        "A request was sent recently. Please wait a little and try again.",
    },
  };

  function t(key) {
    const lang = getLang();
    return COPY[lang]?.[key] || COPY.ar[key] || "";
  }

  onReady(function () {
    const formEl = document.getElementById("contactForm");
    if (!formEl) return;

    // New n8n contact flow is handled by js/aquatech-contact-client.js.
    // Keep this legacy Google Sheets handler away from the new form.
    if (formEl.matches("[data-aquatech-contact-form]")) return;

    const statusEl = document.getElementById("formStatus");
    const btnSend = document.getElementById("sendLead");
    const successModal = document.getElementById("successModal");
    const successModalText = document.getElementById("successModalText");
    const successModalClose = document.getElementById("successModalClose");

    const CONFIG = window.AQUA_CONFIG || {};
    const SUBMIT_URL = CONFIG.SHEETS_SCRIPT_URL || "";
    const COOLDOWN_MS = Number(CONFIG.SUBMIT_COOLDOWN_MS || 30000);
    const COOLDOWN_KEY = "aqua_contact_last_submit";

    function showSuccessModal(message) {
      if (!successModal) {
        setStatus(message);
        return;
      }

      if (successModalText && message) {
        successModalText.textContent = message;
      }

      successModal.classList.add("is-open");
      successModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function hideSuccessModal() {
      if (!successModal) return;

      successModal.classList.remove("is-open");
      successModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    successModalClose?.addEventListener("click", hideSuccessModal);

    successModal?.addEventListener("click", function (event) {
      if (event.target === successModal) hideSuccessModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") hideSuccessModal();
    });

    function valueOf(id) {
      return document.getElementById(id)?.value?.trim() || "";
    }

    function setStatus(text) {
      if (statusEl) statusEl.textContent = text || "";
    }

    function setBusy(isBusy) {
      if (!btnSend) return;

      btnSend.disabled = !!isBusy;
      btnSend.classList.toggle("opacity-60", !!isBusy);
      btnSend.classList.toggle("cursor-not-allowed", !!isBusy);
    }

    function setFieldError(id, hasError) {
      const el = document.getElementById(id);
      if (!el) return;

      el.classList.toggle("ring-2", !!hasError);
      el.classList.toggle("ring-red-500/40", !!hasError);
      el.classList.toggle("border-red-500/40", !!hasError);
    }

    function setServiceError(hasError) {
      const root = document.querySelector('[data-aqua-select="service"]');
      if (!root) return;

      const trigger = root.querySelector(".aqua-select-trigger");
      const error = root.querySelector(".aqua-select-error");

      trigger?.classList.toggle("ring-2", !!hasError);
      trigger?.classList.toggle("ring-red-500/40", !!hasError);
      trigger?.classList.toggle("border-red-500/40", !!hasError);
      error?.classList.toggle("is-visible", !!hasError);
    }

    function getFormData() {
      const email = valueOf("fEmail");
      const countryCode = valueOf("fCountryCode") || "+962";
      const phone = valueOf("fPhone");
      const cleanPhone = phone.replace(/\D/g, "").replace(/^0+/, "");
      const fullPhone = cleanPhone
        ? `${countryCode.replace("+", "")}${cleanPhone}`
        : "";

      const fullPhoneEl = document.getElementById("fFullPhone");
      if (fullPhoneEl) fullPhoneEl.value = fullPhone;

      return {
        name: valueOf("fName"),
        email,
        country_code: countryCode,
        phone,
        full_phone: fullPhone,
        service: valueOf("serviceInput"),
        budget: valueOf("fBudget"),
        timeline: valueOf("fTimeline"),
        details: valueOf("fDetails"),
        website: valueOf("fWebsite"),
      };
    }

    function validate(data) {
      ["fName", "fEmail", "fPhone", "fDetails"].forEach((id) =>
        setFieldError(id, false),
      );
      setServiceError(false);

      const hasName = data.name.length >= 2;
      const hasContact = Boolean(data.email || data.full_phone);
      const hasService = Boolean(data.service);

      if (!hasName) setFieldError("fName", true);

      if (!hasContact) {
        setFieldError("fEmail", true);
        setFieldError("fPhone", true);
      }

      if (!hasService) {
        setServiceError(true);
      }

      return hasName && hasContact && hasService;
    }

    function buildPayload(data) {
      return {
        ...data,
        contact: data.email || data.full_phone,
        lang: getLang(),
        page: window.location.href,
        referrer: document.referrer || "",
        ua: navigator.userAgent || "",
        ts: new Date().toISOString(),
        source: "aquatech_website_contact_form",
      };
    }

    function canSubmitNow() {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) || 0);
      return Date.now() - last > COOLDOWN_MS;
    }

    function markSubmittedNow() {
      localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    }

    function resetCustomSelects() {
      document.querySelectorAll(".aqua-custom-select").forEach((root) => {
        root.classList.remove("is-open");

        const input = root.querySelector("input[type='hidden']");
        const selected = root.querySelectorAll(
          ".aqua-select-option.is-selected",
        );

        selected.forEach((item) => item.classList.remove("is-selected"));
        if (input) input.value = "";

        const type = root.getAttribute("data-aqua-select");
        const text =
          root.querySelector(".aqua-select-text") ||
          root.querySelector("#serviceSelectText");

        if (!text) return;

        if (type === "service") {
          text.setAttribute("data-i18n", "form.service.placeholder");
          text.textContent =
            getLang() === "ar" ? "اختر الخدمة" : "Choose service";
        }

        if (type === "budget") {
          text.setAttribute("data-i18n", "form.budget.placeholder");
          text.textContent =
            getLang() === "ar" ? "اختر الميزانية" : "Choose budget";
        }

        if (type === "timeline") {
          text.setAttribute("data-i18n", "form.timeline.placeholder");
          text.textContent =
            getLang() === "ar" ? "اختر الموعد" : "Choose timeline";
        }
      });

      window.applyAquaLanguage?.(getLang());
    }

    formEl.addEventListener("submit", async function (event) {
      event.preventDefault();

      const data = getFormData();

      if (data.website) return;

      if (!validate(data)) {
        setStatus(t("required"));
        return;
      }

      if (!canSubmitNow()) {
        setStatus(t("cooldown"));
        return;
      }

      if (!SUBMIT_URL) {
        setStatus(t("error"));
        return;
      }

      setBusy(true);
      setStatus(t("sending"));

      try {
        const payload = buildPayload(data);

        await fetch(SUBMIT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain;charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        markSubmittedNow();
        formEl.reset();
        resetCustomSelects();
        setStatus("");
        showSuccessModal(t("success"));

        window.gtag?.("event", "generate_lead", {
          event_category: "contact",
          event_label: data.service || "unknown",
        });
      } catch (error) {
        console.error("Aqua contact form error:", error);
        setStatus(t("error"));
      } finally {
        setBusy(false);
      }
    });
  });
})();
