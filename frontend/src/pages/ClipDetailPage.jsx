import { lazy, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '@/components/Header'
import VideoPlayer from '@/components/VideoPlayer'
import TagSection from '@/components/TagSection'
import { useClip } from '@/hooks/useClip'
import { useAccel } from '@/hooks/useAccel'

const MotionChart = lazy(() => import('@/components/MotionChart'))

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function ClipDetailPage() {
  const { id } = useParams()
  const { data: clip, isLoading, isError } = useClip(id)
  const { data: accel = { x: [], z: [] } } = useAccel(id)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="bg-muted rounded" style={{ aspectRatio: '3 / 4' }} />
            <div className="h-[200px] bg-muted rounded" />
          </div>
        </main>
      </div>
    )
  }

  if (isError || !clip) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-destructive">Clip not found.</p>
        </main>
      </div>
    )
  }

  const { minute, hour, day, month, year, video_url, cv_tags, user_tags } = clip

  // Back link restores the exact date/hour context this clip belongs to
  const backUrl = `/?h=${hour}&d=${day}&m=${month}&y=${year}`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        <Link to={backUrl} className="text-sm text-muted-foreground hover:underline">
          ← {month}/{day}/{year} at {pad(hour)}:00
        </Link>

        <h2 className="text-xl font-semibold mt-3 mb-4">
          {pad(hour)}:{pad(minute)}
        </h2>

        <VideoPlayer src={video_url} />

        <div className="mt-4" style={{ height: '200px' }}>
          <Suspense fallback={<div className="w-full h-full bg-muted rounded animate-pulse" />}>
            <MotionChart x={accel.x ?? []} z={accel.z ?? []} />
          </Suspense>
        </div>

        <div className="mt-4">
          <TagSection
            cvTags={cv_tags}
            initialUserTags={user_tags}
            clipId={Number(id)}
          />
        </div>
      </main>
    </div>
  )
}
