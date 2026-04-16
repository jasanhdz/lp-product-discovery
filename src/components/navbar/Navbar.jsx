import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/sessionSlice'
import { AppBar, Toolbar, Box, Typography, Avatar, Button } from '@mui/material'
import { RocketLaunch, Logout } from '@mui/icons-material'
import styles from './Navbar.module.scss'

export function Navbar() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.session)

  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Toolbar className={styles.toolbar} disableGutters>
        
        {/* LOGO IZQUIERDO */}
        <Box className={styles.logoGroup}>
          <Box className={styles.logoIcon}>
            <RocketLaunch sx={{ fontSize: '1.2rem' }} />
          </Box>
          <Box className={styles.logoWordmark}>
            <Typography className={styles.logoTitle}>DESCUBRIMIENTO</Typography>
            <Typography className={styles.logoSub}>Portal Ciudadela</Typography>
          </Box>
        </Box>

        {/* ESTATUS CENTRAL */}
        <Box className={styles.missionBadge}>
          <div className={styles.missionDot} />
          Misión Activa
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
