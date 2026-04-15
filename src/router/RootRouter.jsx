import { Navigate } from 'react-router-dom'
import { APP_ROUTES, AUTH_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'

export default function RootRoute() {
  const { isLoadingSession, isLoggedIn } = {
    isLoadingSession: false,
    isLoggedIn: true
  }

  if (isLoadingSession) return <LoaderPage />

  return isLoggedIn ? (
    <Navigate to={APP_ROUTES.PRODUCTS} replace />
  ) : (
    <Navigate to={AUTH_ROUTES.SIGN_IN} replace />
  )
}
