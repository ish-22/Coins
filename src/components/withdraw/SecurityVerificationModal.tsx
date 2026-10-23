import React, { useState } from 'react'
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  AlertTriangle,
  Sparkles,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { WithdrawPayload } from './WithdrawConfirmationModal'
import { formatCrypto } from '@/utils/formatters'
import { useAuth } from '@/context/AuthContext'

export interface SecurityVerificationModalProps {
  isOpen: boolean
  payload: WithdrawPayload | null
  onSuccess: () => void
  onBack: () => void
  onClose: () => void
}

export const SecurityVerificationModal: React.FC<SecurityVerificationModalProps> = ({
  isOpen,
  payload,
  onSuccess,
  onBack,
  onClose,
}) => {
  const { user } = useAuth()
  const [google2faCode, setGoogle2faCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !payload) return null

  // Fast test fill helper
  const handleAutoFill = () => {
    setGoogle2faCode('884920')
    setEmailCode('123456')
    setErrorMsg(null)
  }

  const handleSendEmailCode = () => {
    setCodeSent(true)
    setEmailCode('123456')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (google2faCode.trim().length < 6) {
      setErrorMsg('Please enter a 6-digit Google Authenticator code (or click Auto-fill Demo).')
      return
    }

    if (emailCode.trim().length < 6) {
      setErrorMsg('Please enter a 6-digit Email confirmation code.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onSuccess()
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-elevated overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cp-border flex items-center justify-between bg-cp-card">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cp-gold/10 text-cp-gold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-cp-text-primary">
                Security Verification
              </h3>
              <span className="text-xs text-cp-text-muted">
                Step 2 of 2: Authorize Withdrawal
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Quick Demo Helper Button */}
          <div className="p-3 rounded-xl bg-cp-card border border-cp-gold/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-cp-gold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Demo Fast Fill</span>
              </span>
              <p className="text-[11px] text-cp-text-muted">
                Populate mock 2FA & email codes for instant testing
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoFill}
              className="text-xs font-semibold py-1 px-2.5"
            >
              Auto-fill Codes
            </Button>
          </div>

          {/* 1. Google Authenticator 2FA */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-cp-text-muted flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-cp-gold" />
              <span>Google Authenticator (6-digit 2FA)</span>
            </label>

            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 884920"
              value={google2faCode}
              onChange={(e) => setGoogle2faCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-cp-card border border-cp-border rounded-xl py-2.5 px-3.5 text-center font-mono text-base font-bold tracking-widest text-cp-text-primary focus:outline-none focus:border-cp-gold"
            />
          </div>

          {/* 2. Email Verification Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-cp-text-muted flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cp-gold" />
                <span>Email Verification Code ({user?.email || 'your email'})</span>
              </label>

              <button
                type="button"
                onClick={handleSendEmailCode}
                className="text-[10px] text-cp-gold hover:underline font-semibold"
              >
                {codeSent ? 'Resend (59s)' : 'Get Code'}
              </button>
            </div>

            <input
              type="text"
              maxLength={6}
              placeholder="e.g. 123456"
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-cp-card border border-cp-border rounded-xl py-2.5 px-3.5 text-center font-mono text-base font-bold tracking-widest text-cp-text-primary focus:outline-none focus:border-cp-gold"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-cp-negative font-medium pt-1">{errorMsg}</p>
          )}

          {/* Disclaimer */}
          <div className="p-2.5 rounded-lg bg-cp-card border border-cp-border text-[11px] text-cp-text-muted flex items-center gap-2">
            <Lock className="w-4 h-4 text-cp-gold shrink-0" />
            <span>Simulated multi-factor validation for demonstration mode.</span>
          </div>

          {/* Buttons */}
          <div className="pt-2 border-t border-cp-border flex items-center justify-end gap-3">
            <Button type="button" variant="ghost" size="md" onClick={onBack}>
              Back
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              className="font-bold uppercase tracking-wider"
            >
              Submit Withdrawal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SecurityVerificationModal
