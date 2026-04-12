import { Link } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'

export default function Header() {
  const { user, logout } = useAuth0()

  function handleLogout() {
    logout({ logoutParams: { returnTo: `${window.location.origin}/login` } })
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#0a1525] z-10 border-b border-white/[0.06]">
      <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white">
        <img src="/logo.png" alt="" className="w-8 h-8 object-contain" />
        Activiome
      </Link>
      <div className="flex items-center gap-2">
        {user?.email && (
          <span className="text-sm text-white/50 hidden sm:block mr-2">
            {user.email}
          </span>
        )}
        <Link to="/settings">
          <Button variant="ghost" size="sm" className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10">
            <Settings size={15} />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-1.5 text-white/70 hover:text-white hover:bg-white/10"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Log Out</span>
        </Button>
      </div>
    </header>
  )
}
