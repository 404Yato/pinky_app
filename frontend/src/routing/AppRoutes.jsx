import { useEffect } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";

import { AuthLoadingState } from "@/components/auth/AuthLoadingState";
import { AppShell } from "@/components/layout/AppShell";
import { getFocusedCollection, getFocusedCollectionByPath } from "@/config/collections";
import { BookDetailPage } from "@/pages/BookDetailPage";
import { BookFormPage } from "@/pages/BookFormPage";
import { FocusedCollectionPage } from "@/pages/FocusedCollectionPage";
import { HomePage } from "@/pages/HomePage";
import { LandingPage } from "@/pages/LandingPage";
import { LibraryPage } from "@/pages/LibraryPage";
import { LoginPage } from "@/pages/LoginPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ROUTES } from "@/routing/routeConfig";
import { getLoginDestination, getReturnTo, getSuccessMessage, parseBookId } from "@/routing/routeState";

function LegacyHashRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const legacyPath = location.hash.startsWith("#/") ? location.hash.slice(1) : null;

  useEffect(() => {
    if (legacyPath) navigate(legacyPath, { replace: true, state: location.state });
  }, [legacyPath, location.state, navigate]);

  return legacyPath ? null : <Outlet />;
}

function PublicAuthRoute({ auth, page }) {
  const location = useLocation();
  const navigate = useNavigate();

  if (auth.status === "loading") return <AuthLoadingState />;
  if (auth.status === "error") return <AuthLoadingState error onRetry={auth.retry} />;
  if (auth.authenticated) return <Navigate to={ROUTES.home} replace />;

  if (page === "register") {
    return <RegisterPage onRegister={async (values) => {
      await auth.register(values);
      navigate(ROUTES.login, { state: { success: "registered" } });
    }} />;
  }

  return (
    <LoginPage
      successMessage={location.state?.success === "registered" ? "Cuenta creada correctamente. Ya puedes iniciar sesión." : null}
      onDismissSuccess={() => navigate(ROUTES.login, { replace: true, state: null })}
      onLogin={async (credentials) => {
        await auth.login(credentials);
        navigate(getLoginDestination(location.state), { replace: true });
      }}
    />
  );
}

function ProtectedRoute({ auth }) {
  const location = useLocation();

  if (auth.status === "loading") return <AuthLoadingState />;
  if (auth.status === "error") return <AuthLoadingState error onRetry={auth.retry} />;
  if (!auth.authenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}

function AuthenticatedLayout({ auth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const detailMatch = useMatch(ROUTES.bookDetail);
  const editMatch = useMatch(ROUTES.editBook);
  const collection = getFocusedCollectionByPath(location.pathname);
  const libraryRoute = location.pathname === ROUTES.library || location.pathname === ROUTES.createBook || detailMatch || editMatch;
  const activeItem = collection?.id ?? (libraryRoute ? "library" : "home");
  const title = collection?.label
    ?? (editMatch ? "Editar libro" : location.pathname === ROUTES.createBook ? "Agregar libro" : detailMatch ? "Detalle del libro" : location.pathname === ROUTES.library ? "Biblioteca" : "Inicio");

  const handleLogout = async () => {
    await auth.logout();
    navigate(ROUTES.login, { replace: true });
  };

  const handleNavigate = (itemId) => {
    const destination = getFocusedCollection(itemId)?.path ?? (itemId === "library" ? ROUTES.library : ROUTES.home);
    navigate(destination);
  };

  return (
    <AppShell title={title} pageKey={`${location.pathname}:${location.key}`} activeItem={activeItem} onNavigate={handleNavigate} user={auth.user} onLogout={handleLogout}>
      <Outlet />
    </AppShell>
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  return <HomePage onBrowse={() => navigate(ROUTES.library)} onCreateBook={() => navigate(ROUTES.createBook)} onSelectBook={(bookId) => navigate(`/library/${bookId}`)} />;
}

function LibraryRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <LibraryPage
      onSelectBook={(bookId) => navigate(`/library/${bookId}`)}
      onCreateBook={() => navigate(ROUTES.createBook)}
      successMessage={getSuccessMessage(location.state)}
      onDismissSuccess={() => navigate(ROUTES.library, { replace: true, state: null })}
    />
  );
}

function FocusedCollectionRoute({ collectionId }) {
  const collection = getFocusedCollection(collectionId);
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <FocusedCollectionPage
      collection={collection}
      onSelectBook={(bookId) => navigate(`/library/${bookId}`, { state: { returnTo: collection.path } })}
      successMessage={getSuccessMessage(location.state)}
      onDismissSuccess={() => navigate(collection.path, { replace: true, state: null })}
    />
  );
}

function BookDetailRoute() {
  const { bookId: rawBookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookId = parseBookId(rawBookId);
  if (bookId === null) return <Navigate to={ROUTES.landing} replace />;

  const returnTo = getReturnTo(location.state);
  return (
    <BookDetailPage
      bookId={bookId}
      onBack={() => navigate(returnTo)}
      onEdit={() => navigate(`/library/${bookId}/edit`, { state: { returnTo } })}
      onDeleted={() => navigate(returnTo, { state: { success: "deleted" } })}
      successMessage={getSuccessMessage(location.state)}
      onDismissSuccess={() => navigate(`/library/${bookId}`, { replace: true, state: { returnTo } })}
    />
  );
}

function BookFormRoute({ editing = false }) {
  const { bookId: rawBookId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const bookId = editing ? parseBookId(rawBookId) : null;
  if (editing && bookId === null) return <Navigate to={ROUTES.landing} replace />;

  const returnTo = getReturnTo(location.state);
  return (
    <BookFormPage
      bookId={bookId}
      onCancel={() => navigate(editing ? `/library/${bookId}` : ROUTES.library, { state: editing ? { returnTo } : null })}
      onSaved={(book, action) => navigate(`/library/${book.id}`, { state: { success: action, returnTo } })}
    />
  );
}

export function AppRoutes({ auth }) {
  return (
    <Routes>
      <Route element={<LegacyHashRedirect />}>
        <Route path={ROUTES.landing} element={<LandingPage authenticated={auth.authenticated} />} />
        <Route path={ROUTES.login} element={<PublicAuthRoute auth={auth} page="login" />} />
        <Route path={ROUTES.register} element={<PublicAuthRoute auth={auth} page="register" />} />

        <Route element={<ProtectedRoute auth={auth} />}>
          <Route element={<AuthenticatedLayout auth={auth} />}>
            <Route path={ROUTES.home} element={<HomeRoute />} />
            <Route path={ROUTES.library} element={<LibraryRoute />} />
            <Route path={ROUTES.createBook} element={<BookFormRoute />} />
            <Route path={ROUTES.bookDetail} element={<BookDetailRoute />} />
            <Route path={ROUTES.editBook} element={<BookFormRoute editing />} />
            <Route path={ROUTES.favorites} element={<FocusedCollectionRoute collectionId="favorites" />} />
            <Route path={ROUTES.read} element={<FocusedCollectionRoute collectionId="read" />} />
            <Route path={ROUTES.reading} element={<FocusedCollectionRoute collectionId="reading" />} />
            <Route path={ROUTES.pending} element={<FocusedCollectionRoute collectionId="pending" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.landing} replace />} />
      </Route>
    </Routes>
  );
}
