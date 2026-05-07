    // ====== CONFIG — pulled from global AQUA_CONFIG set in <head> ======
    const WHATSAPP_NUMBER = (window.AQUA_CONFIG || {}).WHATSAPP_NUMBER || "962780932199";
    const CONTACT_EMAIL   = (window.AQUA_CONFIG || {}).CONTACT_EMAIL   || "info.aquatech.jo@gmail.com";
    const INSTAGRAM_URL = "https://www.instagram.com/aquatech.jo/";
    const FACEBOOK_URL = "https://web.facebook.com/profile.php?id=61564549784728";
    const LINKEDIN_URL = "https://www.linkedin.com/company/aqua-teach/";
    const GITHUB_URL = "https://github.com/aquatechjo";

    // Keep the selected language available before any dynamic links/placeholders use it.
    // This prevents the language script from crashing before translations are applied.
    let currentLang = (function(){
      try {
        const saved = localStorage.getItem("aqua_lang");
        return (saved === "ar" || saved === "en") ? saved : (document.documentElement.lang === "en" ? "en" : "ar");
      } catch(e) {
        return document.documentElement.lang === "en" ? "en" : "ar";
      }
    })();



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
// ===== i18n =====
    const I18N = {
      ar: {
        pageTitle: "Aqua.Tech | Growth • Software • AI",
        metaDesc: "Aqua.Tech تبني مواقع احترافية وأنظمة مخصصة وأتمتة بالذكاء الاصطناعي وتدير حسابات السوشيال ميديا لمساعدة الشركات على النمو وتحويل الزوار والمتابعين إلى عملاء.",
        "brand.sub":"",

        "nav.services":"الخدمات",
        "nav.projects":"المشاريع",
        "nav.process":"طريقة العمل",
        "nav.faq":"الأسئلة",
        "nav.contact":"تواصل",
        "nav.why":"لماذا نحن","nav.trust":"لماذا نحن","nav.pricing":"الأسعار","nav.offers":"العروض","nav.results":"Results",
        "nav.about":"من نحن",
        "nav.results":"Results",
        "nav.systems":"Solutions",
        "nav.portfolio2":"المشاريع",
        "nav.testimonials":"المعايير",

        
        "btn.whatsapp":"واتساب",
        "btn.quote":"اطلب عرض سعر",
        "btn.call":"احجز مكالمة مجانية",
        "btn.viewServices":"خدماتنا",

        "hero.badge":"حلول رقمية ونمو فعلي — من الانطلاقة إلى التوسع",
        "skip.main":"تخطَّ إلى المحتوى الرئيسي",
        "hero.devMode":"DEV MODE","hero.terminalLabel":"terminal • deploy",
        "hero.terminalBody":"<span class=\"text-white/80\">$</span> npx create-aqua-app\n<span class=\"text-white/80\">$</span> build --optimize\n<span class=\"text-white/80\">$</span> deploy --env=prod\n<span class=\"text-[var(--p1)]\">✔</span>shipped in<span class=\"text-[var(--p2)]\">minutes</span> — performance ✅",
        "form.modalTitle":"تم إرسال طلبك بنجاح",
        "form.modalText":"سوف نتواصل معك في أقرب وقت",

        "hero.h1a":"نطور مواقع وتطبيقات",
        "hero.h1b":"تنمّي أعمالك وتزيد مبيعاتك",
        "hero.desc":"Aqua.Tech نبني مواقع وأنظمة تركّز على جذب العملاء، استقبال الطلبات، والرد الأولي في مسار واضح وقابل للتنفيذ.",
        "hero.ctaPrimary":"ابدأ الآن",
        "hero.ctaSecondary":"استعرض الحلول",
        "hero.pill1":"⚡ إطلاق أسرع",
        "hero.pill2":"🤖 ردود ومتابعة ذكية",
        "hero.pill3":"📈 تحويل أعلى للطلبات",
        "stats.fastT":"3–5 أيام","stats.fastD":"إطلاق صفحة هبوط",
        "stats.clearT":"24 ساعة","stats.clearD":"خطة واضحة بعد التواصل",
        "stats.qualityT":"2× أسرع","stats.qualityD":"ردود بالأتمتة الذكية",
        "socialproof.c1":"مشروع منجز",
        "socialproof.c2":"متوسط تسليم صفحة هبوط",
        "socialproof.c3":"تسليم كود + ملفات تصميم",
        "socialproof.n2":"3–5 أيام",

        "hero.cardLabel":"خدماتنا الأساسية",
        "hero.cardTitle":"حزمة متكاملة لنموك الرقمي",
        "mini.launchT":"الإطلاق",
        "mini.webT":"الويب",
        "mini.aiT":"AI",
        "mini.growthT":"النمو",
        "mini.landing":"جذب عملاء بسرعة",
        "mini.webs":"موقع احترافي جاهز للنمو",
        "mini.chatbot":"ردود أسرع وتنظيم أذكى",
        "mini.growth":"تحويل الزيارات إلى عملاء",

        "pricing.h":"باقات بأسعار ابتدائية واضحة",
        "pricing.sub":"",
        "pricing.cta":"خلينا نحدد لك الأنسب →",
        "pricing.card1.kicker":"أفضل بداية سريعة",
        "pricing.card1.t":"Landing Page Express",
        "pricing.card1.price":"يبدأ من 250 د.أ",
        "pricing.card1.d":"مناسب للعروض والخدمات والإعلانات والحملات السريعة.",
        "pricing.card2.kicker":"الأكثر طلبًا من الشركات الناشئة",
        "pricing.card2.t":"AI Chatbot Starter",
        "pricing.card2.price":"يبدأ من 400 د.أ",
        "pricing.card2.d":"خيار ممتاز للشركات التي تريد ردًا أسرع وتنظيمًا أفضل للعملاء.",
        "pricing.card3.kicker":"مناسب للنمو الجاد",
        "pricing.card3.t":"موقع أو متجر احترافي",
        "pricing.card3.price":"يبدأ من 700 د.أ",
        "pricing.card3.d":"مناسب للشركات التي تريد حضورًا أقوى وتجربة احترافية قابلة للنمو.",
        "pricing.card4.kicker":"أفضل خطوة قبل المشروع الكبير",
        "pricing.card4.t":"Custom System Discovery",
        "pricing.card4.price":"يبدأ من 150 د.أ",
        "pricing.card4.d":"مرحلة اكتشاف وتحليل تعطيك نطاقًا أوضح وسعرًا أدق للمشاريع الكبيرة.",
        "pricing.cardCta":"خلينا نرشح لك الباقة الأنسب →",
        "pricing.note":"الأسعار ابتدائية واسترشادية، وتتغير حسب النطاق والمزايا والتكاملات المطلوبة.",

        "proof.h":"كيف نخلق قيمة حقيقية لمشروعك",
        "proof.sub":"بدل أن يكون الموقع مجرد “خدمة تقنية”، نربط التنفيذ بهدف تجاري واضح: أسرع إطلاق، تنظيم أفضل، ونمو يمكن قياسه.",
        "proof.card1.kicker":"",
        "proof.card1.t":"صفحة هبوط للإعلانات",
        "proof.card1.d":"إذا كنت تريد إطلاق عرض بسرعة، نبني صفحة واضحة مع دعوة مباشرة للإجراء وربط واتساب أو نموذج حتى تبدأ جمع العملاء فورًا.",
        "proof.card1.r":"النتيجة: بداية أسرع + تحويل أوضح + قياس أفضل.",
        "proof.card2.kicker":"",
        "proof.card2.t":"بوت وأتمتة للاستفسارات",
        "proof.card2.d":"إذا كان عندك ضغط رسائل أو أسئلة متكررة، نجهز لك بوت يساعدك ترد بسرعة ويجمع البيانات بشكل منظم.",
        "proof.card2.r":"النتيجة: وقت أقل ضائع + متابعة أسرع + تجربة عميل أفضل.",
        "proof.card3.kicker":"",
        "proof.card3.t":"نظام مخصص للنمو",
        "proof.card3.d":"إذا كانت شركتك تتوسع وعملياتك أصبحت معقدة، نحلل احتياجك ونبني لوحة أو نظامًا يدعم تشغيلك على المدى البعيد.",
        "proof.card3.r":"النتيجة: تنظيم أعلى + وضوح تشغيلي + قابلية أكبر للتوسع.",


        "offers.h":"عروض جاهزة للانطلاق",
        "offers.sub":"إذا كنت تريد بداية سريعة أو عرضًا واضحًا، هذه الباقات هي أفضل نقطة دخول للعمل معنا.",
        "offers.cta":"احصل على توصية مناسبة لك →",
        "offers.cardCta":"احصل على توصية مناسبة لك →",
        "offers.card1.badge":"الأسرع إطلاقًا",
        "offers.card1.t":"Landing Page Express",
        "offers.card1.d":"صفحة هبوط احترافية تجهزك للإعلان وجمع العملاء بخطوات واضحة وسريعة.",
        "offers.card1.p1":"مناسبة للعروض والخدمات والإعلانات",
        "offers.card1.p2":"ربط واتساب / نموذج / دعوة واضحة للإجراء",
        "offers.card2.badge":"طلب مرتفع",
        "offers.card2.t":"AI Chatbot Starter",
        "offers.card2.d":"بوت ذكي للموقع أو واتساب يساعدك ترد أسرع وتجمع العملاء بشكل منظم.",
        "offers.card2.p1":"أسئلة متكررة + استقبال طلبات",
        "offers.card2.p2":"ربط بسيط مع واتساب أو نموذج",
        "offers.card3.badge":"دخل متكرر",
        "offers.card3.t":"Growth Package",
        "offers.card3.d":"باقة نمو شهرية تجمع بين المحتوى والتصميم والمتابعة لتحويل الحضور الرقمي إلى نتائج.",
        "offers.card3.p1":"خطة محتوى + تصميم + نشر",
        "offers.card3.p2":"تقارير ومتابعة وتحسين مستمر",
        "offers.card4.badge":"للمشاريع الأكبر",
        "offers.card4.t":"Custom System Discovery",
        "offers.card4.d":"جلسة تحليل ونطاق عمل أولي للمشاريع المخصصة قبل البدء في التنفيذ الكامل.",
        "offers.card4.p1":"فهم العمليات والاحتياج الفعلي",
        "offers.card4.p2":"مخرجات أوضح وسعر أدق لاحقًا",


        "hero.readyT":"جاهز نبدأ؟",
        "hero.readyD":"احكيلنا عن مشروعك وسنرجع لك بخطة واضحة وخيارات مناسبة لمرحلتك.",
        "hero.readyCta":"اكتب تفاصيل مشروعك →",

        "services.h":"الخدمات",
        "services.sub":"اختار خدمة واحدة أو خذ باكيدج كامل… إحنا بنغطي كل الرحلة.",
        "services.cta":"اطلب عرض سعر سريع",
        "services.more":" الخدمات",

        "details.h":"الخدمات",
        "details.sub":"اختر خدمة واحدة أو باقة متكاملة — نغطي كامل رحلة مشروعك من الفكرة حتى الإطلاق.",
        "details.allCta":"اطلب استشارة مجانية",
        "details.cta":"خلينا نحدد لك الحل المناسب →",

        "details.landing.kicker":"حلول سريعة",
        "details.landing.t":"Landing Page Express",
        "details.landing.d":"صفحة هبوط احترافية وسريعة تساعدك على إطلاق حملاتك وجمع العملاء المحتملين بسرعة.",
        "details.landing.p1":"تصميم واضح موجه للتحويل ومبني لجمع العملاء المحتملين",
        "details.landing.p2":"متوافقة مع الجوال + أداء سريع + دعوة إجراء واضحة",
        "details.landing.p3":"ربط واتساب / النماذج / التحليلات",

        "details.web.kicker":"تطوير الويب",
        "details.web.t":"مواقع احترافية وسريعة",
        "details.web.d":"صفحات هبوط، مواقع شركات، متاجر، ولوحات تحكم — مهيأة لمحركات البحث وبنهج mobile-first.",
        "details.web.p1":"تصميم واجهات وتجربة مستخدم + بناء واجهات حديثة",
        "details.web.p2":"الواجهة الخلفية / نظام إدارة محتوى / لوحة تحكم عند الحاجة",
        "details.web.p3":"السرعة + تهيئة لمحركات البحث + تتبع التحليلات",

        "details.chatbot.kicker":"ذكاء اصطناعي وأتمتة",
        "details.chatbot.t":"شات بوت وأتمتة بالذكاء الاصطناعي",
        "details.chatbot.d":"نساعدك على بناء بوتات ومسارات أتمتة لتسريع الردود، وتنظيم العملاء المحتملين، وتقليل العمل اليدوي.",
        "details.chatbot.p1":"بوت للموقع أو واتساب للأسئلة الشائعة والاستفسارات",
        "details.chatbot.p2":"أتمتة استقبال العملاء المحتملين ومسارات الرسائل/النماذج",
        "details.chatbot.p3":"ربط مع نظام إدارة العملاء أو جداول Google أو الأنظمة الداخلية",

        "details.custom.kicker":"برمجيات مخصصة",
        "details.custom.t":"أنظمة ولوحات تحكم مصممة لك",
        "details.custom.d":"أنظمة داخلية، أتمتة، وتكاملات API لتوفير الوقت والتكلفة.",
        "details.custom.p1":"تحليل المتطلبات + تصميم قاعدة البيانات + الأدوار والصلاحيات",
        "details.custom.p2":"تكاملات: الدفع / نظام إدارة العملاء / واتساب / والمزيد",
        "details.custom.p3":"تقارير + مراقبة + دعم وصيانة مستمرة",
        "details.custom.p4":"حلول IoT وربط أجهزة وحساسات مع النظام ولوحات التحكم",


        "details.growth.kicker":"النمو والتسويق",
        "details.growth.t":"باقات النمو والتسويق الرقمي",
        "details.growth.d":"ندعم نموك بالمحتوى والإعلانات وتحسين الظهور ورفع تحويل الزوار إلى عملاء.",
        "details.growth.p1":"إدارة السوشال ميديا + محتوى + تصميم + جدولة",
        "details.growth.p2":"إعلانات مدفوعة وتحسين التحويل",
        "details.growth.p3":"تقارير شهرية ومتابعة مستمرة للأداء",

        "details.social.kicker":"إدارة حسابات السوشيال ميديا",
        "details.social.t":"إدارة حسابات السوشيال ميديا باحتراف",
        "details.social.d":"نجهز لك خطة محتوى وتصاميم وجدولة ونساعدك تبني حضور ثابت يحول المتابعين إلى عملاء محتملين.",
        "details.social.p1":"خطة محتوى شهرية + أفكار منشورات وريلز حسب نشاطك",
        "details.social.p2":"تصميم بوستات وستوريز وكتابة كابشن مناسب للبراند",
        "details.social.p3":"جدولة ونشر + متابعة الرسائل والتفاعل حسب الباقة",
        "details.social.p4":"تقرير شهري واضح لتحسين الوصول والطلبات",
        "details.social.cta":"ابدأ إدارة حساباتك →",

        "details.design.kicker":"التصميم",
        "details.design.t":"تصميم واجهات وتجربة مستخدم + هوية بصرية",
        "details.design.d":"واجهات مريحة وحديثة مع هوية بصرية تبني الثقة.",
        "details.design.p1":"Wireframes + UI kit + design system",
        "details.design.p2":"الهوية البصرية: استخدام الشعار + الألوان + الخطوط",
        "details.design.p3":"تصميمات للسوشال + أصول تسويقية",

        "svc.appsT":"تطوير تطبيقات",
        "svc.appsD":"تطبيقات iOS/Android بأداء عالي وتجربة مستخدم ممتازة—من MVP لمنتج كامل.",
        "svc.webT":"تطوير مواقع",
        "svc.webD":"مواقع سريعة وجميلة، صفحات هبوط، متاجر، ولوحات تحكم—جاهزة للسيو والتسويق.",
        "svc.customT":"برمجيات مخصصة",
        "svc.customD":"أنظمة داخلية، أتمتة، تكاملات… حلول على مقاس شغلك.",
        "svc.designT":"تصميم",
        "svc.designD":"تصميم واجهات وتجربة مستخدم، هوية بصرية، براندنج، وتصاميم للسوشال… مظهر احترافي يبيع.",
        "svc.motionT":"موشن جرافيك",
        "svc.motionD":"إعلانات قصيرة، ريلز، فيديوهات تعريفية… قصة جذابة تزيد التحويل.",
        "svc.socialT":"إدارة سوشال ميديا",
        "svc.socialD":"خطة محتوى، تصميم بوستات، جدولة، إدارة رسائل… حضور قوي ومستمر.",

        
        "nav.results":"Results",
        "results.h":"نتائج يمكننا تحقيقها معك",
        "results.sub":"",
        "results.c1k":"Landing page + ads",
        "results.c1t":"زيادة وضوح التحويل وجمع الاستفسارات",
        "results.c1d":"صفحة هبوط واضحة مع CTA مباشر وربط واتساب أو نموذج يمكن أن تساعدك على رفع عدد الاستفسارات وتقليل ضياع الزوار بين الزيارة والطلب.",
        "results.c2k":"AI + automation",
        "results.c2t":"تقليل وقت الرد وتنظيم العملاء المحتملين",
        "results.c2d":"أتمتة أو شات بوت يساعدك على الرد خلال دقائق بدل ساعات، مع جمع البيانات وربطها بالأدوات التي تستخدمها حاليًا.",
        "results.c3k":"Custom system",
        "results.c3t":"تشغيل أوضح ووقت أقل ضائع",
        "results.c3d":"نظام أو لوحة تحكم مخصصة تساعدك على تنظيم الطلبات والمتابعة والتقارير، وتقليل الاعتماد على التتبع اليدوي العشوائي.",
        "footer.tag":"Growth • Software • AI",
        "footer.desc":"نبني صفحات هبوط ومواقع وأنظمة وأتمتة تساعد الشركات ورواد الأعمال على النمو بشكل أسرع وأكثر وضوحًا واحترافية.",
        "footer.servicesH":"الخدمات",
        "footer.contactH":"التواصل",
        "footer.link1":"العروض",
        "footer.link2":"الخدمات",
        "footer.link3":"الأسعار الابتدائية",
        "footer.link4":"النتائج المتوقعة",
        "footer.link5":"ابدأ مشروعك",
        "footer.copy":"© Aqua.Tech — All rights reserved.",
        "footer.note":"جاهزون لمساعدتك على الإطلاق والنمو والأتمتة.",

        "nav.systems":"Solutions",
        "nav.portfolio2":"Projects",
        "nav.testimonials":"Experience",
        "systems.h":"Ready-made solutions",
        "systems.sub":"Ready-made systems and platforms that can be adapted to your business type and current stage.",
        "systems.cta":"Request the right system →",
        "systems.cardCta":"Request this system →",
        "systems.card1.kicker":"Legal operations",
        "systems.card1.t":"Law Firm Management System",
        "systems.card1.d":"A system that helps manage cases, clients, appointments, and legal files more clearly and efficiently.",
        "systems.card1.p1":"Case and file management",
        "systems.card1.p2":"Client and appointment tracking",
        "systems.card2.kicker":"Academic workflow",
        "systems.card2.t":"University Project Hub",
        "systems.card2.d":"A platform for organizing student projects, uploading files, tracking teams, and supporting academic supervision.",
        "systems.card2.p1":"Organize student teams and projects",
        "systems.card2.p2":"File uploads and evaluation tracking",
        "systems.card3.kicker":"Career tools",
        "systems.card3.t":"ResumeIQ",
        "systems.card3.d":"A tool that helps users create resumes faster, more clearly, and with a smoother experience.",
        "systems.card3.p1":"Create your resume easily",
        "systems.card3.p2":"Organize content professionally",
        "systems.card4.kicker":"Attendance management",
        "systems.card4.t":"Smart Attendance",
        "systems.card4.d":"A smart attendance system powered by face recognition to register attendance automatically through a camera while reducing manual errors and improving daily tracking.",
        "systems.card4.p1":"Automatic attendance via camera",
        "systems.card4.p2":"Better attendance reports and organization",
        "portfolio2.h":"Real-world applications of these solutions",
        "portfolio2.sub":"Examples showing how these systems can be applied in real scenarios across different fields.",
        "portfolio2.c1k":"Use case",
        "portfolio2.c1t":"System for a law firm",
        "portfolio2.c1d":"A system that helps a law firm organize cases, clients, and appointments more clearly.",
        "portfolio2.c1s":"",
        "portfolio2.c2k":"Use case",
        "portfolio2.c4k":"Use case",
        "portfolio2.c4t":"Smart attendance system with face recognition",
        "portfolio2.c4d":"An AI-powered attendance system built with computer vision to register attendance automatically through a camera, reduce manual errors, and improve day-to-day monitoring.",
        "portfolio2.c4s":"",
        "portfolio2.cardCta":"Request a similar solution →",
        "portfolio2.c1p1":"Organize cases and files more clearly",
        "portfolio2.c1p2":"Track clients and appointments more easily",
        "portfolio2.c2p1":"Organize project teams and tasks",
        "portfolio2.c2p2":"Upload files and track evaluation",
        "portfolio2.c3p1":"A simpler resume-building experience",
        "portfolio2.c3p2":"Organize content professionally",
        "portfolio2.c4p1":"Automatic attendance registration via camera",
        "portfolio2.c4p2":"Reduce manual errors and manipulation",
        "portfolio2.c2t":"Platform for university projects",
        "portfolio2.c2d":"A platform used to organize student projects, upload files, and simplify academic follow-up and evaluation.",
        "portfolio2.c2s":"",
        "portfolio2.c3k":"Use case",
        "portfolio2.c3t":"Resume builder for job seekers",
        "portfolio2.c3d":"A simplified experience that helps users create resumes faster and more clearly.",
        "portfolio2.c3s":"",
        "testimonials.h":"مبادئ عمل نلتزم بها في كل مشروع",
        "testimonials.sub":"كل مشروع ننفذه يعكس هذه المبادئ بشكل عملي — وضوح، جودة، ونتائج قابلة للقياس.",
        "testimonials.q1":"المتطلبات والخطوات يجب أن تبقى واضحة، والعميل يعرف دائمًا أين وصل المشروع وما الخطوة التالية.",
        "testimonials.a1":"وضوح في التواصل والتنفيذ",
        "testimonials.q2":"نركز على حلول تدعم الهدف التجاري، وليس فقط شكل جميل بدون نتيجة يمكن قياسها.",
        "testimonials.a2":"تركيز على النتيجة",
        "testimonials.q3":"نبني مع قابلية التوسع حتى يبدأ المشروع بشكل صحيح اليوم ويبقى جاهزًا للنمو والتحسين لاحقًا.",
        "testimonials.a3":"تفكير طويل المدى",
      "nav.security":"الأمان",
      "security.h":"الأمان والثقة",
      "security.sub":"نبني المواقع والأنظمة وفق ممارسات حديثة تساعد على رفع الأمان، حماية البيانات، وتقوية موثوقية المشروع عند الإطلاق والتوسع.",
      "security.cta":"اطلب موقعًا أكثر أمانًا",
      "security.card1.kicker":"Connection",
      "security.card1.t":"اتصال آمن وموثوق",
      "security.card1.d":"تفعيل HTTPS وسياسات التصفح الأساسية لحماية نقل البيانات وتعزيز الثقة أثناء التصفح أو إرسال النماذج.",
      "security.card2.kicker":"Application",
      "security.card2.t":"حماية على مستوى التطبيق",
      "security.card2.d":"نطبق التحقق من المدخلات، تنقية النصوص، حماية النماذج، وتقليل المخاطر الشائعة مثل الرسائل المزعجة أو الإدخال غير الآمن.",
      "security.card3.kicker":"Deployment",
      "security.card3.t":"تهيئة آمنة أثناء النشر",
      "security.card3.d":"نهيئ المتصفح والروابط الخارجية والطلبات بشكل أكثر أمانًا، مع جاهزية لإضافة Cloudflare وSecurity Headers من جهة الاستضافة.",
      "security.card4.kicker":"Trust",
      "security.card4.t":"ثقة أعلى للمشروع والعملاء",
      "security.card4.d":"الموقع الآمن لا يحمي المشروع فقط، بل يرفع الانطباع المهني ويزيد ثقة العميل عند التواصل أو مشاركة بياناته.",
      "security.list.kicker":"Included practices",
      "security.list.h":"ما الذي نأخذه بعين الاعتبار",
      "security.list.i1":"SSL / HTTPS وتشفير الاتصال",
      "security.list.i2":"Security Headers وسياسات المتصفح الأساسية",
      "security.list.i3":"التحقق من المدخلات وتنقية بيانات النماذج",
      "security.list.i4":"حماية من السبام ومحاولات الإرسال المتكرر",
      "security.list.i5":"جاهزية لدمج Cloudflare وحماية الاستضافة",
      "security.note.kicker":"Professional note",
      "security.note.h":"مهم",
      "security.note.d":"لا يوجد موقع غير قابل للاختراق 100٪، لكن يمكن بناء موقع بمستوى حماية أعلى يقلل المخاطر ويجعل الهجوم أصعب وأكثر كلفة.",
      "security.note.extra":"للحماية الأقوى على الإنتاج ننصح بتفعيل Cloudflare وHSTS وWAF من جهة الاستضافة أو CDN.",
      "form.security1":"🔒 مدخلات مُتحقق منها",
      "form.security2":"🛡️ حماية من السبام",
      "form.security3":"⚙️ تهيئة آمنة عند النشر",
      "msg.statusInvalidName":"يرجى كتابة اسم صحيح.",
      "msg.statusInvalidEmail":"يرجى إدخال بريد إلكتروني صحيح.",
      "msg.statusInvalidPhone":"يرجى إدخال رقم واتساب صحيح.",
      "msg.statusInvalidDetails":"يرجى كتابة تفاصيل أوضح عن المشروع.",
      "msg.statusTooFast":"يرجى الانتظار قليلًا قبل إرسال طلب جديد.",
      "msg.statusSpam":"تم تجاهل الطلب لأنه يبدو غير صالح.",
      "msg.statusConfigHelp":"فعّل Cloudflare وSecurity Headers من جهة الاستضافة للحصول على حماية أقوى على الإنتاج.",

        "trust.h":"لماذا تختار Aqua.Tech",
        "trust.sub":"",
        "trust.c1k":"الخطوة الأولى",
        "trust.c1t":"خطة واضحة خلال 24 ساعة",
        "trust.c1d":"نفهم هدفك بسرعة، ثم نحدد لك ما الذي يجب بناؤه أولًا، وما الذي يمكن تأجيله، وما أنسب نقطة بداية لميزانيتك ومرحلتك.",
        "trust.c2k":"Delivery",
        "trust.c2t":"حل يُشغّل اليوم ويتوسع لاحقًا",
        "trust.c2d":"نبني بشكل عملي من البداية، بحيث تحصل على نسخة مفيدة الآن، وتبقى جاهزة للتطوير لاحقًا بدون إعادة بناء من الصفر.",
        "trust.c3k":"Support",
        "trust.c3t":"دعم وتحسين بعد الإطلاق",
        "trust.c3d":"بعد الإطلاق نساعدك في التحسينات، التعديلات، ومعالجة الملاحظات حتى يبقى الحل فعالًا ويعطي نتيجة أفضل.",
        "trust.c4k":"الوضوح",
        "trust.c4t":"تواصل أوضح وقرار أسرع",
        "trust.c4d":"تحديثات واضحة أثناء التنفيذ، ومخرجات مرتبة، وتسليم منظم حسب الاتفاق حتى تعرف دائمًا أين وصل المشروع وما التالي.",
        "results.cta":"خلينا نحدد لك النتيجة المناسبة →",
        "portfolio2.cta":"اطلب حل مشابه →",
        "contact.trustT":"قبل إرسال الطلب:",
        "contact.trustD":"يكفينا وصف مختصر ووسيلة تواصل واحدة على الأقل لنرجع لك بتوصية أولية وخطوة تنفيذ واضحة بدون تعقيد.",
        "fit.h":"هل هذا مناسب لك؟",
        "fit.sub":"",
        "fit.cta":"خلينا نحدد لك البداية المناسبة →",
        "fit.goodK":"مناسب لك إذا",
        "fit.goodT":"أنت في مرحلة تحتاج قرارًا عمليًا",
        "fit.good1":"عندك مشروع جديد وتريد أن تبدأ بشكل مرتب وواضح",
        "fit.good2":"عندك زيارات أو استفسارات لكن التحويل ما زال ضعيفًا",
        "fit.good3":"تريد نظامًا أو أتمتة تخفف الضغط والعمل اليدوي",
        "fit.badK":"قد لا يكون مناسبًا الآن إذا",
        "fit.badT":"أنت لا تريد نتيجة واضحة من الموقع أو النظام",
        "fit.bad1":"تبحث فقط عن شكل جميل بدون هدف تجاري أو تشغيلي واضح",
        "fit.bad2":"لا تريد تحديد خطوة بداية أو نطاق أولي للمشروع",
        "fit.bad3":"تريد كل شيء دفعة واحدة بدون ترتيب أولويات",
        "sticky.kicker":"بداية سريعة",
        "sticky.title":"ابدأ معنا بخطوة واضحة",
        "sticky.cta":"اطلب عرضًا مبدئيًا",
        "why.h":"لماذا تختار Aqua.Tech",
        "why.sub":"لأننا نجمع بين التنفيذ التقني، التفكير التجاري، وسرعة الإنجاز لنساعدك تبدأ بشكل قوي وتكبر بشكل أذكى وبتكلفة أوضح.",
        "why.c1t":"تنفيذ واضح",
        "why.c1d":"خطة عمل واضحة من البداية حتى التسليم.",
        "why.c2t":"حلول مخصصة",
        "why.c2d":"نطوّر حسب احتياج مشروعك، مش قوالب جاهزة فقط.",
        "why.c3t":"تواصل سريع",
        "why.c3d":"متابعة واضحة وتحديثات مستمرة أثناء التنفيذ.",
        "why.c4t":"دعم بعد التسليم",
        "why.c4d":"نظل معك بعد الإطلاق للتحسين والدعم عند الحاجة.",
        "about.h":"من نحن",
        "about.d":"Aqua.Tech شريك رقمي يساعد الشركات ورواد الأعمال على بناء حضور قوي، تطوير مواقع وصفحات هبوط وأنظمة أكثر كفاءة، وتحويل الأفكار إلى حلول عملية قابلة للنمو. نركز على الدمج بين التنفيذ التقني، الأتمتة الذكية، والنتائج التجارية الواضحة.",
        "process.h":"طريقة العمل",
        "process.sub":"أربع مراحل واضحة من الاكتشاف حتى الإطلاق والدعم.",
        "process.s1t":"اكتشاف","process.s1d":"نفهم الهدف والجمهور ونحدد النطاق والتوقيت.",
        "process.s2t":"تصميم","process.s2d":"تجربة مستخدم + واجهات متناسقة مع الهوية.",
        "process.s3t":"تطوير","process.s3d":"بناء المنتج واختبارات جودة وأداء.",
        "process.s4t":"إطلاق ودعم","process.s4d":"إطلاق + تحسينات + صيانة حسب الحاجة.",
        "process.cta":"اطلب خطة تنفيذ",
        "process.s1b1":"جلسة اكتشاف سريعة + تحديد نطاق",
        "process.s1b2":"تقدير وقت وتكلفة بشكل واضح",
        "process.s1b3":"اقتراح تقنيات مناسبة للمشروع",
        "process.s2b1":"مخططات أولية + مكتبة واجهات",
        "process.s2b2":"تصميم متجاوب Mobile-first",
        "process.s2b3":"تجربة مستخدم سلسة وواضحة",
        "process.s3b1":"تطوير Frontend + Backend عند الحاجة",
        "process.s3b2":"اختبارات + تحسين أداء",
        "process.s3b3":"تسليم نسخة تجريبية للتقييم",
        "process.s4b1":"نشر على الاستضافة/المتاجر",
        "process.s4b2":"مراقبة وتحسين مستمر",
        "process.s4b3":"صيانة ودعم حسب الاتفاق",

        "faq.h":"أسئلة متكررة",
        "faq.q1":"كم يستغرق تنفيذ صفحة هبوط أو موقع أو نظام مخصص؟",
        "faq.a1":"يعتمد ذلك على نوع الخدمة ونطاقها. بعض الخدمات السريعة مثل صفحة الهبوط أو الشات بوت يمكن إطلاقها خلال وقت قصير، بينما تحتاج المشاريع الأكبر إلى نطاق أوضح وجدول زمني أدق.",
        "faq.q2":"كيف يتم تحديد سعر الخدمة أو المشروع؟",
        "faq.a2":"يتم التسعير حسب نوع الخدمة، نطاق العمل، التكاملات المطلوبة، وسرعة التنفيذ. ستحصل على عرض واضح يشرح المراحل والمخرجات.",
        "faq.q3":"هل توفرون خدمات سريعة وأيضًا حلولًا مخصصة بالكامل؟",
        "faq.a3":"نعم. نوفر خدمات سريعة للدخول إلى السوق مثل صفحات الهبوط والبوتات، ونبني أيضًا مواقع وأنظمة مخصصة بالكامل حسب احتياج المشروع.",
        "faq.q4":"هل توفرون شات بوت وأتمتة للأعمال؟",
        "faq.a4":"نعم، نبني شات بوتات وأتمتة تساعد في الرد على العملاء، تنظيم الطلبات، وربط النماذج والأنظمة لتقليل العمل اليدوي.",

        "contact.h":"اطلب النظام المناسب لمرحلتك",
        
        "hero.ctaPrimary":"Start your system now",
        "hero.readyD":"Tell us about your project and we will come back with a clear plan and the right starting options.",
        "contact.sub":"شاركنا هدفك الحالي، وسنرجع لك بتوصية أولية، قناة التواصل الأنسب، وخطوة تالية واضحة تناسب مرحلة مشروعك بدون تعقيد.",
        "contact.waAction":"ابدأ معنا عبر واتساب",
        "contact.emailAction":"راسلنا عبر البريد الإلكتروني",
        "form.sendQuote":"احصل على توصية أولية وخطوة تنفيذ واضحة",
        "form.replyNote":"نراجع طلبك ونرجع لك عادة خلال 24 ساعة بخطة واضحة وخطوة بداية مناسبة.",
        "contact.sub":"شاركنا تفاصيل مشروعك أو هدفك التجاري، وسنرجع لك بخطة واضحة، نطاق مناسب، وخطوة بداية عملية تناسب مرحلتك الحالية.",
        "contact.wa":"واتساب",
        "contact.waAction":"محادثة على الواتساب",
        "contact.email":"إيميل",
                "contact.emailAction":"راسلنا عبر البريد الإلكتروني",
        "contact.social":"حسابات التواصل",
        "contact.loc":"الموقع",
        "contact.locV":"عمّان، الأردن",

        "form.name":"الاسم",
        "form.contact":"وسيلة التواصل",
        "form.emailLabel":"البريد الإلكتروني",
        "form.emailPh":"example@mail.com",
        "form.countryCodeLabel":"رمز الدولة",
        "form.phoneLabel":"رقم الواتساب",
        "form.phonePh":"7XXXXXXXX",
        "form.contactHelp":"",
        "form.service":"الخدمة المطلوبة",
        "form.budget":"الميزانية التقريبية",
        "form.budgetPlaceholder":"اختر الميزانية",
        "form.budgetOpt1":"أقل من 500 د.أ",
        "form.budgetOpt2":"500 - 1500 د.أ",
        "form.budgetOpt3":"1500 - 3000 د.أ",
        "form.budgetOpt4":"3000+ د.أ",
        "form.timeline":"موعد التنفيذ",
        "form.timelinePlaceholder":"اختر الموعد",
        "form.timelineOpt1":"بأسرع وقت",
        "form.timelineOpt2":"خلال أسبوعين",
        "form.timelineOpt3":"خلال شهر",
        "form.timelineOpt4":"ما زلت أستكشف",
        "form.namePh":"اسمك",
        "form.detailsPh":"اكتب الهدف، المميزات، والموعد المتوقع…",
        "form.sendQuote":"احصل على خطة أولية وعرض مبدئي",
        "form.replyNote":"نراجع الطلب ثم نرجع لك عادة خلال 24 ساعة بقناة الرد الأنسب وخطوة البداية المقترحة.",
        "form.details":"تفاصيل المشروع",
        "form.opt1":"موقع ونظام استقبال عملاء",
        "form.opt2":"أتمتة أعمال بالذكاء الاصطناعي",
        "form.opt3":"نظام إدارة العملاء",
        "form.opt4":"أتمتة واتساب",
        "form.opt5":"أتمتة البريد الإلكتروني",
        "form.opt6":"تحسين صفحة الهبوط",
        "form.optSocial":"إدارة حسابات السوشيال ميديا",
        "form.socialDetailsPh":"اكتب لنا عدد الحسابات، نوع النشاط، هل لديك محتوى جاهز، وكم منشور/ريلز تحتاج شهريًا.",
        "form.opt7":"نظام إدارة مكاتب المحاماة",
        "form.opt8":"منصة إدارة المشاريع الجامعية",
        "form.opt9":"ResumeIQ",
        "form.opt10":"Smart Attendance",
        "form.sendWA":"إرسال عبر واتساب",
        "form.sendEmail":"إرسال عبر الإيميل",
        "form.sendLead":"إرسال الطلب",

        "footer.rights":"Aqua.Tech — جميع الحقوق محفوظة.",
        "floating.contact":"تواصل سريع",

        "ph.t1":"تجريبي","ph.h1":"Case Study — مشروعك الأول","ph.d1":"ملخص + الهدف + الحل + النتيجة (عند توفر مشاريع).",
        "ph.t2":"تجريبي","ph.h2":"Mobile App — قريبًا","ph.d2":"لقطات شاشة + تقنيات + مميزات مختصرة.",
        "ph.t3":"تجريبي","ph.h3":"Custom System — قريبًا","ph.d3":"المشكلة التي حلّها النظام + النتائج.",
        "faq.sub":"إجابات على الأسئلة الشائعة قبل البدء بأي مشروع.",
        "faq.q5":"هل توفرون الاستضافة والدومين ورفع الموقع؟",
        "faq.a5":"نعم عند الطلب، مع SSL ورفع الموقع وإعدادات تشغيل أساسية.",
        "faq.q6":"هل توجد صيانة بعد التسليم؟",
        "faq.a6":"نعم، باقات دعم وتحديثات أمنية وتحسينات أداء حسب الحاجة.",
        "faq.q7":"هل تسلمون الكود وملفات التصميم؟",
        "faq.a7":"نعم، تسليم منظم (كود + تصميم) مع شرح تشغيل واضح.",
        "faq.q8":"كيف تكون المتابعة أثناء التنفيذ؟",
        "faq.a8":"نتفق على قناة تواصل وتحديثات حسب المراحل مع توثيق أي تغيير.",
        "faq.q9":"هل تقدمون باقات نمو وتسويق مع التنفيذ التقني؟",
        "faq.a9":"نعم، يمكننا دعم المشروع بباقات نمو تشمل المحتوى، التصميم، الإعلانات، والتحسين المستمر حتى لا يتوقف دورنا عند التسليم فقط.",
        "faq.q10":"هل يمكن توقيع NDA وحماية البيانات؟",
        "faq.a10":"نعم، يمكن توقيع NDA ونتبع ممارسات أمان لحماية البيانات أثناء التطوير.",
        "faq.q11":"هل أحتاج إلى موقع كامل أم صفحة هبوط فقط؟",
        "faq.a11":"إذا كان هدفك جمع العملاء بسرعة لحملة أو خدمة محددة، فغالبًا تكفي صفحة الهبوط كبداية. أما إذا كنت تريد حضورًا أوسع وثقة أعلى ومحتوى أكثر، فالموقع الكامل يكون أنسب.",
        "faq.q12":"كيف أعرف أي خدمة مناسبة لي؟",
        "faq.a12":"بمجرد أن تشاركنا هدفك الحالي، نحدد لك أسرع بداية مناسبة، وما الذي يجب بناؤه أولًا، وما الذي يمكن تأجيله بدون تكلفة غير ضرورية.",
        "faq.a10":"نعم، يمكن توقيع NDA ونتبع ممارسات أمان لحماية البيانات أثناء التطوير.",

        "form.modalOk":"حسنًا",
        "nav.results":"Results",

        "nav.portfolio2":"المشاريع",

        "nav.testimonials":"المعايير",

        "hero.ctaPrimary":"ابدأ الآن",

        "hero.readyD":"احكيلنا عن مشروعك وسنرجع لك بخطة واضحة وخيارات مناسبة لمرحلتك.",

        "results.sub":"",

        "testimonials.h":"مبادئ عمل نلتزم بها في كل مشروع",

        "testimonials.sub":"كل مشروع ننفذه يعكس هذه المبادئ بشكل عملي — وضوح، جودة، ونتائج قابلة للقياس.",

        "testimonials.q1":"المتطلبات والخطوات يجب أن تبقى واضحة، والعميل يعرف دائمًا أين وصل المشروع وما الخطوة التالية.",

        "testimonials.a1":"وضوح في التواصل والتنفيذ",

        "testimonials.q2":"نركز على حلول تدعم الهدف التجاري، وليس فقط شكل جميل بدون نتيجة يمكن قياسها.",

        "testimonials.a2":"تركيز على النتيجة",

        "testimonials.q3":"نبني مع قابلية التوسع حتى يبدأ المشروع بشكل صحيح اليوم ويبقى جاهزًا للنمو والتحسين لاحقًا.",

        "testimonials.a3":"تفكير طويل المدى",

        msg: {
          subject: "طلب جديد من موقع Aqua.Tech",
          name: "الاسم",
          contact: "رقم/إيميل",
          service: "الخدمة",
          budget: "الميزانية التقريبية",
          timeline: "موعد التنفيذ",
          details: "تفاصيل",
          statusNeed: "اكتب اسمك + تفاصيل سريعة عن المشروع.",
          statusWA: "تم فتح واتساب برسالة جاهزة ✅",
          statusEmail: "تم فتح البريد برسالة جاهزة ✅",
          statusSending: "جاري إرسال الطلب…",
          statusSent: "تم إرسال طلبك بنجاح ✅",
          statusFail: "تعذر الإرسال. جرّب مرة ثانية.",
          statusConfig: "يرجى ضبط رابط جداول Google داخل إعدادات الصفحة أولاً."
        }
      },

      en: {

        "nav.systems":"Solutions",
        "systems.h":"Ready-made solutions",
        "systems.sub":"Ready-made systems and platforms that can be adapted to your business type and current stage.",
        "systems.cta":"Request the right system →",
        "systems.cardCta":"Request this system →",
        "systems.card1.kicker":"Legal operations",
        "systems.card1.t":"Law Firm Management System",
        "systems.card1.d":"A system that helps manage cases, clients, appointments, and legal files more clearly and efficiently.",
        "systems.card1.p1":"Case and file management",
        "systems.card1.p2":"Client and appointment tracking",
        "systems.card2.kicker":"Academic workflow",
        "systems.card2.t":"University Project Hub",
        "systems.card2.d":"A platform for organizing student projects, uploading files, tracking teams, and supporting academic supervision.",
        "systems.card2.p1":"Organize student teams and projects",
        "systems.card2.p2":"File uploads and evaluation tracking",
        "systems.card3.kicker":"Career tools",
        "systems.card3.t":"ResumeIQ",
        "systems.card3.d":"A tool that helps users create resumes faster, more clearly, and with a smoother experience.",
        "systems.card3.p1":"Create your resume easily",
        "systems.card3.p2":"Organize content professionally",
        "portfolio2.h":"Real-world applications of these solutions",
        "portfolio2.sub":"Examples showing how these systems can be applied in real scenarios across different fields.",
        "portfolio2.cta":"Request a similar solution →",
        "portfolio2.c1k":"Use case",
        "portfolio2.c1t":"System for a law firm",
        "portfolio2.c1d":"A system that helps a law firm organize cases, clients, and appointments more clearly.",
        "portfolio2.c1s":"",
        "portfolio2.c2k":"Use case",
      "portfolio2.c4k":"Use case",
      "portfolio2.c4t":"Smart attendance system with face recognition",
      "portfolio2.c4d":"An AI-powered attendance system built with computer vision to register attendance automatically through a camera, reduce manual errors, and improve day-to-day monitoring.",
      "portfolio2.c4s":"",
        "portfolio2.c2t":"Platform for university projects",
        "portfolio2.c2d":"A platform used to organize student projects, upload files, and simplify academic follow-up and evaluation.",
        "portfolio2.c2s":"",
        "portfolio2.c3k":"Use case",
        "portfolio2.c3t":"Resume builder for job seekers",
        "portfolio2.c3d":"A simplified experience that helps users create resumes faster and more clearly.",
        "portfolio2.c3s":"",

        pageTitle: "Aqua.Tech | Growth • Software • AI",
        metaDesc: "Aqua.Tech builds professional websites, landing pages, custom systems, and AI automation to help businesses grow and convert better.",
        "brand.sub":" ",

        "nav.services":"Services",
        "nav.projects":"Projects",
        "nav.process":"Process",
        "nav.faq":"FAQ",
        "nav.contact":"Contact",
        "nav.why":"Why us","nav.trust":"Why us","nav.pricing":"Pricing","nav.offers":"Offers","nav.results":"Results",
        "nav.about":"About",
        "nav.results":"Results",
        "nav.portfolio2":"projects",
        "nav.testimonials":"Standards",

        
        "btn.whatsapp":"WhatsApp",
        "btn.quote":"Get a Quote",
        "btn.call":"Book a Free Call",
        "btn.viewServices":"View Services",

        "hero.badge":"Digital solutions built for launch , long-term growth",
        "skip.main":"Skip to main content",
        "hero.devMode":"DEV MODE","hero.terminalLabel":"terminal • deploy",
        "hero.terminalBody":"<span class=\"text-white/80\">$</span> npx create-aqua-app\n<span class=\"text-white/80\">$</span> build --optimize\n<span class=\"text-white/80\">$</span> deploy --env=prod\n<span class=\"text-[var(--p1)]\">✔</span> shipped in <span class=\"text-[var(--p2)]\">minutes</span> — performance ✅",
        "form.modalTitle":"Your request was sent successfully",
        "form.modalText":"We will contact you as soon as possible",
        "hero.h1a":"We build websites & apps and systems",
        "hero.h1b":"That which grows and increases sales",
        "hero.desc":"Aqua.Tech builds websites and systems focused on lead capture, request intake, and first response in one clear, practical flow.",
        "hero.ctaPrimary":"Start now",
        "hero.ctaSecondary":"View services",
        "hero.pill1":"⚡ Faster launch",
        "hero.pill2":"🤖 Smarter follow-up",
        "hero.pill3":"📈 Higher request conversion",
        "stats.fastT":"3–5 days","stats.fastD":"Landing Page launch",
        "stats.clearT":"24 hours","stats.clearD":"Clear plan after contact",
        "stats.qualityT":"2× faster","stats.qualityD":"Replies via AI automation",
        "socialproof.c1":"Projects completed",
        "socialproof.c2":"Average landing page delivery",
        "socialproof.c3":"Code + design files delivered",
        "socialproof.n2":"3–5 days",

        "hero.cardLabel":"Core services",
        "hero.cardTitle":"All-in-one growth package",
        "mini.launchT":"Launch",
        "mini.webT":"Web",
        "mini.aiT":"AI",
        "mini.growthT":"Growth",
        "mini.landing":"Get leads faster",
        "mini.webs":"A professional site ready to grow",
        "mini.chatbot":"Faster replies, smarter flow",
        "mini.growth":"Turn traffic into clients",

        "pricing.h":"Clear starting prices",
        "pricing.sub":"",
        "pricing.cta":"recommend the right starting point →",
        "pricing.card1.kicker":"Best quick start",
        "pricing.card1.t":"Landing Page Express",
        "pricing.card1.price":"Starting from 250 JOD",
        "pricing.card1.d":"Ideal for offers, services, ads, and fast campaigns.",
        "pricing.card2.kicker":"Most requested by startups",
        "pricing.card2.t":"AI Chatbot Starter",
        "pricing.card2.price":"Starting from 400 JOD",
        "pricing.card2.d":"A strong option for businesses that want faster replies and better lead organization.",
        "pricing.card3.kicker":"Built for serious growth",
        "pricing.card3.t":"Professional Website or Store",
        "pricing.card3.price":"Starting from 700 JOD",
        "pricing.card3.d":"Suitable for businesses that want a stronger presence and a scalable professional experience.",
        "pricing.card4.kicker":"Best before a larger project",
        "pricing.card4.t":"Custom System Discovery",
        "pricing.card4.price":"Starting from 150 JOD",
        "pricing.card4.d":"A discovery and analysis phase that leads to clearer scope and more accurate pricing for bigger projects.",
        "pricing.cardCta":"Let us recommend the best package →",
        "pricing.note":"Prices are indicative starting points and vary based on scope, features, and required integrations.",

        "proof.h":"How we create real value for your business",
        "proof.sub":"Instead of being just a technical service, we connect delivery to a clear business goal: faster launch, better organization, and measurable growth.",
        "proof.card1.kicker":"Scenario 01",
        "proof.card1.t":"Landing page for campaigns",
        "proof.card1.d":"If you want to launch an offer quickly, we build a clear page with strong CTA and WhatsApp or form integration so you can start collecting leads immediately.",
        "proof.card1.r":"Outcome: faster launch + clearer conversion + better measurement.",
        "proof.card2.kicker":"Scenario 02",
        "proof.card2.t":"Bot and automation for inquiries",
        "proof.card2.d":"If you receive too many repeated messages or questions, we set up a bot that replies faster and collects data in a more organized way.",
        "proof.card2.r":"Outcome: less wasted time + faster follow-up + better client experience.",
        "proof.card3.kicker":"Scenario 03",
        "proof.card3.t":"Custom system for growth",
        "proof.card3.d":"If your company is growing and operations are becoming complex, we analyze the need and build a dashboard or system that supports long-term operations.",
        "proof.card3.r":"Outcome: higher organization + operational clarity + stronger scalability.",

        "mini.webs":"Websites + Stores",
        "mini.custom":"Systems & Automation",
        "mini.design":"UI/UX + Branding",

        "offers.h":"Ready-to-start offers",
        "offers.sub":"If you want a fast start or a clearer offer, these packages are the best way to begin working with us.",
        "offers.cta":"Get a recommendation that fits you →",
        "offers.cardCta":"Get the right recommendation →",
        "offers.card1.badge":"Fastest launch",
        "offers.card1.t":"Landing Page Express",
        "offers.card1.d":"A professional landing page that gets you ready for ads and lead generation quickly.",
        "offers.card1.p1":"Great for campaigns, services, and offer launches",
        "offers.card1.p2":"WhatsApp / form / clear CTA integration",
        "offers.card2.badge":"High demand",
        "offers.card2.t":"AI Chatbot Starter",
        "offers.card2.d":"A smart bot for your website or WhatsApp to speed up replies and organize leads.",
        "offers.card2.p1":"FAQ handling + lead capture",
        "offers.card2.p2":"Simple WhatsApp or form integration",
        "offers.card3.badge":"Recurring revenue",
        "offers.card3.t":"Growth Package",
        "offers.card3.d":"A monthly growth package that combines content, design, and follow-up to turn your presence into results.",
        "offers.card3.p1":"Content plan + design + publishing",
        "offers.card3.p2":"Reports, follow-up, and ongoing optimization",
        "offers.card4.badge":"For bigger projects",
        "offers.card4.t":"Custom System Discovery",
        "offers.card4.d":"A discovery session and initial scope for custom projects before moving into full implementation.",
        "offers.card4.p1":"Understand the real workflow and need",
        "offers.card4.p2":"Clearer deliverables and more accurate pricing later",

        "hero.readyT":"Ready to start?",
        "hero.readyD":"Tell us about your project and we’ll reply with a clear scope and plan.",
        "hero.readyCta":"Share your project details →",

        "services.h":"Services",
        "services.sub":"Pick one service or a full package — we cover the entire journey.",
        "services.cta":"Request a quick quote",
        "services.more":"Services",

        "details.h":"Services",
        "details.sub":"Choose one service or a full package — we cover your entire project journey from idea to launch.",
        "details.allCta":"Request a free consultation",
        "details.cta":"Let us recommend the right solution →",

        "details.apps.kicker":"Mobile apps",
        "details.apps.t":"Mobile app development",
        "details.apps.d":"Fast, secure apps with great UX—from MVP to a store-ready product.",
        "details.apps.p1":"Native (Swift/Kotlin) or Flutter—based on your needs",
        "details.apps.p2":"Admin panel + APIs + notifications + authentication",
        "details.apps.p3":"Performance tuning + testing + store publishing",

        "details.web.kicker":"Web development",
        "details.web.t":"Fast, professional websites",
        "details.web.d":"Landing pages, company sites, stores, and dashboards—SEO-ready and mobile-first.",
        "details.web.p1":"UI/UX design + modern frontend build",
        "details.web.p2":"Backend / CMS / dashboard when needed",
        "details.web.p3":"Speed + SEO + analytics tracking",

        "details.custom.kicker":"Custom software",
        "details.custom.t":"Systems & dashboards tailored to you",
        "details.custom.d":"Internal systems, automation, and API integrations to save time and cost.",
        "details.custom.p1":"Requirements + database design + roles/permissions",
        "details.custom.p2":"Integrations: Payments / CRM / WhatsApp / more",
        "details.custom.p3":"Reports + monitoring + support & maintenance",
        "details.custom.p4":"IoT solutions with device and sensor integration into your system and dashboards",

        "details.design.kicker":"Design",
        "details.design.t":"UI/UX + visual identity",
        "details.design.d":"Comfortable, modern interfaces with a brand identity that builds trust.",
        "details.design.p1":"Wireframes + UI kit + design system",
        "details.design.p2":"Branding: logo usage + colors + typography",
        "details.design.p3":"Social designs + marketing assets",

        "details.motion.kicker":"Motion graphics",
        "details.motion.t":"Short videos that convert",
        "details.motion.d":"Reels, ads, and explainers—clear script, storyboard, and a polished edit.",
        "details.motion.p1":"Script + storyboard + style frames",
        "details.motion.p2":"Animation + sound + subtitles",
        "details.motion.p3":"Multiple sizes (Reels / Stories / Ads)",

        "details.social.kicker":"Social media management",
        "details.social.t":"Professional social media management",
        "details.social.d":"Monthly content planning, branded designs, scheduling, and clear reporting to turn attention into real inquiries.",
        "details.social.p1":"Monthly content plan + post and reel ideas for your business",
        "details.social.p2":"Post, story, and caption design aligned with your brand",
        "details.social.p3":"Scheduling, publishing, and inbox/community support depending on the package",
        "details.social.p4":"Monthly report to improve reach, engagement, and leads",
        "details.social.cta":"Start managing your accounts →",

        "svc.appsT":"App Development",
        "svc.appsD":"High-performance iOS/Android apps with great UX — from MVP to full product.",
        "svc.webT":"Web Development",
        "svc.webD":"Fast modern websites, landing pages, stores, and dashboards — SEO-ready.",
        "svc.customT":"Custom Software",
        "svc.customD":"Internal systems, automation, integrations — tailored to your business.",
        "svc.designT":"Design",
        "svc.designD":"UI/UX, branding, and social design — visuals that sell.",
        "svc.motionT":"Motion Graphics",
        "svc.motionD":"Short ads, reels, explainers — storytelling that converts.",
        "svc.socialT":"Social Media Management",
        "svc.socialD":"Content planning, design, scheduling — consistent presence.",


        "trust.h":"Why choose Aqua.Tech",
        "trust.sub":"",
        "trust.c1k":"Start clearly",
        "trust.c1t":"A clear plan within 24 hours",
        "trust.c1d":"We quickly understand your goal, then define what should be built first, what can wait, and the best starting point for your stage and budget.",
        "trust.c2k":"Delivery",
        "trust.c2t":"A solution that works now and scales later",
        "trust.c2d":"We build practically from day one, so you get something useful now while staying ready to expand later without rebuilding from scratch.",
        "trust.c3k":"Support",
        "trust.c3t":"Support and improvement after launch",
        "trust.c3d":"After launch, we help with improvements, refinements, and feedback handling so the solution stays useful and keeps performing better.",
        "trust.c4k":"Handover",
        "trust.c4t":"Clearer communication and faster decisions",
        "trust.c4d":"You get clear updates during execution, organized deliverables, and a structured handover so you always know where the project stands and what comes next.",
        "results.cta":"define the right outcome for you →",
        "portfolio2.cta":"Book a similar project →",
        "contact.trustT":"Before you submit:",
        "contact.trustD":" a clear project note and one contact method are enough for us to suggest the right next step without unnecessary complexity.",
        "fit.h":"Is this right for you?",
        "fit.sub":"",
        "fit.cta":"Let us define the right starting point →",
        "fit.goodK":"Good fit if",
        "fit.goodT":"You are at a stage that needs a practical decision",
        "fit.good1":"You have a new project and want to start in a clear, structured way",
        "fit.good2":"You have visits or inquiries but conversion is still weak",
        "fit.good3":"You want a system or automation that reduces pressure and manual work",
        "fit.badK":"May not be the right time if",
        "fit.badT":"You do not want a clear outcome from the website or system",
        "fit.bad1":"You only want something that looks nice without a clear business or operational goal",
        "fit.bad2":"You do not want to define a first step or initial project scope",
        "fit.bad3":"You want everything at once without prioritizing",
        "sticky.kicker":"Quick start",
        "sticky.title":"Start with a clear next step",
        "sticky.cta":"Request a starter quote",
        "why.h":"Why choose Aqua.Tech",
        "why.sub":"Because we combine technical execution, business thinking, and speed so you can launch strongly, scale intelligently, and move with clearer scope and pricing.",
        "why.c1t":"Clear execution",
        "why.c1d":"A structured plan from kickoff to delivery.",
        "why.c2t":"Tailored solutions",
        "why.c2d":"Built around your needs, not forced into generic templates.",
        "why.c3t":"Fast communication",
        "why.c3d":"Consistent updates and direct follow-up throughout delivery.",
        "why.c4t":"Post-launch support",
        "why.c4d":"We stay with you after launch for improvements and support.",
        "about.h":"About us",
        "about.d":"Aqua.Tech is a digital partner for companies and founders who want a stronger online presence, smarter operations, and practical solutions built for growth. We combine technical execution, automation, and business-focused delivery.",
        "process.h":"Process",
        "process.sub":"Four clear stages from discovery to launch and ongoing support.",
        "process.s1t":"Discovery","process.s1d":"Understand goals, audience, scope, and timeline.",
        "process.s2t":"Design","process.s2d":"UX + UI aligned with your brand.",
        "process.s3t":"Development","process.s3d":"Build, test, and optimize performance.",
        "process.s4t":"Launch & Support","process.s4d":"Deploy, improve, and maintain as needed.",
        "process.cta":"Request a delivery plan",
        "process.s1b1":"Quick discovery call + scope definition",
        "process.s1b2":"Clear timeline & budget estimate",
        "process.s1b3":"Recommend the right tech stack",
        "process.s2b1":"Wireframes + UI kit",
        "process.s2b2":"Responsive, mobile-first design",
        "process.s2b3":"Smooth, clear user flows",
        "process.s3b1":"Frontend + backend when needed",
        "process.s3b2":"Testing + performance optimization",
        "process.s3b3":"Deliver a reviewable staging build",
        "process.s4b1":"Deploy to hosting / app stores",
        "process.s4b2":"Monitor & iterate",
        "process.s4b3":"Maintenance & support as agreed",

        "faq.h":"FAQ",
        "faq.q1":"How long does a landing page, website, or custom system take?",
        "faq.a1":"It depends on the service and scope. Faster offers like landing pages or chatbots can launch quickly, while larger projects need a clearer scope and timeline.",
        "faq.q2":"How do you price a service or project?",
        "faq.a2":"Pricing depends on the service type, scope, integrations, and timeline. You receive a clear quote with phases and deliverables.",
        "faq.q3":"Do you offer both fast-launch services and fully custom solutions?",
        "faq.a3":"Yes. We offer quick-launch services like landing pages and bots, and we also build fully custom websites and systems based on your needs.",
        "faq.q4":"Can you build chatbots and business automations?",
        "faq.a4":"Yes. We build chatbots and automations that help with customer replies, lead organization, and workflow automation across your tools.",

        "contact.h":"Request the right system for your current stage",
        "contact.sub":"Share your project details or business goal, and we will come back with a clear plan, suitable scope, and a practical first step for your current stage.",
        "contact.wa":"WhatsApp",
        "contact.waAction":"Contact us by WhatsApp",
        "contact.email":"Email",
                "contact.emailAction":"Contact us by email",
        "contact.social":"Social links",
        "contact.loc":"Location",
        "contact.locV":"Amman, Jordan",

        "form.name":"Name",
        "form.contact":"Contact method",
        "form.emailLabel":"Email address",
        "form.emailPh":"example@mail.com",
        "form.countryCodeLabel":"Country code",
        "form.phoneLabel":"WhatsApp number",
        "form.phonePh":"7XXXXXXXX",
        "form.contactHelp":"",
        "form.service":"Requested service",
        "form.budget":"Estimated budget",
        "form.budgetPlaceholder":"Select budget",
        "form.budgetOpt1":"Under 500 JOD",
        "form.budgetOpt2":"500 - 1500 JOD",
        "form.budgetOpt3":"1500 - 3000 JOD",
        "form.budgetOpt4":"3000+ JOD",
        "form.timeline":"Timeline",
        "form.timelinePlaceholder":"Select timeline",
        "form.timelineOpt1":"As soon as possible",
        "form.timelineOpt2":"Within two weeks",
        "form.timelineOpt3":"Within one month",
        "form.timelineOpt4":"I am still exploring",
        "form.details":"Project details",
        "form.namePh":"Your name",
        "form.detailsPh":"Write goals, key features, and timeline…",
        "form.sendQuote":"Get an initial plan and estimate",
        "form.replyNote":"We usually review your request and reply within 24 hours with a clear plan and a suitable first step.",
        "form.opt1":"Website & lead intake system",
        "form.opt2":"AI business automation",
        "form.opt3":"Client management system",
        "form.opt4":"WhatsApp automation",
        "form.opt5":"Email automation",
        "form.opt6":"Landing page optimization",
        "form.optSocial":"Social Media Management",
        "form.socialDetailsPh":"Tell us how many accounts you have, your business type, if content is ready, and how many posts/reels you need monthly.",
        "form.opt7":"Law Firm Management System",
        "form.opt8":"University Project Hub",
        "form.opt9":"ResumeIQ",
        "form.opt10":"Smart Attendance",
        "form.sendWA":"Send via WhatsApp",
        "form.sendEmail":"Send via Email",
        "form.sendLead":"Submit request",

        "news.h":"Latest News",
        "news.sub":"Technical and scientific articles where we share our experience and the latest ideas ",
        "news.badge":"Fresh content",
        "news.meta1":"Article • Coming soon",
        "news.title1":"First article title",
        "news.ex1":"A short intro will appear here — you can link to the full article or an internal page later.",
        "news.meta2":"Article • Coming soon",
        "news.title2":"Best practices for building systems",
        "news.ex2":"Topics like performance, security, scalability, and data management — explained simply and clearly.",
        "news.meta3":"Article • Coming soon",
        "news.title3":"Digital transformation, step by step",
        "news.ex3":"How we plan and deliver digital transformation in organizations with tools like ERP, and modern integrations.",
        "news.note":"",

        "footer.rights":"Aqua.Tech. All rights reserved.",
        "floating.contact":"Contact us",

        "ph.t1":"Placeholder","ph.h1":"Case Study — Your first project","ph.d1":"Summary + goal + solution + outcome (once projects exist).",
        "ph.t2":"Placeholder","ph.h2":"Mobile App — coming soon","ph.d2":"Screenshots + tech + key highlights.",
        "ph.t3":"Placeholder","ph.h3":"Custom System — coming soon","ph.d3":"Problem solved + results.",
        "faq.sub":"Answers to common questions before starting any project.",
        "faq.q5":"Do you handle hosting, domain, and deployment?",
        "faq.a5":"Yes on request, including SSL, deployment, and basic setup.",
        "faq.q6":"Do you offer maintenance after delivery?",
        "faq.a6":"Yes—support plans, security updates, and performance improvements as needed.",
        "faq.q7":"Can you deliver the source code and design files?",
        "faq.a7":"Yes—organized handover (code + design) with clear run instructions.",
        "faq.q8":"How do we communicate during development?",
        "faq.a8":"We agree on a channel and update cadence, and document any changes.",
        "faq.q9":"Do you offer growth and marketing packages alongside technical work?",
        "faq.a9":"Yes. We can support your project with growth packages including content, design, ads, and ongoing optimization so our role does not stop at delivery.",
        "faq.q10":"Can we sign an NDA and protect data?",
        "faq.a10":"Yes. An NDA can be signed and we follow security practices to protect data during delivery.",
        "faq.q11":"Do I need a full website or just a landing page?",
        "faq.a11":"If your goal is to generate leads quickly for a specific campaign or offer, a landing page is often enough to start. If you need broader positioning, more trust, and richer content, a full website is usually the better choice.",
        "faq.q12":"How do I know which service fits me?",
        "faq.a12":"Once you share your current goal, we can suggest the fastest suitable starting point, what should be built first, and what can wait without unnecessary cost.",
        "faq.a10":"Yes—we can sign an NDA and follow secure development practices.",

        "details.landing.kicker":"Fast solutions",
        "details.landing.t":"Landing Page Express",
        "details.landing.d":"A fast, professional landing page that helps you launch campaigns and capture leads quickly.",
        "details.landing.p1":"Clear conversion-focused design built to capture leads",
        "details.landing.p2":"Mobile-friendly + fast performance + clear CTA",
        "details.landing.p3":"WhatsApp / form / analytics integration",
        "details.chatbot.kicker":"AI and automation",
        "details.chatbot.t":"AI chatbot and automation",
        "details.chatbot.d":"We help you build bots and automated workflows to speed up replies, organize leads, and reduce manual work.",
        "details.chatbot.p1":"Website or WhatsApp bot for FAQs and inquiries",
        "details.chatbot.p2":"Automated lead intake and message/form workflows",
        "details.chatbot.p3":"Integration with CRM, Google Sheets, or internal systems",
        "details.growth.kicker":"Growth and marketing",
        "details.growth.t":"Growth and digital marketing packages",
        "details.growth.d":"We support your growth with content, ads, visibility, and better conversion from visitors to clients.",
        "details.growth.p1":"Social media management + content + design + scheduling",
        "details.growth.p2":"Paid ads and conversion improvement",
        "details.growth.p3":"Monthly reports and continuous performance tracking",
        "results.h":"Results we can achieve with you",
        "results.c1k":"Landing page + ads",
        "results.c1t":"Launch quickly and capture qualified leads",
        "results.c1d":"A clear landing page with a strong CTA and WhatsApp or form integration so you can start campaigns fast and collect inquiries in an organized way.",
        "results.c2k":"AI + automation",
        "results.c2t":"Reduce manual replies and organize inquiries",
        "results.c2d":"A chatbot or simple automation helps you reply faster, capture leads, and connect data with your current tools.",
        "results.c3k":"Custom system",
        "results.c3t":"More control and clearer internal operations",
        "results.c3d":"A dashboard or custom system to help you track operations, requests, and reports in a simpler and more scalable way.",
        "portfolio2.h":"projects",
        "portfolio2.sub":"",
        "portfolio2.c1k":"Service business",
        "portfolio2.c1t":"Service website with landing page and conversion flow",
        "portfolio2.c1d":"Ideal for companies that want a professional presence with inquiry forms, WhatsApp integration, and a clearer client capture flow.",
        "portfolio2.c2k":"Operations",
        "portfolio2.c2t":"Custom dashboard or internal system",
        "portfolio2.c2d":"Useful for managing requests, teams, clients, or reports with clear permissions and an interface that is easy to use daily.",
        "portfolio2.c3k":"AI & Growth",
        "portfolio2.c3t":"Bot and growth setup connected to your website",
        "portfolio2.c3d":"A solution that combines a landing page, automated replies, and digital marketing so your online presence becomes an effective sales channel.",
        "footer.tag":"Growth • Software • AI",
        "footer.desc":"We build landing pages, websites, systems, and automations that help businesses and founders grow faster in a clearer and more professional way.",
        "footer.servicesH":"Services",
        "footer.contactH":"Contact",
        "footer.link1":"Offers",
        "footer.link2":"Services",
        "footer.link3":"Starting prices",
        "footer.link4":"Expected results",
        "footer.link5":"Start your project",
        "footer.copy":"© Aqua.Tech — All rights reserved.",
        "footer.note":"Ready to help you launch, grow, and automate.",
        "form.modalOk":"OK",
        "results.sub":"",

        "testimonials.h":"Working principles we commit to in every project",

        "testimonials.sub":"Every project we deliver reflects these principles in practice — clarity, quality, and measurable results.",

        "testimonials.q1":"Requirements and steps should stay clear, and the client should always know where the project stands and what comes next.",

        "testimonials.a1":"Clarity in communication and execution",

        "testimonials.q2":"We focus on solutions that support the business goal, not just attractive visuals without a measurable outcome.",

        "testimonials.a2":"Outcome-focused thinking",

        "testimonials.q3":"We build with scalability in mind so the project starts right today and stays ready for growth and improvement later.",

        "testimonials.a3":"Long-term thinking",

        msg: {
          subject: "New request from Aqua.Tech website",
          name: "Name",
          contact: "Contact",
          service: "Service",
          budget: "Estimated budget",
          timeline: "Timeline",
          details: "Details",
          statusNeed: "Please enter your name + a quick project summary.",
          statusWA: "WhatsApp opened with a ready message ✅",
          statusEmail: "Email opened with a ready message ✅",
          statusSending: "Sending your request…",
          statusSent: "Request sent successfully ✅",
          statusFail: "Could not send. Please try again.",
          statusConfig: "Please set the Google Sheets Web App URL in the page config first."
        }
      }
    };

    function getStoredLang(){
      try{
        const saved = localStorage.getItem("aqua_lang");
        return (saved === "ar" || saved === "en") ? saved : null;
      }catch(e){
        return null;
      }
    }

    function storeLang(lang){
      try{
        localStorage.setItem("aqua_lang", lang);
      }catch(e){}
    }

    function updateLangToggleUI(lang){
      const toggle = document.getElementById("langToggle");
      if(!toggle) return;
      const firstLabel = toggle.querySelector("span");
      if(firstLabel) firstLabel.textContent = (lang === "ar") ? "EN" : "AR";
      const nextLang = (lang === "ar") ? "English" : "العربية";
      toggle.setAttribute("aria-label", `Switch language to ${nextLang}`);
      toggle.setAttribute("title", `Switch language to ${nextLang}`);
    }

    function applyI18n(lang){
      const dict = I18N[lang] || I18N.ar;

      document.title = dict.pageTitle || document.title;
      const meta = document.getElementById("metaDesc");
      if(meta && dict.metaDesc) meta.setAttribute("content", dict.metaDesc);

      document.documentElement.lang = lang;
      document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

      document.querySelectorAll("[data-i18n]").forEach(el=>{
        const key = el.getAttribute("data-i18n");
        if(Object.prototype.hasOwnProperty.call(dict, key)){
          el.textContent = dict[key];
        }
      });

      document.querySelectorAll("[data-ph-i18n]").forEach(el=>{
        const key = el.getAttribute("data-ph-i18n");
        if(Object.prototype.hasOwnProperty.call(dict, key)){
          el.setAttribute("placeholder", dict[key]);
        }
      });

      document.querySelectorAll("[data-i18n-html]").forEach(el=>{
        const key = el.getAttribute("data-i18n-html");
        if(Object.prototype.hasOwnProperty.call(dict, key)){
          el.innerHTML = dict[key];
        }
      });

      updateLangToggleUI(lang);

      if (typeof updateConsentText === "function") {
        updateConsentText();
      }

       currentLang = lang;

          if (typeof updateDetailsPlaceholderByService === "function") {
           updateDetailsPlaceholderByService();
          }
    }


    Object.assign(I18N.ar, {
      "nav.results":"النتائج",
      "nav.systems":"الحلول",
      "nav.testimonials":"مبادئ العمل",
      "hero.badge":"حلول رقمية تدعم الانطلاق والنمو والتوسع",
      "pricing.card1.t":"صفحة هبوط سريعة",
      "pricing.card2.t":"باقة الشات بوت الذكي الأساسية",
      "pricing.card4.t":"مرحلة اكتشاف النظام المخصص",
      "offers.card1.t":"صفحة هبوط سريعة",
      "offers.card2.t":"باقة الشات بوت الذكي الأساسية",
      "offers.card3.t":"باقة النمو",
      "offers.card4.t":"مرحلة اكتشاف النظام المخصص",
      "systems.h":"حلول جاهزة",
      "systems.sub":"أنظمة ومنصات جاهزة يمكن تخصيصها بحسب نوع النشاط والمرحلة الحالية لمشروعك.",
      "systems.cta":"اطلب النظام المناسب لك →",
      "systems.cardCta":"اطلب هذا النظام →",
      "systems.card1.kicker":"العمليات القانونية",
      "systems.card1.t":"نظام إدارة مكاتب المحاماة",
      "systems.card1.d":"نظام لإدارة القضايا والعملاء والمواعيد والملفات القانونية بشكل أوضح وأسهل.",
      "systems.card1.p1":"إدارة القضايا والملفات",
      "systems.card1.p2":"متابعة العملاء والمواعيد",
      "systems.card2.kicker":"سير العمل التعليمي",
      "systems.card2.t":"منصة مشاريع الجامعة",
      "systems.card2.d":"منصة لتنظيم مشاريع الطلبة ورفع الملفات ومتابعة الفرق والإشراف الأكاديمي.",
      "systems.card2.p1":"تنظيم فرق ومشاريع الطلبة",
      "systems.card2.p2":"رفع الملفات ومتابعة التقييم",
      "systems.card3.kicker":"أدوات مهنية",
      "systems.card3.t":"ResumeIQ",
      "systems.card3.d":"أداة تساعد المستخدم على إنشاء سيرة ذاتية بشكل أوضح وأسرع وتجربة أسهل.",
      "systems.card3.p1":"بناء السيرة الذاتية بسهولة",
      "systems.card3.p2":"تنظيم المحتوى بشكل احترافي",
      "systems.card4.kicker":"إدارة الحضور",
      "systems.card4.t":"Smart Attendance",
      "systems.card4.d":"نظام حضور ذكي يعتمد على التعرف على الوجوه لتسجيل الحضور تلقائيًا عبر الكاميرا، مع تقليل التلاعب والأخطاء اليدوية وتسهيل المتابعة اليومية.",
      "systems.card4.p1":"تسجيل حضور تلقائي عبر الكاميرا",
      "systems.card4.p2":"تقارير وتنظيم أفضل للحضور",
      "portfolio2.h":"تطبيقات واقعية للحلول",
      "portfolio2.sub":"أمثلة على كيف يمكن استخدام هذه الأنظمة في حالات عملية ومجالات مختلفة.",
      "portfolio2.cta":"اطلب حلًا مشابهًا →",
      "portfolio2.c1k":"حالة استخدام",
      "portfolio2.c1t":"نظام لمكتب محاماة",
      "portfolio2.c1d":"تم تطبيق نظام يساعد مكتب المحاماة على تنظيم القضايا ومتابعة العملاء والمواعيد بشكل أوضح.",
      "portfolio2.c1s":"",
      "portfolio2.c2k":"حالة استخدام",
      "portfolio2.c4k":"حالة استخدام",
      "portfolio2.c4t":"نظام حضور ذكي بالتعرف على الوجوه",
      "portfolio2.c4d":"تم تطوير نظام حضور ذكي يعتمد على تقنيات الذكاء الاصطناعي والرؤية الحاسوبية لتسجيل الحضور تلقائيًا عبر الكاميرا، مع تقليل التلاعب والأخطاء اليدوية وتسريع المتابعة اليومية.",
      "portfolio2.c4s":"",
      "portfolio2.cardCta":"اطلب حل مشابه →",
      "portfolio2.c1p1":"تنظيم القضايا والملفات بشكل أوضح",
      "portfolio2.c1p2":"متابعة العملاء والمواعيد بسهولة",
      "portfolio2.c2p1":"تنظيم فرق ومهام المشاريع",
      "portfolio2.c2p2":"رفع الملفات ومتابعة التقييم",
      "portfolio2.c3p1":"تجربة أبسط لبناء السيرة الذاتية",
      "portfolio2.c3p2":"تنظيم المحتوى بشكل احترافي",
      "portfolio2.c4p1":"تسجيل حضور تلقائي عبر الكاميرا",
      "portfolio2.c4p2":"تقليل الأخطاء والتلاعب اليدوي",
      "portfolio2.c2t":"منصة للمشاريع الجامعية",
      "portfolio2.c2d":"تم استخدام المنصة لتنظيم مشاريع الطلبة ورفع الملفات وتسهيل المتابعة والتقييم الأكاديمي.",
      "portfolio2.c2s":"",
      "portfolio2.c3k":"حالة استخدام",
      "portfolio2.c3t":"منشئ سيرة ذاتية للباحثين عن عمل",
      "portfolio2.c3d":"تم تطوير تجربة تساعد المستخدمين على إنشاء سيرة ذاتية أسرع وأوضح بطريقة منظمة وسهلة.",
      "portfolio2.c3s":"",
      "results.c1k":"صفحة هبوط + إعلانات",
      "results.c2k":"ذكاء اصطناعي + أتمتة",
      "results.c3k":"نظام مخصص",
      "contact.sub":"شاركنا تفاصيل مشروعك أو هدفك التجاري، وسنرجع لك بخطة واضحة، ونطاق مناسب، وخطوة بداية عملية تناسب مرحلتك الحالية.",
      "contact.waAction":"ابدأ معنا عبر واتساب",
      "contact.emailAction":"تواصل معنا عبر البريد الإلكتروني",
      "form.sendQuote":"احصل على خطة أولية وتسعير مبدئي",
      "form.replyNote":"نراجع طلبك عادة خلال 24 ساعة ونرجع لك بخطة واضحة وخطوة أولى مناسبة.",
      "form.opt1":"موقع ونظام استقبال عملاء",
      "form.opt3":"نظام إدارة العملاء",
      "form.opt5":"أتمتة البريد الإلكتروني",
      "testimonials.h":"مبادئ عمل نلتزم بها في كل مشروع",
      "testimonials.sub":"كل مشروع ننفذه يعكس هذه المبادئ عمليًا: الوضوح، والجودة، والنتائج القابلة للقياس.",
      "testimonials.a1":"وضوح في التواصل",
      "testimonials.a2":"تركيز على النتيجة",
      "testimonials.a3":"تفكير طويل المدى"
    });

    Object.assign(I18N.en, {
      "portfolio2.cardCta":"Request a similar solution →",
      "portfolio2.c1p1":"Organize cases and files more clearly",
      "portfolio2.c1p2":"Track clients and appointments more easily",
      "portfolio2.c2p1":"Organize project teams and tasks",
      "portfolio2.c2p2":"Upload files and track evaluation",
      "portfolio2.c3p1":"A simpler resume-building experience",
      "portfolio2.c3p2":"Organize content professionally",
      "portfolio2.c4p1":"Automatic attendance registration via camera",
      "portfolio2.c4p2":"Reduce manual errors and manipulation",
      "systems.card4.kicker":"Attendance management",
      "systems.card4.t":"Smart Attendance",
      "systems.card4.d":"A smart attendance system powered by face recognition to register attendance automatically through a camera while reducing manual errors and improving daily tracking.",
      "systems.card4.p1":"Automatic attendance via camera",
      "systems.card4.p2":"Better attendance reports and organization",
      "form.opt10":"Smart Attendance",

      "hero.badge":"Digital solutions built for launch, growth, and scale",
      "results.cta":"Let us define the right outcome for you →",
      "portfolio2.h":"Use cases",
      "portfolio2.sub":"Examples of how these systems can be used across practical scenarios and industries.",
      "portfolio2.cta":"Request a similar solution →",
      "portfolio2.c1k":"Use case",
      "portfolio2.c1t":"System for a law firm",
      "portfolio2.c1d":"A system designed to help a law firm organize cases, clients, and appointments more clearly.",
      "portfolio2.c2k":"Use case",
      "portfolio2.c2t":"University projects platform",
      "portfolio2.c2d":"A platform used to organize student projects, file uploads, and academic follow-up.",
      "portfolio2.c3k":"Use case",
      "portfolio2.c3t":"Resume builder for job seekers",
      "portfolio2.c3d":"A simpler experience that helps users create a faster, clearer, and more organized resume.",
      "contact.trustD":"A clear project note and one contact method are enough for us to suggest the right next step without unnecessary complexity.",
      "contact.waAction":"Contact us by WhatsApp",
      "contact.emailAction":"Contact us by email",
      "form.sendQuote":"Get an initial plan and estimate",
      "footer.copy":"© Aqua.Tech — All rights reserved.",
      "nav.security":"Security",
      "security.h":"Security & Trust",
      "security.sub":"We build websites and systems using modern practices that improve security, protect data, and strengthen project reliability during launch and growth.",
      "security.cta":"Request a more secure website",
      "security.card1.kicker":"Connection",
      "security.card1.t":"Secure and trusted connection",
      "security.card1.d":"HTTPS and browser security policies help protect data transfer and improve trust while browsing or submitting forms.",
      "security.card2.kicker":"Application",
      "security.card2.t":"Application-level protection",
      "security.card2.d":"We validate inputs, sanitize text, harden forms, and reduce common risks such as spam or unsafe submissions.",
      "security.card3.kicker":"Deployment",
      "security.card3.t":"Safer deployment setup",
      "security.card3.d":"We configure safer browser behavior, external links, and requests, with readiness for Cloudflare and stronger security headers on hosting.",
      "security.card4.kicker":"Trust",
      "security.card4.t":"Higher trust for your business",
      "security.card4.d":"A secure website does not only protect the project, it also improves credibility and gives clients more confidence when contacting you or sharing data.",
      "security.list.kicker":"Included practices",
      "security.list.h":"What we take into account",
      "security.list.i1":"SSL / HTTPS and encrypted connections",
      "security.list.i2":"Security headers and core browser policies",
      "security.list.i3":"Input validation and form data sanitization",
      "security.list.i4":"Spam reduction and repeated-submit protection",
      "security.list.i5":"Readiness for Cloudflare and hosting protection",
      "security.note.kicker":"Professional note",
      "security.note.h":"Important",
      "security.note.d":"No website is 100% impossible to breach, but it can be built with stronger protection that reduces risks and makes attacks significantly harder and more costly.",
      "security.note.extra":"For stronger production protection, enable Cloudflare, HSTS, and a WAF on your hosting or CDN.",
      "form.security1":"🔒 Validated inputs",
      "form.security2":"🛡️ Anti-spam protection",
      "form.security3":"⚙️ Safer deployment setup",
      "msg.statusInvalidName":"Please enter a valid name.",
      "msg.statusInvalidEmail":"Please enter a valid email address.",
      "msg.statusInvalidPhone":"Please enter a valid WhatsApp number.",
      "msg.statusInvalidDetails":"Please add clearer project details.",
      "msg.statusTooFast":"Please wait a moment before sending another request.",
      "msg.statusSpam":"The request was ignored because it appears invalid.",
      "msg.statusConfigHelp":"Enable Cloudflare and server-side security headers for stronger production protection."
    });

    function setLang(lang){
      currentLang = (lang === "en") ? "en" : "ar";
      storeLang(currentLang);
      applyI18n(currentLang);
      updateDynamicContactLinks();
    }

    function toggleLang(){
      setLang(currentLang === "ar" ? "en" : "ar");
    }

    function bindLangToggle(){
      const btn = document.getElementById("langToggle");
      if(!btn || btn.dataset.langBound === "1") return;
      btn.dataset.langBound = "1";
      btn.addEventListener("click", function(e){
        e.preventDefault();
        toggleLang();
      });
    }

    currentLang = getStoredLang() || document.documentElement.lang || "ar";
    currentLang = (currentLang === "en") ? "en" : "ar";
    window.I18N = I18N;
    window.applyI18n = applyI18n;
    window.setLang = setLang;
    window.toggleLang = toggleLang;
    bindLangToggle();
    applyI18n(currentLang);
    updateDynamicContactLinks();

    window.addEventListener("DOMContentLoaded", ()=>{
      bindLangToggle();
      applyI18n(currentLang);
      updateDynamicContactLinks();
    });


    // ===== Mobile menu (phones/tablets) =====
    const menuBtn = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const iconOpen = document.getElementById("menuIconOpen");
    const iconClose = document.getElementById("menuIconClose");

    function setMenu(open){
      if(!mobileMenu || !menuBtn) return;
      mobileMenu.classList.toggle("hidden", !open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      // toggle icons
      if(iconOpen) iconOpen.classList.toggle("hidden", open);
      if(iconClose) iconClose.classList.toggle("hidden", !open);
    }

    if(menuBtn){
      menuBtn.addEventListener("click", ()=>{
        const open = mobileMenu ? mobileMenu.classList.contains("hidden") : false;
        setMenu(open);
      });
    }

    // Close when clicking a link
    if(mobileMenu){
      mobileMenu.querySelectorAll("a").forEach(a=>{
        a.addEventListener("click", ()=> setMenu(false));
      });
    }

    // Close when clicking outside
    document.addEventListener("click", (e)=>{
      if(!mobileMenu || mobileMenu.classList.contains("hidden")) return;
      if(menuBtn && (menuBtn.contains(e.target) || mobileMenu.contains(e.target))) return;
      setMenu(false);
    });

    // Close on Escape
    document.addEventListener("keydown", (e)=>{
      if(e.key === "Escape") setMenu(false);
    });


    


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

        // ===== FAQ accordion (robust) =====
    // يعمل حتى لو تم تحديث النصوص بسبب الترجمة
    (function(){
      const faqRoot = document.getElementById("faq");
      if(!faqRoot) return;

      faqRoot.addEventListener("click", (e)=>{
        const btn = e.target && e.target.closest ? e.target.closest(".faq-q") : null;
        if(!btn) return;

        const item = btn.closest(".faq-item");
        if(!item) return;

        const items = Array.from(faqRoot.querySelectorAll(".faq-item"));
        const isOpen = item.classList.contains("is-open");

        // أغلق الجميع
        items.forEach((other)=>{
          other.classList.remove("is-open");
          const b = other.querySelector(".faq-q");
          if(b) b.setAttribute("aria-expanded", "false");
        });

        // افتح/اغلق الحالي
        if(!isOpen){
          item.classList.add("is-open");
          btn.setAttribute("aria-expanded", "true");
        } else {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }
      }, true);
    })();
    // Pause animations when the tab is hidden (saves CPU/GPU)
    document.addEventListener("visibilitychange", ()=>{
      document.body.classList.toggle("is-paused", document.hidden);
    });


// init
