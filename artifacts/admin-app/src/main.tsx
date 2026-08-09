import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MathRenderingProvider } from './components/shared/MathRenderingProvider';
import { ExamTreeAdminGate } from './integrations/ExamTreeAdminGate';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MathRenderingProvider>
      <ExamTreeAdminGate>
        <App />
      </ExamTreeAdminGate>
    </MathRenderingProvider>
  </StrictMode>,
);
