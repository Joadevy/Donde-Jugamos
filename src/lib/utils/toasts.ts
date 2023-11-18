import {toast} from "@/components/ui/use-toast";

export const successToast = (description: string) =>
  toast({
    title: "✅ Solicitud exitosa!",
    description,
  });

export const errorToast = (description: string) =>
  toast({
    title: "❌ Error",
    description,
  });

export const toastTimer = (description: string) =>
  toast({
    title: "⏳ Estamos procesando la operación...",
    description,
  });
