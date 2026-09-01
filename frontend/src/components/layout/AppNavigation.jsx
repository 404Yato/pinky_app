import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function AppNavigation({ activeItem = "home", onNavigate, className }) {
  return (
    <nav aria-label="Navegación principal" className={className}>
      <ul className="space-y-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeItem;

          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={isActive ? "page" : undefined}
                aria-disabled={!item.available}
                disabled={!item.available}
                onClick={() => onNavigate?.(item.id)}
                className={cn(
                  "group flex min-h-11 w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !item.available && "cursor-not-allowed opacity-55",
                )}
              >
                <Icon aria-hidden="true" className="size-5 shrink-0" weight={isActive ? "fill" : "regular"} />
                <span className="flex-1">{item.label}</span>
                {!item.available && (
                  <span className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] opacity-75">
                    Próximamente
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
