document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuIconOpen = document.getElementById("menuIconOpen");
  const menuIconClose = document.getElementById("menuIconClose");

  if (!menuToggle || !mobileMenu) return;

  const openMenu = () => {
    mobileMenu.classList.remove("hidden");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");

    if (menuIconOpen) menuIconOpen.classList.add("hidden");
    if (menuIconClose) menuIconClose.classList.remove("hidden");
  };

  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");

    if (menuIconOpen) menuIconOpen.classList.remove("hidden");
    if (menuIconClose) menuIconClose.classList.add("hidden");
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains("hidden")) {
      openMenu();
    } else {
      closeMenu();
    }
  };

  menuToggle.addEventListener("click", toggleMenu);

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
});