import React, { useState, useEffect } from 'react'
import {
  Sliders,
  Save,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Coins,
  Shield,
  Server,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { adminService } from '@/services'

export const AdminSettings: React.FC = () => {
  // Fee & Limit States
  const [makerFee, setMakerFee] = useState('0.10')
  const [takerFee, setTakerFee] = useState('0.10')
  const [dailyWithdrawalLimitBtc, setDailyWithdrawalLimitBtc] = useState('100.0')
  const [minDepositUsd, setMinDepositUsd] = useState('10.00')

  // Maintenance Banner States
  const [maintenanceModeActive, setMaintenanceModeActive] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState(
    'Scheduled matching engine optimization in progress. Spot trades temporarily simulated.'
  )

  // Notification & Security States
  const [alertLargeWithdrawals, setAlertLargeWithdrawals] = useState(true)
  const [highRiskThresholdUsd, setHighRiskThresholdUsd] = useState('25000')
  const [telegramWebhookPlaceholder, setTelegramWebhookPlaceholder] = useState(
    'https://api.telegram.org/bot[SIMULATED_TOKEN]/sendMessage'
  )

  // Toast confirmation
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        setLoadError(null)
        const settings = await adminService.getSettings()

        if (settings?.platform_name) {
          setMaintenanceMessage(settings.maintenance_message || maintenanceMessage)
        }

        if (settings?.maker_fee !== undefined) setMakerFee(String(settings.maker_fee ?? '0.10'))
        if (settings?.taker_fee !== undefined) setTakerFee(String(settings.taker_fee ?? '0.10'))
        if (settings?.max_daily_withdrawal_tier2 !== undefined) setDailyWithdrawalLimitBtc(String(settings.max_daily_withdrawal_tier2 / 1 || '100.0'))
        if (settings?.min_deposit_value_usd !== undefined) setMinDepositUsd(String(settings.min_deposit_value_usd ?? '10.00'))
        if (settings?.maintenance_mode !== undefined) setMaintenanceModeActive(Boolean(settings.maintenance_mode))
        if (settings?.alert_large_withdrawals !== undefined) setAlertLargeWithdrawals(Boolean(settings.alert_large_withdrawals))
        if (settings?.high_risk_threshold_usd !== undefined) setHighRiskThresholdUsd(String(settings.high_risk_threshold_usd ?? '25000'))
      } catch (error: any) {
        setLoadError(error?.response?.data?.message || 'Unable to load platform settings from the backend.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const payload = {
        maker_fee: Number(makerFee),
        taker_fee: Number(takerFee),
        max_daily_withdrawal_tier2: Number(dailyWithdrawalLimitBtc),
        min_deposit_value_usd: Number(minDepositUsd),
        maintenance_mode: maintenanceModeActive,
        maintenance_message: maintenanceMessage,
        alert_large_withdrawals: alertLargeWithdrawals,
        high_risk_threshold_usd: Number(highRiskThresholdUsd),
        telegram_webhook: telegramWebhookPlaceholder,
      }

      await adminService.updateSettings(payload)
      setToastMessage('Platform administration parameters and fee schedules updated from the live database.')
    } catch (error: any) {
      setToastMessage(error?.response?.data?.message || 'Platform settings could not be saved to the backend.')
    } finally {
      setIsSaving(false)
      setTimeout(() => setToastMessage(null), 4000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-cp-text-primary tracking-tight">
            Platform Parameters & Operational Settings
          </h1>
          <p className="text-xs text-cp-text-muted mt-0.5">
            Configure global spot trading fees, withdrawal quotas, maintenance banners, and automated alert webhooks
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSaveSettings} disabled={isSaving}>
          <Save className="w-4 h-4 mr-1.5" />
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      {loadError && (
        <div className="p-3 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative">
          {loadError}
        </div>
      )}

      {isLoading && (
        <div className="p-4 rounded-xl border border-cp-border bg-cp-card text-xs text-cp-text-muted">
          Loading platform settings from the live API...
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-cp-positive/15 border border-cp-positive/30 text-xs text-cp-positive flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* 1. FEE & LIMIT SCHEDULES */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
                <Coins className="w-4 h-4 text-cp-gold" />
                Global Fee & Withdrawal Limits (Tier 0 Default)
              </CardTitle>
              <Badge variant="gold" size="sm">
                Spot Engine Schedules
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <Input
                label="Base Maker Fee (%) *"
                value={makerFee}
                onChange={(e) => setMakerFee(e.target.value)}
                placeholder="0.10"
              />
              <span className="text-[10px] text-cp-text-muted mt-1 block">Default limit order maker fee</span>
            </div>

            <div>
              <Input
                label="Base Taker Fee (%) *"
                value={takerFee}
                onChange={(e) => setTakerFee(e.target.value)}
                placeholder="0.10"
              />
              <span className="text-[10px] text-cp-text-muted mt-1 block">Default market order taker fee</span>
            </div>

            <div>
              <Input
                label="Daily Max Payout Quota (BTC) *"
                value={dailyWithdrawalLimitBtc}
                onChange={(e) => setDailyWithdrawalLimitBtc(e.target.value)}
                placeholder="100.0"
              />
              <span className="text-[10px] text-cp-text-muted mt-1 block">Tier 2 maximum 24h allowance</span>
            </div>

            <div>
              <Input
                label="Minimum Deposit Value ($) *"
                value={minDepositUsd}
                onChange={(e) => setMinDepositUsd(e.target.value)}
                placeholder="10.00"
              />
              <span className="text-[10px] text-cp-text-muted mt-1 block">Threshold for simulated ledger credit</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. MAINTENANCE MODE & BANNER CONTROLS */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
                <Server className="w-4 h-4 text-cp-gold" />
                Maintenance Mode & Header Banners
              </CardTitle>
              <Badge variant={maintenanceModeActive ? 'negative' : 'positive'} size="sm">
                {maintenanceModeActive ? 'Active Maintenance Banner' : 'Standard Operations'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div className="space-y-0.5">
                <span className="font-bold text-cp-text-primary block">
                  Broadcast Global Maintenance Notice
                </span>
                <p className="text-[11px] text-cp-text-muted">
                  Displays a prominent warning banner across the customer website header
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMaintenanceModeActive(!maintenanceModeActive)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  maintenanceModeActive
                    ? 'bg-cp-negative text-white'
                    : 'bg-cp-elevated text-cp-text-secondary border border-cp-border hover:text-cp-text-primary'
                }`}
              >
                {maintenanceModeActive ? 'BANNER ACTIVE (CLICK TO DISABLE)' : 'ACTIVATE BANNER'}
              </button>
            </div>

            {maintenanceModeActive && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="font-semibold text-cp-text-secondary block">
                  Broadcast Banner Copy:
                </label>
                <textarea
                  rows={2}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3. AUTOMATED RISK ALERTS & WEBHOOKS */}
        <Card className="bg-[#0c121c] border-cp-border">
          <CardHeader className="border-b border-cp-border/80 pb-4">
            <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
              <Bell className="w-4 h-4 text-cp-gold" />
              Automated SecOps Risk Alert Channels
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-cp-text-secondary block mb-1">
                  High-Value Withdrawal Alert Threshold (USD)
                </label>
                <input
                  type="text"
                  value={highRiskThresholdUsd}
                  onChange={(e) => setHighRiskThresholdUsd(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary focus:outline-none"
                />
                <span className="text-[10px] text-cp-text-muted mt-1 block">
                  Triggers operator notification queue when payout exceeds this value
                </span>
              </div>

              <div>
                <label className="font-semibold text-cp-text-secondary block mb-1">
                  Telegram Bot Webhook Endpoint (Simulated)
                </label>
                <input
                  type="text"
                  value={telegramWebhookPlaceholder}
                  onChange={(e) => setTelegramWebhookPlaceholder(e.target.value)}
                  className="w-full bg-[#141d2b] border border-cp-border rounded-xl p-2.5 text-xs text-cp-text-primary font-mono focus:outline-none"
                />
                <span className="text-[10px] text-cp-text-muted mt-1 block">
                  Simulated dispatch endpoint for high-severity alerts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="alert-toggle"
                checked={alertLargeWithdrawals}
                onChange={(e) => setAlertLargeWithdrawals(e.target.checked)}
                className="w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-0 accent-[#F0B93A]"
              />
              <label htmlFor="alert-toggle" className="text-xs text-cp-text-secondary cursor-pointer select-none">
                Require manual operator sign-off on all payouts exceeding the high-value threshold
              </label>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}

export default AdminSettings
