import { Icon } from './Icon.jsx';

const profileStats = [
  { label: 'Objetos registrados', value: '124' },
  { label: 'Prestamos activos', value: '7' },
  { label: 'Listas privadas', value: '5' },
];

export function ProfileView() {
  return (
    <section className="profile-view">
      <div className="profile-hero">
        <img src="/pinkyapp-icon.png" alt="Foto de perfil de Yato" className="profile-photo" />
        <div>
          <p className="eyebrow">Perfil de usuario</p>
          <h1>Yato</h1>
          <p className="intro-copy">
            Administradora de una biblioteca personal de objetos, recuerdos y colecciones favoritas.
          </p>
        </div>
      </div>

      <div className="profile-grid">
        <article className="profile-panel">
          <div className="panel-title">
            <Icon name="profile" />
            <h2>Informacion personal</h2>
          </div>
          <dl className="profile-list">
            <div>
              <dt>Nombre</dt>
              <dd>Yato</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>yato@pinkyapp.cl</dd>
            </div>
            <div>
              <dt>Ubicacion</dt>
              <dd>Santiago, Chile</dd>
            </div>
          </dl>
        </article>

        <article className="profile-panel">
          <div className="panel-title">
            <Icon name="archive" />
            <h2>Preferencias</h2>
          </div>
          <div className="preference-list">
            <span>Inventario privado</span>
            <span>Recordatorios de prestamo</span>
            <span>Colecciones destacadas</span>
          </div>
        </article>
      </div>

      <div className="stats-grid">
        {profileStats.map((stat) => (
          <article key={stat.label}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
