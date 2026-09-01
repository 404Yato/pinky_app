import { Books } from "@phosphor-icons/react";

import { AppNavigation } from "@/components/layout/AppNavigation";

export function Sidebar({ activeItem, onNavigate }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-7">
        <span className="grid size-10 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <Books aria-hidden="true" className="size-6" weight="duotone" />
        </span>
        <div>
          <p className="font-heading text-2xl font-semibold leading-none tracking-tight">Pinky</p>
          <p className="mt-1 text-xs text-sidebar-foreground/65">Tu biblioteca personal</p>
        </div>
      </div>

      <AppNavigation
        activeItem={activeItem}
        onNavigate={onNavigate}
        className="flex-1 overflow-y-auto px-4 py-7"
      />

      <p className="border-t border-sidebar-border px-7 py-5 text-xs leading-relaxed text-sidebar-foreground/55">
        Un rincón tranquilo para tus historias.
      </p>
    </aside>
  );
}
