import { Provider } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { ToastContainer } from 'react-toastify';

import { Store } from './redux/Store';
import routes from './routes';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const authRoutes = useRoutes(routes);

  return (
    <Provider store={Store}>
      <MatxTheme>
        <AuthProvider>{authRoutes}</AuthProvider>
      </MatxTheme>
      <ToastContainer />
    </Provider>
  );
};

export default App;
