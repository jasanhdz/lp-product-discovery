import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'
import PropTypes from 'prop-types'

export default function PublicRouter({ children }) {
  const { isLoadingSession, isLoggedIn } = {
    isLoadingSession: true,
    isLoggedIn: true
  }

  if (isLoadingSession) return <LoaderPage />

  return !isLoggedIn ? <>{children}</> : <Navigate to={APP_ROUTES.PRODUCTS} replace />
}

PublicRouter.propTypes = {
  children: PropTypes.node.isRequired
}
