import { READING_STATUS } from "@/constants/books";

const labels = {
  [READING_STATUS.READ]: "Leídos",
  [READING_STATUS.READING]: "Leyendo",
  [READING_STATUS.PENDING]: "Pendientes",
};

export function ReadingProgress({ progress }) {
  return (
    <section aria-labelledby="reading-progress-title" className="rounded-lg border border-border bg-card p-5 sm:p-7">
      <h2 id="reading-progress-title" className="font-heading text-2xl font-semibold text-card-foreground">Tu camino lector</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">Cada libro encuentra su momento.</p>
      <div className="mt-6 space-y-5">
        {progress.map(({ status, count, percentage }) => (
          <div key={status}>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm">
              <span className="font-medium text-foreground">{labels[status]}</span>
              <span className="text-muted-foreground">{count} · {percentage}%</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${labels[status]}: ${percentage}%`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={percentage}
              className="h-2 overflow-hidden rounded-full bg-secondary"
            >
              <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
