// src/App.jsx
import { useEffect, useState } from 'react'
import { account } from './lib/appwrite'
import Login from './Login'
import Tasks from './Tasks'
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    account.get()
      .then(setUser)
      .catch(() => setUser(null)) // 401 = no hay sesión, es normal
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await account.deleteSession({ sessionId: 'current' })
    setUser(null)
  }

  if (loading) return <p>Cargando…</p>
  if (!user) return <Login onLogin={setUser} />

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', padding: '0 1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Tareas</h1>
        <button onClick={logout}>Salir</button>
      </header>
      <Tasks user={user} />
    </main>
  )
}