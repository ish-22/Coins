import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { MobileDrawer } from './MobileDrawer'
import { Footer } from './Footer'
import { LayoutProvider, useLayout } from '@/context/LayoutContext'

export const MainLayoutContent: React.FC = () => {
  const { isSidebarCollapsed } = useLayout()

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
