import { createRoot } from 'react-dom/client'
import '@/index.css'
import App from '@/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext.jsx'
import { WidthProvider } from '@/contexts/WidthContext.jsx'
import { HeightProvider } from '@/contexts/HeightContext.jsx'
import { RouteProvider } from '@/contexts/RouteContext.jsx'
import { AppProvider } from './contexts/AppContext'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <WidthProvider>
        <HeightProvider>
          <RouteProvider>
            <AppProvider>
              <App />
            </AppProvider>
          </RouteProvider>
        </HeightProvider>
      </WidthProvider>
    </AuthProvider>
  </BrowserRouter>
)
