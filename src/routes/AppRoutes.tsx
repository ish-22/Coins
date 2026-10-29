import React, { Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { AdminLayout } from '@/layouts/admin'
import { ProtectedRoute } from '@/routes/ProtectedRoute'

// Core & Customer Pages (Lazy Loaded)
const Landing = lazy(() => import('@/pages/Landing').then((m) => ({ default: m.Landing })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Markets = lazy(() => import('@/pages/Markets').then((m) => ({ default: m.Markets })))
const Trade = lazy(() => import('@/pages/Trade').then((m) => ({ default: m.Trade })))
const Assets = lazy(() => import('@/pages/Assets').then((m) => ({ default: m.Assets })))
const Orders = lazy(() => import('@/pages/Orders').then((m) => ({ default: m.Orders })))
const Deposit = lazy(() => import('@/pages/Deposit').then((m) => ({ default: m.Deposit })))
const Withdraw = lazy(() => import('@/pages/Withdraw').then((m) => ({ default: m.Withdraw })))
const Watchlist = lazy(() => import('@/pages/Watchlist').then((m) => ({ default: m.Watchlist })))
const Account = lazy(() => import('@/pages/Account').then((m) => ({ default: m.Account })))
const KYC = lazy(() => import('@/pages/KYC').then((m) => ({ default: m.KYC })))
const Settings = lazy(() => import('@/pages/Settings').then((m) => ({ default: m.Settings })))
const Notifications = lazy(() => import('@/pages/Notifications').then((m) => ({ default: m.Notifications })))
const Support = lazy(() => import('@/pages/Support').then((m) => ({ default: m.Support })))
const Help = lazy(() => import('@/pages/Help').then((m) => ({ default: m.Help })))
const Fees = lazy(() => import('@/pages/Fees').then((m) => ({ default: m.Fees })))
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const Status = lazy(() => import('@/pages/Status').then((m) => ({ default: m.Status })))
const Terms = lazy(() => import('@/pages/Terms').then((m) => ({ default: m.Terms })))
const Privacy = lazy(() => import('@/pages/Privacy').then((m) => ({ default: m.Privacy })))
const RiskDisclosure = lazy(() => import('@/pages/RiskDisclosure').then((m) => ({ default: m.RiskDisclosure })))
const Compliance = lazy(() => import('@/pages/Compliance').then((m) => ({ default: m.Compliance })))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/Register').then((m) => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })))
const DesignSystemPreview = lazy(() => import('@/pages/DesignSystemPreview').then((m) => ({ default: m.DesignSystemPreview })))


// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers').then((m) => ({ default: m.AdminUsers })))
const AdminKYC = lazy(() => import('@/pages/admin/AdminKYC').then((m) => ({ default: m.AdminKYC })))
const AdminDeposits = lazy(() => import('@/pages/admin/AdminDeposits').then((m) => ({ default: m.AdminDeposits })))
const AdminWithdrawals = lazy(() => import('@/pages/admin/AdminWithdrawals').then((m) => ({ default: m.AdminWithdrawals })))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })))
const AdminSupport = lazy(() => import('@/pages/admin/AdminSupport').then((m) => ({ default: m.AdminSupport })))
const AdminAnnouncements = lazy(() => import('@/pages/admin/AdminAnnouncements').then((m) => ({ default: m.AdminAnnouncements })))
const AdminAssets = lazy(() => import('@/pages/admin/AdminAssets').then((m) => ({ default: m.AdminAssets })))
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings').then((m) => ({ default: m.AdminSettings })))
const AdminAuditLogs = lazy(() => import('@/pages/admin/AdminAuditLogs').then((m) => ({ default: m.AdminAuditLogs })))

const RouteLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center min-h-[40vh] w-full">
    <div className="w-8 h-8 rounded-full border-2 border-cp-gold border-t-transparent animate-spin" />
  </div>
)

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* ── Public landing and auth pages (standalone, no app shell) ── */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/* ── Standalone Admin Login (no admin layout) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Administration Console Routes ── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="kyc" element={<AdminKYC />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="support" element={<AdminSupport />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="assets" element={<AdminAssets />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* ── Customer App shell routes (sidebar + header layout) ── */}
        <Route path="/" element={<MainLayout />}>
          {/* Core & Trading Routes (Publicly previewable vs Protected) */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="markets" element={<Markets />} />
          <Route path="trade" element={<Trade />} />
          <Route
            path="watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />

          {/* Finance & Wallet Routes (Protected) */}
          <Route
            path="wallet"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route
            path="assets"
            element={
              <ProtectedRoute>
                <Assets />
              </ProtectedRoute>
            }
          />
          <Route path="earn" element={<Navigate to="/wallet" replace />} />
          <Route
            path="orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="deposit"
            element={
              <ProtectedRoute>
                <Deposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="withdraw"
            element={
              <ProtectedRoute>
                <Withdraw />
              </ProtectedRoute>
            }
          />

          {/* Account & Security Routes (Protected) */}
          <Route
            path="account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="kyc"
            element={
              <ProtectedRoute>
                <KYC />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Support & System Routes (Public) */}
          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="support" element={<Support />} />
          <Route path="help" element={<Help />} />
          <Route path="fees" element={<Fees />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="status" element={<Status />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="risk-disclosure" element={<RiskDisclosure />} />
          <Route path="compliance" element={<Compliance />} />

          {/* Design System Foundation Showcase */}
          <Route path="design-system" element={<DesignSystemPreview />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
