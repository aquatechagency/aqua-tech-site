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

  function buildProposalWhatsAppUrl(leadId, lang) {
    const aquaWhatsAppNumber = "962780932199";

    const message =
      lang === "ar"
        ? [
            "مرحباً Aqua.Tech،",
            "أريد استلام البروبوزل الأولي لطلبي.",
            leadId ? `رقم الطلب: ${leadId}` : "",
          ]
            .filter(Boolean)
            .join("\n")
        : [
            "Hello Aqua.Tech,",
            "I would like to receive my instant proposal.",
            leadId ? `Request ID: ${leadId}` : "",
          ]
            .filter(Boolean)
            .join("\n");

    return `https://wa.me/${aquaWhatsAppNumber}?text=${encodeURIComponent(
      message,
    )}`;
  }

  function showWhatsAppBox(url, requestId, labels = {}) {
    if (!url) {
      console.warn("[AquaTech n8n] WhatsApp URL is empty");
      return;
    }

    const lang = getLang();

    const helperText =
      labels.proposal_helper_text ||
      (lang === "ar"
        ? "Ø§Ø¶ØºØ· Ø§Ù„Ø²Ø± Ø§Ù„ØªØ§Ù„ÙŠ Ù„Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø±ÙˆØ¨ÙˆØ²Ù„ Ø§Ù„Ø£ÙˆÙ„ÙŠ Ø¹Ø¨Ø± ÙˆØ§ØªØ³Ø§Ø¨."
        : "Click the button below to get your instant proposal on WhatsApp.");

    const buttonLabel =
      labels.proposal_button_label ||
      (lang === "ar"
        ? "Ø§Ù„Ø­ØµÙˆÙ„ Ø¹Ù„Ù‰ Ø§Ù„Ø¨Ø±ÙˆØ¨ÙˆØ²Ù„"
        : "Get the proposal");

    let box = document.getElementById("proposalWhatsAppBox");
    let link = document.getElementById("proposalWhatsAppLink");

    const statusEl =
      document.querySelector("[data-contact-status]") ||
      document.getElementById("formStatus");

    if (!box) {
      box = document.createElement("div");
      box.id = "proposalWhatsAppBox";
      box.className =
        "mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4";

      const message = document.createElement("p");
      message.className = "text-sm text-on-surface-variant mb-3";
      message.setAttribute("data-proposal-helper", "");
      message.textContent = helperText;

      link = document.createElement("a");
      link.id = "proposalWhatsAppLink";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-on-primary no-underline hover:scale-[.99] transition-all";
      link.textContent = buttonLabel;

      box.appendChild(message);
      box.appendChild(link);

      if (statusEl) {
        statusEl.insertAdjacentElement("afterend", box);
      } else {
        document.getElementById("contactForm")?.appendChild(box);
      }
    }

    const helperEl =
      box.querySelector("[data-proposal-helper]") || box.querySelector("p");

    if (helperEl) {
      helperEl.textContent = helperText;
    }

    if (!link) {
      link = document.createElement("a");
      link.id = "proposalWhatsAppLink";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className =
        "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-on-primary no-underline hover:scale-[.99] transition-all";
      box.appendChild(link);
    }

    link.href = url;
    link.textContent = buttonLabel;
    link.style.display = "inline-flex";
    link.style.width = "100%";
    link.style.alignItems = "center";
    link.style.justifyContent = "center";
    link.style.minHeight = "48px";
    link.style.padding = "0 22px";
    link.style.borderRadius = "14px";
    link.style.color = "#ffffff";
    link.style.fontWeight = "900";
    link.style.textDecoration = "none";
    link.style.background = "linear-gradient(135deg, #0f7fd8, #18c7e8)";
    link.style.boxShadow = "0 14px 30px rgba(15, 127, 216, 0.28)";

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
            lang === "ar"
              ? "ØªÙ… Ø§Ø³ØªÙ„Ø§Ù… Ø·Ù„Ø¨Ùƒ Ø¨Ù†Ø¬Ø§Ø­."
              : "Request received.",
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
              ? "Ø§ÙƒØªØ¨ Ø§Ù„Ø§Ø³Ù… Ø¨Ø´ÙƒÙ„ ØµØ­ÙŠØ­."
              : "Please enter a valid name.",
            "error",
          );
          return;
        }

        if (!service) {
          setStatus(
            lang === "ar"
              ? "Ø§Ø®ØªØ± Ø§Ù„Ø®Ø¯Ù…Ø© Ø§Ù„Ù…Ø·Ù„ÙˆØ¨Ø©."
              : "Please select a service.",
            "error",
          );
          return;
        }

        if (!phone && !email) {
          setStatus(
            lang === "ar"
              ? "Ø£Ø¯Ø®Ù„ Ø±Ù‚Ù… Ø§Ù„ÙˆØ§ØªØ³Ø§Ø¨ Ø£Ùˆ Ø§Ù„Ø¨Ø±ÙŠØ¯ Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠ."
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
            lang === "ar"
              ? "Ø¬Ø§Ø±ÙŠ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨..."
              : "Sending request...",
            "neutral",
          );

          let data = {};

          const isLocalPreview =
            window.location.hostname === "localhost" ||
            window.location.hostname === "127.0.0.1" ||
            window.location.protocol === "file:";

          if (isLocalPreview) {
            const localId = `LOCAL-${Date.now()}`;

            data = {
              ok: true,
              message:
                lang === "ar"
                  ? "ØªÙ… ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ù„Ø¨ Ø¨Ù†Ø¬Ø§Ø­."
                  : "Your request has been submitted successfully.",
              request_id: localId,
              lead_id: localId,
            };

            console.log("[AquaTech local preview] Contact API skipped:", data);
          } else {
            const response = await fetch("/api/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            const text = await response.text();

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
                    ? "ØªØ¹Ø°Ø± Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨ Ø­Ø§Ù„ÙŠØ§Ù‹."
                    : "Could not send the request right now."),
              );
            }
          }

          const isArabic = lang === "ar";
          const leadId = data.request_id || data.lead_id || `AQ-${Date.now()}`;

          const proposalLead = {
            ...payload,
            id: leadId,
            leadId,
            proposalId: leadId,
            name: payload.full_name,
            service: payload.service_type,
            details: payload.message,
            activity: payload.company_activity,
            company: payload.company_name,
            created_at: new Date().toISOString(),
          };

          try {
            localStorage.setItem(
              "aquatech_proposal_lead",
              JSON.stringify(proposalLead),
            );
          } catch (_) {}

          const successMessage = isArabic
            ? "تم تقديم الطلب بنجاح."
            : "Your request has been submitted successfully.";

          setStatus(successMessage, "success");

          const modal = document.getElementById("successModal");
          if (modal) {
            modal.classList.remove("is-open");
            modal.setAttribute("hidden", "");
            modal.style.display = "none";
            modal.style.visibility = "hidden";
            modal.style.opacity = "0";
          }

          const proposalWhatsAppUrl = buildProposalWhatsAppUrl(leadId, lang);

          showWhatsAppBox(proposalWhatsAppUrl, leadId, {
            proposal_helper_text: isArabic
              ? "اضغط الزر التالي للحصول على البروبوزل الأولي عبر واتساب."
              : "Click the button below to get your instant proposal on WhatsApp.",
            proposal_button_label: isArabic
              ? "الحصول على البروبوزل"
              : "Get Proposal",
          });

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
                ? "Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø¥Ø±Ø³Ø§Ù„ Ø§Ù„Ø·Ù„Ø¨."
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
