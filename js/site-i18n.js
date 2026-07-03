(function () {
  const STORAGE_KEY = "aqua_lang";

  const AR_TO_EN = {
    الرئيسية: "Home",
    الخدمات: "Services",
    الحلول: "Solutions",
    النتائج: "Results",
    الأسئلة: "FAQ",
    تواصل: "Contact",
    واتساب: "WhatsApp",
    "ابدأ مشروعك": "Start Project",
    "لماذا نحن": "Why us",
    الخدمات: "Services",
    الحلول: "Solutions",
    النتائج: "Results",
    العروض: "Offers",
    الأسئلة: "FAQ",
    الدعم: "Support",
    تواصل: "Contact",
    واتساب: "WhatsApp",
    "ابدأ مشروعك": "Start Project",
    "افتح القائمة": "Open menu",
    "شعار Aqua.Tech": "Aqua.Tech logo",

    "حلول رقمية ونمو فعلي — من الانطلاقة إلى التوسع":
      "Digital solutions and real growth — from launch to scale",
    "نبني مواقع وأنظمة تركز على جذب العملاء، استقبال الطلبات، والرد الأولي في مسار واضح وقابل للتنفيذ.":
      "We build websites and systems focused on attracting leads, receiving requests, and handling the first response through a clear, executable flow.",

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
    ResumeIQ: "ResumeIQ",
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

    الاسم: "Name",
    اسمك: "Your name",
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
    "اكتب الهدف، المميزات، والموعد المتوقع…":
      "Write the goal, features, and expected timeline…",
    "ابدأ مشروعك بخطة واضحة": "Start your project with a clear plan ",

    "تم إرسال طلبك بنجاح": "Your request was sent successfully",
    "سوف نتواصل معك في أقرب وقت": "We will contact you as soon as possible",
    حسنًا: "OK",
    "هندسة رقمية دقيقة، وليست مجرد واجهة جميلة":
      "Precise digital engineering, not just a beautiful interface",
    "Aqua.Tech شريك رقمي يساعد الشركات ورواد الأعمال على بناء حضور أقوى على الإنترنت، وتطوير مواقع وأنظمة عملية تدعم النمو والتشغيل اليومي.":
      "Aqua.Tech is a digital partner helping companies and entrepreneurs build a stronger online presence and develop practical websites and systems that support growth and daily operations.",
    "خطة واضحة خلال 24 ساعة": "A clear plan within 24 hours",
    "نفهم هدفك بسرعة ونحدد ما الذي يجب بناؤه أولًا وما يمكن تأجيله.":
      "We quickly understand your goal and define what should be built first and what can be delayed.",
    "حل يتوسع لاحقًا": "A solution that scales later",
    "نبني نسخة مفيدة الآن وتبقى جاهزة للتطوير بدون إعادة بناء من الصفر.":
      "We build a useful version now that remains ready to evolve without rebuilding from scratch.",
    "دعم بعد الإطلاق": "Post-launch support",
    "تحسينات وتعديلات ومعالجة ملاحظات حتى يبقى الحل فعالًا.":
      "Improvements, adjustments, and feedback handling to keep the solution effective.",
    "قرار مبني على نتيجة": "Result-driven decisions",
    "نركز على التحويل، سرعة الرد، وتنظيم العملاء بدل الزينة فقط.":
      "We focus on conversion, response speed, and customer organization instead of decoration only.",
    "تخطَّ إلى المحتوى الرئيسي": "Skip to main content",
    "نستخدم Google Analytics لتحسين تجربتك. هل توافق؟":
      "We use Google Analytics to improve your experience. Do you agree?",
    قبول: "Accept",
    رفض: "Decline",
    "ابدأ رحلتك الرقمية الآن": "Start your digital journey now",
    "احكيلنا عن هدفك الحالي، وسنقترح عليك خطوة البداية، القناة الأنسب للتواصل، وما الذي يجب بناؤه أولًا.":
      "Tell us about your current goal, and we will suggest the first step, the best communication channel, and what should be built first.",
    "تواصل مباشر": "Direct contact",
    "املأ البيانات التالية وسنرسل لك الخطوة المناسبة.":
      "Fill in the details below and we will send you the right next step.",
    "مدخلات مُتحقق منها": "Validated inputs",
    "حماية من السبام": "Spam protection",
    "تهيئة آمنة عند النشر": "Secure deployment setup",
    "أسئلة متكررة": "Frequently asked questions",
    "إجابات مختصرة تساعدك تعرف كيف نبدأ وننفذ ونسلم.":
      "Short answers to help you understand how we start, build, and deliver.",
    "كم يستغرق تنفيذ موقع أو نظام؟":
      "How long does it take to build a website or system?",
    "يعتمد على النطاق. الصفحات التسويقية قد تبدأ من 3–5 أيام، بينما الأنظمة المخصصة تحتاج تحليل وجدول أوضح.":
      "It depends on the scope. Landing pages can start from 3–5 days, while custom systems need deeper analysis and a clearer timeline.",
    "كيف يتم تحديد السعر؟": "How is the price determined?",
    "حسب نوع الخدمة، نطاق العمل، التكاملات المطلوبة، وسرعة التنفيذ.":
      "Based on the service type, scope of work, required integrations, and delivery speed.",
    "هل توجد صيانة بعد التسليم؟": "Is there maintenance after delivery?",
    "نعم، تتوفر باقات دعم وتحسينات وتحديثات حسب الحاجة.":
      "Yes, support, improvement, and update packages are available as needed.",
    "هل أحتاج موقع كامل أم صفحة تسويقية؟":
      "Do I need a full website or a landing page?",
    "إذا هدفك حملة أو خدمة محددة، فغالبًا صفحة تسويقية تكفي كبداية. للمحتوى الأكبر والثقة الأوسع، الموقع الكامل أنسب.":
      "If your goal is a campaign or a specific service, a landing page is often enough to start. For larger content and broader trust, a full website is more suitable.",
    "نبني صفحات تسويقية احترافية ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو بشكل أسرع وبطريقة أوضح وأكثر احترافية.":
      "We build professional landing pages, websites, systems, and automation that help companies and entrepreneurs grow faster, clearer, and more professionally.",
    الروابط: "Links",
    "عن الشركة": "About",
    "تواصل معنا": "Contact us",
    "يوميًا — 10 AM إلى 10 PM": "Daily — 10 AM to 10 PM",
    "© Aqua.Tech — جميع الحقوق محفوظة.": "© Aqua.Tech — All rights reserved.",
    "حلول رقمية ونمو فعلي": "Digital solutions and real growth",
    " من الانطلاقة إلى التوسع": "— from launch to scale",
    "استعرض الحلول": " solutions",
    "3–5 أيام": "3–5 days",
    "إطلاق صفحات تسويقية احترافية": "Launch professional landing pages",
    "24 ساعة": "24 hours",
    "خطة واضحة بعد التواصل": "A clear plan after contact",
    "مشروع منجز بنجاح": "Successfully delivered projects",
    "نتائج يمكننا تحقيقها معك": "Results we can achieve with you",
    "زيادة وضوح التحويل": "Clearer conversion",
    "صفحات تسويقية احترافية واضحة مع CTA مباشر لرفع عدد الاستفسارات وتقليل ضياع الزوار.":
      "Clear professional landing pages with a direct CTA to increase inquiries and reduce visitor drop-off.",
    "تقليل وقت الرد": "Reduce response time",
    "أتمتة أو شات بوت يساعدك على الرد خلال دقائق بدل ساعات، مع جمع البيانات بشكل منظم.":
      "Automation or a chatbot helps you reply within minutes instead of hours while collecting data in an organized way.",
    "تشغيل أوضح ووقت أقل": "Clearer operations, less time",
    "نظام أو لوحة تحكم مخصصة تساعدك على تنظيم الطلبات والمتابعة والتقارير الدقيقة.":
      "A custom system or dashboard helps you organize requests, follow-ups, and accurate reports.",
    "تحسن في استقبال الطلبات": "Improvement in request intake",
    "تقليل وقت الرد الأولي": "Reduction in first response time",
    "الأمان والثقة": "Security and trust",
    "نبني المواقع والأنظمة وفق ممارسات حديثة تساعد على رفع الأمان، حماية البيانات، وتقوية موثوقية المشروع.":
      "We build websites and systems using modern practices that improve security, protect data, and strengthen project reliability.",
    "اتصال آمن": "Secure connection",
    "HTTPS وتهيئة آمنة للروابط والنماذج.":
      "HTTPS and secure setup for links and forms.",
    "حماية التطبيق": "Application protection",
    "تحقق من المدخلات وتقليل مخاطر السبام.":
      "Input validation and reduced spam risks.",
    "نشر موثوق": "Reliable deployment",
    "جاهزية لإضافة Cloudflare وSecurity Headers.":
      "Ready to add Cloudflare and security headers.",
    "ثقة أعلى": "Higher trust",
    "تجربة احترافية تعزز ثقة العميل عند التواصل.":
      "A professional experience that increases customer trust when contacting you.",
    "الخدمات التي نقدمها للنمو": "Services we provide for growth",
    "نغطي كامل رحلة مشروعك من الفكرة حتى الإطلاق والنمو المستمر.":
      "We cover your full project journey from idea to launch and continuous growth.",
    "صفحات تسويقية احترافية": "Professional landing pages",
    "صفحات تسويقية احترافية وسريعة تساعدك تبدأ الإعلان وجمع العملاء خلال وقت قصير.":
      "Fast professional landing pages that help you start advertising and collect leads quickly.",
    "تصميم موجه لرفع التحويل": "Conversion-focused design",
    "متوافقة مع الجوال + سرعة عالية": "Mobile-friendly and fast",
    "مواقع ومتاجر": "Websites and stores",
    "نبني مواقع شركات ومتاجر وصفحات خدمات تركّز على الثقة والسرعة.":
      "We build company websites, stores, and service pages focused on trust and speed.",
    "استكشف المزيد": "Explore more",
    "الذكاء الاصطناعي": "Artificial intelligence",
    "نساعدك تبني بوتات ومهام تلقائية لتسريع الردود وتقليل العمل اليدوي.":
      "We help you build bots and automated tasks to speed up replies and reduce manual work.",
    "جرب الأتمتة": "Try automation",
    "أنظمة ولوحات تحكم مخصصة": "Custom systems and dashboards",
    "أنظمة داخلية، أتمتة، وتكاملات API لتوفير الوقت والتكلفة لمشروعك.":
      "Internal systems, automation, and API integrations to save time and cost for your project.",
    "تحدث مع خبير": "Talk to an expert",
    "حلول جاهزة للانطلاق": "Ready solutions to launch",
    "أنظمة ومنصات جاهزة يمكن تخصيصها بحسب نوع النشاط والمرحلة الحالية لمشروعك.":
      "Ready systems and platforms that can be customized based on your business type and current project stage.",
    "إدارة مكاتب المحاماة": "Law firm management",
    "نظام لإدارة القضايا والعملاء والمواعيد والملفات القانونية بشكل أوضح.":
      "A system for managing cases, clients, appointments, and legal files more clearly.",
    "إدارة الملفات": "File management",
    "متابعة المواعيد": "Appointment tracking",
    "اطلب النظام": "Request the system",
    "أداة تساعد المستخدم على إنشاء سيرة ذاتية بشكل أوضح وأسرع وتجربة أسهل.":
      "A tool that helps users create a clearer resume faster with an easier experience.",
    "بناء ذكي للسيرة": "Smart resume building",
    "قوالب احترافية": "Professional templates",
    "نظام حضور ذكي يعتمد على التعرف على الوجوه لتسجيل الحضور تلقائيًا.":
      "A smart attendance system based on face recognition to register attendance automatically.",
    "التعرف على الوجوه": "Face recognition",
    "تقارير فورية": "Instant reports",
    "منصة مشاريع الجامعة": "University projects platform",
    "منصة لتنظيم مشاريع الطلبة ورفع الملفات ومتابعة الفرق والإشراف الأكاديمي.":
      "A platform for organizing student projects, uploading files, tracking teams, and academic supervision.",
    "تنظيم الفرق": "Team organization",
    "متابعة التقييم": "Evaluation tracking",
    "عمّان، الأردن": "Amman, Jordan",
    "عمان، الأردن": "Amman, Jordan",
    "ماذا يحدث بعد ذلك؟": "What happens next?",
    "تحليل البيانات": "Data analysis",
    "نراجع طلبك ونفهم المتطلبات التقنية والأهداف التجارية.":
      "We review your request and understand the technical requirements and business goals.",
    "جلسة استشارية": "Consultation session",
    "نتواصل معك خلال 24 ساعة لتحديد نقطة البداية.":
      "We contact you within 24 hours to define the starting point.",
    "عرض واضح": "Clear proposal",
    "نقدم خطة عمل مع التكلفة والجدول الزمني.":
      "We provide an action plan with cost and timeline.",
    "نبني مواقع وأنظمة تركّز على جذب العملاء، استقبال الطلبات، والرد الأولي في مسار واضح وقابل للتنفيذ.":
      "We build websites and systems focused on attracting leads, receiving requests, and handling the first response through a clear, executable flow.",
    "الحلول الجاهزة": "Ready solutions",
    الأمان: "Security",
    "Solutions الجاهزة": "Ready solutions",
  };

  const EN_TO_AR = Object.fromEntries(
    Object.entries(AR_TO_EN).map(([ar, en]) => [en, ar]),
  );

  const DATA_I18N = {
    ar: {
      "hero.kicker": "برمجة • إطلاق • توسّع",
      "hero.title": "حلول رقمية ونمو فعلي",
      "hero.titleAccent": "من الانطلاقة إلى التوسع",
      "hero.subtitle":
        "نبني مواقع وأنظمة تركّز على جذب العملاء، استقبال الطلبات، والتعامل مع أول رد من خلال مسار واضح وقابل للتنفيذ.",
      "hero.ctaPrimary": "ابدأ مشروعك",
      "hero.ctaSecondary": "استعرض الحلول",

      "about.kicker": "من نحن",
      "about.title": "هندسة رقمية دقيقة، وليست مجرد واجهة جميلة",
      "about.description":
        "Aqua.Tech شريك رقمي يساعد الشركات ورواد الأعمال على بناء حضور أقوى على الإنترنت، وتطوير مواقع وأنظمة عملية تدعم النمو والتشغيل اليومي.",
      "about.card1.title": "خطة واضحة خلال 24 ساعة",
      "about.card1.desc":
        "نفهم هدفك بسرعة ونحدد ما الذي يجب بناؤه أولًا وما يمكن تأجيله.",
      "about.card2.title": "حل يتوسع لاحقًا",
      "about.card2.desc":
        "نبني نسخة مفيدة الآن وتبقى جاهزة للتطوير بدون إعادة بناء من الصفر.",
      "about.card3.title": "دعم بعد الإطلاق",
      "about.card3.desc":
        "تحسينات وتعديلات ومعالجة ملاحظات حتى يبقى الحل فعالًا.",
      "about.card4.title": "قرار مبني على نتيجة",
      "about.card4.desc":
        "نركز على التحويل، سرعة الرد، وتنظيم العملاء بدل الزينة فقط.",

      "trust.kicker": "لماذا Aqua.Tech",
      "trust.title": "لماذا تختار Aqua.Tech",
      "trust.description":
        "نركز على بناء حلول واضحة، قابلة للتنفيذ، وتخدم هدف المشروع بدل الاكتفاء بواجهة جميلة فقط.",
      "trust.card1.kicker": "الخطوة الأولى",
      "trust.card1.title": "خطة واضحة خلال 24 ساعة",
      "trust.card1.desc":
        "نفهم هدفك بسرعة، ثم نحدد لك ما الذي يجب بناؤه أولًا، وما الذي يمكن تأجيله.",
      "trust.card2.kicker": "التسليم",
      "trust.card2.title": "حل يتوسع لاحقًا",
      "trust.card2.desc":
        "نبني نسخة مفيدة الآن وتبقى جاهزة للتطوير لاحقًا بدون إعادة بناء من الصفر.",
      "trust.card3.kicker": "الدعم",
      "trust.card3.title": "دعم بعد الإطلاق",
      "trust.card3.desc":
        "نساعدك في التحسينات، التعديلات، ومعالجة الملاحظات حتى يبقى الحل فعالًا.",
      "trust.card4.kicker": "الوضوح",
      "trust.card4.title": "تواصل أوضح",
      "trust.card4.desc":
        "تحديثات واضحة أثناء التنفيذ، ومخرجات مرتبة، وتسليم منظم حسب الاتفاق.",

      "trust.title": "لماذا تختار Aqua.Tech",
      "trust.description":
        "نركز على بناء حلول واضحة، قابلة للتنفيذ، وتخدم هدف المشروع بدل الاكتفاء بواجهة جميلة فقط.",
      "trust.card1.desc":
        "نفهم هدفك بسرعة، ثم نحدد لك ما الذي يجب بناؤه أولًا، وما الذي يمكن تأجيله.",
      "trust.card3.desc":
        "نساعدك في التحسينات، التعديلات، ومعالجة الملاحظات حتى يبقى الحل فعالًا.",
      "trust.card4.title": "تواصل أوضح",
      "trust.card4.desc":
        "تحديثات واضحة أثناء التنفيذ، ومخرجات مرتبة، وتسليم منظم حسب الاتفاق.",

      "solutions.kicker": "Deployment ready",
      "solutions.title": "حلول جاهزة للانطلاق",
      "solutions.subtitle":
        "أنظمة ومنصات جاهزة يمكن تخصيصها بحسب نوع النشاط والمرحلة الحالية لمشروعك.",

      "solutions.law.title": "إدارة مكاتب المحاماة",
      "solutions.law.desc":
        "نظام لإدارة القضايا والعملاء والمواعيد والملفات القانونية بشكل أوضح.",
      "solutions.law.point1": "إدارة الملفات",
      "solutions.law.point2": "متابعة المواعيد",

      "solutions.resume.title": "ResumeIQ",
      "solutions.resume.desc":
        "أداة تساعد المستخدم على إنشاء سيرة ذاتية بشكل أوضح وأسرع وتجربة أسهل.",
      "solutions.resume.point1": "بناء ذكي للسيرة",
      "solutions.resume.point2": "قوالب احترافية",

      "solutions.attendance.title": "الحضور الذكي",
      "solutions.attendance.desc":
        "نظام حضور ذكي يعتمد على التعرف على الوجوه لتسجيل الحضور تلقائيًا.",
      "solutions.attendance.point1": "التعرف على الوجوه",
      "solutions.attendance.point2": "تقارير فورية",

      "solutions.university.title": "منصة مشاريع الجامعة",
      "solutions.university.desc":
        "منصة لتنظيم مشاريع الطلبة ورفع الملفات ومتابعة الفرق والإشراف الأكاديمي.",
      "solutions.university.point1": "تنظيم الفرق",
      "solutions.university.point2": "متابعة التقييم",

      "solutions.cta": "اطلب النظام",

      "results.kicker": "Proven results",
      "results.title": "نتائج يمكننا تحقيقها معك",

      "results.item1.title": "زيادة وضوح التحويل",
      "results.item1.desc":
        "صفحات تسويقية احترافية واضحة مع أزرار دعوة مباشرة لرفع عدد الاستفسارات وتقليل ضياع الزوار.",

      "results.item2.title": "تقليل وقت الرد",
      "results.item2.desc":
        "أتمتة أو شات بوت يساعدك على الرد خلال دقائق بدل ساعات، مع جمع البيانات بشكل منظم.",

      "results.item3.title": "تشغيل أوضح ووقت أقل",
      "results.item3.desc":
        "نظام أو لوحة تحكم مخصصة تساعدك على تنظيم الطلبات والمتابعة والتقارير الدقيقة.",

      "results.metric1.label": "تحسن في استقبال الطلبات",
      "results.metric2.label": "تقليل وقت الرد الأولي",
      "results.panel.title": "وضوح تشغيلي",

      "security.kicker": "Trust by design",
      "security.title": "الأمان والثقة",
      "security.description":
        "نحمي البيانات ونبني مواقع وأنظمة موثوقة وفق ممارسات حديثة تساعد على رفع ثقة المشروع.",

      "support.kicker": "بعد الإطلاق",
      "support.title": "لا ينتهي دورنا عند التسليم",
      "support.description":
        "نساعدك بعد الإطلاق في المتابعة، التحسين، والدعم الفني حتى يبقى مشروعك مستقرًا ويحقق نتائج أفضل.",

      "support.card1.badge": "دعم فني",
      "support.card1.title": "معالجة ومتابعة",
      "support.card1.desc":
        "معالجة المشاكل التقنية والمتابعة بعد الإطلاق حتى يبقى الموقع أو النظام مستقرًا.",

      "support.card2.badge": "استجابة سريعة",
      "support.card2.title": "وقت واضح للرد",
      "support.card2.desc":
        "رد ومتابعة خلال وقت واضح حسب نوع الطلب وأولوية المشكلة.",

      "support.card3.badge": "تحسينات",
      "support.card3.title": "تطوير مستمر",
      "support.card3.desc":
        "تحسين الأداء وتجربة المستخدم وإضافة تعديلات صغيرة حسب الحاجة بعد التشغيل.",

      "support.card4.badge": "استقرار",
      "support.card4.title": "نسخ احتياطي",
      "support.card4.desc":
        "تجهيزات أساسية للحفاظ على استقرار المشروع وتقليل أثر المشاكل المفاجئة.",

      "support.cta": "اطلب خطة دعم مناسبة",

      "footer.desc":
        "نبني صفحات تسويقية احترافية، مواقع، أنظمة، وأتمتة تساعد الشركات ورواد الأعمال على النمو بشكل أسرع وبطريقة أوضح وأكثر احترافية.",

      "footer.companyH": "الشركة",
      "footer.servicesH": "الخدمات",
      "footer.contactH": "تواصل",

      "footer.about": "من نحن",
      "footer.why": "لماذا نحن",
      "footer.results": "النتائج",
      "footer.security": "الأمان",

      "footer.services": "الخدمات",
      "footer.solutions": "الحلول الجاهزة",
      "footer.offers": "العروض",
      "footer.support": "الدعم بعد التسليم",

      "footer.whatsapp": "واتساب",
      "footer.email": "البريد الإلكتروني",
      "footer.faq": "الأسئلة المتكررة",
      "footer.start": "ابدأ مشروعك",

      "footer.copy": "© Aqua.Tech — جميع الحقوق محفوظة.",

      "form.budget.placeholder": "اختر الميزانية",
      "form.budget.under700": "أقل من $700",
      "form.budget.7001500": "$700 - $1,500",
      "form.budget.15004000": "$1,500 - $4,000",
      "form.budget.over4000": "أكثر من $4,000",
      "form.timeline.placeholder": "اختر الموعد",
      "form.timeline.asap": "بأسرع وقت",
      "form.timeline.twoWeeks": "خلال أسبوعين",
      "form.timeline.oneMonth": "خلال شهر",
      "form.timeline.exploring": "ما زلت أستكشف",
      "form.service.placeholder": "اختر الخدمة",
      "contact.kicker": "ابدأ مشروعك",
      "contact.title": "ابدأ رحلتك الرقمية الآن",
      "contact.subtitle":
        "احكِ لنا عن هدفك الحالي، وسنقترح عليك خطوة البداية، القناة الأنسب للتواصل، وما الذي يجب بناؤه أولًا.",
      "contact.socials": "حسابات التواصل",

      "services.kicker": "ما نبنيه",
      "services.title": "خدمات رقمية تركّز على النمو",
      "services.subtitle":
        "نغطي رحلة مشروعك من الفكرة إلى الإطلاق والنمو المستمر بحلول واضحة قابلة للتنفيذ.",

      "services.landing.title": "صفحات هبوط تسويقية",
      "services.landing.desc":
        "صفحات سريعة وواضحة تساعدك تبدأ الإعلان، تجمع الطلبات، وتحوّل الزوار إلى عملاء محتملين.",
      "services.landing.tag1": "صفحة هبوط",
      "services.landing.tag2": "واتساب",
      "services.landing.tag3": "تتبع",
      "services.landing.cta": "اطلب صفحة هبوط",

      "services.website.title": "مواقع شركات ومتاجر",
      "services.website.desc":
        "نبني مواقع شركات ومتاجر وصفحات خدمات تعزز الثقة، تشرح العرض بوضوح، وتدعم الظهور في البحث.",
      "services.website.tag1": "SEO",
      "services.website.tag2": "CMS",
      "services.website.tag3": "أداء",
      "services.website.cta": "اطلب موقعك",

      "services.ai.title": "أتمتة وذكاء اصطناعي",
      "services.ai.desc":
        "نبني بوتات ومهام تلقائية تساعدك ترد أسرع، تجمع بيانات العملاء، وتقلل العمل اليدوي.",
      "services.ai.tag1": "AI Agent",
      "services.ai.tag2": "أتمتة",
      "services.ai.cta": "ابدأ الأتمتة",

      "services.systems.title": "أنظمة ولوحات تحكم مخصصة",
      "services.systems.desc":
        "أنظمة داخلية، لوحات تحكم، وتكاملات API تنظّم العمليات وتوفر الوقت والتكلفة.",
      "services.systems.tag1": "Dashboard",
      "services.systems.tag2": "API",
      "services.systems.tag3": "Workflow",
      "services.systems.cta": "تحدث مع خبير",

      "services.growth.title": "نمو وتسويق رقمي",
      "services.growth.desc":
        "ندعم نمو مشروعك بخطة محتوى، إعلانات، وتحسين ظهور يساعدك على تحويل الزوار إلى عملاء.",
      "services.growth.tag1": "محتوى",
      "services.growth.tag2": "إعلانات",
      "services.growth.tag3": "نمو",
      "services.growth.cta": "شاهد باقات النمو",

      "services.social.title": "إدارة السوشيال ميديا",
      "services.social.desc":
        "نجهز خطة محتوى، تصاميم، وجدولة تساعدك تبني حضور ثابت وتحول المتابعين إلى عملاء محتملين.",
      "services.social.tag1": "سوشيال",
      "services.social.tag2": "تصميم",
      "services.social.tag3": "تقارير",
      "services.social.cta": "ابدأ إدارة حساباتك",

      "services.design.title": "واجهات وهوية بصرية",
      "services.design.desc":
        "نصمم واجهات وتجارب وهوية بصرية تعطي مشروعك شكلًا احترافيًا وثقة أعلى أمام العملاء.",
      "services.design.tag1": "UI/UX",
      "services.design.tag2": "هوية",
      "services.design.tag3": "تصميم",
      "services.design.cta": "صمّم هويتك",

      "offers.kicker": "عروض الانطلاق",
      "offers.title": "عروض جاهزة للانطلاق",
      "offers.subtitle":
        "إذا كنت تريد بداية سريعة أو عرضًا واضحًا، هذه الباقات هي أفضل نقطة دخول للعمل معنا.",

      "offers.landing.badge": "الأسرع إطلاقًا",
      "offers.landing.title": "صفحات هبوط تسويقية",
      "offers.landing.desc":
        "صفحات تسويقية تجهزك للإعلان وجمع العملاء بخطوات واضحة وسريعة.",
      "offers.landing.point1": "مناسبة للعروض والخدمات والإعلانات",
      "offers.landing.point2": "ربط واتساب / نموذج / CTA واضح",
      "offers.landing.price": "يبدأ من $250 تقريبًا",
      "offers.landing.time": "5–7 أيام",
      "offers.landing.cta": "اطلب صفحة هبوط",

      "offers.bot.badge": "طلب مرتفع",
      "offers.bot.title": "باقة شات بوت ذكي الأساسية",
      "offers.bot.desc":
        "بوت ذكي للموقع أو واتساب يساعدك ترد أسرع وتجمع العملاء بشكل منظم.",
      "offers.bot.point1": "أسئلة متكررة + استقبال طلبات",
      "offers.bot.point2": "ربط بسيط مع واتساب أو نموذج",
      "offers.bot.price": "يبدأ من $400 تقريبًا",
      "offers.bot.time": "3–5 أيام",
      "offers.bot.cta": "اطلب بوت ذكي",

      "offers.growth.badge": "دخل متكرر",
      "offers.growth.title": "باقة النمو",
      "offers.growth.desc":
        "باقة نمو شهرية تجمع بين المحتوى والتصميم والمتابعة لتحويل الحضور الرقمي إلى نتائج.",
      "offers.growth.point1": "خطة محتوى + تصميم + نشر",
      "offers.growth.point2": "تقارير ومتابعة وتحسين مستمر",
      "offers.growth.price": "يبدأ من $300 شهريًا",
      "offers.growth.type": "إدارة + محتوى",
      "offers.growth.cta": "اطلب خطة نمو",

      "offers.discovery.badge": "للمشاريع الأكبر",
      "offers.discovery.title": "مرحلة اكتشاف النظام المخصص",
      "offers.discovery.desc":
        "جلسة تحليل ونطاق عمل أولي للمشاريع المخصصة قبل البدء في التنفيذ الكامل.",
      "offers.discovery.point1": "فهم العمليات والاحتياج الفعلي",
      "offers.discovery.point2": "مخرجات أوضح وسعر أدق لاحقًا",
      "offers.discovery.price": "تسعير حسب النطاق",
      "offers.discovery.type": "Scope واضح",
      "offers.discovery.cta": "احجز جلسة تحليل",

      "faq.kicker": "FAQ",
      "faq.title": "أسئلة متكررة",
      "faq.subtitle":
        "إجابات واضحة تساعدك تعرف كيف نبدأ، كيف نحدد السعر، وما الذي يحدث أثناء التنفيذ وبعد التسليم.",

      "faq.q1": "كم يستغرق تنفيذ صفحة تسويقية أو موقع أو نظام مخصص؟",
      "faq.a1":
        "يعتمد ذلك على نوع الخدمة ونطاقها. الصفحات التسويقية أو الشات بوت يمكن إطلاقها خلال وقت قصير، بينما تحتاج المشاريع الأكبر إلى تحليل أوضح وجدول زمني أدق.",

      "faq.q2": "كيف يتم تحديد سعر الخدمة أو المشروع؟",
      "faq.a2":
        "يتم التسعير حسب نوع الخدمة، نطاق العمل، عدد الصفحات أو الخصائص، التكاملات المطلوبة، وسرعة التنفيذ. بعد فهم هدفك نرسل عرضًا واضحًا بالمراحل والمخرجات.",

      "faq.q3": "هل توفرون خدمات سريعة وحلولًا مخصصة بالكامل؟",
      "faq.a3":
        "نعم. نوفر خدمات سريعة مثل الصفحات التسويقية والبوتات، ونبني أيضًا مواقع وأنظمة مخصصة بالكامل حسب احتياج المشروع وطريقة تشغيله.",

      "faq.q4": "هل يمكنكم بناء شات بوت أو أتمتة للعملاء والعمليات؟",
      "faq.a4":
        "نعم، نبني شات بوتات وأتمتة تساعد في الرد على العملاء، استقبال الطلبات، تنظيم البيانات، وربط النماذج والأدوات لتقليل العمل اليدوي.",

      "faq.q5": "هل توفرون الاستضافة والدومين ورفع الموقع؟",
      "faq.a5":
        "نعم عند الطلب. يمكننا مساعدتك في رفع الموقع، ربط الدومين، تفعيل SSL، وتجهيز الإعدادات الأساسية للتشغيل.",

      "faq.q6": "هل توجد صيانة بعد التسليم؟",
      "faq.a6":
        "نعم، تتوفر باقات دعم وتحسينات وتحديثات حسب الحاجة، حتى يبقى المشروع مستقرًا وقابلًا للتطوير بعد الإطلاق.",

      "faq.q7": "هل يشمل التسليم شرح تشغيل وإدارة الموقع؟",
      "faq.a7":
        "نعم، نسلّم الموقع أو النظام جاهزًا للاستخدام، مع شرح واضح لطريقة الإدارة والتحديثات الأساسية حسب طبيعة المشروع.",

      "faq.q8": "كيف تكون المتابعة أثناء التنفيذ؟",
      "faq.a8":
        "نتفق على قناة تواصل واضحة، ونشاركك التحديثات حسب مراحل التنفيذ، مع توثيق أي تعديل أو قرار مهم حتى تبقى الصورة واضحة.",

      "faq.q9": "هل تقدمون باقات نمو وتسويق مع التنفيذ التقني؟",
      "faq.a9":
        "نعم، يمكن دعم المشروع بباقات نمو تشمل المحتوى، التصميم، الإعلانات، والتحسين المستمر حتى لا يتوقف دورنا عند التسليم فقط.",

      "faq.q10": "هل يمكن توقيع NDA وحماية بيانات المشروع؟",
      "faq.a10":
        "نعم، يمكن توقيع اتفاقية سرية عند الحاجة، ونتعامل مع بيانات المشروع بحذر وفق أفضل الممارسات الممكنة أثناء التطوير والتشغيل.",

      "faq.q11": "هل أحتاج موقعًا كاملًا أم صفحة تسويقية فقط؟",
      "faq.a11":
        "إذا كان هدفك حملة أو خدمة محددة وجمع طلبات بسرعة، فغالبًا الصفحة التسويقية تكفي كبداية. أما إذا كنت تريد حضورًا أوسع وثقة أعلى ومحتوى أكثر، فالموقع الكامل أنسب.",

      "faq.q12": "كيف أعرف أي خدمة مناسبة لي؟",
      "faq.a12":
        "شاركنا هدفك الحالي، وسنحدد لك أسرع بداية مناسبة، وما الذي يجب بناؤه أولًا، وما الذي يمكن تأجيله بدون تكلفة غير ضرورية.",
      "hero.ctaPrimary": "ابدأ مشروعك",
      "hero.ctaSecondary": "استعرض الحلول",
    },

    en: {
      "hero.kicker": "Programming • Launching • Expanding",
      "hero.title": "Digital solutions and real growth",
      "hero.titleAccent": "From launch to scale",
      "hero.subtitle":
        "We build websites and systems focused on attracting leads, receiving requests, and handling the first response through a clear, executable flow.",
      "hero.ctaPrimary": "Start your project",
      "hero.ctaSecondary": "View solutions",

      "about.kicker": "About Aqua.Tech",
      "about.title":
        "Precise digital engineering, not just a beautiful interface",
      "about.description":
        "Aqua.Tech is a digital partner that helps companies and entrepreneurs build a stronger online presence and develop practical websites and systems that support growth and daily operations.",
      "about.card1.title": "A clear plan within 24 hours",
      "about.card1.desc":
        "We quickly understand your goal and define what should be built first and what can be delayed.",
      "about.card2.title": "A solution that scales later",
      "about.card2.desc":
        "We build a useful version now that remains ready for development without rebuilding from scratch.",
      "about.card3.title": "Post-launch support",
      "about.card3.desc":
        "Improvements, adjustments, and feedback handling to keep the solution effective.",
      "about.card4.title": "Result-driven decisions",
      "about.card4.desc":
        "We focus on conversion, response speed, and customer organization instead of decoration only.",

      "trust.kicker": "Why Aqua.Tech",
      "trust.title": "Why choose Aqua.Tech",
      "trust.description":
        "We focus on building clear, executable solutions that serve the project goal instead of only creating a beautiful interface.",
      "trust.card1.kicker": "First step",
      "trust.card1.title": "A clear plan within 24 hours",
      "trust.card1.desc":
        "We quickly understand your goal, then define what should be built first and what can be delayed.",
      "trust.card2.kicker": "Delivery",
      "trust.card2.title": "A solution that scales later",
      "trust.card2.desc":
        "We build a useful version now that remains ready for future development without rebuilding from scratch.",
      "trust.card3.kicker": "Support",
      "trust.card3.title": "Post-launch support",
      "trust.card3.desc":
        "We help with improvements, adjustments, and feedback handling so the solution stays effective.",
      "trust.card4.kicker": "Clarity",
      "trust.card4.title": "Clearer communication",
      "trust.card4.desc":
        "Clear updates during execution, organized outputs, and structured delivery based on the agreement.",
      "trust.title": "Why choose Aqua.Tech",
      "trust.description":
        "We focus on building clear, executable solutions that serve the project goal instead of only creating a beautiful interface.",
      "trust.card1.desc":
        "We quickly understand your goal, then define what should be built first and what can be delayed.",
      "trust.card3.desc":
        "We help with improvements, adjustments, and feedback handling so the solution stays effective.",
      "trust.card4.title": "Clearer communication",
      "trust.card4.desc":
        "Clear updates during execution, organized outputs, and structured delivery based on the agreement.",

      "solutions.kicker": "Deployment ready",
      "solutions.title": "Ready solutions to launch",
      "solutions.subtitle":
        "Ready systems and platforms that can be customized based on your business type and current project stage.",

      "solutions.law.title": "Law firm management",
      "solutions.law.desc":
        "A system for managing cases, clients, appointments, and legal files in a clearer way.",
      "solutions.law.point1": "File management",
      "solutions.law.point2": "Appointment tracking",

      "solutions.resume.title": "ResumeIQ",
      "solutions.resume.desc":
        "A tool that helps users create resumes more clearly, faster, and with an easier experience.",
      "solutions.resume.point1": "Smart resume builder",
      "solutions.resume.point2": "Professional templates",

      "solutions.attendance.title": "Smart Attendance",
      "solutions.attendance.desc":
        "A smart attendance system based on face recognition to register attendance automatically.",
      "solutions.attendance.point1": "Face recognition",
      "solutions.attendance.point2": "Instant reports",

      "solutions.university.title": "University projects platform",
      "solutions.university.desc":
        "A platform for organizing student projects, uploading files, tracking teams, and academic supervision.",
      "solutions.university.point1": "Team organization",
      "solutions.university.point2": "Evaluation tracking",

      "solutions.cta": "Request the system",

      "results.kicker": "Proven results",
      "results.title": "Results we can achieve with you",

      "results.item1.title": "Clearer conversion",
      "results.item1.desc":
        "Professional landing pages with clear CTAs to increase inquiries and reduce visitor drop-off.",

      "results.item2.title": "Reduced response time",
      "results.item2.desc":
        "Automation or a chatbot that helps you respond within minutes instead of hours, while collecting data in an organized way.",

      "results.item3.title": "Clearer operations, less time",
      "results.item3.desc":
        "A custom system or dashboard that helps organize requests, follow-ups, and accurate reports.",

      "results.metric1.label": "Improvement in request intake",
      "results.metric2.label": "Reduction in first response time",
      "results.panel.title": "Operational clarity",

      "security.kicker": "Trust by design",
      "security.title": "Security and trust",
      "security.description":
        "We build secure, reliable websites and systems using modern practices that help increase project trust.",

      "support.kicker": "After launch",
      "support.title": "Our role does not end at delivery",
      "support.description":
        "We support you after launch with follow-up, improvements, and technical support to keep your project stable and performing better.",

      "support.card1.badge": "Technical support",
      "support.card1.title": "Issue handling and follow-up",
      "support.card1.desc":
        "We handle technical issues and post-launch follow-up so the website or system stays stable.",

      "support.card2.badge": "Fast response",
      "support.card2.title": "Clear response time",
      "support.card2.desc":
        "Clear response and follow-up time based on the request type and issue priority.",

      "support.card3.badge": "Improvements",
      "support.card3.title": "Continuous improvement",
      "support.card3.desc":
        "Performance and user experience improvements with small adjustments based on post-launch needs.",

      "support.card4.badge": "Stability",
      "support.card4.title": "Backup readiness",
      "support.card4.desc":
        "Essential preparations to protect project stability and reduce the impact of unexpected issues.",

      "support.cta": "Request a suitable support plan",

      "footer.desc":
        "We build professional landing pages, websites, systems, and automation that help companies and entrepreneurs grow faster, clearer, and more professionally.",

      "footer.companyH": "Company",
      "footer.servicesH": "Services",
      "footer.contactH": "Contact",

      "footer.about": "About us",
      "footer.why": "Why us",
      "footer.results": "Results",
      "footer.security": "Security",

      "footer.services": "Services",
      "footer.solutions": "Ready solutions",
      "footer.offers": "Offers",
      "footer.support": "Support after delivery",

      "footer.whatsapp": "WhatsApp",
      "footer.email": "Email",
      "footer.faq": "FAQ",
      "footer.start": "Start Project",

      "footer.copy": "© Aqua.Tech — All rights reserved.",

      "form.budget.placeholder": "Select budget",
      "form.budget.under700": "Under $700",
      "form.budget.7001500": "$700 - $1,500",
      "form.budget.15004000": "$1,500 - $4,000",
      "form.budget.over4000": "Over $4,000",
      "form.timeline.placeholder": "Select timeline",
      "form.timeline.asap": "As soon as possible",
      "form.timeline.twoWeeks": "Within two weeks",
      "form.timeline.oneMonth": "Within one month",
      "form.timeline.exploring": "Still exploring",
      "form.service.placeholder": "Select a service",

      "contact.kicker": "Start Project",
      "contact.title": "Start your digital journey now",
      "contact.subtitle":
        "Tell us about your current goal, and we will suggest the best starting step, the right contact channel, and what should be built first.",
      "contact.socials": "Social accounts",

      "services.kicker": "What we build",
      "services.title": "Growth-focused digital services",
      "services.subtitle":
        "We cover your project journey from idea to launch and continuous growth with clear, executable solutions.",

      "services.landing.title": "Marketing landing pages",
      "services.landing.desc":
        "Fast, focused pages that help you launch ads, collect inquiries, and convert visitors into qualified leads.",
      "services.landing.tag1": "Landing page",
      "services.landing.tag2": "WhatsApp",
      "services.landing.tag3": "Tracking",
      "services.landing.cta": " landing page",

      "services.website.title": "Company websites and stores",
      "services.website.desc":
        "We build company websites, stores, and service pages that strengthen trust, explain your offer clearly, and support search visibility.",
      "services.website.tag1": "SEO",
      "services.website.tag2": "CMS",
      "services.website.tag3": "Performance",
      "services.website.cta": "Request your website",

      "services.ai.title": "AI and automation",
      "services.ai.desc":
        "We build chatbots and automated workflows that help you respond faster, collect customer data, and reduce manual work.",
      "services.ai.tag1": "AI Agent",
      "services.ai.tag2": "Automation",
      "services.ai.cta": "Start automation",

      "services.systems.title": "Custom systems and dashboards",
      "services.systems.desc":
        "Internal systems, dashboards, and API integrations that organize operations and reduce time and cost.",
      "services.systems.tag1": "Dashboard",
      "services.systems.tag2": "API",
      "services.systems.tag3": "Workflow",
      "services.systems.cta": "Talk to an expert",

      "services.growth.title": "Digital growth and marketing",
      "services.growth.desc":
        "We support your growth with content planning, ads, and visibility improvement to turn visitors into customers.",
      "services.growth.tag1": "Content",
      "services.growth.tag2": "Ads",
      "services.growth.tag3": "Growth",
      "services.growth.cta": "View growth packages",

      "services.social.title": "Social media management",
      "services.social.desc":
        "We prepare content plans, designs, and scheduling to build a consistent presence and turn followers into potential customers.",
      "services.social.tag1": "Social",
      "services.social.tag2": "Design",
      "services.social.tag3": "Reports",
      "services.social.cta": "Start account management",

      "services.design.title": "UI and visual identity",
      "services.design.desc":
        "We design interfaces, experiences, and visual identities that give your project a professional look and stronger customer trust.",
      "services.design.tag1": "UI/UX",
      "services.design.tag2": "Brand",
      "services.design.tag3": "Visuals",
      "services.design.cta": "Design your identity",

      "offers.kicker": "Launch offers",
      "offers.title": "Ready launch offers",
      "offers.subtitle":
        "If you want a fast start or a clear package, these offers are the best entry point to work with us.",

      "offers.landing.badge": "Fastest launch",
      "offers.landing.title": "Marketing landing pages",
      "offers.landing.desc":
        "Focused landing pages that prepare you for ads and lead collection with clear, fast steps.",
      "offers.landing.point1":
        "Suitable for offers, services, and ad campaigns",
      "offers.landing.point2": "WhatsApp / form / clear CTA integration",
      "offers.landing.price": "Starts from about $250",
      "offers.landing.time": "5–7 days",
      "offers.landing.cta": "landing page",

      "offers.bot.badge": "High demand",
      "offers.bot.title": "Basic AI chatbot package",
      "offers.bot.desc":
        "A smart chatbot for your website or WhatsApp that helps you respond faster and collect leads in an organized way.",
      "offers.bot.point1": "FAQ handling + request intake",
      "offers.bot.point2": "Simple WhatsApp or form integration",
      "offers.bot.price": "Starts from about $400",
      "offers.bot.time": "3–5 days",
      "offers.bot.cta": " AI chatbot",

      "offers.growth.badge": "Recurring growth",
      "offers.growth.title": "Growth package",
      "offers.growth.desc":
        "A monthly growth package combining content, design, and follow-up to turn digital presence into results.",
      "offers.growth.point1": "Content plan + design + publishing",
      "offers.growth.point2": "Reports, follow-up, and continuous improvement",
      "offers.growth.price": "Starts from $300 / month",
      "offers.growth.type": "Management + content",
      "offers.growth.cta": "growth plan",

      "offers.discovery.badge": "For larger projects",
      "offers.discovery.title": "Custom system discovery phase",
      "offers.discovery.desc":
        "An analysis and scope session for custom projects before starting full implementation.",
      "offers.discovery.point1": "Understand operations and actual needs",
      "offers.discovery.point2":
        "Clearer outputs and more accurate pricing later",
      "offers.discovery.price": "Pricing based on scope",
      "offers.discovery.type": "Clear scope",
      "offers.discovery.cta": "discovery session",
      "faq.kicker": "FAQ",
      "faq.title": "Frequently asked questions",
      "faq.subtitle":
        "Clear answers to help you understand how we start, how pricing is defined, and what happens during execution and after delivery.",

      "faq.q1":
        "How long does it take to build a landing page, website, or custom system?",
      "faq.a1":
        "It depends on the service type and scope. Landing pages and chatbots can usually be launched quickly, while larger projects need clearer analysis and a more accurate timeline.",

      "faq.q2": "How is the project or service price determined?",
      "faq.a2":
        "Pricing depends on the service type, scope, number of pages or features, required integrations, and delivery speed. After understanding your goal, we send a clear offer with phases and deliverables.",

      "faq.q3": "Do you provide both fast services and fully custom solutions?",
      "faq.a3":
        "Yes. We provide fast services such as landing pages and chatbots, and we also build fully custom websites and systems based on the project needs and operations.",

      "faq.q4":
        "Can you build a chatbot or automation for customers and operations?",
      "faq.a4":
        "Yes. We build chatbots and automation flows that help answer customers, receive requests, organize data, and connect forms and tools to reduce manual work.",

      "faq.q5": "Do you provide hosting, domain setup, and website deployment?",
      "faq.a5":
        "Yes, on request. We can help deploy the website, connect the domain, activate SSL, and prepare the basic settings needed for launch.",

      "faq.q6": "Is there maintenance after delivery?",
      "faq.a6":
        "Yes. Support, improvements, and update packages are available depending on your needs, so the project stays stable and ready to grow after launch.",

      "faq.q7": "Does delivery include training on how to manage the website?",
      "faq.a7":
        "Yes. We deliver the website or system ready to use, with a clear explanation of how to manage it and update basic content depending on the project type.",

      "faq.q8": "How do follow-ups work during execution?",
      "faq.a8":
        "We agree on a clear communication channel and share updates based on the execution stages, while documenting important changes or decisions to keep everything clear.",

      "faq.q9":
        "Do you offer growth and marketing packages with technical execution?",
      "faq.a9":
        "Yes. The project can be supported with growth packages that include content, design, ads, and continuous improvement, so our role does not stop at delivery.",

      "faq.q10": "Can we sign an NDA and protect project data?",
      "faq.a10":
        "Yes. An NDA can be signed when needed, and we handle project data carefully using practical best practices during development and operation.",

      "faq.q11": "Do I need a full website or just a landing page?",
      "faq.a11":
        "If your goal is a specific campaign, service, or quick lead collection, a landing page is often enough to start. If you need broader presence, more trust, and more content, a full website is better.",

      "faq.q12": "How do I know which service is right for me?",
      "faq.a12":
        "Share your current goal with us, and we will define the fastest suitable starting point, what should be built first, and what can be delayed without unnecessary cost.",
      "hero.ctaPrimary": "Start your project",
      "hero.ctaSecondary": "View solutions",
    },
  };

  function translateDataI18n(lang) {
    const dict = DATA_I18N[lang] || DATA_I18N.ar;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });
  }
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
        },
      },
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
    document.title =
      lang === "en"
        ? "Aqua.Tech | Digital Solutions and Real Growth"
        : "Aqua.Tech | حلول رقمية ونمو فعلي";

    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        lang === "en"
          ? "Aqua.Tech builds professional landing pages, websites, systems, and automation for real business growth."
          : "Aqua.Tech تبني صفحات تسويقية ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو.",
      );
    }
  }

  function updateToggle(lang) {
    const btn = document.getElementById("langToggle");
    if (!btn) return;

    btn.textContent = lang === "en" ? "AR" : "EN";
    btn.setAttribute(
      "aria-label",
      lang === "en" ? "Switch to Arabic" : "Switch to English",
    );
    btn.setAttribute(
      "title",
      lang === "en" ? "Switch to Arabic" : "Switch to English",
    );
  }

  function applyAquaLanguage(lang) {
    const nextLang = lang === "en" ? "en" : "ar";

    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "en" ? "ltr" : "rtl";
    updateAquaMeta(nextLang);

    translateTextNodes(nextLang);
    translateDataI18n(nextLang);
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
