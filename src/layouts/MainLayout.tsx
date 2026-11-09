import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { MobileDrawer } from './MobileDrawer'
import { Footer } from './Footer'
import { LayoutProvider, useLayout } from '@/context/LayoutContext'
import { useAuth } from '@/context/AuthContext'
import { AlertTriangle, ShieldAlert, LifeBuoy } from 'lucide-react'

export const MainLayoutContent: React.FC = () => {
  const { isSidebarCollapsed } = useLayout()
  const { user } = useAuth()

  const isRestricted = user?.accountStatus === 'suspended' || user?.accountStatus === 'blocked'

  return (
    <div className="min-h-screen flex w-full bg-cp-bg text-cp-text-primary selection:bg-cp-gold/30 selection:text-cp-gold overflow-hidden">
      {/* 1. Desktop Fixed/Collapsible Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content & Header Column */}
      <div
        className={[
          'flex-1 flex flex-col min-w-0 min-h-screen relative overflow-y-auto',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64 xl:pl-72',
        ].join(' ')}
      >
        {/* Top Header */}
        <Header />

        {/* Global Account Status Banner (when Admin changes user status to Suspended/Blocked) */}
        {isRestricted && (
          <div className="w-full bg-red-500/15 border-b border-red-500/30 px-4 sm:px-6 py-3 flex items-center justify-between text-xs sm:text-sm text-red-400">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 animate-pulse" />
              <span>
                <strong>Account {user?.accountStatus === 'blocked' ? 'Blocked' : 'Suspended'}:</strong> Access to trading, deposits, and asset withdrawals has been restricted by administration.
              </span>
            </div>
            <Link
              to="/support"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded font-medium transition-colors text-xs flex-shrink-0 ml-4"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>Contact Support</span>
            </Link>
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28 lg:pb-12">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />

        {/* 3. Mobile 5-item Bottom Navigation */}
        <BottomNav />

        {/* 4. Mobile Slide-out Drawer Menu */}
        <MobileDrawer />
      </div>
    </div>
  )
}

export const MainLayout: React.FC = () => {
  return (
    <LayoutProvider>
      <MainLayoutContent />
    </LayoutProvider>
  )
}

export default MainLayout
