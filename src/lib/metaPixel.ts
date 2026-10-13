// Meta Pixel helpers. The base code lives in index.html; these only fire events
// when the pixel was allowed to load (it is blocked in consent-required regions).
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const trackMeta = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
};

export const isWhatsAppUrl = (href: string) => /(^|\/\/)(wa\.me|api\.whatsapp\.com)\//i.test(href);
