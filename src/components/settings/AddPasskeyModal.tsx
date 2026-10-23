import React, { useState } from 'react'
import { X, KeyRound, Fingerprint, Smartphone, Laptop, CheckCircle2, Sparkles } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { PasskeyItem } from '@/mock/settingsData'

export interface AddPasskeyModalProps {
  isOpen: boolean
  onAdd: (passkey: PasskeyItem) => void
  onClose: () => void
}

export const AddPasskeyModal: React.FC<AddPasskeyModalProps> = ({
  isOpen,
  onAdd,
  onClose,
}) => {
  const [passkeyName, setPasskeyName] = useState('My Security Passkey')
  const [deviceType, setDeviceType] = useState<PasskeyItem['deviceType']>('touch_id')
  const [isSimulatingBiometrics, setIsSimulatingBiometrics] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  if (!isOpen) return null

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!passkeyName.trim()) {
      setErrorMsg('Please specify a recognizable passkey label.')
      return
    }

    setIsSimulatingBiometrics(true)
    setTimeout(() => {
      setIsSimulatingBiometrics(false)
      onAdd({
        id: `pk-${Date.now().toString().slice(-4)}`,
        name: passkeyName.trim(),
        deviceType,
        addedDate: new Date().toISOString().split('T')[0],
        lastUsed: 'Just now',
      })
      onClose()
    }, 700)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl bg-cp-elevated border border-cp-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-cp-border flex items-center justify-between bg-cp-card/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cp-text-primary">Register Biometric Passkey</h3>
              <p className="text-xs text-cp-text-secondary">FIDO2 / WebAuthn passwordless security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleRegister} className="p-6 space-y-4 text-xs">
          <p className="text-cp-text-secondary leading-relaxed">
            Passkeys allow you to sign in securely and approve withdrawals using fingerprint (Touch ID / Windows Hello), Face ID, or hardware security keys without SMS or passwords.
          </p>

          {/* Passkey Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-primary block">
              Passkey Label <span className="text-cp-negative">*</span>
            </label>
            <input
              type="text"
              value={passkeyName}
              onChange={(e) => {
                setPasskeyName(e.target.value)
                setErrorMsg(null)
              }}
              placeholder="e.g. MacBook Pro Touch ID, iPhone Face ID"
              className="w-full bg-cp-card border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
            />
            {errorMsg && <p className="text-[11px] text-cp-negative">{errorMsg}</p>}
          </div>

          {/* Device Type */}
          <div className="space-y-1.5">
            <label className="font-semibold text-cp-text-secondary block">Authenticator Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeviceType('touch_id')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                  deviceType === 'touch_id'
                    ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                    : 'bg-cp-card border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                }`}
              >
                <Fingerprint className="w-4 h-4 shrink-0" />
                <span>Touch ID / Fingerprint</span>
              </button>

              <button
                type="button"
                onClick={() => setDeviceType('face_id')}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-colors ${
                  deviceType === 'face_id'
                    ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                    : 'bg-cp-card border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                }`}
              >
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Face ID / Mobile</span>
              </button>
            </div>
          </div>

          {/* Biometrics Simulation Area */}
          {isSimulatingBiometrics ? (
            <div className="p-4 rounded-xl bg-cp-card border border-cp-gold/40 text-center space-y-2 animate-in fade-in">
              <Fingerprint className="w-8 h-8 text-cp-gold mx-auto animate-pulse" />
              <span className="font-bold text-xs text-cp-text-primary block">
                Simulating Biometric Verification...
              </span>
              <span className="text-[11px] text-cp-text-secondary">
                Touch your sensor or look at your camera to confirm registration.
              </span>
            </div>
          ) : null}

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              isLoading={isSimulatingBiometrics}
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Register Passkey
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
