import React, { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { Logo } from '@/components/common/Logo'
import { Typography } from '@/components/common/Typography'
import { authService } from '@/services'

import { ALL_COUNTRIES } from '@/constants/countries'

export const DEMO_COUNTRIES = ALL_COUNTRIES


export const Register: React.FC = () => {
  const navigate = useNavigate()

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Validation & UI states
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    country?: string
    password?: string
    confirmPassword?: string
    terms?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Password strength evaluation
  const passwordCriteria = useMemo(() => {
    return {
      hasLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    }
  }, [password])

  const passwordScore = useMemo(() => {
    let score = 0
    if (passwordCriteria.hasLength) score += 1
    if (passwordCriteria.hasUpper) score += 1
    if (passwordCriteria.hasNumber) score += 1
    if (passwordCriteria.hasSpecial) score += 1
    return score
  }, [passwordCriteria])

  const passwordStrengthLabel = useMemo(() => {
    if (!password) return { label: 'Empty', color: 'text-cp-text-muted', barColor: 'bg-cp-border' }
    if (passwordScore <= 1) return { label: 'Weak', color: 'text-cp-negative', barColor: 'bg-cp-negative' }
    if (passwordScore === 2) return { label: 'Fair', color: 'text-cp-gold', barColor: 'bg-cp-gold' }
    if (passwordScore === 3) return { label: 'Good', color: 'text-blue-400', barColor: 'bg-blue-400' }
    return { label: 'Strong', color: 'text-cp-positive', barColor: 'bg-cp-positive' }
  }, [password, passwordScore])

  // Email format validation
  const validateEmail = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: typeof errors = {}

    // Full name check
    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.'
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.'
    }

    // Email check
    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please provide a valid email format.'
    }

    // Country check
    if (!country) {
      newErrors.country = 'Please select your country of residence.'
    }

    // Password check
    if (!password) {
      newErrors.password = 'Please create a password.'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.'
    }

    // Confirm password check
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    // Terms check
    if (!acceptTerms) {
      newErrors.terms = 'You must accept the demonstration terms and conditions to proceed.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    try {
      await authService.register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        country,
        acceptTerms,
      })
      setIsSubmitting(false)
      navigate('/dashboard')
    } catch (err: any) {
      setIsSubmitting(false)
      const serverErrors = err.response?.data?.errors
      const serverMessage = err.response?.data?.message || err.message
      if (serverErrors) {
        setErrors({
          email: serverErrors.email?.[0],
          password: serverErrors.password?.[0],
          fullName: serverErrors.fullName?.[0],
        })
      } else if (err.response?.status === 422) {
        setErrors({ email: serverMessage })
      } else {
        // Fallback for offline demo mode
        navigate('/dashboard')
      }
    }
  }

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 animate-fadeIn">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Link to="/dashboard" className="transition-transform hover:scale-105">
              <Logo size="lg" />
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cp-gold/10 border border-cp-gold/20 text-cp-gold text-xs font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Demonstration Onboarding</span>
          </div>

          <Typography variant="h1" className="text-2xl sm:text-3xl font-extrabold text-cp-text-primary tracking-tight">
            Create CoinPlus Account
          </Typography>

          <p className="text-xs sm:text-sm text-cp-text-secondary max-w-sm mx-auto">
            Experience next-generation spot cryptocurrency trading in a secure simulation environment.
          </p>
        </div>

        {/* Register Form Card */}
        <Card className="border-cp-border bg-cp-card shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <Input
                  label="Full Name *"
                  placeholder="e.g. Alex Vance"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
                  }}
                  leftIcon={<User className="w-4 h-4" />}
                  error={errors.fullName}
                  disabled={isSubmitting}
                  autoComplete="name"
                />
              </div>

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

              {/* Country Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-country"
                  className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
                >
                  Country of Residence *
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3 text-cp-text-muted pointer-events-none">
                    <Globe className="w-4 h-4" />
                  </div>
                  <select
                    id="register-country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value)
                      if (errors.country) setErrors((prev) => ({ ...prev, country: undefined }))
                    }}
                    disabled={isSubmitting}
                    className={`w-full bg-cp-card border rounded-lg text-sm text-cp-text-primary py-2.5 pl-9 pr-8 transition-all duration-200 focus:outline-none focus:bg-cp-elevated/40 cursor-pointer ${
                      errors.country
                        ? 'border-cp-negative focus:border-cp-negative focus:ring-1 focus:ring-cp-negative/50'
                        : 'border-cp-border hover:border-cp-border-light focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50'
                    }`}
                  >
                    <option value="" disabled className="text-cp-text-muted">
                      Select your country...
                    </option>
                    {DEMO_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-cp-card text-cp-text-primary">
                        {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.country && (
                  <p className="text-xs text-cp-negative flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.country}</span>
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
                >
                  Password *
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    disabled={isSubmitting}
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-2 pt-1 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-cp-text-muted">Password Strength:</span>
                      <span className={`font-semibold ${passwordStrengthLabel.color}`}>
                        {passwordStrengthLabel.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`rounded-full transition-all duration-300 ${
                            step <= passwordScore ? passwordStrengthLabel.barColor : 'bg-cp-border'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px] text-cp-text-muted pt-1">
                      <span className={`flex items-center gap-1 ${passwordCriteria.hasLength ? 'text-cp-positive' : ''}`}>
                        {passwordCriteria.hasLength ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        8+ characters
                      </span>
                      <span className={`flex items-center gap-1 ${passwordCriteria.hasUpper ? 'text-cp-positive' : ''}`}>
                        {passwordCriteria.hasUpper ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        Uppercase letter
                      </span>
                      <span className={`flex items-center gap-1 ${passwordCriteria.hasNumber ? 'text-cp-positive' : ''}`}>
                        {passwordCriteria.hasNumber ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        Number
                      </span>
                      <span className={`flex items-center gap-1 ${passwordCriteria.hasSpecial ? 'text-cp-positive' : ''}`}>
                        {passwordCriteria.hasSpecial ? <Check className="w-3 h-3" /> : <span className="w-3 text-center">•</span>}
                        Special symbol
                      </span>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-xs text-cp-negative flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm-password"
                  className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none"
                >
                  Confirm Password *
                </label>
                <div className="relative flex items-center group">
                  <div className="absolute left-3 text-cp-text-muted group-focus-within:text-cp-gold transition-colors duration-200 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                    }}
                    disabled={isSubmitting}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={`w-full bg-cp-card border rounded-lg text-sm text-cp-text-primary placeholder:text-cp-text-muted/60 py-2.5 pl-9 pr-10 transition-all duration-200 focus:outline-none focus:bg-cp-elevated/40 ${
                      errors.confirmPassword
                        ? 'border-cp-negative focus:border-cp-negative focus:ring-1 focus:ring-cp-negative/50'
                        : 'border-cp-border hover:border-cp-border-light focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 p-1 text-cp-text-muted hover:text-cp-text-primary transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="text-xs text-cp-negative flex items-center gap-1 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>

              {/* Terms & Privacy Policy Acceptance */}
              <div className="space-y-1 pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-cp-text-secondary select-none">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked)
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }))
                    }}
                    disabled={isSubmitting}
                    className="mt-0.5 w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-cp-gold/40 focus:ring-offset-0 cursor-pointer accent-[#F0B93A]"
                  />
                  <span className="leading-relaxed text-[11px] sm:text-xs">
                    I agree to the CoinPlus Demonstration Terms and acknowledge that this is a simulated cryptocurrency
                    environment with no real money or custody of assets.
                  </span>
                </label>

                {errors.terms && (
                  <p className="text-xs text-cp-negative flex items-center gap-1 pl-6 pt-0.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.terms}</span>
                  </p>
                )}
              </div>

              {/* Create Account CTA */}
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
                    <span>Creating Demonstration Account...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Create Demonstration Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            {/* Existing Account Link */}
            <div className="pt-4 border-t border-cp-border/80 text-center text-xs text-cp-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-cp-gold hover:underline font-bold transition-colors">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Responsible Demonstration Disclaimer */}
        <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-[11px] text-cp-text-muted space-y-1">
          <p className="text-cp-text-secondary font-semibold">Educational Demonstration Platform</p>
          <p>
            No real accounts or passwords are stored in an external database. All balances and trades are simulated in-browser.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
