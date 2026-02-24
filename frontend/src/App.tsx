import React, { useEffect, useState } from 'react'
import axios from 'axios'

type Task = {
  id: number
  title: string
  description?: string
  completed: boolean
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => { fetchTasks() }, [])

  async function fetchTasks() {
    const res = await axios.get('/api/tasks')
    setTasks(res.data)
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title) return
    await axios.post('/api/tasks', { title })
    setTitle('')
    fetchTasks()
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Todo</h1>
      <form onSubmit={addTask}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {tasks.map(t => (
          <li key={t.id}>{t.title} {t.completed ? '✅' : ''}</li>
        ))}
      </ul>
    </div>
  )
}
