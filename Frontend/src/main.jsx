import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import "@fortawesome/fontawesome-free/css/all.min.css";
// import { AuthProvider } from './Context/AuthContext.jsx'
import {Provider} from 'react-redux'
import { store } from './redux/Store.jsx';

createRoot(document.getElementById('root')).render(
<Provider store={store}>
  {/* <AuthProvider> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  {/* </AuthProvider> */}
  </Provider>
)
