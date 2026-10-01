import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MathRenderingProvider } from './components/shared/MathRenderingProvider';
import { ExamTreeAdminGate } from './integrations/ExamTreeAdminGate';
import './index.css';

const chunkReloadKey = 'examtree-admin-chunk-reload-at';
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = Number(sessionStorage.getItem(chunkReloadKey) ?? '0');
  if (Date.now() - lastReload > 10_000) {
    sessionStorage.setItem(chunkReloadKey, String(Date.now()));
    window.location.reload();
  }
});
window.setTimeout(() => sessionStorage.removeItem(chunkReloadKey), 15_000);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MathRenderingProvider>
      <ExamTreeAdminGate>
        <App />
      </ExamTreeAdminGate>
    </MathRenderingProvider>
  </StrictMode>,
);
