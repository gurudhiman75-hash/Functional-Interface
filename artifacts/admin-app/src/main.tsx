import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AdminMathJax } from './components/shared/AdminMathJax';
import { ExamTreeAdminGate } from './integrations/ExamTreeAdminGate';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminMathJax>
      <ExamTreeAdminGate>
        <App />
      </ExamTreeAdminGate>
    </AdminMathJax>
  </StrictMode>,
);
