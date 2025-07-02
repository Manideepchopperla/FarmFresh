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
import ProtectedRoute from './ProtectedRoute'
import Success from './components/PaymentSuccess'
import Cancel from './components/PaymentCancel'

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
          <Route path='/' element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />

          <Route path="order" element={
            <ProtectedRoute><OrderPage /></ProtectedRoute>
          } />
          <Route path="track" element={
            <ProtectedRoute><TrackOrderPage /></ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute><AdminPage /></ProtectedRoute>
           } />
          <Route path="user" element={
            <ProtectedRoute><UserPage /></ProtectedRoute>
          } />
          <Route path="success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />


          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
  )
}

export default App
