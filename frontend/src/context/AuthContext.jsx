import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api, { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

const getStoredUser = () => {
  const raw = localStorage.getItem('ttm_user')
  return raw ? JSON.parse(raw) : null
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore auth state on refresh by reusing the stored token.
    const token = localStorage.getItem('ttm_token')
    if (token) {
      setAuthToken(token)
    }
    setLoading(false)
  }, [])

  const login = async (payload) => {
    const { data } = await api.post('/auth/login', payload)
    setAuthToken(data.token)
    localStorage.setItem('ttm_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const signup = async (payload) => {
    const { data } = await api.post('/auth/signup', payload)
    setAuthToken(data.token)
    localStorage.setItem('ttm_user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    setAuthToken(null)
    localStorage.removeItem('ttm_user')
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, login, signup, logout }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
