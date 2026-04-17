import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Typography, Skeleton } from '@mui/material'
import { RootState } from '@/store'
import { useGetMultipleCharactersByIdsQuery } from '@/store/api/rickAndMortyApi'
import ProductCard from '@/components/ProductCard/ProductCard'
import gridStyles from '@/pages/Products/styles.module.scss'
import FavoriteIcon from '@mui/icons-material/Favorite'
import SEO from '@/components/SEO'

export default function WhitelistPage() {
  const favoriteIds = useSelector((state: RootState) => state.whitelist.favoriteIds)
  const shouldFetch = favoriteIds.length > 0

  const {
    data: favoritedCharacters,
    isLoading,
    isError
  } = useGetMultipleCharactersByIdsQuery(favoriteIds, {
    skip: !shouldFetch
  })
  const sortedCharacters = React.useMemo(() => {
    if (!favoritedCharacters) return []
    return [...favoritedCharacters].sort((a, b) => {
      return favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id)
    })
  }, [favoritedCharacters, favoriteIds])

  return (
    <Box className={gridStyles.pageContainer}>
      <SEO title="Favoritos de la Tripulación" description="Supervisa tu lista privada de entidades favoritas." />
      <Box className={gridStyles.catalogHeader}>
        <Typography className={gridStyles.catalogTitle}>Portafolio de Favoritos</Typography>
        <Typography className={gridStyles.catalogSub}>
          {favoriteIds.length} {favoriteIds.length === 1 ? 'ENTIDAD' : 'ENTIDADES'} GUARDADA
          {favoriteIds.length === 1 ? '' : 'S'}
        </Typography>
      </Box>

      {!shouldFetch ? (
        <Box textAlign='center' pt={10} pb={20}>
          <FavoriteIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.05)', mb: 2 }} />
          <Typography sx={{ color: 'rgba(234, 240, 251, 0.4)', fontFamily: 'Space Mono, monospace' }}>
            TU LISTA DE FAVORITOS ESTÁ VACÍA
          </Typography>
        </Box>
      ) : isError ? (
        <Box textAlign='center' pt={10}>
          <Typography color='error'>Señal Interrumpida. Fallo al cargar entidades guardadas.</Typography>
        </Box>
      ) : (
        <Box className={gridStyles.productGrid}>
          {isLoading
            ? // Skeletons
              Array.from(new Array(favoriteIds.length)).map((_, i) => (
                <Box key={`skeleton-wl-${i}`} className={gridStyles.productCard}>
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height='100%'
                    animation='wave'
                    sx={{ bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px' }}
                  />
                </Box>
              ))
            : // Cards (Usando nuestro array ordenado)
              sortedCharacters.map((entity) => <ProductCard key={entity.id} entity={entity} />)}
        </Box>
      )}
    </Box>
  )
}
