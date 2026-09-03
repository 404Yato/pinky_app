import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { getFocusedCollection, getFocusedCollectionByPath } from "@/config/collections";
import { navigateTo, readRoute, withReturnTo } from "@/lib/routes";
import { useAuth } from "@/hooks/useAuth";
import { HomePage } from "@/pages/HomePage";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { BookFormPage } from "@/pages/BookFormPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { FocusedCollectionPage } from "@/pages/FocusedCollectionPage";
import { LoginPage } from "@/pages/LoginPage";

function App() {
  const [route, setRoute] = useState(readRoute);
  const { user, authenticated, login, logout } = useAuth();
  const isLibrary = route.page === "library";
  const isBookDetail = route.page === "book-detail";
  const isBookForm = route.page === "book-create" || route.page === "book-edit";
  const isCollection = route.page === "collection";
  const collection = isCollection ? getFocusedCollection(route.collectionId) : null;
  const returnCollection = getFocusedCollectionByPath(route.returnTo);
  const activeItem = collection?.id ?? returnCollection?.id ?? (isLibrary || isBookDetail || isBookForm ? "library" : "home");

  useEffect(() => {
    const handleRouteChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  useEffect(() => {
    if (authenticated && route.page === "login") navigateTo("/");
  }, [authenticated, route.page]);

  if (!authenticated) {
    return <LoginPage onLogin={async (credentials) => {
      await login(credentials);
      if (route.page === "login") navigateTo("/");
    }} />;
  }

  const handleLogout = () => {
    logout();
    navigateTo("/login");
  };

  const handleNavigate = (itemId) => {
    const destination = getFocusedCollection(itemId)?.path ?? (itemId === "library" ? "/library" : "/");
    navigateTo(destination);
  };

  const pageTitle = collection?.label ?? (isBookForm ? (route.page === "book-edit" ? "Editar libro" : "Agregar libro") : isBookDetail ? "Detalle del libro" : isLibrary ? "Biblioteca" : "Inicio");
  const successMessage = route.success === "created" ? "El libro se agregó a tu biblioteca." : route.success === "updated" ? "Los cambios se guardaron correctamente." : null;

  return (
    <AppShell title={pageTitle} activeItem={activeItem} onNavigate={handleNavigate} user={user} onLogout={handleLogout}>
      {isBookDetail && <BookDetailPage bookId={route.bookId} onBack={() => navigateTo(route.returnTo)} onEdit={() => navigateTo(withReturnTo(`/library/${route.bookId}/edit`, route.returnTo))} onDeleted={() => navigateTo(route.returnTo)} successMessage={successMessage} />}
      {isBookForm && <BookFormPage bookId={route.bookId} onCancel={() => navigateTo(route.bookId ? withReturnTo(`/library/${route.bookId}`, route.returnTo) : "/library")} onSaved={(book, action) => navigateTo(withReturnTo(`/library/${book.id}?success=${action}`, route.returnTo))} />}
      {isLibrary && <LibraryPage onSelectBook={(bookId) => navigateTo(`/library/${bookId}`)} onCreateBook={() => navigateTo("/library/new")} />}
      {collection && <FocusedCollectionPage key={collection.id} collection={collection} onSelectBook={(bookId) => navigateTo(withReturnTo(`/library/${bookId}`, collection.path))} />}
      {!isLibrary && !isBookDetail && !isBookForm && !isCollection && (
        <HomePage
          onBrowse={() => navigateTo("/library")}
          onCreateBook={() => navigateTo("/library/new")}
          onSelectBook={(bookId) => navigateTo(`/library/${bookId}`)}
        />
      )}
    </AppShell>
  );
}

export default App;
