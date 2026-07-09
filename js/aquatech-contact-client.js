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
    el.classList.remove(
      "text-red-400",
      "text-primary",
      "text-on-surface-variant",
    );

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
    if (!url) {
      console.warn("[AquaTech n8n] WhatsApp URL is empty");
      return;
    }

    let box = document.getElementById("proposalWhatsAppBox");
    let link = document.getElementById("proposalWhatsAppLink");

    const statusEl =
      document.querySelector("[data-contact-status]") ||
      document.getElementById("formStatus");

    // If the box is missing from HTML, create it dynamically.
    if (!box) {
      box = document.createElement("div");
      box.id = "proposalWhatsAppBox";
      box.className =
        "mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4";

      const message = document.createElement("p");
      message.className = "text-sm text-on-surface-variant mb-3";
      message.textContent =
        getLang() === "ar"
          ? "تم تجهيز رابط البروبوزل الأولي. اضغط الزر التالي لفتحه على واتساب وإرسال رقم الطلب."
          : "Your instant proposal link is ready. Click the WhatsApp button to send your request ID and start the conversation.";

      link = document.createElement("a");
      link.id = "proposalWhatsAppLink";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-on-primary no-underline hover:scale-[.99] transition-all";
      link.textContent =
        getLang() === "ar"
          ? "استلام البروبوزل على واتساب"
          : "Receive proposal on WhatsApp";

      box.appendChild(message);
      box.appendChild(link);

      if (statusEl) {
        statusEl.insertAdjacentElement("afterend", box);
      } else {
        const form = document.getElementById("contactForm");
        form?.appendChild(box);
      }
    }

    // If link is missing inside an existing box, create it.
    if (!link) {
      link = document.createElement("a");
      link.id = "proposalWhatsAppLink";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-on-primary no-underline hover:scale-[.99] transition-all";
      link.textContent =
        getLang() === "ar"
          ? "استلام البروبوزل على واتساب"
          : "Receive proposal on WhatsApp";

      box.appendChild(link);
    }

    link.href = url;

    if (requestId) {
      link.setAttribute("data-request-id", requestId);
    }

    box.classList.remove("hidden");
    box.removeAttribute("hidden");
    box.style.display = "block";
    box.style.visibility = "visible";
    box.style.opacity = "1";

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
          setStatus(
            lang === "ar" ? "تم استلام طلبك بنجاح." : "Request received.",
            "success",
          );
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
          setStatus(
            lang === "ar"
              ? "اكتب الاسم بشكل صحيح."
              : "Please enter a valid name.",
            "error",
          );
          return;
        }

        if (!service) {
          setStatus(
            lang === "ar"
              ? "اختر الخدمة المطلوبة."
              : "Please select a service.",
            "error",
          );
          return;
        }

        if (!phone && !email) {
          setStatus(
            lang === "ar"
              ? "أدخل رقم الواتساب أو البريد الإلكتروني."
              : "Please enter WhatsApp number or email.",
            "error",
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
          setStatus(
            lang === "ar" ? "جاري إرسال الطلب..." : "Sending request...",
            "neutral",
          );

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
                  : "Could not send the request right now."),
            );
          }

          setStatus(
            data.message ||
              (lang === "ar"
                ? "تم استلام طلبك بنجاح."
                : "Your request has been received."),
            "success",
          );

          if (data.whatsapp_url) {
            showWhatsAppBox(
              data.whatsapp_url,
              data.request_id || data.lead_id || "",
            );
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
            "error",
          );
        } finally {
          setBusy(false);
        }
      },
      true,
    );
  });
})();
