import { Link } from 'react-router-dom'
import { useState } from 'react'

const categorias = [
  { id: 'ropa', nombre: 'Ropa Mujer & Hombre', emoji: '👗' },
  { id: 'calzado', nombre: 'Calzado', emoji: '👟' },
  { id: 'electronica', nombre: 'Electrónica', emoji: '📱' },
  { id: 'hogar', nombre: 'Hogar & Deco', emoji: '🏠' },
  { id: 'juguetes', nombre: 'Juguetes', emoji: '🧸' },
  { id: 'herramientas', nombre: 'Herramientas', emoji: '🔧' },
  { id: 'belleza', nombre: 'Belleza & Cuidado', emoji: '💄' },
  { id: 'deportes', nombre: 'Deportes', emoji: '⚽' },
  { id: 'accesorios', nombre: 'Accesorios', emoji: '🎒' },
]

function Navbar({ cantidadCarrito, usuario, onLogout }) {
  const [abierto, setAbierto] = useState(false)

  return (
    <nav style={styles.nav}>
      {/* IZQUIERDA: logo + categorías */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={styles.logo}>
          Peralta<span style={{ color: '#E8001D' }}>Import</span>
          <sub style={styles.sub}>®</sub>
        </Link>

        <div
          style={{ position: 'relative' }}
          onMouseLeave={() => setAbierto(false)}
        >
          <button
            onClick={() => setAbierto(!abierto)}
            style={styles.catBtn}
          >
            Categorías
            <span style={{ fontSize: '10px', marginLeft: '6px', display: 'inline-block', transform: abierto ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s' }}>▼</span>
          </button>

          {abierto && (
            <div style={styles.dropdown} onMouseEnter={() => setAbierto(true)}>
              {categorias.map(cat => (
                <Link
                  key={cat.id}
                  to={`/categoria/${cat.id}`}
                  onClick={() => setAbierto(false)}
                  style={styles.dropItem}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ marginRight: '10px' }}>{cat.emoji}</span>
                  {cat.nombre}
                  <span style={{ marginLeft: 'auto', color: '#555', fontSize: '12px' }}>›</span>
                </Link>
              ))}
              <Link
                to="/categorias"
                onClick={() => setAbierto(false)}
                style={{ ...styles.dropItem, borderTop: '1px solid rgba(255,255,255,0.08)', color: '#E8001D', fontWeight: 700, marginTop: '4px', paddingTop: '12px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#2a2a2a'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Ver todas las categorías →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* DERECHA: admin + carrito */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {usuario ? (
          <>
            <Link to="/admin" style={styles.adminBtn}>⚙ Admin</Link>
            <button onClick={onLogout} style={styles.logoutBtn}>Salir</button>
          </>
        ) : (
          <Link to="/login" style={styles.adminBtn}>Ingresar</Link>
        )}
        <Link to="/carrito" style={styles.cartBtn}>
          🛒 Carrito ({cantidadCarrito})
        </Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: '#141414',
    borderBottom: '2px solid #E8001D',
    padding: '0 clamp(12px, 3vw, 40px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
    boxSizing: 'border-box',
  },
  logo: {
    fontFamily: 'sans-serif',
    fontWeight: 900,
    fontSize: '26px',
    color: 'white',
    textDecoration: 'none',
  },
  sub: {
    fontSize: '11px',
    color: '#FFB800',
    marginLeft: '4px',
  },
  catBtn: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 20px',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    height: '40px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: '2px solid #E8001D',
    minWidth: '240px',
    padding: '8px 0',
    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
    zIndex: 200,
    marginTop: '0px',
  },
  dropItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 20px',
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'background .15s',
  },
  adminBtn: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#ccc',
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '13px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    height: '40px',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid rgba(232,0,29,0.3)',
    color: '#888',
    padding: '8px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  },
  cartBtn: {
    background: '#E8001D',
    color: 'white',
    padding: '8px 20px',
    fontWeight: 700,
    fontSize: '14px',
    textDecoration: 'none',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '8px',
  },
}

export default Navbar