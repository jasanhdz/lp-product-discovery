import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, IconButton, Skeleton, Chip, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavoriteThunk } from '@/store/slices/whitelistSlice';
import { RootState, AppDispatch } from '@/store';
import { useGetCharacterByIdQuery } from '@/store/api/rickAndMortyApi';
import styles from './styles.module.scss';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { data: character, isLoading, isError } = useGetCharacterByIdQuery(id as string);
  const isFavorite = useSelector((state: RootState) => 
    character ? state.whitelist.favoriteIds.includes(character.id) : false
  );

  const handleToggleFavorite = () => {
    if (character) {
      dispatch(toggleFavoriteThunk(character.id));
    }
  };

  if (isError) {
    return (
      <Box className={styles.pageWrapper}>
        <Typography color="error" sx={{ fontFamily: 'Space Mono, monospace' }}>
          [ 404 ] LINK SEVERED. ALIEN NOT FOUND IN CITADEL DATABASE.
        </Typography>
        <Button onClick={() => navigate('/products')} sx={{ mt: 2, color: 'var(--green-portal)' }}>
          Return to Hub
        </Button>
      </Box>
    );
  }

  return (
    <Box className={styles.pageWrapper}>
      {/* Top Bar Navigation */}
      <Box className={styles.topBar}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate('/products')}
          className={styles.backBtn}
        >
          BACK TO GRID
        </Button>
      </Box>

      {/* Main Analysis Card */}
      <Box className={styles.cardPanel}>
        
        {/* Left: Hologram Display */}
        <Box className={styles.imageSection}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height="100%" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
          ) : (
            <>
              <img src={character?.image} alt={character?.name} className={styles.alienImg} />
              
              {/* Floating Whitelist Button Hovering on Image */}
              <IconButton 
                onClick={handleToggleFavorite}
                className={`${styles.whitelistOverlay} ${isFavorite ? styles.whitelistBtnActive : styles.whitelistBtnInactive}`}
                size="large"
              >
                {isFavorite ? <FavoriteIcon fontSize="large" /> : <FavoriteBorderIcon fontSize="large" />}
              </IconButton>
            </>
          )}
        </Box>

        {/* Right: Scientific Metadata */}
        <Box className={styles.infoSection}>
          {isLoading ? (
            <>
              <Skeleton width="40%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2 }} />
              <Skeleton width="80%" height={80} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 4 }} />
              <Skeleton width="30%" height={40} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 4 }} />
              <Divider sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />
              <Box className={styles.metadataGrid}>
                <Skeleton width="100%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                <Skeleton width="100%" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
              </Box>
            </>
          ) : (
            <>
              <Box className={styles.supertitle}>
                ENTITY ID // {character?.id.toString().padStart(4, '0')}
              </Box>
              
              <Box component="h1" className={styles.alienName}>
                {character?.name.toUpperCase()}
              </Box>

              <Box className={styles.statusWrapper}>
                <Chip 
                  label={`STATUS: ${character?.status.toUpperCase()}`}
                  className={styles.statusPill}
                  icon={
                    <Box sx={{ 
                      width: 8, height: 8, borderRadius: '50%', ml: 1,
                      bgcolor: character?.status === 'Alive' ? '#97ce4c' : 
                               character?.status === 'Dead' ? '#ff4d4d' : '#f39c12',
                      boxShadow: `0 0 8px ${character?.status === 'Alive' ? '#97ce4c' : character?.status === 'Dead' ? '#ff4d4d' : '#f39c12'}`
                    }} />
                  }
                />
                
                {isFavorite && (
                  <Chip 
                    label="IN WHITELIST"
                    className={styles.statusPill}
                    icon={<FavoriteIcon sx={{ fontSize: 16, color: '#97ce4c !important' }} />}
                  />
                )}
              </Box>

              <Divider className={styles.divider} />

              {/* Grid de Metadatos Cientificos */}
              <Box className={styles.metadataGrid}>
                <Box className={styles.metaBox}>
                  <Box className={styles.metaLabel}>Species Sub-Class</Box>
                  <Box className={styles.metaValue}>{character?.species}</Box>
                </Box>
                
                <Box className={styles.metaBox}>
                  <Box className={styles.metaLabel}>Extraterrestrial Type</Box>
                  <Box className={styles.metaValue}>{character?.type || 'Unknown Classification'}</Box>
                </Box>
                
                <Box className={styles.metaBox}>
                  <Box className={styles.metaLabel}>Gender</Box>
                  <Box className={styles.metaValue}>{character?.gender}</Box>
                </Box>
                
                <Box className={styles.metaBox}>
                  <Box className={styles.metaLabel}>Planet of Origin</Box>
                  <Box className={styles.metaValue}>{character?.origin.name}</Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
