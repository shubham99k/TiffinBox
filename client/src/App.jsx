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
import PostMenu from './pages/cook/PostMenu'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingCooks from './pages/admin/PendingCooks'

// Customer Pages
import Home from './pages/customer/Home'
import CookPublicProfile from './pages/customer/CookPublicProfile'

// Order Pages
import PlaceOrder from './pages/customer/PlaceOrder'
import OrderHistory from './pages/customer/OrderHistory'
import CookOrders from './pages/cook/CookOrders'

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
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />

        {/* Cook */}
        <Route path='/cook/setup' element={<CookProfileSetup />} />
        <Route path='/cook/dashboard' element={<CookDashboard />} />
        <Route path='/cook/post-menu' element={<PostMenu />} />


        {/* Admin */}
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/pending-cooks' element={<PendingCooks />} />

        {/* Customer */}
        <Route path='/home' element={<Home />} />
        <Route path='/cook/:id' element={<CookPublicProfile />} />

        {/* Orders */}
        <Route path='/orders/place' element={<PlaceOrder />} />
        <Route path='/orders/my' element={<OrderHistory />} />
        <Route path='/cook/orders' element={<CookOrders />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App