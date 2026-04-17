import { Navigate } from 'react-router-dom'
import { APP_ROUTES, AUTH_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'
import { useAppSelector } from '@/store/hooks'

export default function RootRoute() {
  const { isLoadingSession, isLoggedIn } = useAppSelector((state) => state.session)

  if (isLoadingSession) return <LoaderPage />

  return isLoggedIn ? <Navigate to={APP_ROUTES.PRODUCTS} replace /> : <Navigate to={AUTH_ROUTES.SIGN_IN} replace />
}
