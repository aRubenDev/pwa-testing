// src/Tasks.jsx
import { useEffect, useState } from 'react'
import { tablesDB, DB_ID, TABLE_ID, ID, Query, Permission, Role } from './lib/appwrite'

export default function Tasks({ user }) {
  const [rows, setRows] = useState([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await tablesDB.listRows({
        databaseId: DB_ID,
        tableId: TABLE_ID,
        queries: [Query.orderDesc('$createdAt'), Query.limit(50)],
      })
      setRows(res.rows)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const add = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      await tablesDB.createRow({
        databaseId: DB_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: { title: title.trim(), done: false },
        // Row security: solo este usuario puede leer/editar/borrar su fila
        permissions: [
          Permission.read(Role.user(user.$id)),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ],
      })
      setTitle('')
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  const toggle = async (row) => {
    await tablesDB.updateRow({
      databaseId: DB_ID, tableId: TABLE_ID, rowId: row.$id,
      data: { done: !row.done },
    })
    load()
  }

  const remove = async (row) => {
    await tablesDB.deleteRow({ databaseId: DB_ID, tableId: TABLE_ID, rowId: row.$id })
    load()
  }

  if (loading) return <p>Cargando…</p>

  return (
    <>
      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input style={{ flex: 1 }} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nueva tarea" />
        <button>Añadir</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {rows.length === 0 && <p>No hay tareas todavía.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rows.map((r) => (
          <li key={r.$id} style={{ display: 'flex', gap: 8, padding: '6px 0' }}>
            <input type="checkbox" checked={r.done} onChange={() => toggle(r)} />
            <span style={{ flex: 1, textDecoration: r.done ? 'line-through' : 'none' }}>{r.title}</span>
            <button onClick={() => remove(r)}>✕</button>
          </li>
        ))}
      </ul>
    </>
  )
}