import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // <StrictMode> //when strict mode is on,in development ,react runs setup and cleanup one extra time before the actual setup
    <App />
  // </StrictMode>,
)
