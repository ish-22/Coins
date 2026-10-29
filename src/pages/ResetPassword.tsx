import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Logo } from '@/components/common/Logo'
import { Typography } from '@/components/common/Typography'
import { authService } from '@/services/authService'

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tokenParam = searchParams.get('token') || ''
  const emailParam = searchParams.get('email') || ''

  const [token, setToken] = useState(tokenParam)
  const [email, setEmail] = useState(emailParam)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (tokenParam) setToken(tokenParam)
    if (emailParam) setEmail(emailParam)
  }, [tokenParam, emailParam])

  // Password requirements calculation
  const passwordRules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Contains number or symbol', met: /[0-9!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]
  const isPasswordValid = passwordRules.every((r) => r.met)
  const isMatch = password.length > 0 && password === passwordConfirmation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError('Password reset token is missing. Please click the link in your email again.')
      return
    }

    if (!email) {
      setError('Email address is missing. Please click the link in your email again.')
      return
    }

    if (!isPasswordValid) {
      setError('Please ensure your new password satisfies all security requirements.')
      return
    }

    if (!isMatch) {
      setError('Passwords do not match. Please re-enter.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await authService.resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
      setIsSuccess(true)
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to reset password.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
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
            <KeyRound className="w-3 h-3" />
            <span>Create New Password</span>
          </div>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Reset Password
          </Typography>

          <p className="text-xs sm:text-sm text-cp-text-secondary max-w-xs mx-auto">
            {isSuccess
              ? 'Your password has been reset successfully.'
              : 'Choose a strong, secure password for your CoinPlus account.'}
          </p>
        </div>

        {isSuccess ? (
          /* Success Card */
          <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden animate-fadeIn">
            <CardContent className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cp-positive/15 border border-cp-positive/30 text-cp-positive flex items-center justify-center mx-auto shadow-lg shadow-cp-positive/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <Typography variant="h3" className="text-xl font-bold text-cp-text-primary">
                  Password Reset Complete!
                </Typography>
                <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed max-w-sm mx-auto">
                  Your credentials have been securely updated. You can now sign in with your new password.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/login')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Proceed to Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Reset Form Card */
          <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              {/* Account Email Display */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-cp-text-secondary">
                  Account Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!emailParam}
                  className="w-full bg-cp-elevated/40 border border-cp-border rounded-lg text-sm text-cp-text-secondary py-2.5 px-3 focus:outline-none focus:border-cp-gold disabled:opacity-75"
                />
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cp-text-secondary">
                    New Password *
                  </label>
                  <div className="relative flex items-center group">
                    <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Enter new password (min. 8 characters)"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg text-sm text-cp-text-primary py-2.5 pl-9 pr-10 focus:outline-none focus:border-cp-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-cp-text-muted hover:text-cp-text-primary transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Checklist */}
                {password.length > 0 && (
                  <div className="p-3 rounded-lg bg-cp-elevated/40 border border-cp-border/60 text-xs space-y-1.5 animate-fadeIn">
                    <div className="font-semibold text-cp-text-secondary text-[11px] mb-1">
                      Password Requirements:
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      {passwordRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-1.5 ${
                            rule.met ? 'text-cp-positive font-medium' : 'text-cp-text-muted'
                          }`}
                        >
                          {rule.met ? <Check className="w-3 h-3 text-cp-positive" /> : <X className="w-3 h-3 text-cp-text-muted" />}
                          <span>{rule.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cp-text-secondary">
                    Confirm New Password *
                  </label>
                  <div className="relative flex items-center group">
                    <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      disabled={isSubmitting}
                      placeholder="Re-enter new password"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg text-sm text-cp-text-primary py-2.5 pl-9 pr-10 focus:outline-none focus:border-cp-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-cp-text-muted hover:text-cp-text-primary transition-colors cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordConfirmation.length > 0 && (
                    <div className="text-[11px] flex items-center gap-1 mt-1">
                      {isMatch ? (
                        <span className="text-cp-positive flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-cp-negative flex items-center gap-1">
                          <X className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !isPasswordValid || !isMatch}
                  className="w-full mt-2"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-cp-base border-t-transparent rounded-full animate-spin" />
                      <span>Saving New Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Return to Login link */}
              <div className="pt-4 border-t border-cp-border/80 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-cp-gold hover:underline font-bold transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
