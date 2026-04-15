import { Route, Routes } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes'
import NotFound from '@/pages/NotFound'
import PublicRoute from './PublicRouter'
import PrivateRoute from './PrivateRouter'
import RootRoute from './RootRouter'

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<RootRoute />} />
      {publicRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PublicRoute>
              <route.component />
            </PublicRoute>
          }
        />
      ))}
      {privateRoutes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute>
              <route.component />
            </PrivateRoute>
          }
        />
      ))}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
