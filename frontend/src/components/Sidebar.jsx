import { NavLink } from 'react-router-dom'
import {
  ChartBarSquareIcon,
  ClipboardDocumentCheckIcon,
  FolderOpenIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import useAuth from '../hooks/useAuth'

const navItems = [
  { label: 'Dashboard', to: '/', icon: ChartBarSquareIcon },
  { label: 'Projects', to: '/projects', icon: FolderOpenIcon },
  { label: 'Task Board', to: '/tasks', icon: ClipboardDocumentCheckIcon },
]

const Sidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="hidden w-64 flex-col gap-8 border-r border-slate-200 bg-white/70 px-6 py-8 lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.32em] text-steel">Team Task Manager</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink">Orbit Squad</h1>
      </div>

      <div className="glass-panel rounded-2xl p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ocean text-white">
            <UserGroupIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{user?.name || 'Guest'}</p>
            <p className="text-xs uppercase text-steel">{user?.role || 'member'}</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-ink text-white shadow-soft'
                  : 'text-steel hover:bg-slate-100 hover:text-ink'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
