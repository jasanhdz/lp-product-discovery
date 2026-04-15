import styles from '@/styles/pageContainer.module.scss'

export default function DynamicFormPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Formulario Dinámico</h1>
      <p>Aquí construiremos los inputs dinámicos a partir de la API.</p>
    </div>
  )
}
