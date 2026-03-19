import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOTP from './pages/auth/VerifyOTP'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'

// Cook Pages
import CookProfileSetup from './pages/cook/CookProfileSetup'
import CookDashboard from './pages/cook/CookDashboard'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingCooks from './pages/admin/PendingCooks'

function App() {
  const { user } = useSelector((state) => state.auth)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />

        {/* Auth */}
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/verify-otp' element={<VerifyOTP />} />
        <Route path='/home' element={<div style={{ padding: '40px', fontFamily: 'Geist', fontSize: '24px', fontWeight: 700 }}>🍱 Customer Home — Coming Soon!</div>} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Cook */}
        <Route path='/cook/setup' element={<CookProfileSetup />} />
        <Route path='/cook/dashboard' element={<CookDashboard />} />

        {/* Admin */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/pending-cooks' element={<PendingCooks />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App