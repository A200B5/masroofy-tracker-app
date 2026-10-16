import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/design-system.css';
import './styles/app.css';
import { LanguageProvider } from './context/LanguageContext';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for offline PWA capabilities
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>
);
