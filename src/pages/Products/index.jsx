import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  Chip,
  FormControl,
  InputLabel,
  Skeleton,
  CircularProgress
} from '@mui/material'
import { Search, FilterList } from '@mui/icons-material'
import SEO from '@/components/SEO'
import styles from './styles.module.scss'
import { setSpecies, setSearchTerm, setStatusFilter } from '@/store/slices/productsUiSlice'
import { useProductsFeed } from './hooks/useProductsFeed'
import { useObserverRecovery } from '@/hooks/useObserverRecovery'
import ProductCard from '@/components/ProductCard/ProductCard'

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { species, searchTerm, statusFilter } = useSelector((state) => state.productsUi)
  const {
    items: allCharacters,
    totalEntities,
    isFetching,
    isError,
    hasNext,
    loadNextPage,
    refetch
  } = useProductsFeed({ species, searchTerm, statusFilter })

  const onIntersect = useCallback(() => {
    loadNextPage()
  }, [loadNextPage])
  const { observerTarget, cooldown } = useObserverRecovery({
    isFetching,
    isError,
    hasNext,
    refetchAction: refetch,
    onIntersect
  })

  return (
    <Box>
      <SEO title="Catálogo de Personajes" description="Administra la Whitelist evaluando la fiabilidad de las criaturas a unirte en tu misión." />
      {}
      <Box className={styles.searchBarGlobalWrapper}>
        <Box className={styles.searchBarContainer}>
          <TextField
            fullWidth
            placeholder='Buscar en todas las dimensiones...'
            variant='outlined'
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Search className={styles.searchIcon} />
                </InputAdornment>
              )
            }}
          />

          {}
          <Box className={styles.filtersGroup}>
            <Typography className={styles.filterLabel}>
              <FilterList fontSize='small' /> FILTRO:
            </Typography>

            <FormControl className={styles.speciesFormControl}>
              <InputLabel id='species-label'>Especie</InputLabel>
              <Select
                labelId='species-label'
                value={species}
                label='Especie'
                onChange={(e) => dispatch(setSpecies(e.target.value))}
                IconComponent={(props) => (
                  <svg
                    {...props}
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                  >
                    <path d='M6 9l6 6 6-6' />
                  </svg>
                )}
              >
                <MenuItem value='all'>Todas las Especies</MenuItem>
                <MenuItem value='Human'>Humano</MenuItem>
                <MenuItem value='Alien'>Alienígena</MenuItem>
                <MenuItem value='Robot'>Robot</MenuItem>
              </Select>
            </FormControl>

            {}
            <Box className={styles.pillsGroup}>
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='En Existencia'
                onClick={() => dispatch(setStatusFilter('alive'))}
                className={`${styles.pill} ${styles.pillGreen}`}
                variant={statusFilter === 'alive' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'alive' ? 0.4 : 1 }}
              />
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='Descontinuado'
                onClick={() => dispatch(setStatusFilter('dead'))}
                className={`${styles.pill} ${styles.pillRed}`}
                variant={statusFilter === 'dead' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'dead' ? 0.4 : 1 }}
              />
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='Desconocido'
                onClick={() => dispatch(setStatusFilter('unknown'))}
                className={`${styles.pill} ${styles.pillYellow}`}
                variant={statusFilter === 'unknown' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'unknown' ? 0.4 : 1 }}
              />
            </Box>

            <Box className={styles.entitiesBadge}>{totalEntities} entidades</Box>
          </Box>
        </Box>
      </Box>

      {}
      <Box className={styles.pageContainer}>
        {}
        <Box className={styles.catalogHeader}>
          <Typography className={styles.catalogTitle}>Catálogo Interdimensional</Typography>
          <Typography className={styles.catalogSub}>BASE CITADEL :: {totalEntities} ENTIDADES ENCONTRADAS</Typography>
        </Box>

        {}
        {isError && !isFetching && allCharacters.length === 0 && (
          <Typography color='error' textAlign='center' mt={4}>
            Error leyendo Base Citadel. No se encontraron resultados.
          </Typography>
        )}

        {}
        {(allCharacters.length > 0 || isFetching) && (
          <Box className={styles.productGrid}>
            {}
            {allCharacters.map((entity) => (
              <ProductCard key={entity.id} entity={entity} />
            ))}

            {}
            {isFetching &&
              Array.from(new Array(10)).map((_, i) => (
                <Box key={`skeleton-${i}`} className={styles.productCard}>
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='100%'
                    animation='wave'
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)' }}
                  />
                </Box>
              ))}
          </Box>
        )}

        {}
        <Box ref={observerTarget} pt={8} pb={4} textAlign='center'>
          {cooldown > 0 ? (
            <Typography sx={{ color: '#ff4d4d', fontFamily: 'Space Mono, monospace', opacity: 0.8 }}>
              [ LÍMITE ALCANZADO - RECONECTANDO EN {cooldown}s ]
            </Typography>
          ) : isFetching ? (
            <Typography sx={{ color: 'rgba(234, 240, 251, 0.4)', fontFamily: 'Space Mono, monospace' }}>
              Escaneando cuadrante...
            </Typography>
          ) : !hasNext && allCharacters.length > 0 ? (
            <Typography
              sx={{
                color: 'var(--green-portal)',
                fontFamily: 'Space Mono, monospace',
                opacity: 0.8,
                letterSpacing: '0.1em'
              }}
            >
              [ FIN DE TRANSMISIÓN DE BASE DE DATOS ]
            </Typography>
          ) : null}
        </Box>
      </Box>

      {}
      {totalEntities > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: { xs: 24, md: 40 },
            right: { xs: 24, md: 40 },
            backgroundColor: 'rgba(9, 14, 23, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(50, 205, 50, 0.4)',
            color: 'var(--green-portal)',
            padding: '10px 20px',
            borderRadius: '30px',
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 8px rgba(50, 205, 50, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            cursor: 'default',
            '&:hover': {
              borderColor: 'var(--green-portal)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(50, 205, 50, 0.4)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          {isFetching ? (
            <CircularProgress size={14} sx={{ color: 'var(--cyan-rick)' }} />
          ) : (
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--green-portal)',
                boxShadow: '0 0 8px var(--green-portal)'
              }}
            />
          )}
          {allCharacters.length} / {totalEntities} CARGADAS
        </Box>
      )}
    </Box>
  )
}
