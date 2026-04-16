import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '@mui/material';
import { Search, FilterList } from '@mui/icons-material';
import styles from './styles.module.scss';

// Redux Actions
import { setSpecies, setSearchTerm, setStatusFilter } from '@/store/slices/productsUiSlice';

// Custom Hooks Pro
import { useProductsFeed } from './hooks/useProductsFeed';
import { useObserverRecovery } from '@/hooks/useObserverRecovery';

// Componentes
import ProductCard from '@/components/ProductCard/ProductCard';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { species, searchTerm, statusFilter } = useSelector((state) => state.productsUi);

  // Hook de Datos de Negocio
  const {
    items: allCharacters,
    totalEntities,
    isFetching,
    isError,
    hasNext,
    loadNextPage,
    refetch
  } = useProductsFeed({ species, searchTerm, statusFilter });

  const onIntersect = useCallback(() => {
    loadNextPage();
  }, [loadNextPage]);

  // Hook Genérico de Observer
  const { observerTarget, cooldown } = useObserverRecovery({
    isFetching,
    isError,
    hasNext,
    refetchAction: refetch,
    onIntersect
  });

  return (
    <Box>
      {/* SECONDARY NAVBAR (SEARCH & FILTERS) FULL WIDTH */}
      <Box className={styles.searchBarGlobalWrapper}>
        <Box className={styles.searchBarContainer}>
          <TextField
            fullWidth
            placeholder='Search across all dimensions...'
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

          {/* Filters Group */}
          <Box className={styles.filtersGroup}>
            <Typography className={styles.filterLabel}>
              <FilterList fontSize='small' /> FILTER:
            </Typography>

            <FormControl className={styles.speciesFormControl}>
              <InputLabel id='species-label'>Species</InputLabel>
              <Select
                labelId='species-label'
                value={species}
                label='Species'
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
                <MenuItem value='all'>All Species</MenuItem>
                <MenuItem value='Human'>Human</MenuItem>
                <MenuItem value='Alien'>Alien</MenuItem>
                <MenuItem value='Robot'>Robot</MenuItem>
              </Select>
            </FormControl>

            {/* Status Pills */}
            <Box className={styles.pillsGroup}>
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='In Stock'
                onClick={() => dispatch(setStatusFilter('alive'))}
                className={`${styles.pill} ${styles.pillGreen}`}
                variant={statusFilter === 'alive' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'alive' ? 0.4 : 1 }}
              />
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='Discontinued'
                onClick={() => dispatch(setStatusFilter('dead'))}
                className={`${styles.pill} ${styles.pillRed}`}
                variant={statusFilter === 'dead' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'dead' ? 0.4 : 1 }}
              />
              <Chip
                icon={<div className={styles.cardDot} style={{ backgroundColor: 'currentColor' }} />}
                label='Unknown'
                onClick={() => dispatch(setStatusFilter('unknown'))}
                className={`${styles.pill} ${styles.pillYellow}`}
                variant={statusFilter === 'unknown' ? 'filled' : 'outlined'}
                sx={{ opacity: statusFilter && statusFilter !== 'unknown' ? 0.4 : 1 }}
              />
            </Box>

            <Box className={styles.entitiesBadge}>{totalEntities} entities</Box>
          </Box>
        </Box>
      </Box>

      {/* PAGE CONTENT */}
      <Box className={styles.pageContainer}>
        {/* CATALOG HEADER */}
        <Box className={styles.catalogHeader}>
          <Typography className={styles.catalogTitle}>Interdimensional Catalog</Typography>
          <Typography className={styles.catalogSub}>
            CITADEL_DB :: {totalEntities} ENTITIES FOUND
          </Typography>
        </Box>

        {/* ALERTS DE ERROR */}
        {isError && !isFetching && allCharacters.length === 0 && (
          <Typography color='error' textAlign='center' mt={4}>
            Error querying Citadel DB. No results found.
          </Typography>
        )}

        {/* RESULTS GRID */}
        {(allCharacters.length > 0 || isFetching) && (
          <Box className={styles.productGrid}>
            {/* 1. Mapeo Condicional */}
            {allCharacters.map((entity) => (
              <ProductCard key={entity.id} entity={entity} />
            ))}

            {/* 2. Esqueletos Condicionales */}
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

        {/* OBSERVER PERMANENTE */}
        <Box ref={observerTarget} pt={8} pb={4} textAlign='center'>
          {cooldown > 0 ? (
            <Typography sx={{ color: '#ff4d4d', fontFamily: 'Space Mono, monospace', opacity: 0.8 }}>
              [ RATE LIMIT DETECTED - RECONNECTING IN {cooldown}s ]
            </Typography>
          ) : isFetching ? (
            <Typography
              sx={{ color: 'rgba(234, 240, 251, 0.4)', fontFamily: 'Space Mono, monospace' }}
            >
              Scanning limits...
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
              [ END OF DATABASE TRANSMISSION ]
            </Typography>
          ) : null}
        </Box>
      </Box>

      {/* PROGRESS HUD (Floating Tracker) */}
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
          {allCharacters.length} / {totalEntities} LOADED
        </Box>
      )}
    </Box>
  );
}
