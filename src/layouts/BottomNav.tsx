import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { MOBILE_BOTTOM_NAV_ITEMS } from '@/routes/navItems'

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cp-card/95 backdrop-blur-xl border-t border-cp-border select-none touch-manipulation pb-[max(env(safe-area-inset-bottom),4px)]"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
        {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isProminent = item.isProminent

          return (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center flex-1 h-full py-1 text-center relative transition-all duration-200',
                  isActive
                    ? 'text-cp-gold'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isProminent ? (
                    /* Prominent Center Trade Button */
                    <div className="relative -top-3 flex flex-col items-center">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 shadow-card',
                          isActive
                            ? 'bg-gold-gradient text-cp-bg shadow-gold-md scale-105 ring-4 ring-cp-card'
                            : 'bg-cp-elevated text-cp-gold border border-cp-gold/40 hover:scale-105'
                        )}
                      >
                        <Icon className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <span
                        className={cn(
                          'text-[10px] font-bold mt-0.5 tracking-tight',
                          isActive ? 'text-cp-gold' : 'text-cp-text-secondary'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  ) : (
                    /* Standard Tab Button */
                    <>
                      {/* Active Top Bar Indicator */}
                      {isActive && (
                        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-cp-gold rounded-full shadow-[0_0_8px_#F0B93A]" />
                      )}

                      <Icon
                        className={cn(
                          'w-5 h-5 transition-transform duration-200',
                          isActive ? 'scale-110 text-cp-gold' : 'text-cp-text-muted'
                        )}
                      />
                      <span
                        className={cn(
                          'text-[10px] mt-1 font-medium tracking-tight truncate max-w-[60px]',
                          isActive ? 'font-bold text-cp-gold' : 'text-cp-text-secondary'
                        )}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
