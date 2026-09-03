import { useEffect, useRef, useState } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ title, pageKey, activeItem, onNavigate, user, onLogout, children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    document.title = `${title} | Pinky`;
    const frame = window.requestAnimationFrame(() => mainRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [pageKey, title]);

  return (
    <div className="min-h-dvh bg-background">
      <a href="#main-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background motion-reduce:transition-none">
        Saltar al contenido
      </a>
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <MobileNavigation
        open={mobileNavigationOpen}
        activeItem={activeItem}
        onNavigate={onNavigate}
        onClose={() => setMobileNavigationOpen(false)}
      />

      <div className="min-h-dvh min-w-0 lg:pl-64">
        <AppHeader title={title} user={user} onLogout={onLogout} onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main ref={mainRef} id="main-content" tabIndex="-1" className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 focus:outline-none sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10 xl:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
