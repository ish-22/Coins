import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '@/layouts'
import { AdminLayout } from '@/layouts/admin'
import {
  Landing,
  Dashboard,
  Markets,
  Trade,
  Assets,
  Orders,
  Deposit,
  Withdraw,
  Watchlist,
  Account,
  KYC,
  Settings,
  Notifications,
  Support,
  Help,
  Fees,
  About,
  Contact,
  Status,
  Terms,
  Privacy,
  RiskDisclosure,
  Compliance,
  Login,
  Register,
  ForgotPassword,
  DesignSystemPreview,
} from '@/pages'
import {
  AdminLogin,
  AdminDashboard,
  AdminUsers,
  AdminKYC,
  AdminDeposits,
  AdminWithdrawals,
  AdminOrders,
  AdminSupport,
  AdminAnnouncements,
  AdminAssets,
  AdminSettings,
  AdminAuditLogs,
} from '@/pages/admin'

import { ProtectedRoute } from '@/routes/ProtectedRoute'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ── Public landing and auth pages (standalone, no app shell) ── */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
  )
}

export default AppRoutes
