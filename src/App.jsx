import { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Router from '@/router'
import LoaderPage from './pages/Loader'

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderPage />}>
        <Router />
      </Suspense>
    </BrowserRouter>
  )
}
