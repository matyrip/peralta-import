import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import productos from '../productos'

const categorias = [
  { id: 'ropa', nombre: 'Ropa Mujer & Hombre', emoji: '👗', subcats: ['Vestidos', 'Camisas', 'Pantalones', 'Ropa Interior', 'Abrigos'] },
  { id: 'calzado', nombre: 'Calzado', emoji: '👟', subcats: ['Zapatillas', 'Zapatos', 'Sandalias', 'Botas', 'Pantuflas'] },
  { id: 'electronica', nombre: 'Electrónica', emoji: '📱', subcats: ['Celulares', 'Auriculares', 'Smartwatch', 'Cables', 'Cargadores'] },
  { id: 'hogar', nombre: 'Hogar & Deco', emoji: '🏠', subcats: ['Cocina', 'Baño', 'Decoración', 'Iluminación', 'Textiles'] },
  { id: 'juguetes', nombre: 'Juguetes', emoji: '🧸', subcats: ['Educativos', 'Muñecas', 'Autos', 'Robots', 'Juegos de Mesa'] },
  { id: 'herramientas', nombre: 'Herramientas', emoji: '🔧', subcats: ['Eléctricas', 'Manuales', 'Medición', 'Fijación', 'Jardín'] },
  { id: 'belleza', nombre: 'Belleza & Cuidado', emoji: '💄', subcats: ['Maquillaje', 'Skincare', 'Cabello', 'Perfumes', 'Uñas'] },
  { id: 'deportes', nombre: 'Deportes', emoji: '⚽', subcats: ['Fútbol', 'Fitness', 'Natación', 'Ciclismo', 'Artes Marciales'] },
  { id: 'accesorios', nombre: 'Accesorios', emoji: '🎒', subcats: ['Bolsos', 'Cinturones', 'Lentes', 'Relojes', 'Joyería'] },
]

function Categorias({ agregarAlCarrito }) {
  const [categoriaActiva, setCategoriaActiva] = useState(categorias[0])
  const navigate = useNavigate()
  const productosFiltrados = productos.filter(p => p.categoria === categoriaActiva.id)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>
          Todas las <span style={{ color: '#E8001D' }}>Categorías</span>
        </h1>
        <p style={styles.headerSub}>Explorá nuestro catálogo completo de productos importados</p>
      </div>

      <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarTitle}>Departamentos</div>
          {categorias.map(cat => (
            <div
              key={cat.id}
              onClick={() => setCategoriaActiva(cat)}
              style={{
                ...styles.catItem,
                background: categoriaActiva.id === cat.id ? '#1e1e1e' : 'transparent',
                borderLeft: categoriaActiva.id === cat.id ? '3px solid #E8001D' : '3px solid transparent',
                color: categoriaActiva.id === cat.id ? 'white' : '#888',
              }}
            >
              <span style={{ marginRight: '10px' }}>{cat.emoji}</span>
              <span style={{ flex: 1 }}>{cat.nombre}</span>
              <span style={{ fontSize: '12px' }}>›</span>
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {/* SUBCATEGORIAS */}
          <div style={styles.subcatRow}>
            {categoriaActiva.subcats.map(sub => (
              <button
                key={sub}
                onClick={() => navigate(`/categoria/${categoriaActiva.id}`)}
                style={styles.subcatBtn}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* PRODUCTOS */}
          <div style={styles.productsHeader}>
            <span style={styles.sectionLabel}>{categoriaActiva.emoji} {categoriaActiva.nombre}</span>
            <span style={{ color: '#888', fontSize: '14px' }}>{productosFiltrados.length} productos</span>
          </div>

          {productosFiltrados.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
              <p>Próximamente productos en esta categoría</p>
              <button
                onClick={() => navigate(`/categoria/${categoriaActiva.id}`)}
                style={styles.verTodosBtn}
              >
                Ver página de categoría
              </button>
            </div>
          ) : (
            <>
              <div style={styles.grid}>
                {productosFiltrados.map(p => (
                  <ProductCard key={p.id} producto={p} agregarAlCarrito={agregarAlCarrito} />
                ))}
              </div>
              <button
                onClick={() => navigate(`/categoria/${categoriaActiva.id}`)}
                style={styles.verTodosBtn}
              >
                Ver todos en {categoriaActiva.nombre} →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  header: {
    background: '#141414',
    padding: '40px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerTitle: {
    fontWeight: 900,
    fontSize: 'clamp(28px, 4vw, 48px)',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  headerSub: {
    color: '#888',
    fontSize: '15px',
  },
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 140px)',
  },
  sidebar: {
    width: '260px',
    flexShrink: 0,
    background: '#141414',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    padding: '24px 0',
  },
  sidebarTitle: {
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#E8001D',
    padding: '0 20px 16px',
  },
  catItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all .15s',
  },
  content: {
    flex: 1,
    padding: '32px 40px',
    overflowY: 'auto',
  },
  subcatRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '32px',
  },
  subcatBtn: {
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#ccc',
    padding: '8px 18px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all .2s',
    fontWeight: 500,
  },
  productsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  sectionLabel: {
    fontWeight: 700,
    fontSize: '18px',
    color: 'white',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  empty: {
    textAlign: 'center',
    padding: '80px 40px',
    color: '#888',
    fontSize: '16px',
  },
  verTodosBtn: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '14px 36px',
    fontWeight: 700,
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    display: 'block',
    marginTop: '16px',
  },
}

export default Categorias