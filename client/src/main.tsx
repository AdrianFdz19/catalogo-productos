import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AppProvider from './context/AppProvider.tsx'

createRoot(document.getElementById('root')!).render(
  
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  
)
