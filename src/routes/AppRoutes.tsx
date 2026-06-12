import { createBrowserRouter, Navigate } from 'react-router';
import App from '@/App';
import SignatureEditPage from '@/pages/signatures-edit/SignatureEditPage';
import TemplateEditPage from '@/pages/templates-edit/TemplateEditPage';
import TemplatesPage from '@/pages/templates/TemplatesPage';
import SignaturesPage from '@/pages/signatures/SignaturesPage';
import HomePage from '@/pages/home/HomePage';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'signatures',
        element: <SignaturesPage />,
      },
      {
        path: 'signatures/edit',
        element: <SignatureEditPage />,
      },
      {
        path: 'templates',
        element: <TemplatesPage />,
      },
      {
        path: 'templates/edit',
        element: <TemplateEditPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

