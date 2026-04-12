import { useAuth0 } from '@auth0/auth0-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Returns an authenticated fetch function that automatically attaches
 * the Auth0 Bearer token to every request. Used as the fetcher for
 * all TanStack Query calls.
 *
 * Usage:
 *   const apiFetch = useApi()
 *   const data = await apiFetch('/clips?h=14&d=5&m=3&y=2024')
 *   const data = await apiFetch('/clips/123/tags', { method: 'POST', body: JSON.stringify({ tag: 'walk' }) })
 */
export function useApi() {
  const { getAccessTokenSilently } = useAuth0()

  async function apiFetch(path, options = {}) {
    const token = await getAccessTokenSilently()

    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(body.error || res.statusText)
    }

    return res.json()
  }

  return apiFetch
}
