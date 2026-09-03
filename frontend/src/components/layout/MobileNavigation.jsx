import { useEffect, useRef } from "react";
import { Books, X } from "@phosphor-icons/react";

import { AppNavigation } from "@/components/layout/AppNavigation";

export function MobileNavigation({ open, onClose, activeItem, onNavigate }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleNavigate = (itemId) => {
    onNavigate?.(itemId);
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="mobile-navigation-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="mobile-navigation m-0 h-dvh max-h-none w-[min(20rem,calc(100vw-2rem))] max-w-none overflow-hidden bg-sidebar p-0 text-sidebar-foreground shadow-2xl lg:hidden"
    >
      <div className="flex h-full flex-col">
        <div className="flex min-h-20 items-center gap-3 border-b border-sidebar-border px-4 pt-[env(safe-area-inset-top)] min-[380px]:px-5">
          <span className="grid size-10 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Books aria-hidden="true" className="size-6" weight="duotone" />
          </span>
          <div className="min-w-0 flex-1">
            <p id="mobile-navigation-title" className="font-heading text-2xl font-semibold leading-none">
              Pinky
            </p>
            <p className="mt-1 truncate text-xs text-sidebar-foreground/65">Tu biblioteca personal</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Cerrar navegación"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-md text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <AppNavigation
          activeItem={activeItem}
          onNavigate={handleNavigate}
          className="flex-1 overflow-y-auto px-3 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] min-[380px]:px-4 min-[380px]:py-6"
        />
      </div>
    </dialog>
  );
}
