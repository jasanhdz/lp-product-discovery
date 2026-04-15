import { Loader } from '@/components/loader/Loader'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'

function LoaderPage({ message = 'Cargando...' }) {
  return (
    <div className={styles.container}>
      <Loader />
      <p className={styles.message}>{message}</p>
    </div>
  )
}

LoaderPage.propTypes = {
  message: PropTypes.string
}

export default LoaderPage
