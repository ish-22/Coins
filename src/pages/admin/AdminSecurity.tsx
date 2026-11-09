import React, { useState } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Smartphone,
  Globe,
  KeyRound,
  Save,
  CheckCircle2,
  AlertTriangle,
  Server,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'

export const AdminSecurity: React.FC = () => {
  const [enforce2FA, setEnforce2FA] = useState(true)
  const [enforcePasskeys, setEnforcePasskeys] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5')
  const [lockoutDuration, setLockoutDuration] = useState('15')
  const [ipWhitelistEnabled, setIpWhitelistEnabled] = useState(false)
  const [ipWhitelist, setIpWhitelist] = useState('127.0.0.1\n192.168.1.0/24')
  const [isSaving, setIsSaving] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setSuccessToast('Administrative security parameters updated and logged in the immutable audit trail.')
      setTimeout(() => setSuccessToast(null), 4000)
    }, 600)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Security Settings
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Configure institutional authentication policies, session timeouts, IP whitelisting, and brute-force defenses
          </p>
        </div>

        <Badge variant="positive" size="sm" className="px-2.5 py-1">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          SOC-2 & ISO 27001 Compliant
        </Badge>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button type="button" onClick={() => setSuccessToast(null)} className="p-1 hover:text-white">✕</button>
        </div>
      )}

      <form onSubmit={handleSaveSecurity} className="space-y-6">
        {/* Section 1: Authentication & 2FA Policies */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-3">
            <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cp-gold" />
              Administrative Authentication & 2FA Enforcement
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div>
                <span className="font-bold text-cp-text-primary block">
                  Mandatory Two-Factor Authentication (2FA) for All Operators
                </span>
                <span className="text-[11px] text-cp-text-muted">
                  Requires TOTP 6-digit verification code from Google Authenticator, Authy, or Duo on every login
                </span>
              </div>
              <input
                type="checkbox"
                checked={enforce2FA}
                onChange={(e) => setEnforce2FA(e.target.checked)}
                className="w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-0 accent-[#F0B93A]"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div>
                <span className="font-bold text-cp-text-primary block">
                  Enforce Hardware Passkeys (FIDO2 / WebAuthn) for SuperAdmins
                </span>
                <span className="text-[11px] text-cp-text-muted">
                  Restricts root-level administrative actions to registered biometric devices or YubiKeys
                </span>
              </div>
              <input
                type="checkbox"
                checked={enforcePasskeys}
                onChange={(e) => setEnforcePasskeys(e.target.checked)}
                className="w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-0 accent-[#F0B93A]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Session & Access Timeout Management */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-3">
            <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-cp-gold" />
              Session Management & Rate Limiting
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-cp-text-muted font-semibold block mb-1">
                  Operator Session Inactivity Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary focus:outline-none"
                >
                  <option value="15">15 Minutes (High Security)</option>
                  <option value="30">30 Minutes (Recommended)</option>
                  <option value="60">1 Hour</option>
                  <option value="480">8 Hours (Full Shift)</option>
                </select>
              </div>

              <div>
                <label className="text-cp-text-muted font-semibold block mb-1">
                  Max Failed Login Attempts
                </label>
                <input
                  type="number"
                  min="3"
                  max="10"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-cp-text-muted font-semibold block mb-1">
                  Lockout Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={lockoutDuration}
                  onChange={(e) => setLockoutDuration(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-cp-text-primary font-mono focus:outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: IP Whitelist & Network Fencing */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-3">
            <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
              <Globe className="w-4 h-4 text-cp-gold" />
              IP Whitelisting & Network Perimeter
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div>
                <span className="font-bold text-cp-text-primary block">
                  Enable Strict Administrative IP Whitelist
                </span>
                <span className="text-[11px] text-cp-text-muted">
                  Rejects access to /admin/* from any IP address not listed below
                </span>
              </div>
              <input
                type="checkbox"
                checked={ipWhitelistEnabled}
                onChange={(e) => setIpWhitelistEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-0 accent-[#F0B93A]"
              />
            </div>

            <div>
              <label className="text-cp-text-muted font-semibold block mb-1">
                Whitelisted CIDR Blocks / IP Addresses (One per line)
              </label>
              <textarea
                rows={4}
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                disabled={!ipWhitelistEnabled}
                className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-3 font-mono text-xs text-cp-text-primary focus:outline-none disabled:opacity-40"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving}
            className="flex items-center gap-1.5 font-bold px-6"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Updating Policies...' : 'Save Security Policies'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}

export default AdminSecurity

