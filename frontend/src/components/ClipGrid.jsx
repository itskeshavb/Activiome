import ClipCard from './ClipCard'

const GRID_CLASS = 'grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-card overflow-hidden w-full border border-white/[0.06]">
      <div className="px-3 py-3">
        <div className="h-3.5 bg-white/5 rounded-full animate-pulse w-8" />
      </div>
      <div className="bg-white/5 animate-pulse" style={{ aspectRatio: '3 / 4' }} />
      <div className="h-[140px] bg-white/[0.03] animate-pulse" />
      <div className="px-3 py-3 border-t border-white/[0.06] flex flex-col gap-1.5">
        <div className="flex gap-1">
          <div className="h-4 bg-white/5 rounded-full animate-pulse w-12" />
          <div className="h-4 bg-white/5 rounded-full animate-pulse w-10" />
        </div>
        <div className="flex gap-1">
          <div className="h-4 bg-cyan-500/10 rounded-full animate-pulse w-14" />
        </div>
      </div>
    </div>
  )
}

export default function ClipGrid({ clips = [], isLoading = false, selectedIds, onToggleSelect, pendingBatchTag }) {
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-2">
        <p className="text-muted-foreground text-sm font-medium">No clips for this hour</p>
        <p className="text-muted-foreground/60 text-xs">Try selecting a different hour or date</p>
      </div>
    )
  }

  return (
    <div className={GRID_CLASS}>
      {clips.map(clip => (
        <ClipCard
          key={clip.id}
          clip={clip}
          isSelected={selectedIds?.has(clip.id) ?? false}
          onToggleSelect={onToggleSelect}
          pendingBatchTag={pendingBatchTag}
        />
      ))}
    </div>
  )
}
