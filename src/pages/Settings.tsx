import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Smartphone,
  Fingerprint,
  Laptop,
  Clock,
  History,
  BookMarked,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Trash2,
  Edit2,
  Plus,
  Bell,
  Sparkles,
  Info,
  LogOut,
  Sliders,
  Check,
  Copy,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  PasskeyItem,
  LoginHistoryItem,
  ActiveSessionItem,
  TrustedDeviceItem,
  WhitelistAddressItem,
  INITIAL_PASSKEYS,
  INITIAL_LOGIN_HISTORY,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_TRUSTED_DEVICES,
  INITIAL_WHITELIST_ADDRESSES,
} from '@/mock/settingsData'
import {
  TwoFactorModal,
  AddPasskeyModal,
  WhitelistAddressModal,
  ConfirmActionModal,
} from '@/components/settings'

export const Settings: React.FC = () => {
  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Section 1: Password State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [showConfirmPw, setShowConfirmPw] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  // Section 2: 2FA State
  const [is2FAEnabled, setIs2FAEnabled] = useState(true)
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false)

  // Section 3: Passkeys State
  const [passkeys, setPasskeys] = useState<PasskeyItem[]>(INITIAL_PASSKEYS)
  const [isPasskeyModalOpen, setIsPasskeyModalOpen] = useState(false)

  // Section 4: Login History
  const [loginHistory] = useState<LoginHistoryItem[]>(INITIAL_LOGIN_HISTORY)

  // Section 5: Active Sessions
  const [sessions, setSessions] = useState<ActiveSessionItem[]>(INITIAL_ACTIVE_SESSIONS)

  // Section 6: Trusted Devices
  const [trustedDevices, setTrustedDevices] = useState<TrustedDeviceItem[]>(INITIAL_TRUSTED_DEVICES)

  // Section 7: Withdrawal Address Whitelist
  const [whitelistAddresses, setWhitelistAddresses] = useState<WhitelistAddressItem[]>(INITIAL_WHITELIST_ADDRESSES)
  const [isWhitelistOnly, setIsWhitelistOnly] = useState(true)
  const [whitelistModalOpen, setWhitelistModalOpen] = useState(false)
  const [editingWhitelistItem, setEditingWhitelistItem] = useState<WhitelistAddressItem | null>(null)

  // Section 8 & 9: Security Preferences & Notifications
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [withdrawalAlerts, setWithdrawalAlerts] = useState(true)
  const [passwordChangeAlerts, setPasswordChangeAlerts] = useState(true)
  const [suspiciousIpAlerts, setSuspiciousIpAlerts] = useState(true)

  // Confirmation Modals State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean
    title: string
    description: string
    confirmText?: string
    onConfirm: () => void
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  })

  // Password Strength Calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'None', color: 'bg-cp-border' }
    let score = 0
    if (newPassword.length >= 8) score += 1
    if (/[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword)) score += 1
    if (/[0-9]/.test(newPassword)) score += 1
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1

    if (score <= 1) return { score, label: 'Weak', color: 'bg-cp-negative' }
    if (score <= 3) return { score, label: 'Medium', color: 'bg-cp-gold' }
    return { score, label: 'Strong', color: 'bg-cp-positive' }
  }, [newPassword])

  // Handle Password Change Submit
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)

    if (!currentPassword) {
      setPwError('Please enter your current password.')
      return
    }

    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPwError('New password and confirmation do not match.')
      return
    }

    if (newPassword === currentPassword) {
      setPwError('New password cannot be identical to your current password.')
      return
    }

    // Success
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    triggerToast('Password updated successfully! (Demonstration)')
  }

  // Handle Revoke Session
  const handleRevokeSession = (sessionId: string, deviceName: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Revoke Active Session?',
      description: `Are you sure you want to log out and terminate session "${deviceName}"? The device will be required to log in again with credentials.`,
      confirmText: 'Revoke Session',
      onConfirm: () => {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId))
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast(`Session for ${deviceName} was revoked.`)
      },
    })
  }

  // Handle Revoke All Other Sessions
  const handleRevokeAllOtherSessions = () => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Revoke All Other Sessions?',
      description: 'This will instantly log out all active sessions on other browsers, computers, and mobile devices. Your current device will remain logged in.',
      confirmText: 'Revoke All Others',
      onConfirm: () => {
        setSessions((prev) => prev.filter((s) => s.isCurrent))
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast('All other sessions terminated successfully.')
      },
    })
  }

  // Handle Remove Trusted Device
  const handleRemoveDevice = (deviceId: string, deviceName: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Remove Trusted Device?',
      description: `Are you sure you want to remove "${deviceName}" from your trusted devices list? Next time you log in from this device, 2FA will be required.`,
      confirmText: 'Remove Device',
      onConfirm: () => {
        setTrustedDevices((prev) => prev.filter((d) => d.id !== deviceId))
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast(`Removed ${deviceName} from trusted devices.`)
      },
    })
  }

  // Handle Remove Passkey
  const handleRemovePasskey = (passkeyId: string, name: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Remove Biometric Passkey?',
      description: `Are you sure you want to delete passkey "${name}"? You will no longer be able to use this biometric key for sign-in or withdrawal authorizations.`,
      confirmText: 'Delete Passkey',
      onConfirm: () => {
        setPasskeys((prev) => prev.filter((p) => p.id !== passkeyId))
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast(`Passkey "${name}" was removed.`)
      },
    })
  }

  // Handle Delete Whitelist Address
  const handleDeleteWhitelist = (id: string, label: string) => {
    setConfirmModalConfig({
      isOpen: true,
      title: 'Remove Whitelist Address?',
      description: `Are you sure you want to remove "${label}" from your withdrawal allowlist? Future withdrawals to this address may be subject to security delay periods.`,
      confirmText: 'Delete Address',
      onConfirm: () => {
        setWhitelistAddresses((prev) => prev.filter((w) => w.id !== id))
        setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))
        triggerToast(`Removed "${label}" from allowlist.`)
      },
    })
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-cp-elevated border border-cp-gold text-cp-text-primary shadow-2xl animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-cp-gold shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              Security & Settings
            </h1>
            <Badge variant="gold" size="sm">
              Level 3 Security
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Manage your password, two-factor authentication, biometric passkeys, active sessions, and allowlists.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex items-center gap-3">
          <Link to="/kyc">
            <Button variant="secondary" size="sm">
              KYC Verification
            </Button>
          </Link>
          <Link to="/account">
            <Button variant="outline" size="sm" className="border-cp-border hover:border-cp-gold">
              Account Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Demonstration Security Suite:</span> CoinPlus
            does not collect real passwords, generate authentic cryptographic secrets, or connect to external identity
            vaults. All settings are simulated for frontend demonstration.
          </div>
        </div>
        <div className="text-xs font-mono text-cp-gold shrink-0 self-end sm:self-auto bg-cp-elevated px-2.5 py-1 rounded-md border border-cp-border">
          FIDO2 / 2FA Mock
        </div>
      </div>

      {/* TOP SECURITY METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Security Score</span>
            <ShieldCheck className="w-4 h-4 text-cp-positive" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-positive">
            98 / 100
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            2FA Active • Whitelist Enforced
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">2FA Protection</span>
            <Smartphone className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {is2FAEnabled ? 'Enabled' : 'Disabled'}
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Google Authenticator
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Passkeys Registered</span>
            <KeyRound className="w-4 h-4 text-cp-gold" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-text-primary">
            {passkeys.length} Keys
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            Biometric FIDO2 devices
          </div>
        </Card>

        <Card className="p-4 bg-cp-card border-cp-border">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-cp-text-secondary font-medium">Active Sessions</span>
            <Laptop className="w-4 h-4 text-cp-text-secondary" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cp-gold">
            {sessions.length} Devices
          </div>
          <div className="text-[11px] text-cp-text-secondary mt-1">
            1 Current • {sessions.length - 1} Others
          </div>
        </Card>
      </div>

      {/* 2-COLUMN MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT COLUMN: AUTHENTICATION & ACCESS */}
        <div className="space-y-6">

          {/* 1. PASSWORD MANAGEMENT */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Account Password</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Update your login password and manage complexity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                {/* Current Password */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-secondary block">
                    Current Password <span className="text-cp-negative">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password..."
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 pl-3 pr-10 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
                    >
                      {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-secondary block">
                    New Password <span className="text-cp-negative">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 8 characters with letters, numbers, symbols..."
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 pl-3 pr-10 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
                    >
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cp-text-secondary">Password Strength:</span>
                        <span className="font-bold text-cp-text-primary">{passwordStrength.label}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-cp-elevated overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-cp-text-secondary block">
                    Confirm New Password <span className="text-cp-negative">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password..."
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 pl-3 pr-10 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPw(!showConfirmPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-cp-text-secondary hover:text-cp-text-primary"
                    >
                      {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {pwError && (
                  <p className="text-[11px] text-cp-negative flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pwError}</span>
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <Button variant="primary" size="sm" type="submit">
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 2. TWO-FACTOR AUTHENTICATION (2FA) */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-cp-gold" />
                  <div>
                    <CardTitle className="text-base text-cp-text-primary">Two-Factor Authentication (2FA)</CardTitle>
                    <p className="text-xs text-cp-text-secondary">Protect logins, API keys, and withdrawals</p>
                  </div>
                </div>
                <Badge variant={is2FAEnabled ? 'positive' : 'negative'} size="sm" withDot>
                  {is2FAEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-cp-elevated border border-cp-border">
                <div className="space-y-1">
                  <span className="font-bold text-xs text-cp-text-primary block">
                    Google Authenticator / Authy / 1Password
                  </span>
                  <p className="text-cp-text-secondary text-[11px] leading-relaxed max-w-sm">
                    {is2FAEnabled
                      ? 'Two-factor authentication is active. Time-based one-time codes (TOTP) are required for all account operations.'
                      : '2FA is currently disabled. Enable 2FA to prevent unauthorized withdrawals.'}
                  </p>
                </div>

                <Button
                  variant={is2FAEnabled ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => setIs2FAModalOpen(true)}
                  className="shrink-0"
                >
                  {is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 3. BIOMETRIC PASSKEYS */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-5 h-5 text-cp-gold" />
                  <div>
                    <CardTitle className="text-base text-cp-text-primary">Passkeys (FIDO2 / WebAuthn)</CardTitle>
                    <p className="text-xs text-cp-text-secondary">Passwordless biometric sign-in keys</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsPasskeyModalOpen(true)}
                  className="h-8 text-xs border-cp-border hover:border-cp-gold"
                >
                  Add Passkey
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs">
              <p className="text-cp-text-secondary text-[11px] leading-relaxed">
                Passkeys provide hardware-grade security resistant to phishing. Use your device’s fingerprint, face unlock, or security key.
              </p>

              <div className="divide-y divide-cp-border/50">
                {passkeys.map((pk) => (
                  <div key={pk.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-gold shrink-0">
                        {pk.deviceType === 'face_id' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Fingerprint className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-cp-text-primary block text-xs">
                          {pk.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-cp-text-secondary mt-0.5 font-mono">
                          <span>Added {pk.addedDate}</span>
                          <span>•</span>
                          <span>Last used {pk.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemovePasskey(pk.id, pk.name)}
                      className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-negative hover:bg-cp-card transition-colors"
                      title="Remove passkey"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 6. TRUSTED DEVICES */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Laptop className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Trusted Devices</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Devices that remember login state without repeating 2FA for 30 days</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs">
              <div className="divide-y divide-cp-border/50">
                {trustedDevices.map((dev) => (
                  <div key={dev.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cp-elevated border border-cp-border flex items-center justify-center text-cp-gold shrink-0">
                        <Laptop className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-cp-text-primary block text-xs">
                          {dev.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-cp-text-secondary mt-0.5 font-mono">
                          <span>{dev.type}</span>
                          <span>•</span>
                          <span>Last used: {dev.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDevice(dev.id, dev.name)}
                      className="h-7 text-[11px] px-2.5 border-cp-border hover:border-cp-negative hover:text-cp-negative"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SESSIONS, WITHDRAWAL ALLOWLIST, & PREFERENCES */}
        <div className="space-y-6">

          {/* 5. ACTIVE SESSIONS */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Laptop className="w-5 h-5 text-cp-gold" />
                  <div>
                    <CardTitle className="text-base text-cp-text-primary">Active Sessions</CardTitle>
                    <p className="text-xs text-cp-text-secondary">Authorized browser and application sessions</p>
                  </div>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRevokeAllOtherSessions}
                    className="h-8 text-xs"
                  >
                    Revoke Others
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs">
              <div className="divide-y divide-cp-border/50">
                {sessions.map((ses) => (
                  <div key={ses.id} className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cp-text-primary text-xs">
                          {ses.device}
                        </span>
                        {ses.isCurrent && (
                          <Badge variant="positive" size="sm" withDot>
                            Current Device
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-cp-text-secondary font-mono mt-1">
                        <span>{ses.browser}</span>
                        <span>•</span>
                        <span>{ses.location}</span>
                        <span>•</span>
                        <span className="text-cp-gold">{ses.lastActive}</span>
                      </div>
                    </div>

                    {!ses.isCurrent && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(ses.id, ses.device)}
                        className="h-7 text-[11px] px-2.5 border-cp-border hover:border-cp-negative hover:text-cp-negative"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 4. LOGIN HISTORY */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Recent Login History</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Simulated sign-in attempts and location audit logs</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs">
              {/* Unknown Device Warning Example */}
              <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 flex items-center gap-2.5 text-xs text-cp-negative">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Security Alert:</strong> An unfamiliar Linux device attempted to log in from Frankfurt, Germany on Oct 18 and was automatically blocked by automated risk rules.
                </span>
              </div>

              <div className="divide-y divide-cp-border/50 overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap text-xs">
                  <thead className="text-[11px] text-cp-text-secondary uppercase">
                    <tr>
                      <th className="py-2">Date / Time</th>
                      <th className="py-2">Device & Browser</th>
                      <th className="py-2">Simulated Location</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cp-border/40 font-mono text-[11px]">
                    {loginHistory.map((log) => (
                      <tr key={log.id} className="hover:bg-cp-elevated/40 transition-colors">
                        <td className="py-2 text-cp-text-secondary">{log.dateTime}</td>
                        <td className="py-2 text-cp-text-primary">{log.device} ({log.browser})</td>
                        <td className="py-2 text-cp-text-secondary">{log.location}</td>
                        <td className="py-2 text-right">
                          <Badge
                            variant={
                              log.status === 'successful'
                                ? 'positive'
                                : log.status === 'blocked'
                                ? 'negative'
                                : 'neutral'
                            }
                            size="sm"
                          >
                            {log.status.toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 7. WITHDRAWAL ADDRESS ALLOWLIST */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BookMarked className="w-5 h-5 text-cp-gold" />
                  <div>
                    <CardTitle className="text-base text-cp-text-primary">Withdrawal Allowlist</CardTitle>
                    <p className="text-xs text-cp-text-secondary">Pre-approved destination addresses for payouts</p>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => {
                    setEditingWhitelistItem(null)
                    setWhitelistModalOpen(true)
                  }}
                  className="h-8 text-xs"
                >
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              {/* Whitelist-only toggle */}
              <div className="p-3.5 rounded-xl bg-cp-elevated border border-cp-border flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-xs text-cp-text-primary block">
                    Whitelist-Only Withdrawal Mode
                  </span>
                  <span className="text-[11px] text-cp-text-secondary block mt-0.5">
                    When enabled, withdrawals can only be sent to pre-approved addresses below.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={isWhitelistOnly}
                    onChange={(e) => {
                      setIsWhitelistOnly(e.target.checked)
                      triggerToast(
                        e.target.checked
                          ? 'Whitelist-only mode enabled.'
                          : 'Whitelist-only mode disabled.'
                      )
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-cp-card peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cp-gold" />
                </label>
              </div>

              {/* Whitelist Addresses List */}
              <div className="divide-y divide-cp-border/50">
                {whitelistAddresses.map((wl) => (
                  <div key={wl.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-cp-text-primary">{wl.label}</span>
                        <Badge variant="gold" size="sm" className="text-[10px] px-1.5 py-0">
                          {wl.asset}
                        </Badge>
                      </div>
                      <div className="text-[11px] font-mono text-cp-text-secondary truncate mt-0.5">
                        {wl.address}
                      </div>
                      <span className="text-[10px] text-cp-text-secondary block mt-0.5">
                        Network: {wl.network} {wl.memoTag ? `• Memo: ${wl.memoTag}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingWhitelistItem(wl)
                          setWhitelistModalOpen(true)
                        }}
                        className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-gold hover:bg-cp-elevated transition-colors"
                        title="Edit address"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteWhitelist(wl.id, wl.label)}
                        className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-negative hover:bg-cp-elevated transition-colors"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 8 & 9. PREFERENCES & SECURITY NOTIFICATIONS */}
          <Card className="border-cp-border bg-cp-card">
            <CardHeader className="border-b border-cp-border/50 pb-4">
              <div className="flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-cp-gold" />
                <div>
                  <CardTitle className="text-base text-cp-text-primary">Security Alerts & Session Rules</CardTitle>
                  <p className="text-xs text-cp-text-secondary">Automated email triggers and session timeout limits</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs">
              {/* Session Timeout Selector */}
              <div className="space-y-1.5">
                <label className="font-semibold text-cp-text-secondary block">
                  Automatic Session Inactivity Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(e.target.value)
                    triggerToast(`Session timeout updated to ${e.target.value} minutes.`)
                  }}
                  className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
                >
                  <option value="15">15 Minutes (Maximum Security)</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">1 Hour</option>
                  <option value="1440">24 Hours</option>
                </select>
              </div>

              {/* Notification Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-cp-border/50">
                <span className="font-semibold text-cp-text-primary block text-xs">
                  Instant Security Email Notifications
                </span>

                <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated cursor-pointer transition-colors">
                  <span className="text-cp-text-primary text-xs">New browser or IP login notification</span>
                  <input
                    type="checkbox"
                    checked={loginAlerts}
                    onChange={(e) => setLoginAlerts(e.target.checked)}
                    className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated cursor-pointer transition-colors">
                  <span className="text-cp-text-primary text-xs">Withdrawal requested & payout approved</span>
                  <input
                    type="checkbox"
                    checked={withdrawalAlerts}
                    onChange={(e) => setWithdrawalAlerts(e.target.checked)}
                    className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated cursor-pointer transition-colors">
                  <span className="text-cp-text-primary text-xs">Password, 2FA, or passkey modified</span>
                  <input
                    type="checkbox"
                    checked={passwordChangeAlerts}
                    onChange={(e) => setPasswordChangeAlerts(e.target.checked)}
                    className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-cp-elevated/40 hover:bg-cp-elevated cursor-pointer transition-colors">
                  <span className="text-cp-text-primary text-xs">Blocked suspicious sign-in alerts</span>
                  <input
                    type="checkbox"
                    checked={suspiciousIpAlerts}
                    onChange={(e) => setSuspiciousIpAlerts(e.target.checked)}
                    className="accent-cp-gold w-4 h-4 rounded cursor-pointer"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Two-Factor Authentication Modal */}
      <TwoFactorModal
        isOpen={is2FAModalOpen}
        isCurrentlyEnabled={is2FAEnabled}
        onSuccess={(newState) => {
          setIs2FAEnabled(newState)
          setIs2FAModalOpen(false)
          triggerToast(
            newState
              ? 'Two-Factor Authentication activated successfully!'
              : 'Two-Factor Authentication has been disabled.'
          )
        }}
        onClose={() => setIs2FAModalOpen(false)}
      />

      {/* Add Passkey Modal */}
      <AddPasskeyModal
        isOpen={isPasskeyModalOpen}
        onAdd={(newPasskey) => {
          setPasskeys((prev) => [newPasskey, ...prev])
          triggerToast(`Passkey "${newPasskey.name}" registered successfully!`)
        }}
        onClose={() => setIsPasskeyModalOpen(false)}
      />

      {/* Whitelist Address Modal */}
      <WhitelistAddressModal
        isOpen={whitelistModalOpen}
        editItem={editingWhitelistItem}
        onSave={(item) => {
          if (editingWhitelistItem) {
            setWhitelistAddresses((prev) => prev.map((w) => (w.id === item.id ? item : w)))
            triggerToast(`Updated allowlist address "${item.label}".`)
          } else {
            setWhitelistAddresses((prev) => [item, ...prev])
            triggerToast(`Added "${item.label}" to withdrawal allowlist.`)
          }
          setEditingWhitelistItem(null)
        }}
        onClose={() => {
          setWhitelistModalOpen(false)
          setEditingWhitelistItem(null)
        }}
      />

      {/* Generic Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        description={confirmModalConfig.description}
        confirmButtonText={confirmModalConfig.confirmText}
        onConfirm={confirmModalConfig.onConfirm}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  )
}

export default Settings
