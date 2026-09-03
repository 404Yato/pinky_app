import { Avatar } from "@base-ui/react/avatar";
import { SignOut } from "@phosphor-icons/react";

export function UserProfile({ user, onLogout }) {
  return (
    <div className="flex min-w-0 items-center gap-3" aria-label={`Usuario actual: ${user.name}`}>
      <Avatar.Root className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-secondary text-primary shadow-sm">
        <Avatar.Fallback className="grid size-full place-items-center text-xs font-bold tracking-wide">
          {user.initials}
        </Avatar.Fallback>
      </Avatar.Root>

      <div className="hidden min-w-0 sm:block">
        <p className="truncate text-sm font-semibold leading-tight text-foreground">{user.name}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
      <button type="button" onClick={onLogout} aria-label={`Cerrar sesión de ${user.name}`} title="Cerrar sesión" className="grid size-10 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <SignOut aria-hidden="true" className="size-5" />
      </button>
    </div>
  );
}
