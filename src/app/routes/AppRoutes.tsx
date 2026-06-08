import { createBrowserRouter, Navigate } from 'react-router';
import App from '@/app/App';
import { EditAdvancedPage } from '@/app/pages/EditAdvancedPage';
import { EditPage } from '@/app/pages/EditPage';
import { LibraryPage } from '@/app/pages/LibraryPage';
import { HOME_ROUTE } from '@/app/routes/paths';

export const appRouter = createBrowserRouter([
  {
    path: HOME_ROUTE,
    element: <App />,
    children: [
      {
        index: true,
        element: <LibraryPage />,
      },
      {
        path: 'edit',
        element: <EditPage />,
      },
      {
        path: 'edit/advanced',
        element: <EditAdvancedPage />,
      },
      {
        path: '*',
        element: <Navigate to={HOME_ROUTE} replace />,
      },
    ],
  },
]);
