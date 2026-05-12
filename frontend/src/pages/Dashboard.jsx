import { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import TopBar from '../components/TopBar'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/dashboard')
        setStats(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load dashboard data.')
      }
    }

    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <TopBar
        title={`Welcome, ${user?.name || 'team'}`}
        subtitle="Track team progress and overdue work at a glance."
      />

      {error && <p className="text-sm text-rose">{error}</p>}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Tasks"
          value={stats?.totalTasks ?? '--'}
          accent="text-ink"
          tone="bg-slate-100/80"
        />
        <StatCard
          label="In Progress"
          value={stats?.statusCounts?.['In Progress'] ?? '--'}
          accent="text-ocean"
          tone="bg-sky-100/70"
        />
        <StatCard
          label="Done"
          value={stats?.statusCounts?.Done ?? '--'}
          accent="text-mint"
          tone="bg-emerald-100/70"
        />
        <StatCard
          label="Overdue"
          value={stats?.overdueTasks ?? '--'}
          accent="text-rose"
          tone="bg-rose-100/70"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="glass-panel rounded-3xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Tasks by status</h3>
          <div className="mt-6 space-y-4">
            {['To Do', 'In Progress', 'Done'].map((status) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-steel">{status}</span>
                <span className="font-semibold text-ink">
                  {stats?.statusCounts?.[status] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Tasks per user</h3>
          <div className="mt-6 space-y-4">
            {stats?.tasksPerUser?.length ? (
              stats.tasksPerUser.map((item) => (
                <div key={item.userId} className="flex items-center justify-between text-sm">
                  <span className="text-steel">{item.userName}</span>
                  <span className="font-semibold text-ink">{item.taskCount}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-steel">
                {user?.role === 'admin'
                  ? 'Assign tasks to see team distribution.'
                  : 'Your assigned tasks will appear here.'}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
