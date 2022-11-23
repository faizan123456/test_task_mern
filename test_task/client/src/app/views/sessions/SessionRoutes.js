import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const NotFound = Loadable(lazy(() => import('./NotFound')));
const ForgotPassword = Loadable(lazy(() => import('./ForgotPassword')));
const ResetPassword = Loadable(lazy(() => import('./ResetPassword')));
const Login = Loadable(lazy(() => import('./Login')));
const Register = Loadable(lazy(() => import('./Register')));

const sessionRoutes = [
  { path: '/signup', element: <Register /> },
  { path: '/signin', element: <Login /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/404', element: <NotFound /> },
];

export default sessionRoutes;
