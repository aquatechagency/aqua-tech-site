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

  function valueOf(id) {
    return document.getElementById(id)?.value?.trim() || "";
  }

  function setStatus(message, type) {
    const el =
      document.querySelector("[data-contact-status]") ||
      document.getElementById("formStatus");

    if (!el) return;

    el.textContent = message || "";
    el.classList.remove("text-red-400", "text-primary", "text-on-surface-variant");

    if (type === "error") {
      el.classList.add("text-red-400");
    } else if (type === "success") {
      el.classList.add("text-primary");
    } else {
      el.classList.add("text-on-surface-variant");
    }
  }

  function setBusy(isBusy) {
    const btn = document.getElementById("sendLead");
    if (!btn) return;

    btn.disabled = !!isBusy;
    btn.classList.toggle("opacity-70", !!isBusy);
    btn.classList.toggle("cursor-not-allowed", !!isBusy);
  }

  function buildPhone() {
    const countryCode = valueOf("fCountryCode") || "+962";
    const localPhone = valueOf("fPhone");

    if (!localPhone) return "";
    if (localPhone.startsWith("+")) return localPhone;

    const cleanLocal = localPhone.replace(/[^\d]/g, "").replace(/^0+/, "");
    return `${countryCode}${cleanLocal}`;
  }

  function showWhatsAppBox(url, requestId) {
    const box = document.getElementById("proposalWhatsAppBox");
    const link = document.getElementById("proposalWhatsAppLink");

    if (!box || !link || !url) {
      console.warn("[AquaTech n8n] WhatsApp box/link missing or URL empty", {
        box,
        link,
        url,
      });
      return;
    }

    link.href = url;
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");

    if (requestId) {
      link.setAttribute("data-request-id", requestId);
    }

    box.classList.remove("hidden");
    box.style.display = "";

    setTimeout(() => {
      box.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 150);
  }

  onReady(function () {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.setAttribute("data-aquatech-contact-form", "");

    if (form.dataset.n8nBound === "true") return;
    form.dataset.n8nBound = "true";

    form.addEventListener(
      "submit",
      async function (event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        const lang = getLang();
        const box = document.getElementById("proposalWhatsAppBox");
        const link = document.getElementById("proposalWhatsAppLink");

        if (box) box.classList.add("hidden");
        if (link) link.href = "#";

        const honeypot = valueOf("fWebsite");
        if (honeypot) {
          setStatus(lang === "ar" ? "تم استلام طلبك بنجاح." : "Request received.", "success");
          return;
        }

        const fullName = valueOf("fName");
        const email = valueOf("fEmail");
        const phone = buildPhone();
        const service = valueOf("serviceInput");
        const budget = valueOf("fBudget");
        const timeline = valueOf("fTimeline");
        const details = valueOf("fDetails");
        const companyName = valueOf("fCompanyName");
        const companyActivity = valueOf("fCompanyActivity");

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
          source: "website",
        };

        try {
          setBusy(true);
          setStatus(lang === "ar" ? "جاري إرسال الطلب..." : "Sending request...", "neutral");

          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          const text = await response.text();

          let data = {};
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            throw new Error("Invalid response from contact API.");
          }

          console.log("[AquaTech n8n] /api/contact response:", data);

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

          if (data.whatsapp_url) {
            showWhatsAppBox(data.whatsapp_url, data.request_id || data.lead_id || "");
          } else {
            console.warn("[AquaTech n8n] No whatsapp_url returned:", data);
          }

          window.gtag?.("event", "contact_form_submit", {
            event_category: "lead",
            event_label: "website_intake",
            request_id: data.request_id || data.lead_id || "",
          });
        } catch (error) {
          console.error("[AquaTech n8n] Contact form error:", error);
          setStatus(
            error.message ||
              (lang === "ar"
                ? "حدث خطأ أثناء إرسال الطلب."
                : "An error occurred while sending the request."),
            "error"
          );
        } finally {
          setBusy(false);
        }
      },
      true
    );
  });
})();