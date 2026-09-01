import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { navigateTo, readRoute } from "@/lib/routes";
import { HomePage } from "@/pages/HomePage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { BookFormPage } from "@/pages/BookFormPage";
import { LibraryPage } from "@/pages/LibraryPage";

function App() {
  const [route, setRoute] = useState(readRoute);
  const isLibrary = route.page === "library";
  const isBookDetail = route.page === "book-detail";
  const isBookForm = route.page === "book-create" || route.page === "book-edit";
  const activeItem = isLibrary || isBookDetail || isBookForm ? "library" : "home";

  useEffect(() => {
    const handleRouteChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const handleNavigate = (itemId) => {
    navigateTo(itemId === "library" ? "/library" : "/");
  };

  const pageTitle = isBookForm ? (route.page === "book-edit" ? "Editar libro" : "Agregar libro") : isBookDetail ? "Detalle del libro" : isLibrary ? "Biblioteca" : "Inicio";
  const successMessage = route.success === "created" ? "El libro se agregó a tu biblioteca." : route.success === "updated" ? "Los cambios se guardaron correctamente." : null;

  return (
    <AppShell title={pageTitle} activeItem={activeItem} onNavigate={handleNavigate}>
      {isBookDetail && <BookDetailPage bookId={route.bookId} onBack={() => navigateTo("/library")} onEdit={() => navigateTo(`/library/${route.bookId}/edit`)} onDeleted={() => navigateTo("/library")} successMessage={successMessage} />}
      {isBookForm && <BookFormPage bookId={route.bookId} onCancel={() => navigateTo(route.bookId ? `/library/${route.bookId}` : "/library")} onSaved={(book, action) => navigateTo(`/library/${book.id}?success=${action}`)} />}
      {isLibrary && <LibraryPage onSelectBook={(bookId) => navigateTo(`/library/${bookId}`)} onCreateBook={() => navigateTo("/library/new")} />}
      {!isLibrary && !isBookDetail && !isBookForm && <HomePage />}
    </AppShell>
  );
}

export default App;
