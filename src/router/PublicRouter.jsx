import { Navigate } from 'react-router-dom'
import { APP_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'
import PropTypes from 'prop-types'
import { useAppSelector } from '@/store/hooks'

export default function PublicRouter({ children }) {
  const { isLoadingSession, isLoggedIn } = useAppSelector((state) => state.session)

  if (isLoadingSession) return <LoaderPage />

  return !isLoggedIn ? <>{children}</> : <Navigate to={APP_ROUTES.PRODUCTS} replace />
}

PublicRouter.propTypes = {
  children: PropTypes.node.isRequired
}
