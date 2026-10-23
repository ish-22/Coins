import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
  KeyRound,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Logo } from '@/components/common/Logo'
import { Typography } from '@/components/common/Typography'
import { authService } from '@/services'

export const Login: React.FC = () => {
  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  // Validation & UI state
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [simulateError, setSimulateError] = useState(false)

  // Fast demo credential auto-fill helper
  const handleFillDemoCredentials = () => {
    setEmail('demo.trader@coinplus.io')
    setPassword('CoinPlus2026!#')
    setErrors({})
    setSimulateError(false)
  }

  // Email format validation
  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    // Email check
    if (!email.trim()) {
      newErrors.email = 'Please enter your account email.'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email format (e.g. name@domain.com).'
    }

    // Password check
    if (!password) {
      newErrors.password = 'Please enter your password.'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.'
    }

    // If simulated error toggle is on
    if (simulateError) {
      newErrors.general = 'Demonstration: Invalid email or password. Please verify credentials or click Auto-fill Demo.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await authService.login({
        email: email.trim(),
        password,
        rememberMe,
      })
      setIsSubmitting(false)
      navigate('/dashboard')
    } catch (err: any) {
      setIsSubmitting(false)
      const serverMessage = err.response?.data?.message || err.message
      if (err.response?.status === 422 || err.response?.status === 401) {
        setErrors({ general: serverMessage || 'Invalid email or password.' })
      } else {
        // Fallback for offline demo mode
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 animate-fadeIn">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Link to="/dashboard" className="transition-transform hover:scale-105">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cp-gold/10 border border-cp-gold/20 text-cp-gold text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Demonstration Trading Platform</span>
          </div>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Sign In to CoinPlus
          </Typography>

          <p className="text-xs sm:text-sm text-cp-text-secondary max-w-xs mx-auto">
            Access your simulated cryptocurrency spot portfolio, order book, and trading terminal.
          </p>
        </div>

        {/* Demo Mode Quick Access Banner */}
        <div className="rounded-xl bg-gradient-to-r from-cp-card via-cp-elevated/70 to-cp-card border border-cp-gold/30 p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cp-gold flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Quick Demo Access
            </span>
            <Badge variant="gold" size="sm">
              Sandbox Mode
            </Badge>
          </div>
          <p className="text-[11px] text-cp-text-muted leading-relaxed">
            This is a frontend demonstration. Click below to prefill sample credentials with instant access:
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleFillDemoCredentials}
              className="text-xs flex-1"
            >
              Auto-fill Demo Credentials
            </Button>
            <button
              type="button"
              onClick={() => setSimulateError(!simulateError)}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                simulateError
                  ? 'bg-cp-negative/20 text-cp-negative border-cp-negative/40'
                  : 'bg-cp-elevated text-cp-text-muted border-cp-border hover:text-cp-text-primary'
              }`}
              title="Test simulated error handling"
            >
              {simulateError ? 'Error Active' : 'Test Error'}
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {errors.general && (
              <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email Address */}
              <div>
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="e.g. alex@coinplus.io"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  leftIcon={<Mail className="w-4 h-4" />}
                  error={errors.email}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
                  >
                    Password *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cp-gold hover:underline font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative flex items-center group">
                  <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    disabled={isSubmitting}
                    placeholder="Enter demonstration password"
                    autoComplete="current-password"
                    className={`w-full bg-cp-card border rounded-lg text-sm text-cp-text-primary placeholder:text-cp-text-muted/60 py-2.5 pl-9 pr-10 transition-all duration-200 focus:outline-none focus:bg-cp-elevated/40 ${
                      errors.password
                        ? 'border-cp-negative focus:border-cp-negative focus:ring-1 focus:ring-cp-negative/50'
                        : 'border-cp-border hover:border-cp-border-light focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 p-1 text-cp-text-muted hover:text-cp-text-primary transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-xs text-cp-negative flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Remember Me & Privacy row */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-cp-text-secondary select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-cp-gold/40 focus:ring-offset-0 cursor-pointer accent-[#F0B93A]"
                  />
                  <span>Remember this browser</span>
                </label>

                <span className="text-[11px] text-cp-text-muted">Demonstration Session</span>
              </div>

              {/* Sign In CTA */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-cp-base border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign In to Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Registration redirect */}
            <div className="pt-4 border-t border-cp-border/80 text-center text-xs text-cp-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-cp-gold hover:underline font-bold transition-colors">
                Create Account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Responsible Demonstration Disclaimer */}
        <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-[11px] text-cp-text-muted space-y-1">
          <p className="text-cp-text-secondary font-semibold">Educational Interface Concept</p>
          <p>
            CoinPlus does not collect real passwords or perform live authentication against remote servers.
            Explore the trading interface freely with demonstration mock balances.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
