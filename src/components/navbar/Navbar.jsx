import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material'
import { Logout, RocketLaunch } from '@mui/icons-material'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout } from '@/store/slices/sessionSlice'
import styles from './Navbar.module.scss'

export function Navbar() {
  const dispatch = useAppDispatch()
  
  // Leemos en vivo del estado global de Redux al usuario logueado
  const { user } = useAppSelector(state => state.session)

  const handleLogout = () => {
    // Al ejecutar este dispatch, Redux destruye el Session y AuthRoutes nos patea al SignIn :)
    dispatch(logout())
  }

  return (
    <AppBar position="sticky" elevation={0} className={styles.appBar}>
      <Toolbar className={styles.toolbar}>
        
        {/* Marca/Logo */}
        <Box display="flex" alignItems="center" gap={1}>
          <RocketLaunch className={styles.iconLogo} />
          <Typography variant="h6" component="div" fontWeight="800" sx={{ letterSpacing: '0.05em' }}>
            DISCOVERY
          </Typography>
        </Box>

        {/* Perfil de Usuario y Logout */}
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ opacity: 0.8, display: { xs: 'none', sm: 'block' } }}>
            Misión activa, {user?.name || 'Piloto'}
          </Typography>
          
          <Avatar className={styles.avatar} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`} />
          
          <Button 
            color="inherit" 
            onClick={handleLogout} 
            startIcon={<Logout />}
            className={styles.logoutBtn}
          >
            Abortar
          </Button>
        </Box>
        
      </Toolbar>
    </AppBar>
  )
}
