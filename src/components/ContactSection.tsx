import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const ContactSection = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    destino: "",
    fecha: "",
    pasajeros: "",
    mensaje: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Build WhatsApp message with form data
    const msg = `Hola, quiero cotizar un viaje.\n\nNombre: ${form.nombre}\nTeléfono: ${form.telefono}\nCorreo: ${form.correo}\nDestino: ${form.destino}\nFecha: ${form.fecha}\nPasajeros: ${form.pasajeros}\nMensaje: ${form.mensaje}`;
    window.open(whatsappLink(msg), "_blank");
    toast({
      title: "¡Solicitud enviada!",
      description: "Te redirigimos a WhatsApp para completar tu cotización.",
    });
  };

  return (
    <section id="contacto" className="py-20 bg-secondary">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Solicita tu <span className="text-primary">Cotización</span>
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          Llena el formulario y te contactaremos a la brevedad, o escríbenos directo por WhatsApp.
        </p>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl p-6 md:p-8 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="nombre" placeholder="Nombre" required value={form.nombre} onChange={handleChange} />
            <Input name="telefono" placeholder="Teléfono o WhatsApp" required value={form.telefono} onChange={handleChange} />
            <Input name="correo" type="email" placeholder="Correo electrónico" value={form.correo} onChange={handleChange} />
            <Input name="destino" placeholder="Destino deseado" value={form.destino} onChange={handleChange} />
            <Input name="fecha" placeholder="Fecha de viaje" value={form.fecha} onChange={handleChange} />
            <Input name="pasajeros" placeholder="Número de pasajeros" value={form.pasajeros} onChange={handleChange} />
          </div>
          <Textarea name="mensaje" placeholder="Mensaje adicional" rows={3} value={form.mensaje} onChange={handleChange} />

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="submit" size="lg" className="flex-1 gap-2 text-base">
              <Send className="h-4 w-4" />
              Solicitar cotización
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="flex-1 gap-2 text-base border-whatsapp text-whatsapp hover:bg-whatsapp/10"
            >
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                WhatsApp directo
              </a>
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
