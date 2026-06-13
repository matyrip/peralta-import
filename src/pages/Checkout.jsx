import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { crearPedido, registroCliente, login } from '../api'
import config from '../config'

function Checkout({ carrito, onPedidoCompleto }) {
  const navigate = useNavigate()
  const [paso, setPaso] = useState(1)
  const [modo, setModo] = useState(null)
  const [form, setForm] = useState({
    email: '', password: '', nombre: '', apellidos: '',
    rut: '', telefono: '', direccion: '', region: '', comuna: '',
    metodo_pago: 'transferencia'
  })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const subtotal = carrito.reduce((a, p) => a + p.precio * p.cantidad, 0)
  const envio = subtotal > 15000 ? 0 : 3990
  const total = subtotal + envio

  const whatsappNumero = '56912345678'

  function armarMensajeWhatsApp() {
    let msg = '¡Hola! Quiero hacer un pedido:\n\n'
    carrito.forEach(p => {
      msg += `• ${p.nombre} x${p.cantidad} — $${(p.precio * p.cantidad).toLocaleString()}\n`
    })
    msg += `\nSubtotal: $${subtotal.toLocaleString()}`
    msg += `\nEnvío: ${envio === 0 ? 'Gratis' : '$' + envio.toLocaleString()}`
    msg += `\nTotal: $${total.toLocaleString()}`
    msg += `\n\nNombre: ${form.nombre} ${form.apellidos}`
    msg += `\nRUT: ${form.rut}`
    msg += `\nTeléfono: ${form.telefono}`
    msg += `\nDirección: ${form.direccion}, ${form.comuna}, ${form.region}`
    return encodeURIComponent(msg)
  }

  async function handleRegistro() {
    setError('')
    setCargando(true)
    try {
      await registroCliente(form.email, form.password, form.nombre)
      setPaso(2)
    } catch (err) {
      setError(err.message)
    }
    setCargando(false)
  }

  async function handleLogin() {
    setError('')
    setCargando(true)
    try {
      await login(form.email, form.password)
      setPaso(2)
    } catch (err) {
      setError(err.message)
    }
    setCargando(false)
  }

  async function finalizarCompra() {
    setError('')
    setCargando(true)
    try {
      const pedido = {
        email: form.email,
        nombre: form.nombre,
        apellidos: form.apellidos,
        rut: form.rut,
        telefono: form.telefono,
        direccion: form.direccion,
        region: form.region,
        comuna: form.comuna,
        metodo_pago: form.metodo_pago,
        items: carrito.map(p => ({
          producto_id: p.id,
          cantidad: p.cantidad,
          precio: p.precio
        }))
      }
      await crearPedido(pedido)
      onPedidoCompleto()
      setPaso(4)
    } catch (err) {
      setError(err.message)
    }
    setCargando(false)
  }

  if (carrito.length === 0 && paso !== 4) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '80px', color: '#888' }}>
          <p style={{ fontSize: '20px', marginBottom: '24px' }}>Tu carrito está vacío</p>
          <button onClick={() => navigate('/')} style={styles.btnPrimary}>Ver Productos</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Checkout</h1>

      {/* PASOS */}
      <div style={styles.pasos}>
        <span style={{ ...styles.paso, color: paso >= 1 ? '#E8001D' : '#444' }}>1. Identificación</span>
        <span style={{ color: '#444' }}>→</span>
        <span style={{ ...styles.paso, color: paso >= 2 ? '#E8001D' : '#444' }}>2. Envío</span>
        <span style={{ color: '#444' }}>→</span>
        <span style={{ ...styles.paso, color: paso >= 3 ? '#E8001D' : '#444' }}>3. Pago</span>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.layout}>
        {/* FORMULARIO */}
        <div style={styles.formArea}>

          {/* PASO 1: IDENTIFICACIÓN */}
          {paso === 1 && (
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Identificación</h2>

              {!modo && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button onClick={() => setModo('login')} style={styles.btnPrimary}>Ya tengo cuenta</button>
                  <button onClick={() => setModo('registro')} style={styles.btnPrimary}>Crear cuenta</button>
                  <button onClick={() => setModo('invitado')} style={styles.btnOutline}>Comprar sin cuenta</button>
                  <a href={`https://wa.me/${whatsappNumero}?text=${armarMensajeWhatsApp()}`} target="_blank" style={styles.btnWhatsApp}>
                    💬 Comprar por WhatsApp
                  </a>
                </div>
              )}

              {modo === 'login' && (
                <>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <input style={styles.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div style={styles.formBtns}>
                    <button onClick={handleLogin} disabled={cargando} style={styles.btnPrimary}>{cargando ? 'Entrando...' : 'Iniciar Sesión'}</button>
                    <button onClick={() => setModo(null)} style={styles.btnCancelar}>Volver</button>
                  </div>
                </>
              )}

              {modo === 'registro' && (
                <>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email</label>
                    <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Contraseña</label>
                    <input style={styles.input} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Nombre</label>
                    <input style={styles.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                  </div>
                  <div style={styles.formBtns}>
                    <button onClick={handleRegistro} disabled={cargando} style={styles.btnPrimary}>{cargando ? 'Creando...' : 'Crear Cuenta y Continuar'}</button>
                    <button onClick={() => setModo(null)} style={styles.btnCancelar}>Volver</button>
                  </div>
                </>
              )}

              {modo === 'invitado' && (
                <>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Email (para boleta)</label>
                    <input style={styles.input} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div style={styles.fieldGroup}>
                    <label style={styles.label}>Nombre</label>
                    <input style={styles.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
                  </div>
                  <div style={styles.formBtns}>
                    <button onClick={() => setPaso(2)} style={styles.btnPrimary}>Continuar</button>
                    <button onClick={() => setModo(null)} style={styles.btnCancelar}>Volver</button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* PASO 2: ENVÍO */}
          {paso === 2 && (
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Datos de Envío</h2>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nombre</label>
                <input style={styles.input} value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Apellidos</label>
                <input style={styles.input} value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>RUT</label>
                <input style={styles.input} placeholder="12345678-9" value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Teléfono</label>
                <input style={styles.input} placeholder="+56 9 1234 5678" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Dirección</label>
                <input style={styles.input} value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Región</label>
                  <select style={styles.input} value={form.region} onChange={e => setForm({ ...form, region: e.target.value })}>
                    <option value="">Seleccionar</option>
                    <option value="Arica y Parinacota">Arica y Parinacota</option>
                    <option value="Tarapacá">Tarapacá</option>
                    <option value="Antofagasta">Antofagasta</option>
                    <option value="Atacama">Atacama</option>
                    <option value="Coquimbo">Coquimbo</option>
                    <option value="Valparaíso">Valparaíso</option>
                    <option value="Metropolitana">Metropolitana</option>
                    <option value="O'Higgins">O'Higgins</option>
                    <option value="Maule">Maule</option>
                    <option value="Ñuble">Ñuble</option>
                    <option value="Biobío">Biobío</option>
                    <option value="Araucanía">Araucanía</option>
                    <option value="Los Ríos">Los Ríos</option>
                    <option value="Los Lagos">Los Lagos</option>
                    <option value="Aysén">Aysén</option>
                    <option value="Magallanes">Magallanes</option>
                  </select>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Comuna</label>
                  <input style={styles.input} value={form.comuna} onChange={e => setForm({ ...form, comuna: e.target.value })} />
                </div>
              </div>
              <div style={styles.formBtns}>
                <button onClick={() => setPaso(3)} style={styles.btnPrimary}>Continuar a Pago</button>
                <button onClick={() => setPaso(1)} style={styles.btnCancelar}>Volver</button>
              </div>
            </div>
          )}

          {/* PASO 3: PAGO */}
          {paso === 3 && (
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Método de Pago</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['transferencia', 'debito', 'credito', 'mercadopago'].map(metodo => (
                  <label key={metodo} style={{
                    ...styles.metodoOption,
                    borderColor: form.metodo_pago === metodo ? '#E8001D' : 'rgba(255,255,255,0.08)',
                  }}>
                    <input
                      type="radio"
                      name="pago"
                      checked={form.metodo_pago === metodo}
                      onChange={() => setForm({ ...form, metodo_pago: metodo })}
                      style={{ marginRight: '12px' }}
                    />
                    <span style={{ color: 'white', fontWeight: 500 }}>
                      {metodo === 'transferencia' && '🏦 Transferencia Bancaria'}
                      {metodo === 'debito' && '💳 Tarjeta de Débito'}
                      {metodo === 'credito' && '💳 Tarjeta de Crédito'}
                      {metodo === 'mercadopago' && '💰 MercadoPago'}
                    </span>
                  </label>
                ))}
              </div>
              <div style={styles.formBtns}>
                <button onClick={finalizarCompra} disabled={cargando} style={styles.btnComprar}>
                  {cargando ? 'Procesando...' : '🔒 Comprar Ahora'}
                </button>
                <button onClick={() => setPaso(2)} style={styles.btnCancelar}>Volver</button>
              </div>
            </div>
          )}

          {/* PASO 4: CONFIRMACIÓN */}
{paso === 4 && (
  <div style={styles.formCard}>
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
      <h2 style={{ fontWeight: 900, fontSize: '28px', marginBottom: '12px', color: 'white' }}>¡Pedido Confirmado!</h2>
      <p style={{ color: '#888', marginBottom: '32px' }}>Te enviamos los detalles a {form.email}</p>

      {form.metodo_pago === 'transferencia' && (
        <div style={styles.datosBanco}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', marginBottom: '20px', textTransform: 'uppercase', color: '#E8001D' }}>Datos para Transferencia</h3>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Transferí el monto total y enviá el comprobante por WhatsApp</p>

          <div style={styles.bancoCard}>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Banco</span><span style={styles.bancoValue}>{config.banco.cuentaVista.banco}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Tipo</span><span style={styles.bancoValue}>{config.banco.cuentaVista.tipo}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Número</span><span style={styles.bancoValue}>{config.banco.cuentaVista.numero}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>RUT</span><span style={styles.bancoValue}>{config.banco.cuentaVista.rut}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Nombre</span><span style={styles.bancoValue}>{config.banco.cuentaVista.nombre}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Email</span><span style={styles.bancoValue}>{config.banco.cuentaVista.email}</span></div>
            <div style={styles.bancoRow}><span style={styles.bancoLabel}>Monto</span><span style={{ ...styles.bancoValue, color: '#E8001D', fontWeight: 900, fontSize: '18px' }}>${total.toLocaleString()}</span></div>
          </div>

          <a href={`https://wa.me/${config.whatsapp}?text=${encodeURIComponent('¡Hola! Acabo de realizar una transferencia por $' + total.toLocaleString() + '. Adjunto comprobante.')}`} target="_blank" style={{ ...styles.btnWhatsApp, marginTop: '20px', display: 'inline-block' }}>
            💬 Enviar Comprobante por WhatsApp
          </a>
        </div>
      )}

      <button onClick={() => navigate('/')} style={{ ...styles.btnPrimary, marginTop: '24px' }}>Volver a la Tienda</button>
    </div>
  </div>
)}
        </div>

        {/* RESUMEN */}
        {paso !== 4 && (
          <div style={styles.resumen}>
            <h3 style={styles.resumenTitle}>Resumen</h3>
            {carrito.map(p => (
              <div key={p.id} style={styles.resumenItem}>
                <span style={{ flex: 1, color: '#ccc', fontSize: '13px' }}>{p.nombre} x{p.cantidad}</span>
                <span style={{ color: 'white', fontSize: '13px' }}>${(p.precio * p.cantidad).toLocaleString()}</span>
              </div>
            ))}
            <div style={styles.resumenLinea}>
              <span style={{ color: '#888' }}>Subtotal</span>
              <span style={{ color: 'white' }}>${subtotal.toLocaleString()}</span>
            </div>
            <div style={styles.resumenLinea}>
              <span style={{ color: '#888' }}>Envío</span>
              <span style={{ color: envio === 0 ? '#22a722' : 'white' }}>{envio === 0 ? 'Gratis' : '$' + envio.toLocaleString()}</span>
            </div>
            <div style={{ ...styles.resumenLinea, borderTop: '1px solid #333', paddingTop: '16px', marginTop: '8px' }}>
              <span style={{ fontWeight: 900, fontSize: '18px', color: 'white' }}>Total</span>
              <span style={{ fontWeight: 900, fontSize: '18px', color: 'white' }}>${total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    padding: '40px clamp(20px, 5vw, 80px)',
    color: 'white',
  },
  title: {
    fontWeight: 900,
    fontSize: '36px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  pasos: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  paso: {
    fontWeight: 700,
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  layout: {
    display: 'flex',
    gap: '40px',
    flexWrap: 'wrap',
  },
  formArea: {
    flex: 1,
    minWidth: '300px',
  },
  formCard: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '32px',
    borderTop: '3px solid #E8001D',
  },
  formTitle: {
    fontWeight: 700,
    fontSize: '18px',
    textTransform: 'uppercase',
    marginBottom: '24px',
    color: 'white',
  },
  fieldGroup: {
    marginBottom: '16px',
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
    padding: '12px 16px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formBtns: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '14px 28px',
    fontWeight: 700,
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
  },
  btnOutline: {
    background: 'transparent',
    border: '2px solid rgba(255,255,255,0.3)',
    color: 'white',
    padding: '14px 28px',
    fontWeight: 700,
    fontSize: '15px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textAlign: 'center',
  },
  btnWhatsApp: {
    background: '#25D366',
    border: 'none',
    color: 'white',
    padding: '14px 28px',
    fontWeight: 700,
    fontSize: '15px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
  },
  btnCancelar: {
    background: 'transparent',
    border: '1px solid #444',
    color: '#888',
    padding: '14px 28px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  btnComprar: {
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '16px 48px',
    fontWeight: 900,
    fontSize: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    width: '100%',
  },
  metodoOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    background: '#1e1e1e',
    border: '1px solid',
    cursor: 'pointer',
  },
  error: {
    background: 'rgba(232,0,29,0.15)',
    border: '1px solid rgba(232,0,29,0.3)',
    color: '#ff6b6b',
    padding: '10px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  resumen: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '32px',
    width: '320px',
    height: 'fit-content',
    flexShrink: 0,
  },
  resumenTitle: {
    fontWeight: 900,
    fontSize: '18px',
    textTransform: 'uppercase',
    marginBottom: '24px',
  },
  resumenItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  resumenLinea: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
  },
  datosBanco: {
    background: '#1e1e1e',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '24px',
    textAlign: 'left',
    maxWidth: '400px',
    margin: '0 auto',
  },
  bancoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  bancoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  bancoLabel: {
    color: '#888',
    fontSize: '13px',
  },
  bancoValue: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
  },
}

export default Checkout