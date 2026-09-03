import { CheckCircle, WarningCircle, X } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

const variants = {
  success: {
    Icon: CheckCircle,
    className: "border-[#b9c8aa] bg-[#e4eadc] text-[#46543b]",
  },
  error: {
    Icon: WarningCircle,
    className: "border-destructive/30 bg-destructive/10 text-destructive",
  },
};

export function StatusNotice({ children, variant = "success", onDismiss, className }) {
  const details = variants[variant] ?? variants.success;
  const Icon = details.Icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex items-start gap-3 rounded-md border px-4 py-3 text-sm font-medium leading-6", details.className, className)}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" weight="fill" />
      <span className="min-w-0 flex-1">{children}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Cerrar mensaje" className="grid size-10 shrink-0 place-items-center rounded-md transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2 focus-visible:ring-offset-transparent">
          <X aria-hidden="true" className="size-4" />
        </button>
      )}
    </div>
  );
}
