import { useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'

/**
 * Fetches all unique user tags for the logged-in user, sorted alphabetically.
 */
export function useTags() {
  const apiFetch = useApi()

  return useQuery({
    queryKey: ['tags'],
    queryFn: () => apiFetch('/tags'),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Fetches all clips that have a given user tag.
 */
export function useTagClips(tag) {
  const apiFetch = useApi()

  return useQuery({
    queryKey: ['tags', tag],
    queryFn: () => apiFetch(`/tags/${encodeURIComponent(tag)}`),
    enabled: !!tag,
    staleTime: 1000 * 60 * 5,
  })
}
