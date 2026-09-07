import { Books, WarningCircle } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

export function AuthLoadingState({ error = false, onRetry }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6" role={error ? "alert" : "status"} aria-label={error ? undefined : "Restaurando sesión"}>
      <div className="text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-md bg-primary text-primary-foreground">{error ? <WarningCircle aria-hidden="true" className="size-6" weight="duotone" /> : <Books aria-hidden="true" className="size-6" weight="duotone" />}</span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">{error ? "No pudimos recuperar tu sesión" : "Preparando tu biblioteca"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error ? "Comprueba que el servicio esté disponible e intenta nuevamente." : "Estamos recuperando tu sesión."}</p>
        {error && <Button type="button" onClick={onRetry} className="mt-6 h-11 px-5 text-sm">Reintentar</Button>}
      </div>
    </main>
  );
}
