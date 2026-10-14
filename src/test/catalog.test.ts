import { describe, expect, it } from "vitest";
import {
  IMPORT_EXAMPLE,
  draftFromImport,
  priceFromText,
  promotionStatus,
  slugify,
  whatsappProgramMessage,
  type CatalogPromotion,
} from "@/lib/catalog";

const promo = (p: Partial<CatalogPromotion>): CatalogPromotion => ({
  id: "x",
  slug: "x",
  title: "Promo",
  description: null,
  valid_from: "2026-10-01",
  valid_to: "2026-10-17",
  clauses: null,
  deposit_text: null,
  image_url: null,
  is_published: true,
  created_at: "",
  updated_at: "",
  ...p,
});

describe("catálogo", () => {
  it("calcula el estado de la promoción", () => {
    expect(promotionStatus(promo({}), "2026-10-17")).toBe("Vigente");
    expect(promotionStatus(promo({}), "2026-10-18")).toBe("Vencida");
    expect(promotionStatus(promo({}), "2026-09-30")).toBe("Programada");
    expect(promotionStatus(promo({ is_published: false }), "2026-10-10")).toBe("Borrador");
  });

  it("formatea el precio desde", () => {
    expect(priceFromText(999, 899, "USD")).toBe("$999 USD + $899 USD de impuestos");
    expect(priceFromText(15999, 0, "MXN")).toBe("$15,999 MXN");
  });

  it("genera slugs sin acentos", () => {
    expect(slugify("Mega Turquía y Dubái")).toBe("mega-turquia-y-dubai");
  });

  it("arma el mensaje de WhatsApp", () => {
    expect(whatsappProgramMessage("Mega Canadá")).toBe(
      "Hola, me interesa el viaje *Mega Canadá*. ¿Me pueden dar información?",
    );
  });

  it("importa el JSON de ejemplo", () => {
    const d = draftFromImport(IMPORT_EXAMPLE);
    expect(d.title).toBe("Europa Clásica");
    expect(d.slug).toBe("europa-clasica");
    expect(d.departures).toHaveLength(1);
    expect(d.internal.operator).toBe("Mega Travel");
    expect(d.is_published).toBe(false);
    expect(() => draftFromImport("{nope")).toThrow();
  });
});
