import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Signup = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await signup(form)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Signup failed. Try again.')
    }
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-steel">Start coordinating your team in minutes.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-ink">
            Full name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean"
              placeholder="Alex Morgan"
              required
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean"
              placeholder="you@company.com"
              required
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean"
              placeholder="Create a password"
              required
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-ocean"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <span className="mt-2 block text-xs text-steel">
              In production, admins are typically assigned by another admin.
            </span>
          </label>

          {error && <p className="text-sm text-rose">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Create account
          </button>
        </form>

        <p className="mt-6 text-sm text-steel">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-ocean">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
