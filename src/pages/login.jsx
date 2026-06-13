import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const data = await login(email, password)
      onLogin(data.usuario)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    }
    setCargando(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Peralta<span style={{ color: '#E8001D' }}>Import</span>
        </h1>
        <p style={styles.subtitle}>Panel de Administración</p>

        {error && <div style={styles.error}>{error}</div>}

        <div>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@peraltaimport.com"
            style={styles.input}
          />

          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
          />

          <button
            onClick={handleSubmit}
            disabled={cargando}
            style={{ ...styles.btn, opacity: cargando ? 0.6 : 1 }}
          >
            {cargando ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: '#0a0a0a',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    background: '#141414',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '400px',
    borderTop: '3px solid #E8001D',
  },
  title: {
    fontWeight: 900,
    fontSize: '28px',
    color: 'white',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '32px',
  },
  label: {
    display: 'block',
    color: '#888',
    fontSize: '12px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: '6px',
    marginTop: '16px',
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
  btn: {
    width: '100%',
    background: '#E8001D',
    border: 'none',
    color: 'white',
    padding: '14px',
    fontWeight: 700,
    fontSize: '15px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    marginTop: '24px',
  },
  error: {
    background: 'rgba(232,0,29,0.15)',
    border: '1px solid rgba(232,0,29,0.3)',
    color: '#ff6b6b',
    padding: '10px 16px',
    fontSize: '14px',
    marginBottom: '16px',
  },
}

export default Login