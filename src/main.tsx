import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import { Toast } from '@heroui/react';
import './styles.css';

const KitDocsSite = lazy(() => import('./features/ui-kit/KitDocsSite'));
const StandaloneShellPreview = lazy(() => import('./features/ui-kit/StandaloneShellPreview'));

const pathClean = window.location.pathname.replace(/\/+$/, "");
const isShellPreview = pathClean.endsWith("/preview/app-shell");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<div className="min-h-screen" style={{ background: "var(--canvas)" }} />}>
      {isShellPreview ? <StandaloneShellPreview /> : <KitDocsSite />}
    </Suspense>
    <Toast.Provider placement="bottom end" />
  </React.StrictMode>
);
