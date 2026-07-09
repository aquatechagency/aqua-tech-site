if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function clearActiveNav() {
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    link.classList.remove("is-active");
  });
}

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
    clearActiveNav();
  }
});