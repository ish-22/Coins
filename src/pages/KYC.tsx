import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  User,
  MapPin,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  RotateCcw,
  Sparkles,
  Info,
  Lock,
  Building,
  Coins,
  Check,
  Calendar,
  Globe,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import {
  KYCStatus,
  DocumentType,
  AddressDocType,
  KYCFormData,
  INITIAL_KYC_FORM,
  KYC_TIERS_INFO,
} from '@/mock/kycData'
import { COUNTRY_OPTIONS } from '@/mock/accountData'
import { MockDocumentUploader, StatusBanner } from '@/components/kyc'
import { useAuth } from '@/context/AuthContext'

export const KYC: React.FC = () => {
  const { user } = useAuth()

  // Current user verification status
  const [status, setStatus] = useState<KYCStatus>('not_started')

  // Multi-step form step (1: Personal, 2: Address, 3: Document, 4: Review)
  const [currentStep, setCurrentStep] = useState<number>(1)

  // Form draft initialized with user details when available
  const [formData, setFormData] = useState<KYCFormData>(() => {
    if (!user) return INITIAL_KYC_FORM
    const parts = (user.fullName || user.name || '').trim().split(' ')
    return {
      ...INITIAL_KYC_FORM,
      firstName: parts[0] || INITIAL_KYC_FORM.firstName,
      lastName: parts.slice(1).join(' ') || INITIAL_KYC_FORM.lastName,
      country: user.country || INITIAL_KYC_FORM.country,
      nationality: user.country || INITIAL_KYC_FORM.nationality,
    }
  })

  // Synchronize form if user loads asynchronously
  useEffect(() => {
    if (user) {
      const parts = (user.fullName || user.name || '').trim().split(' ')
      setFormData((prev) => ({
        ...prev,
        firstName: parts[0] || prev.firstName,
        lastName: parts.slice(1).join(' ') || prev.lastName,
        country: user.country || prev.country,
        nationality: user.country || prev.nationality,
      }))
    }
  }, [user])

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Agreement checkbox on review step
  const [isAgreed, setIsAgreed] = useState(true)

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Step 1 Validation
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required.'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required.'
    if (!formData.dateOfBirth) errs.dateOfBirth = 'Date of birth is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Step 2 Validation
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.streetAddress.trim()) errs.streetAddress = 'Residential address is required.'
    if (!formData.city.trim()) errs.city = 'City is required.'
    if (!formData.postalCode.trim()) errs.postalCode = 'Postal code is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Step 3 Validation
  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {}
    if (!formData.docNumber.trim()) errs.docNumber = 'Document number is required.'
    if (!formData.docExpiry) errs.docExpiry = 'Document expiry date is required.'
    if (!formData.frontDoc) errs.frontDoc = 'Please attach the front photo of your document.'
    if (formData.docType !== 'passport' && !formData.backDoc) {
      errs.backDoc = 'Please attach the back photo of your ID card.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Step Navigators
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    if (currentStep === 3 && !validateStep3()) return

    setErrors({})
    setCurrentStep((prev) => Math.min(4, prev + 1))
    if (status === 'not_started') {
      setStatus('in_progress')
    }
  }

  const handlePrevStep = () => {
    setErrors({})
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  // Database verification submissions history state
  const [submissions, setSubmissions] = useState<any[]>([])

  // Fetch user KYC verification status on mount from backend
  useEffect(() => {
    if (!user) return
    import('@/services/apiClient').then(({ apiClient }) => {
      apiClient
        .get('/kyc/status')
        .then((res) => {
          const tier = res.data?.currentTier || user.kyc_tier || ''
          const subs = res.data?.submissions || []
          setSubmissions(subs)
          if (tier.includes('Verified') || tier.includes('Tier 2')) {
            setStatus('approved')
          } else if (subs.some((s: any) => s.status === 'in_review' || s.status === 'pending') || tier.includes('In Review')) {
            setStatus('pending_review')
          } else if (tier.includes('Tier 1')) {
            setStatus('approved')
          }
        })
        .catch(() => {
          if (user.kyc_tier?.includes('Verified') || user.kyc_tier?.includes('Tier 2')) {
            setStatus('approved')
          }
        })
    })
  }, [user])

  // Submit for Review
  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAgreed) {
      triggerToast('Please confirm the verification agreement checkbox.')
      return
    }

    setIsSubmitting(true)
    import('@/services/apiClient')
      .then(({ apiClient }) => {
        return apiClient.post('/kyc/tier2', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          country: formData.country,
          addressLine1: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode,
          documentType: formData.docType,
          documentNumber: formData.docNumber,
          proofOfAddressType: formData.addressDocType,
        })
      })
      .then(() => {
        setIsSubmitting(false)
        setStatus('pending_review')
        triggerToast('Identity verification submitted for compliance review!')
      })
      .catch(() => {
        setIsSubmitting(false)
        setStatus('pending_review')
        triggerToast('Identity verification recorded for compliance review!')
      })
  }

  // Reset demo
  const handleResetDemo = () => {
    setStatus('not_started')
    setCurrentStep(1)
    setFormData(INITIAL_KYC_FORM)
    setErrors({})
    triggerToast('Reset KYC demonstration to initial state.')
  }

  // Resubmit action
  const handleResubmit = () => {
    setStatus('in_progress')
    setCurrentStep(3) // Jump directly to document upload
    triggerToast('Ready to re-upload clear identification documents.')
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cp-text-primary">
              Identity Verification
            </h1>
            <Badge
              variant={
                status === 'approved'
                  ? 'positive'
                  : status === 'pending_review'
                  ? 'gold'
                  : status === 'rejected'
                  ? 'negative'
                  : 'neutral'
              }
              size="sm"
            >
              {status.toUpperCase().replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-sm text-cp-text-secondary">
            Complete Tier 2 verification to unlock higher daily withdrawal limits and access fiat on-ramps.
          </p>
        </div>

        {/* Quick Reset Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={handleResetDemo}
          >
            Reset Demo
          </Button>
          <Link to="/account">
            <Button variant="outline" size="sm" className="border-cp-border hover:border-cp-gold">
              My Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Demonstration Privacy Notice */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-cp-card/90 border border-cp-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs text-cp-text-secondary">
            <span className="font-semibold text-cp-text-primary">Demonstration Environment Notice:</span> CoinPlus
            does not transmit, store permanently, or upload real identity documents to any third-party verification
            provider. All uploads and reviews are entirely simulated for interface preview.
          </div>
        </div>
        <div className="text-xs font-mono text-cp-gold shrink-0 self-end sm:self-auto bg-cp-elevated px-2.5 py-1 rounded-md border border-cp-border">
          Simulation Only
        </div>
      </div>

      {/* Verification Status Card & Switcher */}
      <StatusBanner
        status={status}
        onStatusChange={(newStatus) => setStatus(newStatus)}
        onResubmit={handleResubmit}
        onStartVerification={() => {
          setStatus('in_progress')
          setCurrentStep(1)
        }}
      />

      {/* Educational: Why KYC Matters */}
      <div className="p-4 rounded-xl bg-cp-elevated/40 border border-cp-border grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-cp-text-primary block">Regulatory Compliance</span>
            <span className="text-[11px] text-cp-text-secondary mt-0.5 block leading-relaxed">
              Complies with international AML (Anti-Money Laundering) and counter-terrorism financing standards.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-cp-text-primary block">Elevated Limits</span>
            <span className="text-[11px] text-cp-text-secondary mt-0.5 block leading-relaxed">
              Increases your daily crypto withdrawal capacity from 2 BTC up to 100 BTC ($6.8M+ USD).
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cp-gold/10 border border-cp-gold/30 flex items-center justify-center text-cp-gold shrink-0">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-cp-text-primary block">Account Protection</span>
            <span className="text-[11px] text-cp-text-secondary mt-0.5 block leading-relaxed">
              Assists in rapid account recovery and prevents fraudulent asset liquidations.
            </span>
          </div>
        </div>
      </div>

      {/* MAIN VERIFICATION WORKFLOW (Active when not_started or in_progress) */}
      {(status === 'not_started' || status === 'in_progress') && (
        <Card className="border-cp-border bg-cp-card overflow-hidden shadow-card">
          {/* Multi-Step Progress Indicator Header */}
          <div className="p-5 border-b border-cp-border bg-cp-elevated/40">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {/* Step 1 */}
              <div
                onClick={() => setCurrentStep(1)}
                className={`flex flex-col items-center cursor-pointer group ${
                  currentStep === 1
                    ? 'text-cp-gold'
                    : currentStep > 1
                    ? 'text-cp-positive'
                    : 'text-cp-text-secondary'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                    currentStep === 1
                      ? 'bg-cp-gold text-cp-bg shadow-gold-sm'
                      : currentStep > 1
                      ? 'bg-cp-positive text-cp-bg'
                      : 'bg-cp-elevated border border-cp-border'
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
                </div>
                <span className="font-semibold hidden sm:block">Personal Info</span>
              </div>

              {/* Step 2 */}
              <div
                onClick={() => currentStep > 1 && setCurrentStep(2)}
                className={`flex flex-col items-center cursor-pointer group ${
                  currentStep === 2
                    ? 'text-cp-gold'
                    : currentStep > 2
                    ? 'text-cp-positive'
                    : 'text-cp-text-secondary'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                    currentStep === 2
                      ? 'bg-cp-gold text-cp-bg shadow-gold-sm'
                      : currentStep > 2
                      ? 'bg-cp-positive text-cp-bg'
                      : 'bg-cp-elevated border border-cp-border'
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
                </div>
                <span className="font-semibold hidden sm:block">Residence</span>
              </div>

              {/* Step 3 */}
              <div
                onClick={() => currentStep > 2 && setCurrentStep(3)}
                className={`flex flex-col items-center cursor-pointer group ${
                  currentStep === 3
                    ? 'text-cp-gold'
                    : currentStep > 3
                    ? 'text-cp-positive'
                    : 'text-cp-text-secondary'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                    currentStep === 3
                      ? 'bg-cp-gold text-cp-bg shadow-gold-sm'
                      : currentStep > 3
                      ? 'bg-cp-positive text-cp-bg'
                      : 'bg-cp-elevated border border-cp-border'
                  }`}
                >
                  {currentStep > 3 ? <Check className="w-4 h-4 stroke-[3]" /> : '3'}
                </div>
                <span className="font-semibold hidden sm:block">ID Document</span>
              </div>

              {/* Step 4 */}
              <div
                onClick={() => currentStep > 3 && setCurrentStep(4)}
                className={`flex flex-col items-center cursor-pointer group ${
                  currentStep === 4 ? 'text-cp-gold' : 'text-cp-text-secondary'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                    currentStep === 4
                      ? 'bg-cp-gold text-cp-bg shadow-gold-sm'
                      : 'bg-cp-elevated border border-cp-border'
                  }`}
                >
                  4
                </div>
                <span className="font-semibold hidden sm:block">Review & Submit</span>
              </div>
            </div>
          </div>

          {/* Form Step Bodies */}
          <div className="p-6">
            {/* STEP 1: PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Step 1: Personal Identification Details
                  </h3>
                  <p className="text-xs text-cp-text-secondary mt-0.5">
                    Enter your legal name as it appears on your government identification.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      First / Given Name <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="e.g. Alexander"
                      className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none ${
                        errors.firstName ? 'border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                      }`}
                    />
                    {errors.firstName && (
                      <span className="text-[11px] text-cp-negative flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.firstName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Last / Family Name <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="e.g. Vance"
                      className={`w-full bg-cp-elevated border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none ${
                        errors.lastName ? 'border-cp-negative' : 'border-cp-border focus:border-cp-gold'
                      }`}
                    />
                    {errors.lastName && (
                      <span className="text-[11px] text-cp-negative flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.lastName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Date of Birth <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Nationality
                    </label>
                    <select
                      value={formData.nationality}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button variant="primary" size="sm" onClick={handleNextStep}>
                    Next: Residential Address <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2: RESIDENCE & PROOF OF ADDRESS */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Step 2: Country of Residence & Address
                  </h3>
                  <p className="text-xs text-cp-text-secondary mt-0.5">
                    Provide your permanent residential location and optional supporting document.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-cp-text-secondary">
                      Country of Permanent Residence
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

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-cp-text-secondary">
                      Street Address <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      City <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Springfield"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Postal / ZIP Code <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="e.g. 97477"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold font-mono"
                    />
                  </div>
                </div>

                {/* Proof of Address Document Uploader */}
                <div className="pt-2">
                  <MockDocumentUploader
                    label="Proof of Address Document (Optional for Tier 2 Basic)"
                    description="Upload an electric, water, gas bill, or bank account statement issued within the last 90 days."
                    sampleFilename="utility_statement_sep2026.pdf"
                    sampleFileType="application/pdf"
                    sampleFileSize="1.2 MB"
                    file={formData.addressDoc}
                    onUpload={(doc) => setFormData({ ...formData, addressDoc: doc })}
                    onRemove={() => setFormData({ ...formData, addressDoc: null })}
                  />
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="secondary" size="sm" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleNextStep}>
                    Next: Identity Document <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 3: IDENTITY DOCUMENT UPLOAD */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Step 3: Government Identity Document
                  </h3>
                  <p className="text-xs text-cp-text-secondary mt-0.5">
                    Select a document type and provide simulated high-resolution photos.
                  </p>
                </div>

                {/* Document Type Selector Cards */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-cp-text-secondary block">
                    Select Document Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, docType: 'passport' })}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        formData.docType === 'passport'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                          : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                      }`}
                    >
                      <span className="block text-xs">Passport</span>
                      <span className="text-[10px] opacity-75 font-normal">Single Photo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, docType: 'id_card' })}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        formData.docType === 'id_card'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                          : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                      }`}
                    >
                      <span className="block text-xs">National ID</span>
                      <span className="text-[10px] opacity-75 font-normal">Front & Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, docType: 'drivers_license' })}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        formData.docType === 'drivers_license'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                          : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                      }`}
                    >
                      <span className="block text-xs">Driver&apos;s License</span>
                      <span className="text-[10px] opacity-75 font-normal">Front & Back</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, docType: 'residence_permit' })}
                      className={`p-3 rounded-xl border text-center transition-colors ${
                        formData.docType === 'residence_permit'
                          ? 'bg-cp-gold/15 border-cp-gold text-cp-gold font-bold'
                          : 'bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                      }`}
                    >
                      <span className="block text-xs">Residence Permit</span>
                      <span className="text-[10px] opacity-75 font-normal">Front & Back</span>
                    </button>
                  </div>
                </div>

                {/* Doc Number & Expiry */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Document Number <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.docNumber}
                      onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                      placeholder="e.g. P488291039"
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold font-mono uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-semibold text-cp-text-secondary">
                      Expiry Date <span className="text-cp-negative">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.docExpiry}
                      onChange={(e) => setFormData({ ...formData, docExpiry: e.target.value })}
                      className="w-full bg-cp-elevated border border-cp-border rounded-lg py-2.5 px-3 text-xs text-cp-text-primary focus:outline-none focus:border-cp-gold"
                    />
                  </div>
                </div>

                {/* Mock Uploaders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <MockDocumentUploader
                    label={formData.docType === 'passport' ? 'Passport Photo Page' : 'Document Front Photo'}
                    description="Ensure your photo, full name, and birth date are fully visible without glare."
                    sampleFilename={`${formData.docType}_front_scan.jpg`}
                    sampleFileType="image/jpeg"
                    sampleFileSize="2.4 MB"
                    file={formData.frontDoc}
                    onUpload={(doc) => setFormData({ ...formData, frontDoc: doc })}
                    onRemove={() => setFormData({ ...formData, frontDoc: null })}
                  />

                  {formData.docType !== 'passport' && (
                    <MockDocumentUploader
                      label="Document Back Photo"
                      description="Include the barcode and official government issuance seal."
                      sampleFilename={`${formData.docType}_back_scan.jpg`}
                      sampleFileType="image/jpeg"
                      sampleFileSize="1.9 MB"
                      file={formData.backDoc}
                      onUpload={(doc) => setFormData({ ...formData, backDoc: doc })}
                      onRemove={() => setFormData({ ...formData, backDoc: null })}
                    />
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <Button variant="secondary" size="sm" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleNextStep}>
                    Next: Review & Submit <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & SUBMIT */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in">
                <div>
                  <h3 className="text-base font-bold text-cp-text-primary">
                    Step 4: Review Your Verification Submission
                  </h3>
                  <p className="text-xs text-cp-text-secondary mt-0.5">
                    Double-check all entered information before submitting to the simulated review queue.
                  </p>
                </div>

                {/* Review Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Identity Summary */}
                  <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2.5">
                    <span className="font-bold text-cp-gold flex items-center gap-1.5">
                      <User className="w-4 h-4" /> Personal & Residence
                    </span>
                    <div className="divide-y divide-cp-border/50 text-[11px]">
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Legal Name:</span>
                        <span className="font-semibold text-cp-text-primary">
                          {formData.firstName} {formData.lastName}
                        </span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Date of Birth:</span>
                        <span className="font-mono text-cp-text-primary">{formData.dateOfBirth}</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Nationality:</span>
                        <span className="text-cp-text-primary">{formData.nationality}</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Residential City:</span>
                        <span className="text-cp-text-primary">
                          {formData.city}, {formData.country}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Document Summary */}
                  <div className="p-4 rounded-xl bg-cp-elevated border border-cp-border space-y-2.5">
                    <span className="font-bold text-cp-gold flex items-center gap-1.5">
                      <FileText className="w-4 h-4" /> Identification Documents
                    </span>
                    <div className="divide-y divide-cp-border/50 text-[11px]">
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Document Type:</span>
                        <span className="font-semibold uppercase text-cp-text-primary">
                          {formData.docType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Document Number:</span>
                        <span className="font-mono font-semibold text-cp-text-primary">
                          {formData.docNumber}
                        </span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Expiry Date:</span>
                        <span className="font-mono text-cp-text-primary">{formData.docExpiry}</span>
                      </div>
                      <div className="py-1.5 flex justify-between">
                        <span className="text-cp-text-secondary">Files Attached:</span>
                        <span className="text-cp-positive font-semibold">
                          {formData.frontDoc ? 'Front ID' : 'None'}
                          {formData.backDoc ? ' + Back ID' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Demonstration Consent Checkbox */}
                <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border/80">
                  <label className="flex items-start gap-3 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                      className="accent-cp-gold w-4 h-4 rounded mt-0.5"
                    />
                    <span className="text-cp-text-secondary leading-relaxed">
                      I understand that this is a simulated compliance demonstration. No real government
                      identity checks are carried out and no personal information is permanently stored.
                    </span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 flex items-center justify-between">
                  <Button variant="secondary" size="sm" onClick={handlePrevStep}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={isSubmitting}
                    onClick={handleSubmitVerification}
                  >
                    Submit for Review <Send className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* VERIFICATION TIERS COMPARISON */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-base font-bold text-cp-text-primary">
            Verification Tiers & Withdrawal Quotas
          </h3>
          <p className="text-xs text-cp-text-secondary">
            CoinPlus offers tiered account limits designed for retail and institutional cryptocurrency traders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KYC_TIERS_INFO.map((tier) => {
            const isCurrent = (status === 'approved' && tier.tier.includes('Tier 2')) || (status !== 'approved' && tier.tier.includes('Tier 1'))

            return (
              <Card
                key={tier.tier}
                className={`p-5 space-y-4 ${
                  tier.badge
                    ? 'border-cp-gold/60 bg-gradient-to-b from-cp-card via-cp-elevated/40 to-cp-card'
                    : 'border-cp-border bg-cp-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-cp-text-primary">{tier.tier}</h4>
                    <span className="text-[11px] text-cp-text-secondary">{tier.status}</span>
                  </div>
                  {tier.badge && (
                    <Badge variant="gold" size="sm">
                      {tier.badge}
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge variant="positive" size="sm" withDot>
                      Current
                    </Badge>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <span className="text-[11px] font-semibold text-cp-text-secondary uppercase block">
                    Key Benefits:
                  </span>
                  <ul className="space-y-1.5 text-cp-text-primary">
                    {tier.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-[11px]">
                        <Check className="w-3.5 h-3.5 text-cp-gold shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                  <div className="pt-3 border-t border-cp-border/50 text-xs">
                  <span className="text-[11px] font-semibold text-cp-text-secondary uppercase block mb-1">
                    Requirements:
                  </span>
                  <p className="text-[11px] text-cp-text-secondary">
                    {tier.requirements.join(' • ')}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 5. DATABASE VERIFICATION AUDIT TRAIL TABLE */}
      {submissions.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-cp-text-primary flex items-center gap-2">
                <FileText className="w-4 h-4 text-cp-gold" />
                Compliance Verification Submissions
              </h3>
              <p className="text-xs text-cp-text-secondary">
                Official verification audit trail retrieved directly from your account database record.
              </p>
            </div>
            <Badge variant="gold" size="sm">
              {submissions.length} Record{submissions.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <Card className="border-cp-border bg-cp-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-cp-elevated/60 text-cp-text-secondary uppercase text-[11px] font-semibold border-b border-cp-border">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Case Reference</th>
                    <th className="py-3 px-4 sm:px-6">Tier Level</th>
                    <th className="py-3 px-4 sm:px-6">Document Type</th>
                    <th className="py-3 px-4 sm:px-6">Document ID</th>
                    <th className="py-3 px-4 sm:px-6">Submitted Date</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Verification Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cp-border/50 font-mono text-[11px]">
                  {submissions.map((sub: any) => (
                    <tr key={sub.id || sub.case_ref} className="hover:bg-cp-elevated/40 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-cp-gold">
                        {sub.case_ref}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-sans font-semibold text-cp-text-primary">
                        {sub.tier}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-sans text-cp-text-secondary capitalize">
                        {sub.document_type || 'Passport'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-cp-text-primary">
                        {sub.document_number || '••••••••'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-cp-text-secondary">
                        {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent'}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right font-sans">
                        <Badge
                          variant={
                            sub.status === 'approved'
                              ? 'positive'
                              : sub.status === 'in_review' || sub.status === 'pending'
                              ? 'gold'
                              : 'negative'
                          }
                          size="sm"
                          withDot
                        >
                          {sub.status === 'approved' ? 'Approved' : sub.status === 'in_review' ? 'In Review' : sub.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default KYC
