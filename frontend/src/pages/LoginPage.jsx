import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { is } from 'date-fns/locale'

function PulseWave({ id, flip = false }) {
  const gradId = `pulse-grad-${id}`
  return (
    <svg
      viewBox="0 0 500 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={flip ? { transform: 'scaleX(-1)' } : {}}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0" />
          <stop offset="60%" stopColor="#00d4ff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.1" />
        </linearGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Main pulse line */}
      <path
        d="M0,150 L80,150 L100,135 L115,150 L125,80 L138,220 L150,150 L220,150 L235,140 L248,150 L258,95 L270,205 L282,150 L360,150 L375,142 L388,150 L400,150 L500,150"
        stroke={`url(#${gradId})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${id})`}
      />
      {/* Faint echo line */}
      <path
        d="M0,170 L80,170 L100,158 L115,170 L125,115 L138,230 L150,170 L220,170 L235,162 L248,170 L258,120 L270,220 L282,170 L360,170 L375,164 L388,170 L400,170 L500,170"
        stroke="#00d4ff"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.2"
      />
    </svg>
  )
}

export default function LoginPage() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/')
    }
  }, [isLoading, isAuthenticated, navigate])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070d1f]">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a1e4a_0%,_#070d1f_70%)]" />

      {/* Left pulse wave */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/5 h-64 opacity-60 pointer-events-none">
        <PulseWave id="left" />
      </div>

      {/* Right pulse wave */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/5 h-64 opacity-60 pointer-events-none">
        <PulseWave id="right" flip />
      </div>
    
      {/* Ambient glow spots */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative z-10 flex flex-col items-center gap-8 bg-[#0b1a35]/80 backdrop-blur-md border border-white/[0.06] rounded-[2rem] px-10 py-12 w-full max-w-sm shadow-2xl">

        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl" />
            <img
              src="/logo.png"
              alt="Activiome"
              className="relative w-24 h-24 object-contain drop-shadow-[0_0_12px_rgba(0,212,255,0.4)]"
            />
          </div>

          {/* Brand name */}
          <h1 className="text-2xl font-bold tracking-[0.125em] text-white uppercase">
            Activiome
          </h1>
        </div>
        {/* Login button */}
        <button
          onClick={() => loginWithRedirect()}
          disabled={isLoading}
          className="w-full py-3.5 rounded-full font-bold text-base text-white bg-blue-500 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          {isLoading ? 'Loading…' : 'Log In'}
        </button>

      </div>
    </div>
  )
}
