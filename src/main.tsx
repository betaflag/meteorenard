import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react";
import './index.css'
import App from './App.tsx'

Sentry.init({
  dsn: "https://f1bc95b06e56afe6aba3737974a5754d@o4510278539214848.ingest.us.sentry.io/4510278540001280",
  sendDefaultPii: true
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
