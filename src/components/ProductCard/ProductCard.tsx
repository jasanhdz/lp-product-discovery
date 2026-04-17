import React from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFavoriteThunk } from '@/store/slices/whitelistSlice'
import { RootState, AppDispatch } from '@/store'
import { Character } from '@/types/rickAndMorty'
import styles from './styles.module.scss'

interface ProductCardProps {
  entity: Character
}

export default function ProductCard({ entity }: ProductCardProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const isFavorite = useSelector((state: RootState) => state.whitelist.favoriteIds.includes(entity.id))

  const handleClickCard = () => {
    navigate(`/products/${entity.id}`)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(toggleFavoriteThunk(entity.id))
  }

  return (
    <Box className={styles.cardContainer} onClick={handleClickCard}>
      <img src={entity.image} alt={entity.name} className={styles.image} loading='lazy' />

      <Box className={styles.overlay}>
        <Typography className={styles.title} title={entity.name}>
          {entity.name.toUpperCase()}
        </Typography>

        <IconButton
          className={`${styles.heartBtn} ${isFavorite ? styles.heartBtnActive : ''}`}
          onClick={handleToggleFavorite}
          size='small'
        >
          {isFavorite ? <FavoriteIcon fontSize='small' /> : <FavoriteBorderIcon fontSize='small' />}
        </IconButton>
      </Box>
    </Box>
  )
}
