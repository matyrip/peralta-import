import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Categoria from './pages/Categoria'
import Categorias from './pages/Categorias'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Checkout from './pages/Checkout'
import { useState } from 'react'
import { cerrarSesion } from './api'

function App() {
  const [carrito, setCarrito] = useState([])
  const [usuario, setUsuario] = useState(null)

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id)
      if (existe) {
        return prev.map(p => p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p)
      }
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const quitarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id))
  }

  const handleLogin = (user) => {
    setUsuario(user)
  }

  const handleLogout = () => {
    cerrarSesion()
    setUsuario(null)
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  return (
    <BrowserRouter>
      <Navbar
        cantidadCarrito={carrito.reduce((a, p) => a + p.cantidad, 0)}
        usuario={usuario}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/categorias" element={<Categorias agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/categoria/:nombre" element={<Categoria agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/producto/:id" element={<Producto agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} quitarDelCarrito={quitarDelCarrito} />} />
        <Route path="/checkout" element={<Checkout carrito={carrito} onPedidoCompleto={vaciarCarrito} />} />
        <Route path="/login" element={
          usuario ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/admin" element={
          usuario ? <Admin usuario={usuario} /> : <Navigate to="/login" />
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App