import { useQuery } from '@tanstack/react-query'
import { useApi } from './useApi'

export function useClips({ h, d, m, y }) {
  const apiFetch = useApi()

  return useQuery({
    queryKey: ['clips', { h, d, m, y }],
    queryFn: () => apiFetch(`/clips?h=${h}&d=${d}&m=${m}&y=${y}`),
    staleTime: 1000 * 60 * 5,
  })
}
