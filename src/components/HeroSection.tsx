import { MessageCircle, Plane, Palmtree, Globe, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/constants";
import cardPlaya from "@/assets/card-playa.jpg";
import cardInternacional from "@/assets/card-internacional.jpg";
import cardExperiencias from "@/assets/card-experiencias.jpg";

const WHATSAPP_MESSAGE = "Hola, quiero cotizar un viaje. Mi nombre es:";

const cards = [
  {
    title: "Playa",
    text: "Relájate en paraísos de aguas turquesas.",
    img: cardPlaya,
    Icon: Palmtree,
  },
  {
    title: "Internacional",
    text: "Descubre destinos que te cambiarán la vida.",
    img: cardInternacional,
    Icon: Globe,
  },
  {
    title: "Experiencias",
    text: "Viajes a tu medida, momentos inolvidables.",
    img: cardExperiencias,
    Icon: Heart,
  },
];

const HeroSection = () => (
  <section
    id="inicio"
    className="relative overflow-hidden bg-gradient-to-b from-secondary via-background to-secondary/40 pt-12 pb-20"
  >
    {/* Soft decorative palm shadow */}
    <div
      className="pointer-events-none absolute -top-10 -left-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
      aria-hidden="true"
    />
    <div
      className="pointer-events-none absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
      aria-hidden="true"
    />

    <div className="container relative z-10 mx-auto px-4">
      {/* Welcome */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <div className="mb-5 flex items-center justify-center gap-3 text-accent">
          <span className="h-px w-10 bg-accent/50" />
          <Plane className="h-5 w-5" />
          <span className="h-px w-10 bg-accent/50" />
        </div>
        <h1 className="text-4xl font-bold leading-tight text-primary md:text-5xl">
          Bienvenido a <span className="text-accent">GB Travel</span>
        </h1>
        <p className="mt-4 text-lg font-light text-muted-foreground">
          Inspírate y descubre tu próximo viaje.
        </p>
      </div>

      {/* Visual cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map(({ title, text, img, Icon }) => (
          <article
            key={title}
            className="group relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl ring-1 ring-border/40"
          >
            <img
              src={img}
              alt={title}
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-3 p-6">
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground">{title}</h2>
                <span className="my-2 block h-0.5 w-10 bg-accent" />
                <p className="max-w-[14rem] text-sm font-light text-primary-foreground/90">
                  {text}
                </p>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/70 text-accent">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Main actions */}
      <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button asChild size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Link to="/arma-tu-viaje">
            <Sparkles className="h-5 w-5" />
            Arma tu viaje
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="gap-2 border-primary/30 text-primary hover:bg-secondary"
        >
          <a href={whatsappLink(WHATSAPP_MESSAGE)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default HeroSection;
