import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const Dashboard = Loadable(lazy(() => import('./dashboard')));
const Users = Loadable(lazy(() => import('./users')));
const UserDetails = Loadable(lazy(() => import('./userDetails')));

const privateRoutes = [
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/users', element: <Users /> },
  { path: '/user/:id', element: <UserDetails /> },
];

export default privateRoutes;
