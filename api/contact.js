module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      message: "Method not allowed",
    });
  }

  try {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    const webhookSecret = process.env.AQUATECH_WEBHOOK_SECRET;

    if (!webhookUrl || !webhookSecret) {
      return res.status(500).json({
        ok: false,
        message: "Contact endpoint is not configured.",
      });
    }

    const body = req.body || {};

    // Honeypot spam trap
    if (body.website || body.company_website) {
      return res.status(200).json({
        ok: true,
        message: "Request received.",
      });
    }

    const fullName = String(body.full_name || body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || body.full_phone || "").trim();
    const serviceType = String(body.service_type || body.service || "").trim();
    const message = String(body.message || body.details || "").trim();

    if (!fullName || fullName.length < 2) {
      return res.status(400).json({
        ok: false,
        message: "Please enter your name.",
      });
    }

    if (!serviceType) {
      return res.status(400).json({
        ok: false,
        message: "Please select a service.",
      });
    }

    if (!phone && !email) {
      return res.status(400).json({
        ok: false,
        message: "Please enter WhatsApp number or email.",
      });
    }

    const payload = {
      full_name: fullName,
      phone,
      email,
      company_name: String(body.company_name || "").trim(),
      company_activity: String(body.company_activity || "").trim(),
      service_type: serviceType,
      budget: String(body.budget || "").trim(),
      timeline: String(body.timeline || "").trim(),
      message,
      page_url: String(body.page_url || req.headers.referer || "").trim(),
      lang: String(body.lang || "").trim(),
      source: "website",
    };

    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-aquatech-secret": webhookSecret,
      },
      body: JSON.stringify(payload),
    });

    const text = await n8nResponse.text();

    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {
        ok: false,
        message: "Invalid workflow response.",
        raw: text,
      };
    }

    return res.status(n8nResponse.ok ? 200 : 502).json(data);
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Something went wrong. Please try again.",
      error: error && error.message ? error.message : "Unknown error",
    });
  }
};