import { Icon } from './Icon.jsx';

const menuItems = [
  { id: 'inventory', label: 'Mi Inventario', icon: 'inventory' },
  { id: 'profile', label: 'Perfil', icon: 'profile' },
];

export function Sidebar({ activeSection, isOpen, onSelectSection }) {
  return (
    <aside className="sidebar" aria-label="Menu principal" aria-hidden={!isOpen} inert={!isOpen ? '' : undefined}>
      <div className="user-card">
        <img src="/pinkyapp-icon.png" alt="Foto de usuario" className="user-avatar" />
        <div>
          <p className="user-label">Bienvenida</p>
          <strong>Yato</strong>
        </div>
      </div>
      <nav className="side-nav">
        {menuItems.map((item) => (
          <button
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            key={item.label}
            type="button"
            onClick={() => onSelectSection(item.id)}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
