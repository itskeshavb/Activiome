import { useState, useRef } from 'react'
import { X, Sparkles, User } from 'lucide-react'

function CVTag({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-white/[0.07] text-white/40 font-medium">
      {label}
    </span>
  )
}

function UserTag({ label, onRemove, disabled }) {
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs bg-cyan-500/10 text-cyan-400 font-medium border border-cyan-500/20">
      {label}
      <button
        onClick={() => onRemove(label)}
        disabled={disabled}
        className="ml-0.5 hover:text-cyan-200 leading-none disabled:opacity-40 transition-colors"
        aria-label={`Remove tag ${label}`}
      >
        <X size={10} />
      </button>
    </span>
  )
}

// TagSection is controlled — tags state lives in ClipCard.
export default function TagSection({ cvTags = [], userTags = [], onAdd, onRemove, isBusy = false }) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  function handleAdd(e) {
    e.preventDefault()
    const tag = inputValue.trim().toLowerCase()
    if (tag && !userTags.includes(tag)) {
      onAdd(tag)
    }
    setInputValue('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-1.5">

      {/* AI / CV tags */}
      {cvTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex items-center gap-0.5 text-[10px] text-white/20 font-semibold uppercase tracking-wide mr-0.5 shrink-0">
            <Sparkles size={8} />
            AI
          </span>
          {cvTags.map(tag => (
            <CVTag key={tag} label={tag} />
          ))}
        </div>
      )}

      {/* User tags + add input */}
      <div className="flex flex-wrap items-center gap-1">
        {userTags.length > 0 && (
          <>
            <span className="inline-flex items-center gap-0.5 text-[10px] text-cyan-400/40 font-semibold uppercase tracking-wide mr-0.5 shrink-0">
              <User size={8} />
              You
            </span>
            {userTags.map(tag => (
              <UserTag key={tag} label={tag} onRemove={onRemove} disabled={isBusy} />
            ))}
          </>
        )}

        <form onSubmit={handleAdd} className="flex items-center gap-1 mt-0.5">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Add tag…"
            disabled={isBusy}
            className="flex-1 min-w-0 w-16 text-xs bg-transparent border-b border-white/10 focus:border-cyan-400 focus:outline-none py-0.5 text-foreground placeholder:text-white/20 transition-colors disabled:opacity-40"
          />
          <button
            type="submit"
            disabled={isBusy}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors disabled:opacity-40 shrink-0"
          >
            Add
          </button>
        </form>
      </div>

    </div>
  )
}
