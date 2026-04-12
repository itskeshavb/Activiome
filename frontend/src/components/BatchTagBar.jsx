import { useState } from 'react'
import { X, Tag } from 'lucide-react'

export default function BatchTagBar({ count, onAddTag, onClear }) {
  const [value, setValue] = useState('')

  if (count === 0) return null

  function handleSubmit(e) {
    e.preventDefault()
    const tag = value.trim().toLowerCase()
    if (tag) {
      onAddTag(tag)
      setValue('')
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#0d1e38]/95 backdrop-blur border border-cyan-500/30 rounded-full px-5 py-3 shadow-2xl shadow-black/50">
      <Tag size={13} className="text-cyan-400 shrink-0" />
      <span className="text-sm text-cyan-400 font-semibold shrink-0">
        {count} {count === 1 ? 'clip' : 'clips'} selected
      </span>

      <div className="w-px h-4 bg-white/10 shrink-0" />

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Add tag to all…"
          autoFocus
          className="bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none w-40"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="text-xs font-semibold text-[#070d1f] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-default px-3 py-1 rounded-full transition-colors shrink-0"
        >
          Add
        </button>
      </form>

      <div className="w-px h-4 bg-white/10 shrink-0" />

      <button
        onClick={onClear}
        className="text-white/40 hover:text-white transition-colors shrink-0"
        aria-label="Clear selection"
      >
        <X size={14} />
      </button>
    </div>
  )
}
