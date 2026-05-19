import { useState } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { TopBar } from './components/TopBar.jsx';
import { InventoryOverview } from './components/InventoryOverview.jsx';
import { ProfileView } from './components/ProfileView.jsx';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('inventory');

  return (
    <div className={`app-shell ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar activeSection={activeSection} isOpen={isSidebarOpen} onSelectSection={setActiveSection} />
      <div className="workspace">
        <TopBar onToggleSidebar={() => setIsSidebarOpen((current) => !current)} />
        <main className="page-content">
          {activeSection === 'inventory' ? <InventoryOverview /> : <ProfileView />}
        </main>
      </div>
    </div>
  );
}
