import { useState } from "react";

import { AppHeader } from "@/components/layout/AppHeader";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell({ title, activeItem, onNavigate, children }) {
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

      <div className="min-h-dvh lg:pl-64">
        <AppHeader title={title} onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main id="main-content" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-10 lg:py-16">
          {children}
        </main>
      </div>
    </div>
  );
}
