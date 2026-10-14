import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage, uploadCatalogImage } from "@/lib/catalog";

type Props = {
  folder: string;
  multiple?: boolean;
  label?: string;
  onUploaded: (urls: string[]) => void;
};

/** Sube imágenes al bucket público "catalog" y devuelve sus URLs públicas. */
const ImageUploadButton = ({ folder, multiple = false, label = "Subir foto", onUploaded }: Props) => {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} no es una imagen.`);
          continue;
        }
        if (file.size > 8 * 1024 * 1024) {
          toast.error(`${file.name} pesa más de 8 MB.`);
          continue;
        }
        urls.push(await uploadCatalogImage(file, folder));
      }
      if (urls.length) {
        onUploaded(urls);
        toast.success(urls.length === 1 ? "Foto subida" : `${urls.length} fotos subidas`);
      }
    } catch (e) {
      toast.error(`No se pudo subir: ${errorMessage(e)}`);
      if (urls.length) onUploaded(urls);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      <Button type="button" variant="outline" className="gap-2" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
        {label}
      </Button>
    </>
  );
};

export default ImageUploadButton;
