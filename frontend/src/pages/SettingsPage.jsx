import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'

export default function SettingsPage() {
  const { user } = useAuth0()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <h2 className="text-lg font-semibold">Settings</h2>
        </div>

        <section>
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Account
          </h3>
          <div className="border border-border rounded-lg p-4 bg-card flex flex-col gap-1">
            {user?.name && (
              <p className="text-sm font-medium">{user.name}</p>
            )}
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground font-mono mt-1">{user?.sub}</p>
          </div>
        </section>
      </main>
    </div>
  )
}
