import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './store'
import App from './App.jsx'
import './assets/styles/global.scss';
import './assets/icon/style.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Root = () => {
  const app = (
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  );

  return googleClientId
    ? <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
    : app;
};

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Root />
  // </StrictMode>,
)
