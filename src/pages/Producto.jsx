import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { obtenerProducto } from '../api'

function Producto({ agregarAlCarrito }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProducto(id)
      .then(data => {
        setProducto(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setCargando(false)
      })
  }, [id])

  if (cargando) return <div style={{ color: '#888', padding: '80px' }}>Cargando...</div>
  if (!producto) return <div style={{ color: 'white', padding: '80px' }}>Producto no encontrado</div>

  const emoji = producto.categoria_emoji || '📦'

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '60px 40px', color: 'white' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: '1px solid #444', color: '#888', padding: '8px 20px', cursor: 'pointer', marginBottom: '40px' }}>
        ← Volver
      </button>
      <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ background: '#2a2a2a', width: '320px', height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px', flexShrink: 0, overflow: 'hidden' }}>
          {producto.imagen ? (
            <img src={producto.imagen} alt={producto.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            emoji
          )}
        </div>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#E8001D', marginBottom: '12px' }}>{producto.categoria_slug || ''}</div>
          <h1 style={{ fontWeight: 900, fontSize: '40px', marginBottom: '16px' }}>{producto.nombre}</h1>
          <div style={{ color: '#FFB800', fontSize: '20px', marginBottom: '24px' }}>{'★'.repeat(producto.estrellas)}{'☆'.repeat(5 - producto.estrellas)}</div>
          <div style={{ marginBottom: '32px' }}>
            <span style={{ fontWeight: 900, fontSize: '42px' }}>${producto.precio.toLocaleString()}</span>
            {producto.precio_old && <span style={{ fontSize: '18px', color: '#888', textDecoration: 'line-through', marginLeft: '12px' }}>${producto.precio_old.toLocaleString()}</span>}
          </div>
          <button
            onClick={() => { agregarAlCarrito(producto); navigate('/carrito') }}
            style={{ background: '#E8001D', border: 'none', color: 'white', padding: '16px 48px', fontWeight: 700, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  )
}

export default Producto