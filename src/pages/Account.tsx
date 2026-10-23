import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  Clock,
  Coins,
  Calendar,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  Info,
  ChevronRight,
  ExternalLink,
  Laptop,
  Check,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  UserAccountProfile,
  DEFAULT_USER_PROFILE,
  COUNTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  TIMEZONE_OPTIONS,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
} from '@/mock/accountData'
import { DiscardChangesModal } from '@/components/account'
import { useAuth } from '@/context/AuthContext'

export const Account: React.FC = () => {
  const { user, updateUser, refreshUser } = useAuth()

  // Saved profile persisted in AuthContext / localStorage
  const [savedProfile, setSavedProfile] = useState<UserAccountProfile>(() => {
    return user || DEFAULT_USER_PROFILE
  })

  // Editable form state (draft)
  const [formData, setFormData] = useState<UserAccountProfile>(() => user || DEFAULT_USER_PROFILE)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch latest profile from backend on mount
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  // Synchronize with auth user changes
  useEffect(() => {
    if (user) {
      setSavedProfile(user)
      setFormData(user)
    }
  }, [user])

  // Validation errors
  const [errors, setErrors] = useState<{
    fullName?: string
    displayName?: string
    email?: string
    phone?: string
  }>({})

  // Privacy toggles (mask/unmask)
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)

  // Modals & Toast State
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false)
  const [pendingDiscardAction, setPendingDiscardAction] = useState<'cancel' | 'reset' | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [copiedUid, setCopiedUid] = useState(false)

  // Synchronize draft when savedProfile changes
  useEffect(() => {
    setFormData(savedProfile)
  }, [savedProfile])

  // Check if form has unsaved modifications
  const isDirty = JSON.stringify(formData) !== JSON.stringify(savedProfile)

  // Trigger feedback toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Copy UID helper
  const handleCopyUid = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(formData.uid)
      setCopiedUid(true)
      setTimeout(() => setCopiedUid(false), 2000)
    }
  }

  // Masking helpers
  const maskEmail = (email: string) => {
    if (showSensitiveInfo) return email
    const [user, domain] = email.split('@')
    if (!domain) return email
    const maskedUser = user.length > 2 ? `${user[0]}***${user[user.length - 1]}` : `${user[0]}***`
    return `${maskedUser}@${domain}`
  }

  const maskPhone = (phone: string) => {
    if (showSensitiveInfo) return phone
    if (phone.length < 8) return phone
    return phone.slice(0, 4) + ' ***-***-' + phone.slice(-4)
  }

  // Validate form
  const validate = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full legal name is required (minimum 2 characters).'
    }

    if (!formData.displayName.trim() || formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name is required.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.'
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save changes handler
  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!validate()) {
      triggerToast('Please resolve validation errors before saving.')
      return
    }

    try {
      setIsSaving(true)
      await updateUser(formData)
      setSavedProfile(formData)
      triggerToast('Account details updated successfully!')
    } catch {
      setSavedProfile(formData)
      triggerToast('Preferences saved locally.')
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel edits button
  const handleCancelClick = () => {
    if (isDirty) {
      setPendingDiscardAction('cancel')
      setIsDiscardModalOpen(true)
    } else {
      setFormData(savedProfile)
      setErrors({})
    }
  }

  // Reset to default settings
  const handleResetDefaultsClick = () => {
    setPendingDiscardAction('reset')
    setIsDiscardModalOpen(true)
  }

  // Confirm discard changes
  const handleConfirmDiscard = () => {
    if (pendingDiscardAction === 'reset') {
      const base = user || DEFAULT_USER_PROFILE
      setSavedProfile(base)
      setFormData(base)
      setErrors({})
      triggerToast('Reset account preferences.')
    } else {
      setFormData(savedProfile)
      setErrors({})
      triggerToast('Unsaved changes discarded.')
    }
    setIsDiscardModalOpen(false)
    setPendingDiscardAction(null)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              My Account
            </h1>
            <Badge variant="gold" size="sm">
              {formData.vipLevel}
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Manage your personal profile, contact information, regional settings, and platform preferences.
          </p>
        </div>

        {/* Global Save / Cancel Bar */}
        <div className="flex items-center gap-3">
          {isDirty && (
            <Button
              variant="secondary"
              size="sm"
              disabled={isSaving}
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            disabled={!isDirty || isSaving}
            onClick={() => handleSaveChanges()}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Unsaved Changes Warning Banner */}
      {isDirty && (
        <div className="p-3.5 rounded-xl bg-cp-gold/10 border border-cp-gold/40 flex items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2.5 text-cp-gold font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>You have unsaved changes in your account settings. Click Save Changes to apply them.</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCancelClick}
              className="text-cp-text-secondary hover:text-cp-text-primary underline text-xs"
            >
              Discard
            </button>
            <Button variant="primary" size="sm" onClick={() => handleSaveChanges()} className="h-7 text-xs px-2.5">
              Save
            </Button>
          </div>
        </div>
      )}

      {/* Demonstration Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Simulated Profile:</span> This is a
            demonstration trader account profile. Changes made here persist in your local browser
            and are not submitted to any external server or identity provider.
          </div>
        </div>
        <button
          onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
          className="flex items-center gap-1.5 text-xs text-cp-gold hover:underline self-end sm:self-auto shrink-0 font-medium"
        >
          {showSensitiveInfo ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showSensitiveInfo ? 'Hide Details' : 'Show Unmasked Details'}</span>
        </button>
      </div>

      {/* PROFILE OVERVIEW CARD */}
      <Card className="border-cp-border bg-cp-card overflow-hidden">
        <div className="p-6 border-b border-cp-border/50 bg-gradient-to-r from-cp-card via-cp-elevated/40 to-cp-card">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Avatar & Display Name */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cp-gold via-cp-gold/80 to-amber-200 text-cp-bg font-extrabold text-2xl flex items-center justify-center shadow-gold-md border-2 border-cp-card">
                  {formData.avatarInitials}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cp-positive border-2 border-cp-card"
                  title="Account Status: Active"
                />
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-cp-text-primary">
                    {formData.displayName}
                  </h2>
                  <Badge variant="positive" size="sm" withDot>
                    Active
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-cp-text-secondary mt-1 font-mono">
                  <div className="flex items-center gap-1">
                    <span>UID: {formData.uid}</span>
                    <button
                      onClick={handleCopyUid}
                      className="p-1 hover:text-cp-gold transition-colors"
                      title="Copy UID"
                    >
                      {copiedUid ? (
                        <Check className="w-3.5 h-3.5 text-cp-positive" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <span>•</span>
                  <span>Created {formData.accountCreationDate}</span>
                </div>
              </div>
            </div>

            {/* Quick Status Badges & KYC shortcut */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cp-card border border-cp-border flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-cp-positive" />
                <div className="text-left">
                  <span className="text-[10px] text-cp-text-secondary block">Identity Verification</span>
                  <span className="text-xs font-bold text-cp-text-primary">{formData.verificationTier}</span>
                </div>
              </div>

              <Link to="/kyc">
                <Button variant="outline" size="sm" className="h-10 text-xs border-cp-border hover:border-cp-gold">
                  KYC Center <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Contact & Tier Bar */}
        <div className="p-4 bg-cp-elevated/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2.5">
            <Mail className="w-4 h-4 text-cp-gold shrink-0" />
            <div>
              <span className="text-cp-text-secondary block text-[11px]">Contact Email</span>
              <span className="font-mono font-semibold text-cp-text-primary">{maskEmail(formData.email)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-cp-gold shrink-0" />
            <div>
              <span className="text-cp-text-secondary block text-[11px]">Registered Mobile</span>
              <span className="font-mono font-semibold text-cp-text-primary">{maskPhone(formData.phone)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Coins className="w-4 h-4 text-cp-gold shrink-0" />
            <div>
              <span className="text-cp-text-secondary block text-[11px]">Trading Fee Tier</span>
              <span className="font-semibold text-cp-text-primary">VIP 1 (Maker: 0.02% / Taker: 0.04%)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Form Body (2-Column Grid) */}
      <form onSubmit={(e) => { e.preventDefault(); handleSaveChanges(); }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <Card className="border-cp-border bg-cp-card">
          <CardHeader className="border-b border-cp-border/50 pb-4">
            <div className="flex items-center gap-2.5">
              <User className="w-5 h-5 text-cp-gold" />
              <div>
                <CardTitle className="text-base text-cp-text-primary">Personal Information</CardTitle>
                <p className="text-xs text-cp-text-secondary">Official identity name and regional preferences</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-xs">
            {/* Legal Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                Full Legal Name <span className="text-cp-negative">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value })
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                }}
                className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none transition-colors ${
                  errors.fullName ? 'border-cp-negative focus:border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                }`}
                placeholder="Enter full legal name..."
              />
              {errors.fullName && (
                <span className="text-[11px] text-cp-negative flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.fullName}
                </span>
              )}
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                Display Name (Pseudonym) <span className="text-cp-negative">*</span>
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => {
                  setFormData({ ...formData, displayName: e.target.value })
                  if (errors.displayName) setErrors({ ...errors, displayName: undefined })
                }}
                className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none transition-colors ${
                  errors.displayName ? 'border-cp-negative focus:border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                }`}
                placeholder="Enter display name..."
              />
              {errors.displayName && (
                <span className="text-[11px] text-cp-negative flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.displayName}
                </span>
              )}
            </div>

            {/* Country of Residence */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cp-gold" />
                <span>Country of Residence</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Language */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-cp-text-secondary block">
                Preferred Interface Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
              >
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Zone & Date Format Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cp-text-secondary flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cp-gold" />
                  <span>Time Zone</span>
                </label>
                <select
                  value={formData.timeZone}
                  onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                  className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
                >
                  {TIMEZONE_OPTIONS.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cp-text-secondary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cp-gold" />
                  <span>Date Format</span>
                </label>
                <select
                  value={formData.dateFormat}
                  onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                  className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
                >
                  {DATE_FORMAT_OPTIONS.map((df) => (
                    <option key={df} value={df}>
                      {df}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 2: CONTACT INFORMATION */}
        <div className="space-y-6">
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Contact Information</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Security notifications and withdrawal authorizations</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-cp-text-secondary">
                    Primary Email Address <span className="text-cp-negative">*</span>
                  </label>
                  <Badge variant="positive" size="sm" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary font-mono focus:outline-none transition-colors ${
                    errors.email ? 'border-cp-negative focus:border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                  }`}
                  placeholder="name@example.com"
                />
                {errors.email && (
                  <span className="text-[11px] text-cp-negative flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-cp-text-secondary">
                    Mobile Phone Number <span className="text-cp-negative">*</span>
                  </label>
                  <Badge variant="positive" size="sm" className="text-[10px]">
                    Verified
                  </Badge>
                </div>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value })
                    if (errors.phone) setErrors({ ...errors, phone: undefined })
                  }}
                  className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary font-mono focus:outline-none transition-colors ${
                    errors.phone ? 'border-cp-negative focus:border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                  }`}
                  placeholder="+1 555-019-8921"
                />
                {errors.phone && (
                  <span className="text-[11px] text-cp-negative flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.phone}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-lg bg-cp-elevated border border-cp-border/60 text-cp-text-secondary text-[11px] leading-relaxed">
                Contact information is used for simulated two-factor security codes, order fill alerts, and withdrawal approvals.
              </div>
            </CardContent>
          </Card>

          {/* SECTION 3: PREFERENCES & NOTIFICATIONS */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">System & Notification Preferences</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Customize terminal views and communication alerts</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs">
              {/* Default Dashboard Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-cp-text-secondary block">
                  Default Landing Screen
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, defaultDashboardView: 'pro_terminal' })}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      formData.defaultDashboardView === 'pro_terminal'
                        ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                        : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                    }`}
                  >
                    <span className="block text-xs">Pro Trade</span>
                    <span className="text-[10px] opacity-75 font-normal">Terminal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, defaultDashboardView: 'classic' })}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      formData.defaultDashboardView === 'classic'
                        ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                        : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                    }`}
                  >
                    <span className="block text-xs">Dashboard</span>
                    <span className="text-[10px] opacity-75 font-normal">Classic</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, defaultDashboardView: 'portfolio' })}
                    className={`p-2.5 rounded-xl border text-left transition-colors ${
                      formData.defaultDashboardView === 'portfolio'
                        ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                        : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                    }`}
                  >
                    <span className="block text-xs">Wallet</span>
                    <span className="text-[10px] opacity-75 font-normal">Balances</span>
                  </button>
                </div>
              </div>

              {/* Display Currency */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cp-text-secondary block">
                  Preferred Portfolio Valuation Currency
                </label>
                <select
                  value={formData.displayCurrency}
                  onChange={(e) => setFormData({ ...formData, displayCurrency: e.target.value })}
                  className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer font-mono"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-3 pt-2 border-t border-cp-border/50">
                <span className="text-xs font-semibold text-cp-text-primary block">
                  Email & Push Alerts
                </span>

                <div className="space-y-2.5">
                  <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated/80 cursor-pointer transition-colors">
                    <span className="text-xs text-cp-text-primary">Trade executions & order fills</span>
                    <input
                      type="checkbox"
                      checked={formData.notifications.tradeFills}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            tradeFills: e.target.checked,
                          },
                        })
                      }
                      className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated/80 cursor-pointer transition-colors">
                    <span className="text-xs text-cp-text-primary">Security & login authorizations</span>
                    <input
                      type="checkbox"
                      checked={formData.notifications.securityAlerts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            securityAlerts: e.target.checked,
                          },
                        })
                      }
                      className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated/80 cursor-pointer transition-colors">
                    <span className="text-xs text-cp-text-primary">Price volatility & watchlist triggers</span>
                    <input
                      type="checkbox"
                      checked={formData.notifications.priceAlerts}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            priceAlerts: e.target.checked,
                          },
                        })
                      }
                      className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated/80 cursor-pointer transition-colors">
                    <span className="text-xs text-cp-text-primary">Market news & research summaries</span>
                    <input
                      type="checkbox"
                      checked={formData.notifications.marketingNews}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          notifications: {
                            ...formData.notifications,
                            marketingNews: e.target.checked,
                          },
                        })
                      }
                      className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Footer Controls & Reset */}
      <div className="p-4 rounded-xl bg-cp-card border border-cp-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleResetDefaultsClick}
          className="flex items-center gap-1.5 text-xs text-cp-text-secondary hover:text-cp-negative transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Preferences to Defaults</span>
        </button>

        <div className="flex items-center gap-3">
          {isDirty && (
            <Button variant="secondary" size="sm" onClick={handleCancelClick}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-4 h-4" />}
            disabled={!isDirty}
            onClick={() => handleSaveChanges()}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Discard Changes Confirmation Modal */}
      <DiscardChangesModal
        isOpen={isDiscardModalOpen}
        onConfirm={handleConfirmDiscard}
        onClose={() => setIsDiscardModalOpen(false)}
      />
    </div>
  )
}

export default Account
