import React, { createContext, useContext, useState, useEffect } from 'react'

export interface LayoutContextValue {
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  isMobileDrawerOpen: boolean
  openMobileDrawer: () => void
  closeMobileDrawer: () => void
  isSearchOpen: boolean
  setSearchOpen: (open: boolean) => void
  toggleSearch: () => void
}

const LayoutContext = createContext<LayoutContextValue | undefined>(undefined)

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('cp_sidebar_collapsed')
      return saved ? JSON.parse(saved) : false
    } catch {
      return false
    }
  })

  const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)

  // Persist sidebar state
  useEffect(() => {
    try {
      localStorage.setItem('cp_sidebar_collapsed', JSON.stringify(isSidebarCollapsed))
    } catch {
      // ignore
    }
  }, [isSidebarCollapsed])

  // Close mobile drawer on ESC key and window resize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false)
        setSearchOpen(false)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileDrawerOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileDrawerOpen])

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  const openMobileDrawer = () => setMobileDrawerOpen(true)
  const closeMobileDrawer = () => setMobileDrawerOpen(false)
  const toggleSearch = () => setSearchOpen((prev) => !prev)

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        setSidebarCollapsed,
        isMobileDrawerOpen,
        openMobileDrawer,
        closeMobileDrawer,
        isSearchOpen,
        setSearchOpen,
        toggleSearch,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout(): LayoutContextValue {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
