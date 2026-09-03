import { useMemo } from "react";

import { DashboardBookSection } from "@/components/dashboard/DashboardBookSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardEmptyState, DashboardErrorState, DashboardLoadingState } from "@/components/dashboard/DashboardState";
import { LibraryStats } from "@/components/dashboard/LibraryStats";
import { ReadingProgress } from "@/components/dashboard/ReadingProgress";
import { useBooks } from "@/hooks/useBooks";
import { getDashboardSections, getLibraryStats, getReadingProgress } from "@/lib/dashboard";

export function HomePage({ onBrowse, onCreateBook, onSelectBook }) {
  const { books, status, retry } = useBooks();
  const dashboard = useMemo(() => ({
    stats: getLibraryStats(books),
    sections: getDashboardSections(books),
    progress: getReadingProgress(books),
  }), [books]);

  if (status === "loading") return <DashboardLoadingState />;
  if (status === "error") return <DashboardErrorState onRetry={retry} />;

  return (
    <div>
      <DashboardHeader onBrowse={onBrowse} onCreateBook={onCreateBook} />
      {books.length === 0 ? (
        <div className="mt-12"><DashboardEmptyState onCreateBook={onCreateBook} /></div>
      ) : (
        <>
          <LibraryStats stats={dashboard.stats} />
          <div className="mt-10 grid gap-10 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
            <DashboardBookSection id="recent-books-title" title="Recién llegados" description="Las últimas historias que sumaste a tus estantes." books={dashboard.sections.recent} emptyMessage="Tus próximos libros aparecerán aquí." onSelectBook={onSelectBook} onBrowse={onBrowse} />
            <ReadingProgress progress={dashboard.progress} />
          </div>
          <div className="mt-12 space-y-12">
            <DashboardBookSection id="reading-books-title" title="Leyendo ahora" description="Historias en las que dejaste un marcador." books={dashboard.sections.reading} emptyMessage="No tienes lecturas en curso. Cuando empieces una, la encontrarás aquí." onSelectBook={onSelectBook} onBrowse={onBrowse} />
            <DashboardBookSection id="favorite-books-title" title="Tus favoritos" description="Libros a los que siempre quieres volver." books={dashboard.sections.favorites} emptyMessage="Marca como favorita una historia especial para tenerla siempre cerca." onSelectBook={onSelectBook} onBrowse={onBrowse} />
          </div>
        </>
      )}
    </div>
  );
}
