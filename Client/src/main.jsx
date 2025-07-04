import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { appStore, persistor } from './utils/appStore.jsx'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

ReactDOM.createRoot(document.getElementById('root')).render(
   <React.StrictMode>
     <Provider store={appStore}>
        <PersistGate loading={null} persistor={persistor}>
           <App />
       </PersistGate>
     </Provider>
   </React.StrictMode>

)
