import { Icon } from './Icon.jsx';

export function TopBar({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <button className="icon-button" type="button" onClick={onToggleSidebar} aria-label="Mostrar u ocultar menu">
        <Icon name="menu" />
      </button>
      <div className="brand">
        <img src="/pinkyapp-icon.png" alt="Icono de Pinky App" className="brand-icon" />
        <span>Pinky App</span>
      </div>
    </header>
  );
}
