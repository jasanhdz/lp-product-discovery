import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/sessionSlice'
import { AppBar, Toolbar, Box, Typography, Avatar, Button } from '@mui/material'
import { RocketLaunch, Logout, Favorite } from '@mui/icons-material'
import styles from './Navbar.module.scss'

import { useNavigate, useLocation } from 'react-router-dom'

export function Navbar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.session)
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Toolbar className={styles.toolbar} disableGutters>
        
        {/* LOGO IZQUIERDO */}
        <Box className={styles.logoGroup} onClick={() => navigate('/products')} sx={{ cursor: 'pointer' }}>
          <Box className={styles.logoIcon}>
            <RocketLaunch sx={{ fontSize: '1.2rem' }} />
          </Box>
          <Box className={styles.logoWordmark}>
            <Typography className={styles.logoTitle}>CITADEL DB</Typography>
            <Typography className={styles.logoSub}>Alien Discovery</Typography>
          </Box>
        </Box>

        {/* ESTATUS CENTRAL */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box 
            className={styles.missionBadge} 
            sx={{ cursor: 'pointer', opacity: location.pathname === '/products' ? 1 : 0.6 }}
            onClick={() => navigate('/products')}
          >
            <div className={styles.missionDot} />
            GRID
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
            <Favorite sx={{ fontSize: '1rem', mr: 1, mb: '2px' }} />
            WHITELIST
          </Box>
        </Box>

        {/* USUARIO DERECHO */}
        <Box className={styles.rightGroup}>
          <Typography className={styles.pilotName}>
            {user?.name || 'Viajero'}
          </Typography>
          
          <Avatar 
            className={styles.avatar} 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'alien'}`} 
          />
          
          <Button 
            onClick={() => dispatch(logout())}
            startIcon={<Logout sx={{ fontSize: '1rem !important' }}/>}
            className={styles.logoutBtn}
          >
            Abortar
          </Button>
        </Box>

      </Toolbar>
    </AppBar>
  )
}
