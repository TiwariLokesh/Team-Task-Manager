import { MagnifyingGlassIcon, PowerIcon } from '@heroicons/react/24/outline'
import useAuth from '../hooks/useAuth'

const TopBar = ({ title, subtitle }) => {
  const { logout } = useAuth()

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-steel">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-steel md:flex">
          <MagnifyingGlassIcon className="h-4 w-4" />
          <input
            className="w-40 bg-transparent text-sm text-ink outline-none"
            placeholder="Search"
            type="text"
          />
        </label>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-slate-300"
        >
          <PowerIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  )
}

export default TopBar
