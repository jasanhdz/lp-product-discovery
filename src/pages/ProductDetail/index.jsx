import { useParams } from 'react-router-dom'
import styles from '@/styles/pageContainer.module.scss'

export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Detalle del Producto</h1>
      <p>Estás viendo la información ampliada del producto con ID: {id}</p>
    </div>
  )
}
