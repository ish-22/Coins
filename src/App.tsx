import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { SessionTimeoutManager } from './components/common/SessionTimeoutManager'

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SessionTimeoutManager />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
