// ============================================================
// GB Travel — Editable Placeholders
// Update these values before publishing your site.
// ============================================================

/** WhatsApp number in international format without spaces or symbols */
export const WHATSAPP_NUMBER = "528182105791";

/** Full URL to your Facebook page */
export const FACEBOOK_URL = "https://www.facebook.com/gbtravel.mx";

/** Contact email */
export const EMAIL = "gbtravelmty@gmail.com";

/** Phone number displayed on the site */
export const PHONE = "8182105791";

/** Site address (physical) */
export const ADDRESS = "Plaza Fiesta San Agustin, San Pedro Garza Garcia, Mx";

/** WhatsApp link helper */
export const whatsappLink = (message = "Hola, me interesa cotizar un viaje con GB Travel") =>
  `https://wa.me/${528182105791}?text=${encodeURIComponent(message)}`;
