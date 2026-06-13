import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { obtenerProductosPorCategoria } from '../api'

function Categoria({ agregarAlCarrito }) {
  const { nombre } = useParams()
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerProductosPorCategoria(nombre)
      .then(data => {
        setProductos(data)
        setCargando(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setCargando(false)
      })
  }, [nombre])

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '60px 40px', color: 'white' }}>
      <h1 style={{ fontWeight: 900, fontSize: '48px', textTransform: 'uppercase', marginBottom: '8px' }}>
        {nombre}
      </h1>
      <p style={{ color: '#888', marginBottom: '40px' }}>{productos.length} productos encontrados</p>
      {cargando ? (
        <p style={{ color: '#888' }}>Cargando...</p>
      ) : productos.length === 0 ? (
        <p style={{ color: '#888' }}>No hay productos en esta categoría todavía.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {productos.map(p => (
            <ProductCard key={p.id} producto={p} agregarAlCarrito={agregarAlCarrito} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Categoria