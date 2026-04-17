import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar
} from '@mui/material'
import styles from './styles.module.scss'

import { useGetDynamicFormSchemaQuery } from '@/store/api/formApi'

export default function MissionBriefingPage() {
  const { data: formStructure, error: apiError, isLoading } = useGetDynamicFormSchemaQuery()

  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [success, setSuccess] = useState(false)

  const schema = Array.isArray(formStructure) && formStructure.length > 0 ? formStructure : []
  useEffect(() => {
    if (schema.length > 0) {
      const initialForm = {}
      schema.forEach((field) => {
        initialForm[field.name || field.id] = field.type === 'checkbox' ? false : ''
      })
      setFormData((prev) => (Object.keys(prev).length === 0 ? initialForm : prev))
    }
  }, [schema])

  const handleChange = (name, type) => (e) => {
    const value = type === 'checkbox' ? e.target.checked : e.target.value
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setValidationError('')
    const missingFields = schema.filter(
      (field) =>
        (field.isMandatory || field.isMandarory) &&
        (formData[field.name || field.id] === '' || formData[field.name || field.id] === undefined)
    )

    if (missingFields.length > 0) {
      setValidationError(
        `Faltan campos obligatorios: ${missingFields.map((f) => f.label || f.name || f.id).join(', ')}`
      )
      setIsSubmitting(false)
      return
    }
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccess(true)
      const resetForm = {}
      schema.forEach((field) => {
        resetForm[field.name] = field.type === 'checkbox' ? false : ''
      })
      setFormData(resetForm)
    }, 1500)
  }

  const renderField = (field) => {
    const { id, type, name, label, placeholder, options, isMandatory, isMandarory } = field
    const fieldName = name || id
    const isRequired = isMandatory || isMandarory

    switch (type) {
      case 'text':
      case 'number':
      case 'email':
        return (
          <TextField
            key={fieldName}
            type={type}
            fullWidth
            variant='outlined'
            label={label || fieldName}
            placeholder={placeholder}
            name={fieldName}
            value={formData[fieldName] ?? ''}
            onChange={handleChange(fieldName, type)}
            required={isRequired}
            className={styles.inputField}
          />
        )

      case 'select':
        return (
          <TextField
            key={fieldName}
            select
            fullWidth
            variant='outlined'
            label={label || fieldName}
            name={fieldName}
            value={formData[fieldName] ?? ''}
            onChange={handleChange(fieldName, type)}
            required={isRequired}
            className={styles.inputField}
          >
            {(options || []).map((opt) => (
              <MenuItem key={opt} value={opt}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        )

      case 'checkbox':
        return (
          <FormControlLabel
            key={fieldName}
            className={styles.checkboxField}
            control={
              <Checkbox
                checked={!!formData[fieldName]}
                onChange={handleChange(fieldName, type)}
                name={fieldName}
                required={isRequired}
              />
            }
            label={label || fieldName}
          />
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <>
        <div className={styles.loadingContainer}>
          <CircularProgress size={40} color='inherit' />
          <span>Decodificando parámetros de misión...</span>
        </div>
      </>
    )
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.backgroundEffects} />

        <div className={styles.glassCard}>
          <div className={styles.header}>
            <div className={styles.title}>Plan de Misión</div>
            <div className={styles.subtitle}>INICIATIVA CLASIFICADA DE LA CIUDADELA</div>
          </div>

          {(validationError || apiError) && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {validationError || 'Error al cargar la configuración del servidor'}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.formGroup}>
            {schema.map(renderField)}

            <Button type='submit' variant='contained' size='large' disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CircularProgress size={20} sx={{ color: '#0a0b10' }} />
                  TRANSMITIENDO...
                </span>
              ) : (
                'INICIAR MISIÓN'
              )}
            </Button>
          </form>
        </div>

        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setSuccess(false)} severity='success' sx={{ width: '100%' }}>
            ¡Plan de Misión registrado exitosamente en Base Citadel!
          </Alert>
        </Snackbar>
      </div>
    </>
  )
}
