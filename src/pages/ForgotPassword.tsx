import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Logo } from '@/components/common/Logo'
import { Typography } from '@/components/common/Typography'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Fast demo credential auto-fill helper
  const handleAutoFillDemo = () => {
    setEmail('demo.trader@coinplus.io')
    setError(null)
  }

  // Email format validation
  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  }

  // Mask email for display
  const maskEmail = (val: string): string => {
    const parts = val.split('@')
    if (parts.length !== 2) return val
    const name = parts[0]
    const domain = parts[1]
    const maskedName = name.length <= 2 ? `${name[0]}***` : `${name[0]}***${name[name.length - 1]}`
    return `${maskedName}@${domain}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Please enter your account email address.')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email format (e.g. name@domain.com).')
      return
    }

    setError(null)
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      setSubmittedEmail(email.trim())
      setIsSubmitted(true)
      setResendCooldown(30)
    }, 700)
  }

  const handleResend = () => {
    if (resendCooldown > 0) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setResendCooldown(30)
    }, 600)
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
            <span>Account Recovery</span>
          </div>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Reset Your Password
          </Typography>

          <p className="text-xs sm:text-sm text-cp-text-secondary max-w-xs mx-auto">
            {isSubmitted
              ? 'Check your simulated inbox for recovery instructions.'
              : 'Enter the email address associated with your demonstration account.'}
          </p>
        </div>

        {/* Success or Form State */}
        {isSubmitted ? (
          /* Mock Success State Card */
          <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden animate-fadeIn">
            <CardContent className="p-6 sm:p-8 space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cp-positive/15 border border-cp-positive/30 text-cp-positive flex items-center justify-center mx-auto shadow-lg shadow-cp-positive/10">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <Typography variant="h3" className="text-xl font-bold text-cp-text-primary">
                  Reset Instructions Sent!
                </Typography>
                <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed max-w-sm mx-auto">
                  We've simulated sending a password reset link to{' '}
                  <span className="text-cp-gold font-mono font-semibold">{maskEmail(submittedEmail)}</span>.
                </p>
              </div>

              {/* Demonstration Notice */}
              <div className="p-3.5 rounded-xl bg-cp-elevated/60 border border-cp-border text-xs text-cp-text-muted space-y-1 text-left">
                <p className="text-cp-gold font-semibold flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  Demonstration Environment Note
                </p>
                <p className="leading-relaxed">
                  In this frontend demonstration, no actual recovery email is dispatched. Your simulated credentials
                  remain active in your browser session.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-2">
                <Link to="/login" className="block">
                  <Button variant="primary" size="lg" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Sign In
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 text-xs text-cp-text-muted">
                  <span>Didn't receive the simulated email?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isSubmitting}
                    className="text-cp-gold hover:underline font-semibold disabled:text-cp-text-muted disabled:no-underline cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Click to Resend'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Form Card */
          <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8 space-y-5">
              {/* Quick Demo Helper */}
              <div className="rounded-xl bg-gradient-to-r from-cp-card via-cp-elevated/70 to-cp-card border border-cp-gold/30 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cp-gold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Demonstration Helper
                  </span>
                  <Badge variant="gold" size="sm">
                    1-Click
                  </Badge>
                </div>
                <p className="text-[11px] text-cp-text-muted">
                  Testing the recovery flow? Auto-fill our demo account email:
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoFillDemo}
                  className="text-xs w-full"
                >
                  Fill Demo Email
                </Button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <Input
                    label="Account Email Address *"
                    type="email"
                    placeholder="e.g. alex@coinplus.io"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    leftIcon={<Mail className="w-4 h-4" />}
                    error={error || undefined}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>

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
                      <span>Sending Instructions...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Send Recovery Instructions</span>
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

        {/* Responsible Demonstration Disclaimer */}
        <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-[11px] text-cp-text-muted space-y-1">
          <p className="text-cp-text-secondary font-semibold">Simulated Password Reset</p>
          <p>
            CoinPlus does not transmit actual recovery emails or interact with a live mail server.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
