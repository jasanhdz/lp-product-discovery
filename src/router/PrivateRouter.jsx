import { Navigate } from 'react-router-dom'
import { APP_ROUTES, AUTH_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'
import PropTypes from 'prop-types'

export default function PrivateRouter({ children }) {
  const { isLoadingSession, isLoggedIn } = {
    isLoadingSession: true,
    isLoggedIn: true
  }

  if (isLoadingSession) return <LoaderPage />

  return isLoggedIn ? <>{children}</> : <Navigate to={AUTH_ROUTES.SIGN_IN} replace />
}

PrivateRouter.propTypes = {
  children: PropTypes.node.isRequired
}
