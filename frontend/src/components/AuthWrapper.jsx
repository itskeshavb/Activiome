import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

export default function AuthWrapper() {
  const { isLoading, isAuthenticated } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login')
    }
  }, [isLoading, isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070d1f]">
        <p className="text-white/40 text-sm">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <Outlet />
}
