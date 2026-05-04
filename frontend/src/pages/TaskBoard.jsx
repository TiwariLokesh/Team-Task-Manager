import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'
import TopBar from '../components/TopBar'
import StatusColumn from '../components/StatusColumn'
import Modal from '../components/Modal'
import useAuth from '../hooks/useAuth'

const TaskBoard = () => {
  const { user } = useAuth()
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [activeProjectId, setActiveProjectId] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'Medium',
    status: 'To Do',
    assigned_to: '',
    project_id: '',
  })

  const loadTasks = async () => {
    try {
      const { data } = await api.get('/tasks')
      setTasks(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load tasks.')
    }
  }

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects')
      setProjects(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load projects.')
    }
  }

  useEffect(() => {
    loadTasks()
    loadProjects()
  }, [])

  useEffect(() => {
    const projectId = activeProjectId || form.project_id
    if (!projectId) {
      setMembers([])
      return
    }

    const loadMembers = async () => {
      try {
        const { data } = await api.get(`/projects/${projectId}/members`)
        setMembers(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load members.')
      }
    }

    loadMembers()
  }, [activeProjectId, form.project_id])

  const grouped = useMemo(() => {
    const filtered = activeProjectId
      ? tasks.filter((task) => String(task.project_id) === String(activeProjectId))
      : tasks

    return {
      'To Do': filtered.filter((task) => task.status === 'To Do'),
      'In Progress': filtered.filter((task) => task.status === 'In Progress'),
      Done: filtered.filter((task) => task.status === 'Done'),
    }
  }, [tasks, activeProjectId])

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status })
      loadTasks()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to update status.')
    }
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.post('/tasks', form)
      setForm({
        title: '',
        description: '',
        due_date: '',
        priority: 'Medium',
        status: 'To Do',
        assigned_to: '',
        project_id: '',
      })
      setShowModal(false)
      loadTasks()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create task.')
    }
  }

  return (
    <div className="space-y-8">
      <TopBar title="Task board" subtitle="Keep work flowing with clear status lanes." />
      {error && <p className="text-sm text-rose">{error}</p>}

      <section className="flex flex-wrap items-center justify-between gap-3">
        <select
          value={activeProjectId}
          onChange={(event) => setActiveProjectId(event.target.value)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          <option value="">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
        {user?.role === 'admin' && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            New task
          </button>
        )}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <StatusColumn
          title="To Do"
          tasks={grouped['To Do']}
          onStatusChange={handleStatusChange}
          canUpdate
          accent="bg-slate-100 text-steel"
        />
        <StatusColumn
          title="In Progress"
          tasks={grouped['In Progress']}
          onStatusChange={handleStatusChange}
          canUpdate
          accent="bg-sky-100 text-ocean"
        />
        <StatusColumn
          title="Done"
          tasks={grouped.Done}
          onStatusChange={handleStatusChange}
          canUpdate
          accent="bg-emerald-100 text-mint"
        />
      </section>

      {showModal && (
        <Modal title="Create a task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-ink md:col-span-2">
              Title
              <input
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                placeholder="Design sprint kickoff"
                required
              />
            </label>
            <label className="text-sm font-medium text-ink md:col-span-2">
              Description
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                rows="3"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Due date
              <input
                type="date"
                value={form.due_date}
                onChange={(event) => setForm((prev) => ({ ...prev, due_date: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              />
            </label>
            <label className="text-sm font-medium text-ink">
              Priority
              <select
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label className="text-sm font-medium text-ink">
              Project
              <select
                value={form.project_id}
                onChange={(event) => setForm((prev) => ({ ...prev, project_id: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-ink">
              Assign to
              <select
                value={form.assigned_to}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, assigned_to: event.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                required
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="md:col-span-2 rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              Create task
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default TaskBoard
