import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './lib/i18n';
import { UserProvider } from './contexts/UserContext';
import { appRouter } from './routes/AppRoutes';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={appRouter} />
    </UserProvider>
  </StrictMode>
);
