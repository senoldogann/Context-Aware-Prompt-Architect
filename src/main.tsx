import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Theme'i localStorage'dan yükle ve uygula (React render edilmeden önce)
const getInitialTheme = (): 'dark' | 'light' => {
  const saved = localStorage.getItem('prompt-architect-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  // Sistem tercihini kontrol et
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

// Theme'i uygula
const initialTheme = getInitialTheme();
document.documentElement.classList.remove('light', 'dark');
document.documentElement.classList.add(initialTheme);
document.body.classList.remove('light', 'dark');
document.body.classList.add(initialTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);

