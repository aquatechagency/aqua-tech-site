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