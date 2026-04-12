import { useParams, Link } from 'react-router-dom'
import Header from '@/components/Header'
import ClipGrid from '@/components/ClipGrid'
import { useTagClips } from '@/hooks/useTags'

export default function TagFilterPage() {
  const { tag } = useParams()
  const { data: clips = [], isLoading, isError } = useTagClips(tag)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="text-sm text-muted-foreground hover:underline">
            ← Back
          </Link>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 font-medium">
            {tag}
          </span>
          {!isLoading && (
            <span className="text-sm text-muted-foreground">
              {clips.length} {clips.length === 1 ? 'clip' : 'clips'}
            </span>
          )}
        </div>

        {isError ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-destructive">Failed to load clips for this tag.</p>
          </div>
        ) : (
          <ClipGrid clips={clips} isLoading={isLoading} />
        )}
      </main>
    </div>
  )
}
