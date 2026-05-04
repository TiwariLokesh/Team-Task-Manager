import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Try again.')
    }
  }

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-steel">Log in to manage tasks across your team.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p className="text-sm text-rose">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
          >
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-steel">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-ocean">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
