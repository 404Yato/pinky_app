import { BookOpen, Books, BookmarkSimple, Heart, Hourglass } from "@phosphor-icons/react";

const items = [
  { key: "total", label: "En tu biblioteca", Icon: Books },
  { key: "read", label: "Leídos", Icon: BookOpen },
  { key: "reading", label: "Leyendo ahora", Icon: BookmarkSimple },
  { key: "pending", label: "Por descubrir", Icon: Hourglass },
  { key: "favorites", label: "Favoritos", Icon: Heart },
];

export function LibraryStats({ stats }) {
  return (
    <section aria-labelledby="library-stats-title" className="mt-10 border-y border-border py-7 sm:mt-12">
      <h2 id="library-stats-title" className="sr-only">Resumen de tu biblioteca</h2>
      <dl className="grid grid-cols-1 gap-x-5 gap-y-5 min-[360px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {items.map(({ key, label, Icon }) => (
          <div key={key} className="flex min-w-0 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-primary">
              <Icon aria-hidden="true" className="size-5" weight="duotone" />
            </span>
            <div className="min-w-0">
              <dd className="font-heading text-2xl font-semibold leading-none text-foreground">{stats[key]}</dd>
              <dt className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">{label}</dt>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}
