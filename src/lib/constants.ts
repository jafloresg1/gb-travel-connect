// ============================================================
// GB Travel — Editable Placeholders
// Update these values before publishing your site.
// ============================================================

/** WhatsApp number in international format without spaces or symbols */
export const WHATSAPP_NUMBER = "521234567890";

/** Full URL to your Facebook page */
export const FACEBOOK_URL = "https://www.facebook.com/gbtravel";

/** Contact email */
export const EMAIL = "info@gbtravel.mx";

/** Phone number displayed on the site */
export const PHONE = "+52 1 234 567 890";

/** Site address (physical) */
export const ADDRESS = "Ciudad de México, México";

/** WhatsApp link helper */
export const whatsappLink = (message = "Hola, me interesa cotizar un viaje con GB Travel") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
