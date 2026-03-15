import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'rich-text-editor-ndevu/styles';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
