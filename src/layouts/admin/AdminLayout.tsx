import React, { useState, useEffect } from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { Info, X, ShieldAlert } from 'lucide-react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

export const AdminLayout: React.FC = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Mock Authentication Guard: Check sessionStorage
  const isAuth = sessionStorage.getItem('cp_admin_auth') === 'true'
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080b12] text-cp-text-primary selection:bg-cp-gold/30 selection:text-cp-gold">
      {/* 1. TOP DEMONSTRATION WARNING BANNER */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/60 to-amber-950/80 border-b border-amber-500/30 px-4 py-2 text-center text-xs text-amber-200 flex items-center justify-center gap-2 select-none shadow-sm z-40">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-semibold tracking-wide">
          Demonstration Administration Interface:
        </span>
        <span className="text-amber-200/90 hidden sm:inline">
          All users, KYC files, queues, deposits, and orders are simulated mock records. No real financial transactions are executed.
        </span>
      </div>

      <div className="flex-1 flex min-w-0">
        {/* 2. DESKTOP ADMIN SIDEBAR */}
        <AdminSidebar />

        {/* 3. MOBILE SLIDE-OUT DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide Drawer */}
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#0c121c] z-50 animate-fadeIn">
              <div className="absolute top-3 right-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AdminSidebar onItemClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* 4. MAIN ADMIN CONTENT WORKSPACE */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          <AdminHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
