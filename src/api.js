const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:4000/api'
  : 'https://peralta-import-api.onrender.com/api'

// Guardar y obtener token
export function guardarToken(token) {
  localStorage.setItem('token', token)
}

export function obtenerToken() {
  return localStorage.getItem('token')
}

export function cerrarSesion() {
  localStorage.removeItem('token')
}

function authHeaders() {
  const token = obtenerToken()
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

// ============ PÚBLICO ============

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/productos`)
  return res.json()
}

export async function obtenerProducto(id) {
  const res = await fetch(`${API_URL}/productos/${id}`)
  return res.json()
}

export async function obtenerCategorias() {
  const res = await fetch(`${API_URL}/categorias`)
  return res.json()
}

export async function obtenerProductosPorCategoria(slug) {
  const res = await fetch(`${API_URL}/categorias/${slug}/productos`)
  return res.json()
}

// ============ AUTH ============

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  const data = await res.json()
  guardarToken(data.token)
  return data
}

// ============ ADMIN ============

export async function crearProducto(producto) {
  const res = await fetch(`${API_URL}/admin/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(producto)
  })
  return res.json()
}

export async function editarProducto(id, producto) {
  const res = await fetch(`${API_URL}/admin/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(producto)
  })
  return res.json()
}

export async function eliminarProducto(id) {
  const res = await fetch(`${API_URL}/admin/productos/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return res.json()
}

export async function subirImagen(id, archivo) {
  const formData = new FormData()
  formData.append('imagen', archivo)
  const res = await fetch(`${API_URL}/admin/productos/${id}/imagen`, {
    method: 'POST',
    headers: authHeaders(),
    body: formData
  })
  return res.json()
}

// ============ USUARIOS ============

export async function obtenerUsuarios() {
  const res = await fetch(`${API_URL}/admin/usuarios`, {
    headers: authHeaders()
  })
  return res.json()
}

export async function crearUsuario(usuario) {
  const res = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(usuario)
  })
  return res.json()
}

export async function eliminarUsuario(id) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return res.json()
}

// ============ CLIENTES ============

export async function obtenerClientes() {
  const res = await fetch(`${API_URL}/admin/clientes`, {
    headers: authHeaders()
  })
  return res.json()
}

export async function cambiarPasswordCliente(id, password) {
  const res = await fetch(`${API_URL}/admin/clientes/${id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ password })
  })
  return res.json()
}

export async function cambiarRolUsuario(id, rol) {
  const res = await fetch(`${API_URL}/admin/usuarios/${id}/rol`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ rol })
  })
  return res.json()
}

// ============ CHECKOUT ============

export async function registroCliente(email, password, nombre) {
  const res = await fetch(`${API_URL}/auth/registro-cliente`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, nombre })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error)
  }
  const data = await res.json()
  guardarToken(data.token)
  return data
}

export async function crearPedido(pedido) {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(pedido)
  })
  return res.json()
}