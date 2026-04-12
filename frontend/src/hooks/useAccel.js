import { useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'

export function useAccel(clipId) {
  const apiFetch = useApi()
  const id = Number(clipId)

  return useQuery({
    queryKey: ['clips', id, 'accel'],
    queryFn: () => apiFetch(`/clips/${id}/accel`),
    staleTime: Infinity,
    enabled: !!id,
  })
}
