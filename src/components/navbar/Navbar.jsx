import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/sessionSlice'
import { clearFavorites } from '@/store/slices/whitelistSlice'
import { AppBar, Toolbar, Box, Typography, Avatar, Button } from '@mui/material'
import { RocketLaunch, Logout, Favorite, Assignment } from '@mui/icons-material'
import styles from './Navbar.module.scss'
import { supabase } from '@/lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

export function Navbar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.session)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    dispatch(clearFavorites())
    dispatch(logout())
  }

  const getAvatarUrl = () => {
    if (user?.avatar_url) return user.avatar_url

    const seed = user?.id || 'alien'
    const species = (user?.species || '').toLowerCase()
    if (species === 'human' || species === 'humanoid') {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
    }
    if (species === 'robot') {
      return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
    }
    if (species.includes('mythological')) {
      return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`
    }
    if (species === 'cronenberg') {
      return `https://api.dicebear.com/7.x/croodles/svg?seed=${seed}`
    }
    return `https://api.dicebear.com/7.x/big-ears/svg?seed=${seed}`
  }

  return (
    <AppBar position='sticky' elevation={0} className={styles.appBar}>
      <Toolbar className={styles.toolbar} disableGutters>
        {}
        <Box className={styles.logoGroup} onClick={() => navigate('/products')} sx={{ cursor: 'pointer' }}>
          <Box className={styles.logoIcon}>
            <RocketLaunch sx={{ fontSize: '1.2rem' }} />
          </Box>
          <Box className={styles.logoWordmark}>
            <Typography className={styles.logoTitle}>BASE CITADEL</Typography>
            <Typography className={styles.logoSub}>Descubrimiento Alienígena</Typography>
          </Box>
        </Box>

        {}
        <Box className={styles.navLinksContainer}>
          <Box
            className={styles.missionBadge}
            sx={{ cursor: 'pointer', opacity: location.pathname === '/products' ? 1 : 0.6 }}
            onClick={() => navigate('/products')}
          >
            <div className={styles.missionDot} />
            <span className={styles.badgeLabel}>CATÁLOGO</span>
          </Box>

          <Box
            className={styles.missionBadge}
            sx={{
              cursor: 'pointer',
              background: location.pathname === '/whitelist' ? 'rgba(151, 206, 76, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              color: location.pathname === '/whitelist' ? '#97ce4c' : 'rgba(255,255,255,0.7)',
              borderColor: location.pathname === '/whitelist' ? 'rgba(151, 206, 76, 0.4)' : 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => navigate('/whitelist')}
          >
            <Favorite sx={{ fontSize: '1rem', mb: '2px' }} className={styles.badgeIcon} />
            <span className={styles.badgeLabel}>FAVORITOS</span>
          </Box>

          <Box
            className={styles.missionBadge}
            sx={{
              cursor: 'pointer',
              background:
                location.pathname === '/products/new' ? 'rgba(151, 206, 76, 0.1)' : 'rgba(255, 255, 255, 0.02)',
              color: location.pathname === '/products/new' ? '#97ce4c' : 'rgba(255,255,255,0.7)',
              borderColor:
                location.pathname === '/products/new' ? 'rgba(151, 206, 76, 0.4)' : 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={() => navigate('/products/new')}
          >
            <Assignment sx={{ fontSize: '1rem', mb: '2px' }} className={styles.badgeIcon} />
            <span className={styles.badgeLabel}>NUEVA MISIÓN</span>
          </Box>
        </Box>

        {}
        <Box className={styles.rightGroup}>
          <Typography className={styles.pilotName}>{user?.name || 'Vagabundo'}</Typography>

          <Avatar className={styles.avatar} src={getAvatarUrl()} />

          <Button
            onClick={() => handleLogout()}
            startIcon={<Logout sx={{ fontSize: '1rem !important' }} />}
            className={styles.logoutBtn}
          >
            Desconectar
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
