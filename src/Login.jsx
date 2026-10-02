// src/Login.jsx
import { useState } from 'react'
import { account, ID } from './lib/appwrite'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (mode === 'register') {
        await account.create({ userId: ID.unique(), email, password })
      }
      await account.createEmailPasswordSession({ email, password })
      onLogin(await account.get())
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 320, margin: '4rem auto', display: 'grid', gap: 8 }}>
      <h1>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</h1>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña (mín. 8)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <button disabled={busy}>{busy ? '…' : mode === 'login' ? 'Entrar' : 'Registrarme'}</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
      </button>
    </form>
  )
}