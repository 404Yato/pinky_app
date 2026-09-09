import { HandHeart, MapPin, User } from "@phosphor-icons/react";

import { POSSESSION_STATUS, POSSESSION_STATUS_LABEL } from "@/constants/items";

export function BookPossessionDetails({ book }) {
  const loaned = book.possessionStatus === POSSESSION_STATUS.LOANED;

  return (
    <section aria-labelledby="possession-title" className="mt-10">
      <h2 id="possession-title" className="font-heading text-2xl font-semibold">Tu ejemplar</h2>
      <div className="mt-4 rounded-lg border border-border bg-card p-5 sm:p-6">
        <p className="flex items-center gap-2 text-base font-semibold text-foreground">
          <HandHeart aria-hidden="true" className="size-5 text-primary" weight="duotone" />
          {POSSESSION_STATUS_LABEL[book.possessionStatus] ?? POSSESSION_STATUS_LABEL[POSSESSION_STATUS.OWNED]}
        </p>
        <dl className="mt-4 space-y-3 text-sm">
          {loaned && book.loanedTo && (
            <div className="flex items-start gap-2">
              <User aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <dt className="font-semibold text-muted-foreground">Prestado a:</dt>
              <dd className="min-w-0 break-words text-foreground">{book.loanedTo}</dd>
            </div>
          )}
          {book.location && (
            <div className="flex items-start gap-2">
              <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <dt className="font-semibold text-muted-foreground">{loaned ? "Ubicación habitual:" : "Ubicación:"}</dt>
              <dd className="min-w-0 break-words text-foreground">{book.location}</dd>
            </div>
          )}
        </dl>
      </div>
    </section>
  );
}
