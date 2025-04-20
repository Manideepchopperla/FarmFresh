import { Route, Routes } from 'react-router-dom'
import './App.css'
import Products from './components/Products'
import Login from './components/Login'
import { BrowserRouter } from 'react-router-dom'
import OrderPage from './components/OrderPage'
import TrackOrderPage from './components/TrackOrder'
import AdminPage from './components/Admin'
import NotFound from './components/NotFound'
import UserPage from './components/User'
import { Toaster } from 'sonner'

function App() {
  return (
    
      <BrowserRouter basename="/">
        <Toaster position="top-center" toastOptions={{
          success: {
            className: 'bg-green-600 text-white',
          },
          error: {
            className: 'bg-red-600 text-white',
          },
        }} />
        <Routes>
            <Route path='/' element={<Products />} />
            <Route path="login" element={<Login />} />
            <Route path="order" element={<OrderPage />} />
            <Route path="track" element={<TrackOrderPage />} />
            <Route path="admin" element={<AdminPage />}/>
            <Route path="user" element={<UserPage />}/>
            <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
