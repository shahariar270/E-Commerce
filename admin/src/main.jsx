import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import store from './store'
import App from './App.jsx'
import './assets/styles/global.scss';
import './assets/icon/style.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>
  // </StrictMode>,
)
