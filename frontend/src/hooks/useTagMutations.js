import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from './useApi'

export function useAddTag(clipId) {
  const apiFetch = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tag) => apiFetch(`/clips/${clipId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] })
    },
    onError: (err) => {
      console.error(`Failed to add tag to clip ${clipId}:`, err)
    },
  })
}

export function useRemoveTag(clipId) {
  const apiFetch = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tag) => apiFetch(`/clips/${clipId}/tags/${encodeURIComponent(tag)}`, {
      method: 'DELETE',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] })
    },
    onError: (err) => {
      console.error(`Failed to remove tag from clip ${clipId}:`, err)
    },
  })
}
