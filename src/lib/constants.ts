// ============================================================
// GB Travel — Editable Placeholders
// Update these values before publishing your site.
// ============================================================

/** WhatsApp number in international format without spaces or symbols */
export const WHATSAPP_NUMBER = "+52818-210-5791";

/** Full URL to your Facebook page */
export const FACEBOOK_URL = "https://www.facebook.com/gbtravel.mx";

/** Contact email */
export const EMAIL = "gbtravelmty@gmail.com";

/** Phone number displayed on the site */
export const PHONE = "+528122826931";

/** Site address (physical) */
export const ADDRESS = "San Pedro Garza Garcia,Nuevo Leon, México";

/** WhatsApp link helper */
export const whatsappLink = (message = "Hola, me interesa cotizar un viaje con GB Travel") =>
  `https://wa.me/${528182105791}?text=${encodeURIComponent(message)}`;
