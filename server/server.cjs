require('dotenv').config({ path: '../.env' })
const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors())
app.use(express.json())

// Carpeta de imágenes
const uploadsDir = path.join(__dirname, '..', 'public', 'img')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
app.use('/img', express.static(uploadsDir))

// Configurar multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `producto-${Date.now()}${ext}`)
  }
})
const upload = multer({ storage })

// Conexión a PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Verificar conexión
pool.query('SELECT NOW()')
  .then(() => console.log('✅ Conectado a PostgreSQL'))
  .catch(err => console.error('❌ Error de conexión:', err.message))

// ============ MIDDLEWARE AUTH ============

function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token requerido' })
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}

function verificarRol(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tenés permisos' })
    }
    next()
  }
}

// ============ AUTH ============

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email])
    const usuario = result.rows[0]
    if (!usuario) return res.status(401).json({ error: 'Email no encontrado' })

    const match = await bcrypt.compare(password, usuario.password)
    if (!match) return res.status(401).json({ error: 'Contraseña incorrecta' })

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Registrar usuario (admin puede crear cualquier rol)
app.post('/api/auth/registro', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, rol',
      [email, hash, nombre, rol || 'operador']
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============ PRODUCTOS (PÚBLICO) ============

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, c.emoji as categoria_emoji
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Obtener producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, c.emoji as categoria_emoji
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `, [req.params.id])
    if (result.rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Productos por categoría
app.get('/api/categorias/:slug/productos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre, c.slug as categoria_slug, c.emoji as categoria_emoji
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE c.slug = $1
      ORDER BY p.id
    `, [req.params.slug])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============ CATEGORÍAS (PÚBLICO) ============

app.get('/api/categorias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============ PRODUCTOS (ADMIN/OPERADOR) ============

// Crear producto
app.post('/api/admin/productos', verificarToken, verificarRol('admin', 'operador'), async (req, res) => {
  try {
    const { nombre, precio, precio_old, categoria_id, badge, estrellas } = req.body
    const result = await pool.query(
      'INSERT INTO productos (nombre, precio, precio_old, categoria_id, badge, estrellas) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nombre, precio, precio_old, categoria_id, badge, estrellas || 5]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Editar producto
app.put('/api/admin/productos/:id', verificarToken, verificarRol('admin', 'operador'), async (req, res) => {
  try {
    const { nombre, precio, precio_old, categoria_id, badge, estrellas } = req.body
    const result = await pool.query(
      'UPDATE productos SET nombre=$1, precio=$2, precio_old=$3, categoria_id=$4, badge=$5, estrellas=$6 WHERE id=$7 RETURNING *',
      [nombre, precio, precio_old, categoria_id, badge, estrellas, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Subir imagen de producto
app.post('/api/admin/productos/:id/imagen', verificarToken, verificarRol('admin', 'operador'), upload.single('imagen'), async (req, res) => {
  try {
    const imagenUrl = `/img/${req.file.filename}`
    const result = await pool.query(
      'UPDATE productos SET imagen=$1 WHERE id=$2 RETURNING *',
      [imagenUrl, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Eliminar producto
app.delete('/api/admin/productos/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM productos WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============ USUARIOS (SOLO ADMIN) ============

app.get('/api/admin/usuarios', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, nombre, rol, creado_en FROM usuarios ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/admin/usuarios/:id', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id=$1', [req.params.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// ============ CLIENTES ============

// Registro público de cliente
app.post('/api/auth/registro-cliente', async (req, res) => {
  try {
    const { email, password, nombre } = req.body
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO usuarios (email, password, nombre, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, rol',
      [email, hash, nombre, 'cliente']
    )
    const usuario = result.rows[0]
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token, usuario })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email ya registrado' })
    res.status(500).json({ error: err.message })
  }
})

// Admin: ver clientes
app.get('/api/admin/clientes', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, nombre, rol, creado_en FROM usuarios WHERE rol = 'cliente' ORDER BY creado_en DESC"
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: cambiar contraseña de cliente
app.put('/api/admin/clientes/:id/password', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const { password } = req.body
    const hash = await bcrypt.hash(password, 10)
    await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hash, req.params.id])
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin: cambiar rol de usuario
app.put('/api/admin/usuarios/:id/rol', verificarToken, verificarRol('admin'), async (req, res) => {
  try {
    const { rol } = req.body
    const result = await pool.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, email, nombre, rol',
      [rol, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// ============ PEDIDOS ============

// Crear pedido (público)
app.post('/api/pedidos', async (req, res) => {
  try {
    const { email, nombre, apellidos, rut, telefono, direccion, region, comuna, metodo_pago, items, usuario_id } = req.body
    const subtotal = items.reduce((a, i) => a + i.precio * i.cantidad, 0)
    const costo_envio = subtotal > 15000 ? 0 : 3990
    const total = subtotal + costo_envio

    const pedido = await pool.query(
      `INSERT INTO pedidos (usuario_id, email, nombre, apellidos, rut, telefono, direccion, region, comuna, metodo_pago, subtotal, costo_envio, total)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [usuario_id || null, email, nombre, apellidos, rut, telefono, direccion, region, comuna, metodo_pago, subtotal, costo_envio, total]
    )

    for (const item of items) {
      await pool.query(
        'INSERT INTO pedido_items (pedido_id, producto_id, cantidad, precio_unitario) VALUES ($1,$2,$3,$4)',
        [pedido.rows[0].id, item.producto_id, item.cantidad, item.precio]
      )
    }

    res.json(pedido.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver pedidos (admin/operador)
app.get('/api/admin/pedidos', verificarToken, verificarRol('admin', 'operador'), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pedidos ORDER BY creado_en DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ============ INICIAR SERVIDOR ============

const PORT = 4000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})