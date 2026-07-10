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

    btn.disabled = Boolean(isBusy);
    btn.classList.toggle("opacity-70", Boolean(isBusy));
    btn.classList.toggle("cursor-not-allowed", Boolean(isBusy));
  }

  function buildPhone() {
    const countryCode = valueOf("fCountryCode") || "+962";
    const localPhone = valueOf("fPhone");

    if (!localPhone) return "";
    if (localPhone.startsWith("+")) return localPhone;

    const cleanLocal = localPhone.replace(/[^\d]/g, "").replace(/^0+/, "");
    return `${countryCode}${cleanLocal}`;
  }

  function buildLocalProposalUrl(payload, requestId, lang) {
    const baseUrl =
      window.location.protocol === "file:"
        ? "https://aquatechagency.com/proposal-exact-overlay-template.html"
        : "/proposal-exact-overlay-template.html";

    const params = {
      lang,
      proposalId: requestId,
      request_id: requestId,
      leadId: requestId,
      name: payload.full_name,
      full_name: payload.full_name,
      email: payload.email,
      phone: payload.phone,
      company: payload.company_name,
      company_name: payload.company_name,
      activity: payload.company_activity,
      company_activity: payload.company_activity,
      service: payload.service_type,
      service_type: payload.service_type,
      budget: payload.budget,
      timeline: payload.timeline,
      details: payload.message,
      message: payload.message,
    };

    const queryString = Object.entries(params)
      .filter(([, value]) => {
        return (
          value !== undefined &&
          value !== null &&
          String(value).trim() !== ""
        );
      })
      .map(([key, value]) => {
        return `${encodeURIComponent(key)}=${encodeURIComponent(
          String(value),
        )}`;
      })
      .join("&");

    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  function hideProposalBox() {
    const box = document.getElementById("proposalResultBox");
    const link = document.getElementById("proposalResultLink");

    if (box) {
      box.classList.add("hidden");
      box.setAttribute("hidden", "");
      box.style.display = "none";
    }

    if (link) {
      link.removeAttribute("href");
    }

    // إزالة الصندوق القديم إذا بقي من نسخة واتساب السابقة.
    document.getElementById("proposalWhatsAppBox")?.remove();
  }

  function showProposalBox(url, requestId, labels = {}) {
    if (!url) {
      console.warn("[AquaTech proposal] Proposal URL is empty");
      return;
    }

    const lang = getLang();

    const helperText =
      labels.helperText ||
      (lang === "ar"
        ? "تم تجهيز البروبوزل الأولي الخاص بطلبك. اضغط الزر التالي لفتحه."
        : "Your initial proposal is ready. Click the button below to open it.");

    const buttonLabel =
      labels.buttonLabel ||
      (lang === "ar" ? "الحصول على البروبوزل" : "Get Proposal");

    let box = document.getElementById("proposalResultBox");
    let link = document.getElementById("proposalResultLink");

    const statusEl =
      document.querySelector("[data-contact-status]") ||
      document.getElementById("formStatus");

    if (!box) {
      box = document.createElement("div");
      box.id = "proposalResultBox";
      box.className =
        "mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4";

      const message = document.createElement("p");
      message.className = "text-sm text-on-surface-variant mb-3";
      message.setAttribute("data-proposal-helper", "");
      message.textContent = helperText;

      link = document.createElement("a");
      link.id = "proposalResultLink";
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
      link.id = "proposalResultLink";
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
        hideProposalBox();

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
                  ? "تم تقديم الطلب بنجاح."
                  : "Your request has been submitted successfully.",
              request_id: localId,
              lead_id: localId,
              proposal_status: "ready",
              proposal_url: buildLocalProposalUrl(payload, localId, lang),
              proposal_generated_at: new Date().toISOString(),
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
                    ? "تعذر إرسال الطلب حالياً."
                    : "Could not send the request right now."),
              );
            }
          }

          const isArabic = lang === "ar";
          const requestId =
            data.request_id || data.lead_id || `AQ-${Date.now()}`;
          const proposalUrl = String(data.proposal_url || "").trim();

          const proposalLead = {
            ...payload,
            id: requestId,
            leadId: requestId,
            proposalId: requestId,
            name: payload.full_name,
            service: payload.service_type,
            details: payload.message,
            activity: payload.company_activity,
            company: payload.company_name,
            created_at: new Date().toISOString(),
            proposal_url: proposalUrl,
          };

          try {
            localStorage.setItem(
              "aquatech_proposal_lead",
              JSON.stringify(proposalLead),
            );
          } catch (_) {}

          const successMessage =
            data.message ||
            (isArabic
              ? "تم تقديم الطلب بنجاح."
              : "Your request has been submitted successfully.");

          setStatus(successMessage, "success");

          // نغلق المودال القديم إن وُجد، لأن النتيجة ستظهر أسفل الفورم.
          const modal = document.getElementById("successModal");
          if (modal) {
            modal.classList.remove("is-open");
            modal.setAttribute("hidden", "");
            modal.style.display = "none";
            modal.style.visibility = "hidden";
            modal.style.opacity = "0";
          }

          if (!proposalUrl) {
            setStatus(
              isArabic
                ? "تم تسجيل طلبك، لكن رابط البروبوزل غير جاهز حالياً. حاول مرة أخرى بعد قليل."
                : "Your request was saved, but the proposal link is not ready yet. Please try again shortly.",
              "error",
            );
          } else {
            showProposalBox(proposalUrl, requestId, {
              helperText: isArabic
                ? "تم تجهيز البروبوزل الأولي الخاص بطلبك. اضغط الزر التالي لفتحه."
                : "Your initial proposal is ready. Click the button below to open it.",
              buttonLabel: isArabic
                ? "الحصول على البروبوزل"
                : "Get Proposal",
            });
          }

          window.gtag?.("event", "contact_form_submit", {
            event_category: "lead",
            event_label: "website_intake",
            request_id: requestId,
            proposal_status: data.proposal_status || "",
          });
        } catch (error) {
          console.error("[AquaTech n8n] Contact form error:", error);
          setStatus(
            error?.message ||
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
