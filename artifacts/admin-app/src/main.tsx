import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ExamTreeAdminGate } from './integrations/ExamTreeAdminGate';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExamTreeAdminGate>
      <App />
    </ExamTreeAdminGate>
  </StrictMode>,
);
