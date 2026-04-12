import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Auth0Provider } from '@auth0/auth0-react'

import AuthWrapper from './components/AuthWrapper'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import ClipDetailPage from './pages/ClipDetailPage'
import TagFilterPage from './pages/TagFilterPage'
import SettingsPage from './pages/SettingsPage'

const queryClient = new QueryClient()

/**
 * Auth0Provider must live inside BrowserRouter so it has access to useNavigate.
 * onRedirectCallback cleans the ?code=&state= params from the URL after login,
 * which prevents the infinite "redirecting to login" loop.
 */
function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate()

  function onRedirectCallback(appState) {
    navigate(appState?.returnTo || '/')
  }

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        // Only pass audience when it's configured — an invalid/missing audience
        // causes Auth0 to fail the token exchange silently, causing a redirect loop.
        ...(import.meta.env.VITE_AUTH0_AUDIENCE
          ? { audience: import.meta.env.VITE_AUTH0_AUDIENCE }
          : {}),
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigate>
          <Routes>
            {/* Public route — no auth required */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes — AuthWrapper redirects to Auth0 if not logged in */}
            <Route element={<AuthWrapper />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/clip/:id" element={<ClipDetailPage />} />
              <Route path="/tags/:tag" element={<TagFilterPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
