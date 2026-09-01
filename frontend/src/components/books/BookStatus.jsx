import { BookOpen, CheckCircle, Clock } from "@phosphor-icons/react";

import { READING_STATUS } from "@/constants/books";
import { cn } from "@/lib/utils";

const statusDetails = {
  [READING_STATUS.READ]: { label: "Leído", icon: CheckCircle, className: "bg-[#e4eadc] text-[#46543b]" },
  [READING_STATUS.READING]: { label: "Leyendo", icon: BookOpen, className: "bg-[#f2dfce] text-[#744a2f]" },
  [READING_STATUS.PENDING]: { label: "Pendiente", icon: Clock, className: "bg-secondary text-secondary-foreground" },
};

export function BookStatus({ status }) {
  const details = statusDetails[status] ?? statusDetails[READING_STATUS.PENDING];
  const Icon = details.icon;

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", details.className)}>
      <Icon aria-hidden="true" className="size-3.5" weight="fill" />
      {details.label}
    </span>
  );
}
