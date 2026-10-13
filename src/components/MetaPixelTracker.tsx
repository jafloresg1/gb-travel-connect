import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { isWhatsAppUrl, trackMeta } from "@/lib/metaPixel";

/** Fires PageView on client-side route changes and Contact on any WhatsApp link click. */
const MetaPixelTracker = () => {
  const location = useLocation();
  const first = useRef(true);

  useEffect(() => {
    // The initial PageView is sent by the base code in index.html.
    if (first.current) {
      first.current = false;
      return;
    }
    trackMeta("PageView");
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (a && isWhatsAppUrl(a.href)) trackMeta("Contact", { content_name: "WhatsApp" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
};

export default MetaPixelTracker;
