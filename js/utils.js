function getWhatsAppUrl(){
  const text = currentLang === "ar"
    ? "مرحبا، أريد الاستفسار عن خدمات Aqua.Tech"
    : "Hello, I want to ask about Aqua.Tech services";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const setHref = (id, url) => {
  const el = document.getElementById(id);
  if(el) el.href = url;
};

window.AquaUtils = {
  getWhatsAppUrl,
  setHref
};