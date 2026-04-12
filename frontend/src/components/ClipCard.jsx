import { lazy, Suspense, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import VideoPlayer from './VideoPlayer'
import TagSection from './TagSection'
import { useAccel } from '@/hooks/useAccel'
import { useAddTag, useRemoveTag } from '@/hooks/useTagMutations'

const MotionChart = lazy(() => import('./MotionChart'))

export default function ClipCard({ clip, isSelected = false, onToggleSelect, pendingBatchTag }) {
  const { id, minute, video_url, cv_tags = [], user_tags = [] } = clip
  const [userTags, setUserTags] = useState(user_tags)
  const lastBatchTsRef = useRef(null)

  const { data: accel = { x: [], z: [] } } = useAccel(id)
  const addTag = useAddTag(id)
  const removeTag = useRemoveTag(id)
  const isBusy = addTag.isPending || removeTag.isPending

  // Respond to batch tag additions triggered from the BatchTagBar
  useEffect(() => {
    if (!pendingBatchTag || pendingBatchTag.ts === lastBatchTsRef.current) return
    lastBatchTsRef.current = pendingBatchTag.ts
    if (pendingBatchTag.ids.has(id)) {
      setUserTags(prev =>
        prev.includes(pendingBatchTag.tag) ? prev : [...prev, pendingBatchTag.tag]
      )
      addTag.mutate(pendingBatchTag.tag)
    }
  }, [pendingBatchTag])

  function handleAddTag(tag) {
    setUserTags(prev => [...prev, tag])
    addTag.mutate(tag)
  }

  function handleRemoveTag(tag) {
    setUserTags(prev => prev.filter(t => t !== tag))
    removeTag.mutate(tag)
  }

  return (
    <div className={cn(
      'group relative flex flex-col bg-card rounded-xl overflow-hidden w-full border transition-all',
      isSelected
        ? 'border-cyan-400 ring-1 ring-cyan-400/20'
        : 'border-white/[0.06] hover:border-cyan-500/30'
    )}>

      {/* Selection checkbox — always visible when selected, on hover otherwise */}
      <button
        onClick={() => onToggleSelect?.(id)}
        className={cn(
          'absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all',
          isSelected
            ? 'bg-cyan-400 border-cyan-400 opacity-100'
            : 'bg-black/30 border-white/25 opacity-0 group-hover:opacity-100 hover:border-white/60'
        )}
        aria-label={isSelected ? 'Deselect clip' : 'Select clip'}
      >
        {isSelected && <Check size={10} className="text-[#070d1f]" strokeWidth={3} />}
      </button>

      {/* Minute label */}
      <div className="px-3 pt-3 pb-1.5">
        <Link
          to={`/clip/${id}`}
          className="text-sm font-bold text-foreground hover:text-cyan-400 transition-colors"
        >
          :{String(minute).padStart(2, '0')}
        </Link>
      </div>

      {/* Lazy-loaded video */}
      <VideoPlayer src={video_url} />

      {/* Accelerometer waveform */}
      <div className="w-full" style={{ height: '140px' }}>
        <Suspense fallback={<div className="w-full h-full bg-muted animate-pulse" />}>
          <MotionChart x={accel.x ?? []} z={accel.z ?? []} />
        </Suspense>
      </div>

      {/* Tags */}
      <div className="px-3 pb-3 pt-2 border-t border-white/[0.06]">
        <TagSection
          cvTags={cv_tags}
          userTags={userTags}
          onAdd={handleAddTag}
          onRemove={handleRemoveTag}
          isBusy={isBusy}
        />
      </div>
    </div>
  )
}
