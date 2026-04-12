import { useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'

/**
 * Fetches a single clip by ID. Normalizes clipId to a number so the cache
 * key matches entries populated by useClips (where IDs come from the DB as numbers).
 */
export function useClip(clipId) {
  const apiFetch = useApi()
  const id = Number(clipId)

  return useQuery({
    queryKey: ['clips', id],
    queryFn: () => apiFetch(`/clips/${id}`),
    enabled: !!id,
  })
}
