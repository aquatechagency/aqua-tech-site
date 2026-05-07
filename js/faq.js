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