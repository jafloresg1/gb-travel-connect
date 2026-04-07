import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FACEBOOK_URL } from "@/lib/constants";

const FacebookSection = () => (
  <section id="facebook" className="py-20 bg-facebook/5">
    <div className="container mx-auto px-4 text-center max-w-2xl">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-facebook/10 text-facebook">
        <Facebook className="h-8 w-8" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Síguenos en <span className="text-facebook">Facebook</span>
      </h2>
      <p className="text-muted-foreground mb-8">
        Publicamos nuestras promociones más recientes, ofertas de última hora y
        oportunidades de viaje exclusivas. ¡No te las pierdas!
      </p>

      {/* Placeholder for future Facebook embed */}
      <div className="mb-8">
        {/* 
          To embed your Facebook page feed later, replace this div with:
          <iframe src="https://www.facebook.com/plugins/page.php?href=YOUR_PAGE_URL&tabs=timeline" ...></iframe>
        */}
      </div>

      <Button
        asChild
        size="lg"
        className="bg-facebook hover:bg-facebook/90 text-facebook-foreground gap-2 text-base"
      >
        <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
          <Facebook className="h-5 w-5" />
          Ver promociones en Facebook
        </a>
      </Button>
    </div>
  </section>
);

export default FacebookSection;
