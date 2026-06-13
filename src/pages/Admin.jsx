import { useState, useEffect } from 'react'
import { obtenerProductos, obtenerCategorias, crearProducto, editarProducto, eliminarProducto, subirImagen, obtenerUsuarios, crearUsuario, eliminarUsuario, obtenerClientes, cambiarPasswordCliente, cambiarRolUsuario } from '../api'

function Admin({ usuario }) {
  const [tab, setTab] = useState('productos')
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [clientes, setClientes] = useState([])
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', precio_old: '', categoria_id: '', badge: '', estrellas: 0 })
  const [formUser, setFormUser] = useState({ email: '', password: '', nombre: '', rol: 'operador' })
  const [creandoUser, setCreandoUser] = useState(false)
  const [cambioPassword, setCambioPassword] = useState(null)
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const prods = await obtenerProductos()
    const cats = await obtenerCategorias()
    setProductos(prods)
    setCategorias(cats)
    if (usuario.rol === 'admin') {
      const users = await obtenerUsuarios()
      const clis = await obtenerClientes()
      setUsuarios(users)
      setClientes(clis)
    }
  }

  function mostrarMensaje(texto) {
    setMensaje(texto)
    setTimeout(() => setMensaje(''), 3000)
  }

  function abrirEditar(p) {
    setEditando(p.id)
    setForm({
      nombre: p.nombre,
      precio: p.precio,
      precio_old: p.precio_old || '',
      categoria_id: p.categoria_id,
      badge: p.badge || '',
      estrellas: p.estrellas
    })
  }

  function abrirNuevo() {
    setEditando('nuevo')
    setForm({ nombre: '', precio: '', precio_old: '', categoria_id: categorias[0]?.id || '', badge: '', estrellas: 0 })
  }

  function cancelar() {
    setEditando(null)
    setForm({ nombre: '', precio: '', precio_old: '', categoria_id: '', badge: '', estrellas: 0 })
  }

  async function guardar() {
    const datos = {
      nombre: form.nombre,
      precio: parseInt(form.precio),
      precio_old: form.precio_old ? parseInt(form.precio_old) : null,
      categoria_id: parseInt(form.categoria_id),
      badge: form.badge || null,
      estrellas: parseInt(form.estrellas)
    }
    if (editando === 'nuevo') {
      await crearProducto(datos)
      mostrarMensaje('Producto creado')
    } else {
      await editarProducto(editando, datos)
      mostrarMensaje('Producto actualizado')
    }
    cancelar()
    cargarDatos()
  }

  async function borrar(id) {
    if (confirm('¿Seguro que querés eliminar este producto?')) {
      await eliminarProducto(id)
      mostrarMensaje('Producto eliminado')
      cargarDatos()
    }
  }

  async function cambiarImagen(id, e) {
    const archivo = e.target.files[0]
    if (!archivo) return
    await subirImagen(id, archivo)
    mostrarMensaje('Imagen actualizada')
    cargarDatos()
  }

  async function guardarUsuario() {
    await crearUsuario(formUser)
    mostrarMensaje('Usuario creado')
    setCreandoUser(false)
    setFormUser({ email: '', password: '', nombre: '', rol: 'operador' })
    cargarDatos()
  }

  async function borrarUsuario(id) {
    if (id === usuario.id) return alert('No podés eliminarte a vos mismo')
    if (confirm('¿Seguro que querés eliminar este usuario?')) {
      await eliminarUsuario(id)
      mostrarMensaje('Usuario eliminado')
      cargarDatos()
    }
  }

  async function guardarPassword(id) {
    if (!nuevaPassword || nuevaPassword.length < 6) return alert('La contraseña debe tener al menos 6 caracteres')
    await cambiarPasswordCliente(id, nuevaPassword)
    mostrarMensaje('Contraseña actualizada')
    setCambioPassword(null)
    setNuevaPassword('')
  }

  async function cambiarRol(id, rol) {
    await cambiarRolUsuario(id, rol)
    mostrarMensaje('Rol actualizado')
    cargarDatos()
  }

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Panel <span style={{ color: '#E8001D' }}>Admin</span></h1>
          <p style={styles.subtitle}>Bienvenido, {usuario?.nombre || 'Admin'} — Rol: {usuario?.rol}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button onClick={() => setTab('productos')} style={{ ...styles.tabBtn, background: tab === 'productos' ? '#E8001D' : '#1e1e1e' }}>Productos</button>
          {usuario.rol === 'admin' && (
            <>
              <button onClick={() => setTab('usuarios')} style={{ ...styles.tabBtn, background: tab === 'usuarios' ? '#E8001D' : '#1e1e1e' }}>Equipo</button>
              <button onClick={() => setTab('clientes')} style={{ ...styles.tabBtn, background: tab === 'clientes' ? '#E8001D' : '#1e1e1e' }}>Clientes</button>
            </>
          )}
        </div>
      </div>

      {mensaje && <div style={styles.mensaje}>{mensaje}</div>}

      {/* ==================== TAB PRODUCTOS ==================== */}
      {tab === 'productos' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={abrirNuevo} style={styles.btnNuevo}>+ Nuevo Producto</button>
          </div>

          {editando && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>{editando === 'nuevo' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Nombre</label>
                  <input style={styles.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Precio</label>
                  <input style={styles.input} type="number" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Precio anterior (opcional)</label>
                  <input style={styles.input} type="number" value={form.precio_old} onChange={e => setForm({ ...form, precio_old: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Categoría</label>
                  <select style={styles.input} value={form.categoria_id} onChange={e => setForm({ ...form, categoria_id: e.target.value })}>
                    {categorias.map(c => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Badge (Nuevo, Hot, Top, -40%)</label>
                  <input style={styles.input} value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Estrellas (0-5, 0 = ocultas)</label>
                  <input style={styles.input} type="number" min="0" max="5" value={form.estrellas} onChange={e => setForm({ ...form, estrellas: e.target.value })} />
                </div>
              </div>
              <div style={styles.formBtns}>
                <button onClick={guardar} style={styles.btnGuardar}>Guardar</button>
                <button onClick={cancelar} style={styles.btnCancelar}>Cancelar</button>
              </div>
            </div>
          )}

          <div style={styles.tabla}>
            <div style={styles.tablaHeader}>
              <span style={{ width: '60px' }}>Foto</span>
              <span style={{ flex: 1 }}>Nombre</span>
              <span style={{ width: '100px' }}>Precio</span>
              <span style={{ width: '120px' }}>Categoría</span>
              <span style={{ width: '80px' }}>Badge</span>
              <span style={{ width: '200px' }}>Acciones</span>
            </div>
            {productos.map(p => (
              <div key={p.id} style={styles.tablaRow}>
                <div style={{ width: '60px' }}>
                  <div style={styles.miniImg}>
                    {p.imagen ? (
                      <img src={p.imagen} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{p.categoria_emoji || '📦'}</span>
                    )}
                  </div>
                </div>
                <span style={{ flex: 1, color: 'white', fontWeight: 500 }}>{p.nombre}</span>
                <span style={{ width: '100px', color: 'white' }}>${p.precio.toLocaleString()}</span>
                <span style={{ width: '120px', color: '#888' }}>{p.categoria_slug}</span>
                <span style={{ width: '80px' }}>
                  {p.badge && <span style={styles.badgeTag}>{p.badge}</span>}
                </span>
                <div style={{ width: '200px', display: 'flex', gap: '6px' }}>
                  <label style={styles.btnFoto}>
                    📷
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => cambiarImagen(p.id, e)} />
                  </label>
                  <button onClick={() => abrirEditar(p)} style={styles.btnEditar}>✏️</button>
                  <button onClick={() => borrar(p.id)} style={styles.btnBorrar}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ==================== TAB EQUIPO ==================== */}
      {tab === 'usuarios' && usuario.rol === 'admin' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button onClick={() => setCreandoUser(true)} style={styles.btnNuevo}>+ Nuevo Usuario</button>
          </div>

          {creandoUser && (
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Nuevo Usuario</h3>
              <div style={styles.formGrid}>
                <div>
                  <label style={styles.label}>Nombre</label>
                  <input style={styles.input} value={formUser.nombre} onChange={e => setFormUser({ ...formUser, nombre: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Email</label>
                  <input style={styles.input} type="email" value={formUser.email} onChange={e => setFormUser({ ...formUser, email: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Contraseña</label>
                  <input style={styles.input} type="password" value={formUser.password} onChange={e => setFormUser({ ...formUser, password: e.target.value })} />
                </div>
                <div>
                  <label style={styles.label}>Rol</label>
                  <select style={styles.input} value={formUser.rol} onChange={e => setFormUser({ ...formUser, rol: e.target.value })}>
                    <option value="admin">Admin — Control total</option>
                    <option value="operador">Operador — Gestiona productos</option>
                    <option value="visualizador">Visualizador — Solo ve el panel</option>
                  </select>
                </div>
              </div>
              <div style={styles.formBtns}>
                <button onClick={guardarUsuario} style={styles.btnGuardar}>Crear Usuario</button>
                <button onClick={() => setCreandoUser(false)} style={styles.btnCancelar}>Cancelar</button>
              </div>
            </div>
          )}

          <div style={styles.tabla}>
            <div style={styles.tablaHeader}>
              <span style={{ flex: 1 }}>Nombre</span>
              <span style={{ width: '200px' }}>Email</span>
              <span style={{ width: '120px' }}>Rol</span>
              <span style={{ width: '150px' }}>Creado</span>
              <span style={{ width: '80px' }}>Acciones</span>
            </div>
            {usuarios.map(u => (
              <div key={u.id} style={styles.tablaRow}>
                <span style={{ flex: 1, color: 'white', fontWeight: 500 }}>{u.nombre}</span>
                <span style={{ width: '200px', color: '#888' }}>{u.email}</span>
                <span style={{ width: '120px' }}>
                  <span style={{
                    ...styles.badgeTag,
                    background: u.rol === 'admin' ? '#E8001D' : u.rol === 'operador' ? '#FFB800' : '#888',
                    color: u.rol === 'operador' ? '#0a0a0a' : 'white',
                  }}>{u.rol}</span>
                </span>
                <span style={{ width: '150px', color: '#888', fontSize: '12px' }}>
                  {new Date(u.creado_en).toLocaleDateString()}
                </span>
                <div style={{ width: '80px' }}>
                  {u.id !== usuario.id && (
                    <button onClick={() => borrarUsuario(u.id)} style={styles.btnBorrar}>🗑️</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ==================== TAB CLIENTES ==================== */}
      {tab === 'clientes' && usuario.rol === 'admin' && (
        <>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#888', fontSize: '14px' }}>{clientes.length} clientes registrados</p>
          </div>

          <div style={styles.tabla}>
            <div style={styles.tablaHeader}>
              <span style={{ flex: 1 }}>Nombre</span>
              <span style={{ width: '200px' }}>Email</span>
              <span style={{ width: '150px' }}>Registrado</span>
              <span style={{ width: '200px' }}>Acciones</span>
            </div>
            {clientes.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                No hay clientes registrados todavía
              </div>
            ) : (
              clientes.map(c => (
                <div key={c.id} style={styles.tablaRow}>
                  <span style={{ flex: 1, color: 'white', fontWeight: 500 }}>{c.nombre}</span>
                  <span style={{ width: '200px', color: '#888' }}>{c.email}</span>
                  <span style={{ width: '150px', color: '#888', fontSize: '12px' }}>
                    {new Date(c.creado_en).toLocaleDateString()}
                  </span>
                  <div style={{ width: '200px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {cambioPassword === c.id ? (
                      <>
                        <input
                          type="password"
                          placeholder="Nueva contraseña"
                          value={nuevaPassword}
                          onChange={e => setNuevaPassword(e.target.value)}
                          style={{ ...styles.input, width: '120px', padding: '6px 8px', fontSize: '12px' }}
                        />
                        <button onClick={() => guardarPassword(c.id)} style={styles.btnGuardar2}>✓</button>
                        <button onClick={() => { setCambioPassword(null); setNuevaPassword('') }} style={styles.btnCancelar2}>✕</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setCambioPassword(c.id)} style={styles.btnEditar}>🔑</button>
                        <button onClick={() => borrarUsuario(c.id)} style={styles.btnBorrar}>🗑️</button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    padding: '40px',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    fontWeight: 900,
    fontSize: '36px',
    textTransform: 'uppercase',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginTop: '4px',
  },
  tabBtn: {
    border: 'none',
    color: 'white',
    padding: '10px 24px',
    fontWeight: 700,
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
  },
  btnNuevo: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '12px 28px',
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
  },
  mensaje: {
    background: 'rgba(34,167,34,0.15)',
    border: '1px solid rgba(34,167,34,0.3)',
    color: '#4caf50',
    padding: '12px 20px',
    marginBottom: '24px',
    fontSize: '14px',
  },
  formCard: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '32px',
    marginBottom: '32px',
    borderTop: '3px solid #E8001D',
  },
  formTitle: {
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '24px',
    textTransform: 'uppercase',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formBtns: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  btnGuardar: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '10px 28px',
    fontWeight: 700,
    fontSize: '14px',
    cursor: 'pointer',
    textTransform: 'uppercase',
  },
  btnGuardar2: {
    background: '#22a722',
    border: 'none',
    color: 'white',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnCancelar: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#888',
    padding: '10px 28px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnCancelar2: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#888',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  tabla: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  tablaHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '14px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#888',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    gap: '12px',
  },
  tablaRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    gap: '12px',
    fontSize: '14px',
  },
  miniImg: {
    width: '44px',
    height: '44px',
    background: '#2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: '20px',
  },
  badgeTag: {
    background: '#E8001D',
    color: 'white',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  btnFoto: {
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnEditar: {
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnBorrar: {
    background: '#1e1e1e',
    border: '1px solid rgba(232,0,29,0.3)',
    color: '#E8001D',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}

export default Admin