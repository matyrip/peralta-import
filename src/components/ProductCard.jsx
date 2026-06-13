import { Link } from 'react-router-dom'

function ProductCard({ producto, agregarAlCarrito }) {
  const categoria = producto.categoria || producto.categoria_slug || ''
  const emoji = producto.emoji || producto.categoria_emoji || '📦'

  return (
    <div style={styles.card}>
      <Link to={`/producto/${producto.id}`} style={{ textDecoration: 'none' }}>
        <div style={styles.img}>
          {producto.badge && (
            <span style={{
              ...styles.badge,
              background: producto.badge === 'Top' || producto.badge === '-40%' ? '#FFB800' : '#E8001D',
              color: producto.badge === 'Top' || producto.badge === '-40%' ? '#0a0a0a' : 'white',
            }}>
              {producto.badge}
            </span>
          )}
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '64px' }}>{emoji}</span>
          )}
        </div>
        <div style={styles.info}>
          <div style={styles.cat}>{categoria}</div>
          <div style={styles.nombre}>{producto.nombre}</div>
          {producto.estrellas > 0 && (
            <div style={styles.estrellas}>{'★'.repeat(producto.estrellas)}{'☆'.repeat(5 - producto.estrellas)}</div>
          )}
        </div>
      </Link>
      <div style={styles.priceRow}>
        <div>
          <span style={styles.precio}>${producto.precio.toLocaleString()}</span>
          {producto.precio_old && (
            <span style={styles.precioOld}>${producto.precio_old.toLocaleString()}</span>
          )}
        </div>
        <button style={styles.addBtn} onClick={() => agregarAlCarrito(producto)}>+</button>
      </div>
    </div>
  )
}

const styles = {
  card: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    transition: 'transform .25s',
    cursor: 'pointer',
  },
  img: {
    height: '180px',
    background: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    zIndex: 1,
  },
  info: { padding: '16px 16px 0' },
  cat: { fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E8001D', marginBottom: '6px' },
  nombre: { fontWeight: 700, fontSize: '16px', color: 'white', marginBottom: '6px' },
  estrellas: { color: '#FFB800', fontSize: '12px' },
  priceRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' },
  precio: { fontWeight: 900, fontSize: '22px', color: 'white' },
  precioOld: { fontSize: '13px', color: '#888', textDecoration: 'line-through', marginLeft: '8px' },
  addBtn: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

export default ProductCard