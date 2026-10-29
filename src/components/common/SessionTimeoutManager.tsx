import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldAlert, LogOut, RefreshCw } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/common/Button'

/**
 * Handles automatic inactivity timeout for authenticated user sessions.
 * Inactivity is tracked via user interaction events (mousemove, keydown, click, scroll, touchstart).
 * Warning modal appears 60 seconds before termination, allowing the user to extend their session.
 */
export const SessionTimeoutManager: React.FC = () => {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showWarning, setShowWarning] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState(60)

  // Last active timestamp in ms - updated on activity and reset on login
  const lastActivityRef = useRef<number>(Date.now())
  const countdownIntervalRef = useRef<any>(null)

  // Get configured session timeout (in minutes), defaulting to 120 mins (2 hours)
  const getTimeoutDurationMs = (): number => {
    try {
      const stored = localStorage.getItem('cp_session_timeout_minutes')
      const mins = stored ? parseInt(stored, 10) : 120
      // Guard against invalid values: minimum 1 min, maximum 1440 mins (24h)
      return Math.max(1, Math.min(1440, isNaN(mins) ? 120 : mins)) * 60 * 1000
    } catch {
      return 120 * 60 * 1000
    }
  }

  // Terminate session and navigate to login
  const handleTimeout = async () => {
    setShowWarning(false)
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    localStorage.removeItem('cp_last_activity_time')
    await logout()
    navigate('/login', {
      state: {
        from: location,
        sessionExpired: true,
      },
    })
  }

  // Extend the session
  const resetActivity = () => {
    const now = Date.now()
    lastActivityRef.current = now
    try {
      localStorage.setItem('cp_last_activity_time', now.toString())
    } catch {
      // ignore
    }
    if (showWarning) {
      setShowWarning(false)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setShowWarning(false)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      return
    }

    // Check if session has already expired based on persisted last activity
    const timeoutMs = getTimeoutDurationMs()
    const storedLastActivity = localStorage.getItem('cp_last_activity_time')
    const lastTime = storedLastActivity ? parseInt(storedLastActivity, 10) : null

    if (lastTime && !isNaN(lastTime)) {
      const elapsedSinceStored = Date.now() - lastTime
      if (elapsedSinceStored >= timeoutMs) {
        handleTimeout()
        return
      }
      lastActivityRef.current = lastTime
    } else {
      const now = Date.now()
      lastActivityRef.current = now
      localStorage.setItem('cp_last_activity_time', now.toString())
    }

    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    let lastThrottledTime = Date.now()
    const onUserActivity = () => {
      // Don't auto-dismiss the warning modal by background micro-mouse movements, require explicit extend click
      if (!showWarning) {
        const now = Date.now()
        lastActivityRef.current = now
        // Throttle writing to localStorage to once every 10 seconds
        if (now - lastThrottledTime > 10000) {
          lastThrottledTime = now
          try {
            localStorage.setItem('cp_last_activity_time', now.toString())
          } catch {
            // ignore
          }
        }
      }
    }

    activityEvents.forEach((event) => {
      window.addEventListener(event, onUserActivity, { passive: true })
    })

    // Check timer periodically
    const checkInterval = setInterval(() => {
      const timeoutMs = getTimeoutDurationMs()
      const warningThresholdMs = timeoutMs - 60 * 1000 // 60s before expiration
      const elapsed = Date.now() - lastActivityRef.current

      if (elapsed >= timeoutMs) {
        // Expired!
        handleTimeout()
      } else if (elapsed >= warningThresholdMs && !showWarning) {
        // Trigger 60-second warning countdown
        setShowWarning(true)
        const leftSec = Math.max(1, Math.ceil((timeoutMs - elapsed) / 1000))
        setSecondsRemaining(leftSec)

        countdownIntervalRef.current = setInterval(() => {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(countdownIntervalRef.current)
              handleTimeout()
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    }, 5000)

    return () => {
      clearInterval(checkInterval)
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current)
      activityEvents.forEach((event) => {
        window.removeEventListener(event, onUserActivity)
      })
    }
  }, [isAuthenticated, showWarning])

  if (!isAuthenticated || !showWarning) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-cp-card border border-cp-gold/40 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cp-gold/15 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-cp-text-primary">Session Inactivity Warning</h3>
            <p className="text-xs text-cp-text-muted">Security timeout rule active</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">
          You have been inactive for a while. For your security, your CoinPlus trading session will automatically terminate in:
        </p>

        <div className="text-center py-3 bg-cp-elevated border border-cp-border rounded-xl">
          <div className="text-3xl font-black font-mono text-cp-gold tracking-wider">
            00:{secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining}
          </div>
          <span className="text-[11px] text-cp-text-muted uppercase tracking-wider font-semibold">
            Seconds remaining
          </span>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            onClick={handleTimeout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Log Out Now
          </Button>

          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={resetActivity}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Stay Signed In
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SessionTimeoutManager
