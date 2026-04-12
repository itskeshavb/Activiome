import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '@/components/Header'
import DateHourControls from '@/components/DateHourControls'
import ClipGrid from '@/components/ClipGrid'
import BatchTagBar from '@/components/BatchTagBar'
import { useClips } from '@/hooks/useClips'

function getNow() {
  const now = new Date()
  return {
    h: String(now.getHours()),
    d: String(now.getDate()),
    m: String(now.getMonth() + 1),
    y: String(now.getFullYear()),
  }
}

export default function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams(getNow())
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [pendingBatchTag, setPendingBatchTag] = useState(null)

  const h = searchParams.get('h')
  const d = searchParams.get('d')
  const m = searchParams.get('m')
  const y = searchParams.get('y')

  const hour  = Number(h)
  const day   = Number(d)
  const month = Number(m)
  const year  = Number(y)

  const date = new Date(year, month - 1, day)

  const { data: clips = [], isLoading, isError } = useClips({ h, d, m, y })

  function handleDateChange(newDate) {
    setSearchParams({
      h,
      d: String(newDate.getDate()),
      m: String(newDate.getMonth() + 1),
      y: String(newDate.getFullYear()),
    })
  }

  function handleHourChange(newHour) {
    setSearchParams({ h: String(newHour), d, m, y })
  }

  function handleToggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleBatchTag(tag) {
    setPendingBatchTag({ tag, ids: new Set(selectedIds), ts: Date.now() })
    setSelectedIds(new Set())
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <DateHourControls
        date={date}
        hour={hour}
        onDateChange={handleDateChange}
        onHourChange={handleHourChange}
      />
      <main className="flex-1 p-6">
        {isError ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-destructive">Failed to load clips. Check your connection and API config.</p>
          </div>
        ) : (
          <ClipGrid
            clips={clips}
            isLoading={isLoading}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            pendingBatchTag={pendingBatchTag}
          />
        )}
      </main>

      <BatchTagBar
        count={selectedIds.size}
        onAddTag={handleBatchTag}
        onClear={() => setSelectedIds(new Set())}
      />
    </div>
  )
}
