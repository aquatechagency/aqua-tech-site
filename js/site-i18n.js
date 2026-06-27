(function () {
  const STORAGE_KEY = "aqua_lang";

  const AR_TO_EN = {
    "الرئيسية": "Home",
    "الخدمات": "Services",
    "الحلول": "Solutions",
    "النتائج": "Results",
    "الأسئلة": "FAQ",
    "تواصل": "Contact",
    "واتساب": "WhatsApp",
    "ابدأ مشروعك": "Start Project",

    "حلول رقمية ونمو فعلي — من الانطلاقة إلى التوسع": "Digital solutions and real growth — from launch to scale",
    "نبني مواقع وأنظمة تركز على جذب العملاء، استقبال الطلبات، والرد الأولي في مسار واضح وقابل للتنفيذ.": "We build websites and systems focused on attracting leads, receiving requests, and handling the first response through a clear, executable flow.",

    "خدمات رقمية مصممة للنمو": "Digital services built for growth",
    "صفحة تسويقية احترافية": "Professional landing page",
    "موقع ونظام استقبال عملاء": "Website and lead intake system",
    "أتمتة أعمال بالذكاء الاصطناعي": "AI business automation",
    "نظام إدارة العملاء": "Customer management system",
    "أتمتة واتساب": "WhatsApp automation",
    "أتمتة البريد الإلكتروني": "Email automation",
    "إدارة حسابات السوشيال ميديا": "Social media management",
    "نظام إدارة مكاتب المحاماة": "Law firm management system",
    "منصة إدارة المشاريع الجامعية": "University project management platform",
    "ResumeIQ": "ResumeIQ",
    "Smart Attendance": "Smart Attendance",
    "موقع شركة احترافي": "Professional company website",
    "نظام مخصص للشركات": "Custom business system",
    "تصميم وصناعة المحتوى": "Content design and production",
    "إدارة الحملات الإعلانية": "Ad campaign management",
    "SEO تحسين الظهور": "SEO visibility optimization",
    "لوحات تحكم وتقارير": "Dashboards and reports",
    "AI Agent أو شات بوت": "AI Agent or chatbot",
    "خدمة أو فكرة أخرى": "Another service or idea",
    "ربط واتساب / نموذج / تتبع": "WhatsApp / form / tracking integration",
    "اطلب صفحتك الآن": "Request your landing page now",

    "الأمان والاعتمادية": "Security and reliability",

    "الاسم": "Name",
    "اسمك": "Your name",
    "البريد الإلكتروني": "Email",
    "رقم الواتساب": "WhatsApp number",
    "رمز الدولة": "Country code",
    "الخدمة المطلوبة": "Requested service",
    "الميزانية التقريبية": "Approximate budget",
    "اختر الميزانية": "Select budget",
    "أقل من $700": "Less than $700",
    "$700 - $1,500": "$700 - $1,500",
    "$1,500 - $4,000": "$1,500 - $4,000",
    "أكثر من $4,000": "More than $4,000",
    "موعد التنفيذ": "Timeline",
    "اختر الموعد": "Select timeline",
    "بأسرع وقت": "As soon as possible",
    "خلال أسبوعين": "Within two weeks",
    "خلال شهر": "Within a month",
    "ما زلت أستكشف": "I am still exploring",
    "تفاصيل المشروع": "Project details",
    "اكتب الهدف، المميزات، والموعد المتوقع…": "Write the goal, features, and expected timeline…",
    "ابدأ مشروعك بخطة واضحة وتنفيذ احترافي": "Start your project with a clear plan and professional execution",

    "تم إرسال طلبك بنجاح": "Your request was sent successfully",
    "سوف نتواصل معك في أقرب وقت": "We will contact you as soon as possible",
    "حسنًا": "OK",
    "هندسة رقمية دقيقة، وليست مجرد واجهة جميلة": "Precise digital engineering, not just a beautiful interface",
    "Aqua.Tech شريك رقمي يساعد الشركات ورواد الأعمال على بناء حضور أقوى على الإنترنت، وتطوير مواقع وأنظمة عملية تدعم النمو والتشغيل اليومي.": "Aqua.Tech is a digital partner helping companies and entrepreneurs build a stronger online presence and develop practical websites and systems that support growth and daily operations.",
    "خطة واضحة خلال 24 ساعة": "A clear plan within 24 hours",
    "نفهم هدفك بسرعة ونحدد ما الذي يجب بناؤه أولًا وما يمكن تأجيله.": "We quickly understand your goal and define what should be built first and what can be delayed.",
    "حل يتوسع لاحقًا": "A solution that scales later",
    "نبني نسخة مفيدة الآن وتبقى جاهزة للتطوير بدون إعادة بناء من الصفر.": "We build a useful version now that remains ready to evolve without rebuilding from scratch.",
    "دعم بعد الإطلاق": "Post-launch support",
    "تحسينات وتعديلات ومعالجة ملاحظات حتى يبقى الحل فعالًا.": "Improvements, adjustments, and feedback handling to keep the solution effective.",
    "قرار مبني على نتيجة": "Result-driven decisions",
    "نركز على التحويل، سرعة الرد، وتنظيم العملاء بدل الزينة فقط.": "We focus on conversion, response speed, and customer organization instead of decoration only.",
    "تخطَّ إلى المحتوى الرئيسي": "Skip to main content",
    "نستخدم Google Analytics لتحسين تجربتك. هل توافق؟": "We use Google Analytics to improve your experience. Do you agree?",
    "قبول": "Accept",
    "رفض": "Decline",
    "ابدأ رحلتك الرقمية الآن": "Start your digital journey now",
    "احكيلنا عن هدفك الحالي، وسنقترح عليك خطوة البداية، القناة الأنسب للتواصل، وما الذي يجب بناؤه أولًا.": "Tell us about your current goal, and we will suggest the first step, the best communication channel, and what should be built first.",
    "تواصل مباشر": "Direct contact",
    "ساعات التواصل: يوميًا من 10 AM إلى 10PM": "Contact hours: daily from 10 AM to 10 PM",
    "املأ البيانات التالية وسنرسل لك الخطوة المناسبة.": "Fill in the details below and we will send you the right next step.",
    "مدخلات مُتحقق منها": "Validated inputs",
    "حماية من السبام": "Spam protection",
    "تهيئة آمنة عند النشر": "Secure deployment setup",
    "أسئلة متكررة": "Frequently asked questions",
    "إجابات مختصرة تساعدك تعرف كيف نبدأ وننفذ ونسلم.": "Short answers to help you understand how we start, build, and deliver.",
    "كم يستغرق تنفيذ موقع أو نظام؟": "How long does it take to build a website or system?",
    "يعتمد على النطاق. الصفحات التسويقية قد تبدأ من 3–5 أيام، بينما الأنظمة المخصصة تحتاج تحليل وجدول أوضح.": "It depends on the scope. Landing pages can start from 3–5 days, while custom systems need deeper analysis and a clearer timeline.",
    "كيف يتم تحديد السعر؟": "How is the price determined?",
    "حسب نوع الخدمة، نطاق العمل، التكاملات المطلوبة، وسرعة التنفيذ.": "Based on the service type, scope of work, required integrations, and delivery speed.",
    "هل توجد صيانة بعد التسليم؟": "Is there maintenance after delivery?",
    "نعم، تتوفر باقات دعم وتحسينات وتحديثات حسب الحاجة.": "Yes, support, improvement, and update packages are available as needed.",
    "هل أحتاج موقع كامل أم صفحة تسويقية؟": "Do I need a full website or a landing page?",
    "إذا هدفك حملة أو خدمة محددة، فغالبًا صفحة تسويقية تكفي كبداية. للمحتوى الأكبر والثقة الأوسع، الموقع الكامل أنسب.": "If your goal is a campaign or a specific service, a landing page is often enough to start. For larger content and broader trust, a full website is more suitable.",
    "نبني صفحات تسويقية احترافية ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو بشكل أسرع وبطريقة أوضح وأكثر احترافية.": "We build professional landing pages, websites, systems, and automation that help companies and entrepreneurs grow faster, clearer, and more professionally.",
    "الروابط": "Links",
    "عن الشركة": "About",
    "تواصل معنا": "Contact us",
    "الموقع": "Location",
    "يوميًا — 10 AM إلى 10 PM": "Daily — 10 AM to 10 PM",
    "© Aqua.Tech — جميع الحقوق محفوظة.": "© Aqua.Tech — All rights reserved.",
    "حلول رقمية ونمو فعلي": "Digital solutions and real growth",
    "— من الانطلاقة إلى التوسع": "— from launch to scale",
    "استعرض الحلول": "Explore solutions",
    "3–5 أيام": "3–5 days",
    "إطلاق صفحات تسويقية احترافية": "Launch professional landing pages",
    "24 ساعة": "24 hours",
    "خطة واضحة بعد التواصل": "A clear plan after contact",
    "مشروع منجز بنجاح": "Successfully delivered projects",
    "نتائج يمكننا تحقيقها معك": "Results we can achieve with you",
    "زيادة وضوح التحويل": "Clearer conversion",
    "صفحات تسويقية احترافية واضحة مع CTA مباشر لرفع عدد الاستفسارات وتقليل ضياع الزوار.": "Clear professional landing pages with a direct CTA to increase inquiries and reduce visitor drop-off.",
    "تقليل وقت الرد": "Reduce response time",
    "أتمتة أو شات بوت يساعدك على الرد خلال دقائق بدل ساعات، مع جمع البيانات بشكل منظم.": "Automation or a chatbot helps you reply within minutes instead of hours while collecting data in an organized way.",
    "تشغيل أوضح ووقت أقل": "Clearer operations, less time",
    "نظام أو لوحة تحكم مخصصة تساعدك على تنظيم الطلبات والمتابعة والتقارير الدقيقة.": "A custom system or dashboard helps you organize requests, follow-ups, and accurate reports.",
    "تحسن في استقبال الطلبات": "Improvement in request intake",
    "تقليل وقت الرد الأولي": "Reduction in first response time",
    "الأمان والثقة": "Security and trust",
    "نبني المواقع والأنظمة وفق ممارسات حديثة تساعد على رفع الأمان، حماية البيانات، وتقوية موثوقية المشروع.": "We build websites and systems using modern practices that improve security, protect data, and strengthen project reliability.",
    "اتصال آمن": "Secure connection",
    "HTTPS وتهيئة آمنة للروابط والنماذج.": "HTTPS and secure setup for links and forms.",
    "حماية التطبيق": "Application protection",
    "تحقق من المدخلات وتقليل مخاطر السبام.": "Input validation and reduced spam risks.",
    "نشر موثوق": "Reliable deployment",
    "جاهزية لإضافة Cloudflare وSecurity Headers.": "Ready to add Cloudflare and security headers.",
    "ثقة أعلى": "Higher trust",
    "تجربة احترافية تعزز ثقة العميل عند التواصل.": "A professional experience that increases customer trust when contacting you.",
    "الخدمات التي نقدمها للنمو": "Services we provide for growth",
    "نغطي كامل رحلة مشروعك من الفكرة حتى الإطلاق والنمو المستمر.": "We cover your full project journey from idea to launch and continuous growth.",
    "صفحات تسويقية احترافية": "Professional landing pages",
    "صفحات تسويقية احترافية وسريعة تساعدك تبدأ الإعلان وجمع العملاء خلال وقت قصير.": "Fast professional landing pages that help you start advertising and collect leads quickly.",
    "تصميم موجه لرفع التحويل": "Conversion-focused design",
    "متوافقة مع الجوال + سرعة عالية": "Mobile-friendly and fast",
    "مواقع ومتاجر": "Websites and stores",
    "نبني مواقع شركات ومتاجر وصفحات خدمات تركّز على الثقة والسرعة.": "We build company websites, stores, and service pages focused on trust and speed.",
    "استكشف المزيد": "Explore more",
    "الذكاء الاصطناعي": "Artificial intelligence",
    "نساعدك تبني بوتات ومهام تلقائية لتسريع الردود وتقليل العمل اليدوي.": "We help you build bots and automated tasks to speed up replies and reduce manual work.",
    "جرب الأتمتة": "Try automation",
    "أنظمة ولوحات تحكم مخصصة": "Custom systems and dashboards",
    "أنظمة داخلية، أتمتة، وتكاملات API لتوفير الوقت والتكلفة لمشروعك.": "Internal systems, automation, and API integrations to save time and cost for your project.",
    "تحدث مع خبير": "Talk to an expert",
    "حلول جاهزة للانطلاق": "Ready solutions to launch",
    "أنظمة ومنصات جاهزة يمكن تخصيصها بحسب نوع النشاط والمرحلة الحالية لمشروعك.": "Ready systems and platforms that can be customized based on your business type and current project stage.",
    "إدارة مكاتب المحاماة": "Law firm management",
    "نظام لإدارة القضايا والعملاء والمواعيد والملفات القانونية بشكل أوضح.": "A system for managing cases, clients, appointments, and legal files more clearly.",
    "إدارة الملفات": "File management",
    "متابعة المواعيد": "Appointment tracking",
    "اطلب النظام": "Request the system",
    "أداة تساعد المستخدم على إنشاء سيرة ذاتية بشكل أوضح وأسرع وتجربة أسهل.": "A tool that helps users create a clearer resume faster with an easier experience.",
    "بناء ذكي للسيرة": "Smart resume building",
    "قوالب احترافية": "Professional templates",
    "نظام حضور ذكي يعتمد على التعرف على الوجوه لتسجيل الحضور تلقائيًا.": "A smart attendance system based on face recognition to register attendance automatically.",
    "التعرف على الوجوه": "Face recognition",
    "تقارير فورية": "Instant reports",
    "منصة مشاريع الجامعة": "University projects platform",
    "منصة لتنظيم مشاريع الطلبة ورفع الملفات ومتابعة الفرق والإشراف الأكاديمي.": "A platform for organizing student projects, uploading files, tracking teams, and academic supervision.",
    "تنظيم الفرق": "Team organization",
    "متابعة التقييم": "Evaluation tracking",
    "موقعنا": "Location",
    "عمّان، الأردن": "Amman, Jordan",
    "عمان، الأردن": "Amman, Jordan",
    "ماذا يحدث بعد ذلك؟": "What happens next?",
    "تحليل البيانات": "Data analysis",
    "نراجع طلبك ونفهم المتطلبات التقنية والأهداف التجارية.": "We review your request and understand the technical requirements and business goals.",
    "جلسة استشارية": "Consultation session",
    "نتواصل معك خلال 24 ساعة لتحديد نقطة البداية.": "We contact you within 24 hours to define the starting point.",
    "عرض واضح": "Clear proposal",
    "نقدم خطة عمل مع التكلفة والجدول الزمني.": "We provide an action plan with cost and timeline.",
    "نبني مواقع وأنظمة تركّز على جذب العملاء، استقبال الطلبات، والرد الأولي في مسار واضح وقابل للتنفيذ.": "We build websites and systems focused on attracting leads, receiving requests, and handling the first response through a clear, executable flow.",
    "الحلول الجاهزة": "Ready solutions",
    "الأمان": "Security",
    "Solutions الجاهزة": "Ready solutions"
  };

  const EN_TO_AR = Object.fromEntries(
    Object.entries(AR_TO_EN).map(([ar, en]) => [en, ar])
  );

  function getMap(lang) {
    return lang === "en" ? AR_TO_EN : EN_TO_AR;
  }

  function shouldSkipTextNode(node) {
    const parent = node.parentElement;
    if (!parent) return true;
    return Boolean(parent.closest("script, style, noscript, svg, code, pre"));
  }

  function replaceInlineKnownPhrases(text, map) {
    let output = text;

    Object.entries(map)
      .sort((a, b) => b[0].length - a[0].length)
      .forEach(([from, to]) => {
        if (from && output.includes(from)) {
          output = output.split(from).join(to);
        }
      });

    return output;
  }

  function replaceTextNode(node, map) {
    const original = node.nodeValue;
    const trimmed = original.trim();
    if (!trimmed) return;

    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";

    if (map[trimmed]) {
      node.nodeValue = leading + map[trimmed] + trailing;
      return;
    }

    const replaced = replaceInlineKnownPhrases(trimmed, map);
    if (replaced !== trimmed) {
      node.nodeValue = leading + replaced + trailing;
    }
  }

  function translateTextNodes(lang) {
    const map = getMap(lang);
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          return shouldSkipTextNode(node)
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => replaceTextNode(node, map));
  }

  function translateAttributes(lang) {
    const map = getMap(lang);

    document.querySelectorAll("[placeholder]").forEach((el) => {
      const value = el.getAttribute("placeholder");
      if (value && map[value]) el.setAttribute("placeholder", map[value]);
    });

    document.querySelectorAll("[aria-label]").forEach((el) => {
      const value = el.getAttribute("aria-label");
      if (value && map[value]) el.setAttribute("aria-label", map[value]);
    });

    document.querySelectorAll("[title]").forEach((el) => {
      const value = el.getAttribute("title");
      if (value && map[value]) el.setAttribute("title", map[value]);
    });
  }

  function updateAquaMeta(lang) {
    document.title = lang === "en"
      ? "Aqua.Tech | Digital Solutions and Real Growth"
      : "Aqua.Tech | حلول رقمية ونمو فعلي";

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        lang === "en"
          ? "Aqua.Tech builds professional landing pages, websites, systems, and automation for real business growth."
          : "Aqua.Tech تبني صفحات تسويقية ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو."
      );
    }
  }

  function updateToggle(lang) {
    const btn = document.getElementById("langToggle");
    if (!btn) return;

    btn.textContent = lang === "en" ? "AR" : "EN";
    btn.setAttribute("aria-label", lang === "en" ? "Switch to Arabic" : "Switch to English");
    btn.setAttribute("title", lang === "en" ? "Switch to Arabic" : "Switch to English");
  }

  function applyAquaLanguage(lang) {
    const nextLang = lang === "en" ? "en" : "ar";

    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "en" ? "ltr" : "rtl";

    updateAquaMeta(nextLang);

    translateTextNodes(nextLang);
    translateAttributes(nextLang);
    updateToggle(nextLang);

    localStorage.setItem(STORAGE_KEY, nextLang);
  }

  function initLanguageToggle() {
    const btn = document.getElementById("langToggle");
    const savedLang = localStorage.getItem(STORAGE_KEY) || "ar";

    applyAquaLanguage(savedLang);

    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = "true";
      btn.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE_KEY) || "ar";
        applyAquaLanguage(current === "ar" ? "en" : "ar");
      });
    }
  }

  window.applyAquaLanguage = applyAquaLanguage;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLanguageToggle);
  } else {
    initLanguageToggle();
  }
})();
