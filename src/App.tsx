import { AuthProvider } from '@/contexts/AuthContext';
import { store } from '@/store';
import { Provider } from 'react-redux';
import Router from './routes';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </Provider>
  );
}

export default App;
