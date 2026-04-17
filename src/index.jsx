import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { store } from '@/store'
import App from '@/App'
import '@/styles/global.scss'

const root = createRoot(document.getElementById('root'))
root.render(
  <HelmetProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </HelmetProvider>
)
