import { useState } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ title, activeItem, onNavigate, user, onLogout, children }) {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <MobileNavigation
        open={mobileNavigationOpen}
        activeItem={activeItem}
        onNavigate={onNavigate}
        onClose={() => setMobileNavigationOpen(false)}
      />

      <div className="min-h-dvh min-w-0 lg:pl-64">
        <AppHeader title={title} user={user} onLogout={onLogout} onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main id="main-content" className="mx-auto w-full min-w-0 max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12 xl:px-10 xl:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
