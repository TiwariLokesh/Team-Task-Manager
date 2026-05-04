import { useEffect, useState } from 'react'
import api from '../services/api'
import TopBar from '../components/TopBar'
import Modal from '../components/Modal'
import useAuth from '../hooks/useAuth'

const Projects = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '' })
  const [memberForms, setMemberForms] = useState({})

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects')
      setProjects(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load projects.')
    }
  }

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/users')
      setUsers(data)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load users.')
    }
  }

  useEffect(() => {
    loadProjects()
    if (user?.role === 'admin') {
      loadUsers()
    }
  }, [user?.role])

  const handleCreate = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await api.post('/projects', form)
      setForm({ name: '' })
      setShowModal(false)
      loadProjects()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create project.')
    }
  }

  const handleMemberChange = (projectId, value) => {
    setMemberForms((prev) => ({ ...prev, [projectId]: value }))
  }

  const handleAddMember = async (projectId) => {
    const userId = memberForms[projectId]
    if (!userId) return

    try {
      await api.post(`/projects/${projectId}/members`, { userId })
      setMemberForms((prev) => ({ ...prev, [projectId]: '' }))
      loadProjects()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to add member.')
    }
  }

  const handleRemoveMember = async (projectId) => {
    const userId = memberForms[projectId]
    if (!userId) return

    try {
      await api.delete(`/projects/${projectId}/members/${userId}`)
      setMemberForms((prev) => ({ ...prev, [projectId]: '' }))
      loadProjects()
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to remove member.')
    }
  }

  return (
    <div className="space-y-8">
      <TopBar title="Projects" subtitle="Manage team spaces and membership." />
      {error && <p className="text-sm text-rose">{error}</p>}

      <section className="flex items-center justify-between">
        <p className="text-sm text-steel">{projects.length} active projects</p>
        {user?.role === 'admin' && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
          >
            New project
          </button>
        )}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel rounded-3xl p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-ink">{project.name}</h3>
            <p className="mt-2 text-sm text-steel">Owner: {project.ownerName}</p>
            <p className="mt-1 text-xs text-steel">Members: {project.memberCount}</p>

            {user?.role === 'admin' && (
              <div className="mt-4 space-y-2">
                <select
                  value={memberForms[project.id] || ''}
                  onChange={(event) => handleMemberChange(project.id, event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs"
                >
                  <option value="">Select user</option>
                  {users.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                {users.length === 0 && (
                  <p className="text-xs text-steel">Create users first to add them.</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddMember(project.id)}
                    className="flex-1 rounded-full bg-ink px-3 py-2 text-xs font-semibold text-white"
                  >
                    Add member
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(project.id)}
                    className="flex-1 rounded-full border border-slate-200 px-3 py-2 text-xs text-steel"
                  >
                    Remove member
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="glass-panel rounded-3xl p-6 text-sm text-steel">
            No projects yet. Ask an admin to create the first workspace.
          </div>
        )}
      </section>

      {showModal && (
        <Modal title="Create a project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <label className="block text-sm font-medium text-ink">
              Project name
              <input
                value={form.name}
                onChange={(event) => setForm({ name: event.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean"
                placeholder="Launch prep"
                required
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white"
            >
              Create project
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default Projects
