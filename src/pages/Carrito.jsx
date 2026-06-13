import { Link } from 'react-router-dom'

function Carrito({ carrito, quitarDelCarrito }) {
  const total = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '60px 40px', color: 'white' }}>
      <h1 style={{ fontWeight: 900, fontSize: '48px', textTransform: 'uppercase', marginBottom: '40px' }}>
        Tu <span style={{ color: '#E8001D' }}>Carrito</span>
      </h1>

      {carrito.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🛒</div>
          <p style={{ fontSize: '20px', marginBottom: '24px' }}>Tu carrito está vacío</p>
          <Link to="/" style={{ background: '#E8001D', color: 'white', padding: '14px 36px', textDecoration: 'none', fontWeight: 700, textTransform: 'uppercase' }}>
            Ver Productos
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            {carrito.map(p => (
              <div key={p.id} style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
                <span style={{ fontSize: '48px' }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '4px' }}>{p.nombre}</div>
                  <div style={{ color: '#888', fontSize: '14px' }}>Cantidad: {p.cantidad}</div>
                </div>
                <div style={{ fontWeight: 900, fontSize: '20px', marginRight: '16px' }}>${(p.precio * p.cantidad).toLocaleString()}</div>
                <button onClick={() => quitarDelCarrito(p.id)} style={{ background: 'none', border: '1px solid #444', color: '#888', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', padding: '32px', width: '300px', height: 'fit-content' }}>
            <h3 style={{ fontWeight: 900, fontSize: '22px', marginBottom: '24px', textTransform: 'uppercase' }}>Resumen</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: '#888' }}>
              <span>Productos ({carrito.reduce((a, p) => a + p.cantidad, 0)})</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', color: '#888' }}>
              <span>Envío</span>
              <span style={{ color: '#22a722' }}>Gratis</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '24px', marginBottom: '32px', borderTop: '1px solid #333', paddingTop: '20px' }}>
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <Link to="/checkout" style={{ background: '#E8001D', color: 'white', width: '100%', padding: '16px', fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', textDecoration: 'none', textAlign: 'center', display: 'block', boxSizing: 'border-box', border: 'none' }}>
  Finalizar Compra
</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Carrito