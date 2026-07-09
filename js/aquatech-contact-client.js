(function () {
  const form = document.querySelector("[data-aquatech-contact-form]");
  if (!form) return;

  if (form.dataset.aquatechBound === "true") return;
  form.dataset.aquatechBound = "true";

  const statusEl =
    document.querySelector("[data-contact-status]") ||
    document.getElementById("formStatus");

  const sendButton = document.getElementById("sendLead");
  const box = document.getElementById("proposalWhatsAppBox");
  const whatsappLink = document.getElementById("proposalWhatsAppLink");

  function getValue(id) {
    return String(document.getElementById(id)?.value || "").trim();
  }

  function setStatus(message, type) {
    if (!statusEl) return;

    statusEl.textContent = message || "";
    statusEl.classList.remove(
      "text-red-400",
      "text-primary",
      "text-on-surface-variant"
    );

    if (type === "error") {
      statusEl.classList.add("text-red-400");
    } else if (type === "success") {
      statusEl.classList.add("text-primary");
    } else {
      statusEl.classList.add("text-on-surface-variant");
    }
  }

  function getLang() {
    const htmlLang = document.documentElement.lang || "";
    if (htmlLang.toLowerCase().startsWith("ar")) return "ar";
    if (document.documentElement.dir === "rtl") return "ar";
    return "en";
  }

  function buildPhone() {
    const countryCode = getValue("fCountryCode") || "+962";
    const localPhone = getValue("fPhone");

    if (!localPhone) return "";
    if (localPhone.startsWith("+")) return localPhone;

    const cleanLocal = localPhone.replace(/[^\d]/g, "").replace(/^0+/, "");
    return `${countryCode}${cleanLocal}`;
  }

  form.addEventListener(
    "submit",
    async function (event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      if (box) box.classList.add("hidden");
      if (whatsappLink) whatsappLink.href = "#";

      const lang = getLang();
      const honeypot = getValue("fWebsite");

      if (honeypot) {
        setStatus(lang === "ar" ? "تم استلام طلبك بنجاح." : "Request received.", "success");
        return;
      }

      const fullName = getValue("fName");
      const email = getValue("fEmail");
      const phone = buildPhone();
      const service = getValue("serviceInput");
      const budget = getValue("fBudget");
      const timeline = getValue("fTimeline");
      const details = getValue("fDetails");
      const companyName = getValue("fCompanyName");
      const companyActivity = getValue("fCompanyActivity");

      if (!fullName || fullName.length < 2) {
        setStatus(lang === "ar" ? "اكتب الاسم بشكل صحيح." : "Please enter a valid name.", "error");
        return;
      }

      if (!service) {
        setStatus(lang === "ar" ? "اختر الخدمة المطلوبة." : "Please select a service.", "error");
        return;
      }

      if (!phone && !email) {
        setStatus(
          lang === "ar"
            ? "أدخل رقم الواتساب أو البريد الإلكتروني."
            : "Please enter WhatsApp number or email.",
          "error"
        );
        return;
      }

      const payload = {
        full_name: fullName,
        email,
        phone,
        company_name: companyName,
        company_activity: companyActivity,
        service_type: service,
        budget,
        timeline,
        message: details,
        page_url: window.location.href,
        lang,
        website: honeypot,
      };

      try {
        if (sendButton) {
          sendButton.disabled = true;
          sendButton.classList.add("opacity-70", "cursor-not-allowed");
        }

        setStatus(lang === "ar" ? "جاري إرسال الطلب..." : "Sending request...", "neutral");

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.ok) {
          throw new Error(
            data.message ||
              (lang === "ar"
                ? "تعذر إرسال الطلب حالياً."
                : "Could not send the request right now.")
          );
        }

        setStatus(
          data.message ||
            (lang === "ar"
              ? "تم استلام طلبك بنجاح."
              : "Your request has been received."),
          "success"
        );

        if (data.whatsapp_url && whatsappLink && box) {
          whatsappLink.href = data.whatsapp_url;
          box.classList.remove("hidden");
        }

        if (typeof gtag === "function") {
          gtag("event", "contact_form_submit", {
            event_category: "lead",
            event_label: "website_intake",
            request_id: data.request_id || data.lead_id || "",
          });
        }
      } catch (error) {
        setStatus(
          error.message ||
            (lang === "ar"
              ? "حدث خطأ أثناء إرسال الطلب."
              : "An error occurred while sending the request."),
          "error"
        );
      } finally {
        if (sendButton) {
          sendButton.disabled = false;
          sendButton.classList.remove("opacity-70", "cursor-not-allowed");
        }
      }
    },
    true
  );

  if (whatsappLink) {
    whatsappLink.addEventListener("click", function () {
      if (typeof gtag === "function") {
        gtag("event", "instant_proposal_whatsapp_click", {
          event_category: "lead",
          event_label: "proposal_whatsapp",
        });
      }
    });
  }
})();