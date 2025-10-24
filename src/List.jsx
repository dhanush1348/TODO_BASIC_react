import { useEffect, useState } from "react"

const STORAGE_KEY = "todo_tasks_v1"

function List() {
  const [tasks, setTasks] = useState([])
  const [text, setText] = useState("")
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState("")

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTasks(JSON.parse(raw))
    } catch (e) {
      console.error("Failed to load tasks", e)
    }
  }, [])

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (e) {
      console.error("Failed to save tasks", e)
    }
  }, [tasks])

  function newId() {
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`
  }

  function addTask(e) {
    e && e.preventDefault()
    const value = text.trim()
    if (!value) return
    const t = { id: newId(), text: value, completed: false, createdAt: Date.now() }
    setTasks((s) => [t, ...s])
    setText("")
  }

  function startEdit(task) {
    setEditId(task.id)
    setEditText(task.text)
  }

  function saveEdit(e) {
    e && e.preventDefault()
    const value = editText.trim()
    if (!value) return
    setTasks((s) => s.map((t) => (t.id === editId ? { ...t, text: value } : t)))
    setEditId(null)
    setEditText("")
  }

  function cancelEdit() {
    setEditId(null)
    setEditText("")
  }

  function removeTask(id) {
    if (!confirm("Delete this task?")) return
    setTasks((s) => s.filter((t) => t.id !== id))
  }

  function toggleComplete(id) {
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  return (
    <section>
      <form onSubmit={addTask} style={{ marginBottom: 12 }}>
        <input
          aria-label="New task"
          placeholder="Add a new task and press Enter"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ padding: 8, minWidth: 240 }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: '8px 12px' }}>
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet — add one above.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />

              {editId === task.id ? (
                <form onSubmit={saveEdit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input value={editText} onChange={(e) => setEditText(e.target.value)} style={{ padding: 6 }} />
                  <button type="submit" style={{ padding: '6px 10px' }}>Save</button>
                  <button type="button" onClick={cancelEdit} style={{ padding: '6px 10px' }}>Cancel</button>
                </form>
              ) : (
                <>
                  <span style={{ textDecoration: task.completed ? 'line-through' : 'none', flex: 1 }}>{task.text}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(task)} style={{ padding: '4px 8px' }}>Edit</button>
                    <button onClick={() => removeTask(task.id)} style={{ padding: '4px 8px' }}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default List