import { Icon } from './Icon.jsx';

const objects = [
  { name: 'Cuadernos antiguos', type: 'Papeleria', status: 'Prestado', color: 'caramel' },
  { name: 'Camara analogica', type: 'Fotografia', status: 'Disponible', color: 'terracotta' },
  { name: 'Taza de ceramica', type: 'Cocina', status: 'Favorito', color: 'rose' },
  { name: 'Coleccion de llaves', type: 'Memorias', status: 'Archivado', color: 'umber' },
];

export function InventoryOverview() {
  return (
    <section className="inventory-view">
      <div className="intro">
        <div>
          <p className="eyebrow">Biblioteca de objetos</p>
          <h1>Mi Inventario</h1>
          <p className="intro-copy">
            Un espacio calido para guardar, clasificar y volver a encontrar objetos con historia.
          </p>
        </div>
        <button className="primary-action" type="button">
          <Icon name="archive" size={18} />
          Agregar objeto
        </button>
      </div>

      <div className="stats-grid" aria-label="Resumen de inventario">
        <article>
          <span>Objetos</span>
          <strong>124</strong>
        </article>
        <article>
          <span>Categorias</span>
          <strong>18</strong>
        </article>
        <article>
          <span>Favoritos</span>
          <strong>32</strong>
        </article>
      </div>

      <div className="object-grid">
        {objects.map((object) => (
          <article className="object-card" key={object.name}>
            <div className={`object-mark ${object.color}`}>
              <Icon name={object.status === 'Favorito' ? 'heart' : 'book'} />
            </div>
            <div>
              <h2>{object.name}</h2>
              <p>{object.type}</p>
            </div>
            <span className="status-pill">{object.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
