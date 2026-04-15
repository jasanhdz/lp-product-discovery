import astronauta from '@/assets/astronauta.webp'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.errorCode}>404</h1>
      <p className={styles.title}>
        <span className={styles.highlight}>¡Vaya!</span> Página no encontrada
      </p>
      <p className={styles.description}>
        La página que estás buscando no existe.
      </p>
      <img
        src={astronauta}
        alt="Astronauta perdido en el espacio"
        className={styles.image}
        loading="lazy"
      />
      <Link to="/" className={styles.button}>
        Volver al inicio
      </Link>
    </div>
  );
}