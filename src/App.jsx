import { Suspense, useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'
import { useAppDispatch } from '@/store/hooks'
import { finishSessionLoading, loginSuccess } from '@/store/slices/sessionSlice'
import { storage } from '@/utils/storage'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const savedToken = storage.getToken()
    const savedUser = storage.getUserFromToken()

    if (savedToken && savedUser) {
      dispatch(loginSuccess({ user: savedUser, token: savedToken }))
    }

    dispatch(finishSessionLoading())
  }, [])

  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderPage />}>
        <Router />
      </Suspense>
    </BrowserRouter>
  )
}
