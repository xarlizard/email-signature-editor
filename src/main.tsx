import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './i18n';
import { UserProvider } from './app/contexts/UserContext';
import { appRouter } from './app/routes/AppRoutes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={appRouter} />
    </UserProvider>
  </StrictMode>
);
