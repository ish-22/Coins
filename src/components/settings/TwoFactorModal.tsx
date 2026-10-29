import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  CheckCircle2,
  KeyRound,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { accountService } from '@/services/accountService'

export interface TwoFactorModalProps {
  isOpen: boolean
  isCurrentlyEnabled: boolean
  onSuccess: (newEnabledState: boolean) => void
  onClose: () => void
}

export const TwoFactorModal: React.FC<TwoFactorModalProps> = ({
  isOpen,
  isCurrentlyEnabled,
  onSuccess,
  onClose,
}) => {
  const [code, setCode] = useState('')
  const [copiedKey, setCopiedKey] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const mockSecretKey = 'CPJ2 99XQ KLA8 22MP'

  const handleCopyKey = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(mockSecretKey.replace(/\s/g, ''))
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    }
  }

  const handleAutoFill = () => {
    setCode('654321')
    setErrorMsg(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (code.trim().length !== 6) {
      setErrorMsg('Please enter a valid 6-digit authenticator code (or click Auto-fill Demo).')
      return
    }

    setIsSubmitting(true)
    accountService
      .toggle2FA(!isCurrentlyEnabled)
      .then(() => {
        setIsSubmitting(false)
        onSuccess(!isCurrentlyEnabled)
      })
      .catch(() => {
        setIsSubmitting(false)
        onSuccess(!isCurrentlyEnabled)
      })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isCurrentlyEnabled
                  ? 'bg-cp-negative/10 border border-cp-negative/30 text-cp-negative'
                  : 'bg-cp-gold/10 border border-cp-gold/30 text-cp-gold'
              }`}
            >
              {isCurrentlyEnabled ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">
                {isCurrentlyEnabled ? 'Disable 2FA Authentication' : 'Setup Two-Factor Authentication'}
              </h3>
              <p className="text-xs text-cp-text-secondary">
                {isCurrentlyEnabled ? 'Confirm security verification' : 'Google Authenticator / Authy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {!isCurrentlyEnabled ? (
            /* Setup flow */
            <div className="space-y-4">
              <p className="text-cp-text-secondary leading-relaxed">
                Scan this demonstration QR code with Google Authenticator, Authy, or 1Password, or enter the setup key manually.
              </p>

              {/* QR Code Placeholder with geometric SVG */}
              <div className="p-4 rounded-xl bg-cp-card border border-cp-border flex flex-col items-center justify-center space-y-3 text-center">
                <div className="p-2.5 bg-white rounded-xl shadow-md">
                  <svg width="128" height="128" viewBox="0 0 128 128" className="w-32 h-32">
                    <rect width="128" height="128" fill="#ffffff" />
                    {/* Corner finder patterns */}
                    <rect x="8" y="8" width="36" height="36" fill="#000000" />
                    <rect x="14" y="14" width="24" height="24" fill="#ffffff" />
                    <rect x="20" y="20" width="12" height="12" fill="#000000" />

                    <rect x="84" y="8" width="36" height="36" fill="#000000" />
                    <rect x="90" y="14" width="24" height="24" fill="#ffffff" />
                    <rect x="96" y="20" width="12" height="12" fill="#000000" />

                    <rect x="8" y="84" width="36" height="36" fill="#000000" />
                    <rect x="14" y="90" width="24" height="24" fill="#ffffff" />
                    <rect x="20" y="96" width="12" height="12" fill="#000000" />

                    {/* Simulated data modules */}
                    <rect x="52" y="16" width="8" height="8" fill="#000000" />
                    <rect x="68" y="24" width="8" height="16" fill="#000000" />
                    <rect x="52" y="44" width="24" height="8" fill="#000000" />
                    <rect x="16" y="52" width="16" height="8" fill="#000000" />
                    <rect x="40" y="60" width="8" height="24" fill="#000000" />
                    <rect x="56" y="64" width="16" height="16" fill="#F0B93A" />
                    <rect x="84" y="52" width="16" height="8" fill="#000000" />
                    <rect x="104" y="68" width="8" height="24" fill="#000000" />
                    <rect x="60" y="92" width="24" height="8" fill="#000000" />
                    <rect x="92" y="88" width="16" height="16" fill="#000000" />
                  </svg>
                </div>
                <span className="text-[11px] text-cp-text-secondary font-mono">
                  Demo Key: CP-DEMO-2FA-AUTH
                </span>
              </div>

              {/* Secret key row */}
              <div className="space-y-1">
                <span className="text-cp-text-secondary block">Manual Setup Key:</span>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-cp-card border border-cp-border font-mono text-cp-text-primary text-xs">
                  <span>{mockSecretKey}</span>
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="p-1 hover:text-cp-gold transition-colors text-cp-text-secondary"
                    title="Copy key"
                  >
                    {copiedKey ? <CheckCircle2 className="w-4 h-4 text-cp-positive" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Disable warning */
            <div className="p-4 rounded-xl bg-cp-negative/10 border border-cp-negative/30 space-y-2">
              <span className="font-bold text-cp-negative flex items-center gap-1.5 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0" /> Security Warning
              </span>
              <p className="text-cp-text-secondary text-[11px] leading-relaxed">
                Disabling Two-Factor Authentication reduces your account protection. For your safety, withdrawals may be locked for 24 hours after disabling 2FA.
              </p>
            </div>
          )}

          {/* Verification Code Input */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-cp-text-primary">
                6-Digit Authenticator Code <span className="text-cp-negative">*</span>
              </label>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-[11px] text-cp-gold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-fill Demo Code
              </button>
            </div>

            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => {
                setCode(e.target.value.replace(/\D/g, ''))
                setErrorMsg(null)
              }}
              placeholder="000000"
              autoFocus
              className="w-full bg-cp-card border border-cp-border rounded-xl py-3 px-4 text-center font-mono text-xl tracking-widest text-cp-text-primary focus:outline-none focus:border-cp-gold transition-colors"
            />

            {errorMsg && (
              <p className="text-[11px] text-cp-negative text-center">{errorMsg}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={isCurrentlyEnabled ? 'danger' : 'primary'}
              size="sm"
              type="submit"
              isLoading={isSubmitting}
            >
              {isCurrentlyEnabled ? 'Disable 2FA' : 'Activate 2FA'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
