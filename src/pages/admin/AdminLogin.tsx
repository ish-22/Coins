import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Logo } from '@/components/common/Logo'
import { authService } from '@/services'

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('operator@coinplus.io')
  const [password, setPassword] = useState('SuperAdmin2026!#')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please provide administrative email and credentials.')
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await authService.adminLogin({
        email: email.trim(),
        password,
      })
      setIsSubmitting(false)
      navigate('/admin/dashboard')
    } catch (err: any) {
      setIsSubmitting(false)
      const msg = err.response?.data?.message || err.message
      if (err.response?.status === 422 || err.response?.status === 403) {
        setError(msg || 'Invalid administrative credentials or insufficient privileges.')
      } else {
        // Fallback demo mode if backend server offline
        sessionStorage.setItem('cp_admin_auth', 'true')
        navigate('/admin/dashboard')
      }
    }
  }

  const handleAutoFillDemo = async () => {
    setEmail('operator@coinplus.io')
    setPassword('SuperAdmin2026!#')
    setError(null)
    setIsSubmitting(true)
    try {
      await authService.adminLogin({
        email: 'operator@coinplus.io',
        password: 'SuperAdmin2026!#',
      })
      setIsSubmitting(false)
      navigate('/admin/dashboard')
    } catch {
      setIsSubmitting(false)
      sessionStorage.setItem('cp_admin_auth', 'true')
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-[#06090f] text-cp-text-primary flex flex-col justify-center items-center p-4 select-none relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cp-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Logo size="lg" asLink={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cp-negative/15 border border-cp-negative/30 text-cp-negative text-xs font-bold tracking-wider uppercase">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Operator Console</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Administrator Sign In
          </h1>

          <p className="text-xs text-cp-text-secondary max-w-xs mx-auto leading-relaxed">
            Manage demonstration users, identity queues, deposit approvals, and platform parameters.
          </p>
        </div>

        {/* Quick Demo Access Card */}
        <div className="rounded-2xl bg-gradient-to-r from-cp-card via-cp-elevated/70 to-cp-card border border-cp-gold/30 p-4 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cp-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              1-Click Reviewer Access
            </span>
            <Badge variant="gold" size="sm">
              Sandbox Role: Super Admin
            </Badge>
          </div>
          <p className="text-[11px] text-cp-text-muted leading-relaxed">
            This is a frontend demonstration. Click below to bypass simulated credential entry and open the dashboard:
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleAutoFillDemo}
            className="w-full text-xs"
          >
            Enter Admin Dashboard (Instant)
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </div>

        {/* Form Card */}
        <Card className="bg-[#0c121c] border-cp-border shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
                {error}
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Input
                  label="Administrator Email *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  placeholder="operator@coinplus.io"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cp-text-secondary block">
                  Password *
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 text-cp-text-muted pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-cp-card border border-cp-border rounded-lg text-sm text-cp-text-primary py-2.5 pl-9 pr-10 focus:outline-none focus:border-cp-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 p-1 text-cp-text-muted hover:text-cp-text-primary"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                disabled={isSubmitting}
                className="w-full mt-2"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign In as Operator'}
              </Button>
            </form>

            <div className="pt-3 border-t border-cp-border/60 text-center">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1.5 text-xs text-cp-text-muted hover:text-cp-gold transition-colors"
              >
                <span>Return to Customer Exchange</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Disclaimer Notice */}
        <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-[11px] text-cp-text-muted space-y-1">
          <p className="text-cp-text-secondary font-semibold">Demonstration Interface Notice</p>
          <p>
            No real server credentials are saved or verified. Production admin permissions must be strictly enforced server-side.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
