import AuthGuard from 'app/auth/AuthGuard';
import privateRoutes from 'app/views/PrivateRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...privateRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="/dashboard" /> },
  { path: '*', element: <NotFound /> },
];

export default routes;
