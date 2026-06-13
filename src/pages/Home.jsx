import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../api'

function Home({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProductos()
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error cargando productos:', err)
        setCargando(false)
      })
  }, [])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: 'white' }}>

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>Importadora directa — Sin intermediarios</div>
        <h1 style={styles.heroTitle}>
          TODO LO QUE<br />
          <span style={{ color: '#E8001D' }}>NECESITÁS</span><br />
          IMPORTADO
        </h1>
        <p style={styles.heroSub}>Ropa, electrónica, hogar, juguetes y más. Directo del origen al mejor precio.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
          <a href="#productos" style={styles.btnPrimary}>Ver Catálogo</a>
          <a href="#contacto" style={styles.btnOutline}>Consultar Mayoreo</a>
        </div>
      </div>

      {/* PRODUCTOS */}
      <div id="productos" style={styles.section}>
        <div style={styles.sectionLabel}>Más vendidos del mes</div>
        <h2 style={styles.sectionTitle}>Nuestros <span style={{ color: '#E8001D' }}>Productos</span></h2>
        <div style={styles.grid}>
          {cargando ? (
            <p style={{ color: '#888' }}>Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p style={{ color: '#888' }}>No hay productos disponibles</p>
          ) : (
            productos.map(p => (
              <ProductCard key={p.id} producto={p} agregarAlCarrito={agregarAlCarrito} />
            ))
          )}
        </div>
      </div>

      {/* BANNER MAYOREO */}
      <div style={styles.banner}>
        <div>
          <h2 style={styles.bannerTitle}>Comprá por mayor<br />y ahorrá hasta un 35%</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginTop: '12px' }}>Precios especiales para revendedores y distribuidores.</p>
        </div>
        <button style={styles.bannerBtn}>Consultar precios mayoreo →</button>
      </div>

    </div>
  )
}

const styles = {
  hero: {
    background: '#141414',
    padding: 'clamp(40px, 8vw, 100px) clamp(20px, 5vw, 80px)',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    boxSizing: 'border-box',
  },
  heroBadge: {
    display: 'inline-block',
    background: '#FFB800',
    color: '#0a0a0a',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    padding: '4px 14px',
    marginBottom: '20px',
    width: 'fit-content',
  },
  heroTitle: {
    fontSize: 'clamp(48px, 7vw, 90px)',
    fontWeight: 900,
    lineHeight: 0.95,
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: '24px',
  },
  heroSub: {
    fontSize: '17px',
    color: '#888',
    maxWidth: '480px',
    marginBottom: '36px',
    lineHeight: 1.6,
  },
  btnPrimary: {
    background: '#E8001D',
    color: 'white',
    padding: '14px 36px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'inline-block',
  },
  btnOutline: {
    background: 'transparent',
    color: 'white',
    padding: '14px 36px',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'inline-block',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  section: {
    padding: '80px 40px',
    background: '#0a0a0a',
  },
  sectionLabel: {
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#E8001D',
    marginBottom: '12px',
  },
  sectionTitle: {
    fontWeight: 900,
    fontSize: 'clamp(32px, 4vw, 52px)',
    textTransform: 'uppercase',
    color: 'white',
    marginBottom: '48px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px',
  },
  banner: {
    background: '#E8001D',
    padding: '60px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    textAlign: 'center',
  },
  bannerTitle: {
    fontWeight: 900,
    fontSize: 'clamp(28px, 6vw, 56px)',
    textTransform: 'uppercase',
    lineHeight: 0.95,
    color: 'white',
  },
  bannerBtn: {
    background: 'white',
    color: '#E8001D',
    padding: '18px 48px',
    fontWeight: 900,
    fontSize: '16px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}

export default Home