import { List } from "@phosphor-icons/react";

import { UserProfile } from "@/components/layout/UserProfile";

export function AppHeader({ title, user, onLogout, onOpenNavigation }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/80 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center gap-2 px-3 min-[380px]:gap-3 min-[380px]:px-4 sm:gap-4 sm:px-6 lg:h-20 lg:px-8 xl:px-10">
        <button
          type="button"
          aria-label="Abrir navegación"
          aria-haspopup="dialog"
          onClick={onOpenNavigation}
          className="grid size-11 shrink-0 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
        >
          <List aria-hidden="true" className="size-5" />
        </button>
        <p className="min-w-0 flex-1 truncate font-heading text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </p>
        <div className="shrink-0 border-l border-border pl-2 min-[380px]:pl-3 sm:pl-5">
          <UserProfile user={user} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
