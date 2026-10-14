import { useEffect } from "react";

type PageMeta = { title: string; description?: string; image?: string };

const setMeta = (attr: "name" | "property", key: string, value: string | undefined) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const previous = el?.getAttribute("content") ?? null;
  if (value === undefined) return () => {};
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
  const node = el;
  return () => {
    if (previous === null) node.remove();
    else node.setAttribute("content", previous);
  };
};

/** Actualiza document.title, meta description y Open Graph; restaura al salir de la página. */
export const usePageMeta = ({ title, description, image }: PageMeta) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const absImage = image ? new URL(image, window.location.origin).href : undefined;
    const restores = [
      setMeta("name", "description", description),
      setMeta("property", "og:title", title),
      setMeta("property", "og:description", description),
      setMeta("property", "og:image", absImage),
      setMeta("property", "og:url", window.location.href),
      setMeta("name", "twitter:title", title),
      setMeta("name", "twitter:description", description),
      setMeta("name", "twitter:image", absImage),
    ];
    return () => {
      document.title = prevTitle;
      restores.reverse().forEach((r) => r());
    };
  }, [title, description, image]);
};
