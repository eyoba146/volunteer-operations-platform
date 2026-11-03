import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fontsource Typography Packages: Bricolage Grotesque (Headlines) & Hanken Grotesk (Body)
import '@fontsource/bricolage-grotesque/600.css';
import '@fontsource/bricolage-grotesque/700.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/hanken-grotesk/400.css';
import '@fontsource/hanken-grotesk/500.css';
import '@fontsource/hanken-grotesk/600.css';
import '@fontsource/hanken-grotesk/700.css';

import './index.css'
import App from './App.tsx'
import { initGlobalRipple } from './utils/ripple'

// Initialize delegated Material-style ripple effect across all buttons and interactive controls
initGlobalRipple();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
