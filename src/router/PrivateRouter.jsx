import { Navigate } from 'react-router-dom'
import { AUTH_ROUTES } from '@/constants/route-paths'
import LoaderPage from '@/pages/Loader'
import PropTypes from 'prop-types'
import { useAppSelector } from '@/store/hooks'
import { Navbar } from '@/components/navbar/Navbar'
import styles from '@/styles/layout.module.scss'

export default function PrivateRouter({ children }) {
  const { isLoadingSession, isLoggedIn } = useAppSelector((state) => state.session)

  if (isLoadingSession) return <LoaderPage />

  return isLoggedIn ? (
    <div className={styles.appLayout}>
      <Navbar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  ) : (
    <Navigate to={AUTH_ROUTES.SIGN_IN} replace />
  )
}

PrivateRouter.propTypes = {
  children: PropTypes.node.isRequired
}
