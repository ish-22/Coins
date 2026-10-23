import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  User,
  FileText,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Building2,
  Sparkles,
  Clock,
  ArrowRight,
  RotateCcw,
  Info,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  Coins,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Typography } from '@/components/common/Typography'
import { Input } from '@/components/common/Input'
import {
  InquiryCategoryId,
  INQUIRY_CATEGORIES,
  OFFICIAL_CONTACT_PLACEHOLDERS,
  SubmittedContactRecord,
} from '@/mock/contactData'

const MIN_MESSAGE_LENGTH = 20
const MAX_MESSAGE_LENGTH = 2000

export const Contact: React.FC = () => {
  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState<InquiryCategoryId>('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [hasConsented, setHasConsented] = useState(false)

  // Validation & UI State
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
    subject?: string
    message?: string
    consent?: string
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRecord, setSubmittedRecord] = useState<SubmittedContactRecord | null>(null)
  const [copiedChannelId, setCopiedChannelId] = useState<string | null>(null)

  // Live message character calculations
  const messageLength = message.trim().length
  const isMessageTooShort = messageLength > 0 && messageLength < MIN_MESSAGE_LENGTH
  const isMessageTooLong = message.length > MAX_MESSAGE_LENGTH

  // Email format validation regex
  const validateEmail = (value: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  }

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Please provide your full name.'
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.'
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Please provide your email address.'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please provide a valid email format (e.g., name@domain.com).'
    }

    // Subject validation
    if (!subject.trim()) {
      newErrors.subject = 'Please enter an inquiry subject.'
    } else if (subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters.'
    }

    // Message validation
    if (!message.trim()) {
      newErrors.message = `Please enter your message (minimum ${MIN_MESSAGE_LENGTH} characters).`
    } else if (message.trim().length < MIN_MESSAGE_LENGTH) {
      newErrors.message = `Your message is too short. Please add at least ${MIN_MESSAGE_LENGTH - message.trim().length} more characters.`
    } else if (message.length > MAX_MESSAGE_LENGTH) {
      newErrors.message = `Your message exceeds the ${MAX_MESSAGE_LENGTH} character limit.`
    }

    // Consent validation
    if (!hasConsented) {
      newErrors.consent = 'You must acknowledge the demonstration privacy notice to proceed.'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    // Process simulated submission
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const selectedCategoryMeta = INQUIRY_CATEGORIES.find((c) => c.id === category)
      const newRecord: SubmittedContactRecord = {
        referenceId: `CP-INQ-${Math.floor(10000 + Math.random() * 90000)}`,
        name: name.trim(),
        email: email.trim(),
        category,
        categoryLabel: selectedCategoryMeta?.label || 'General Inquiry',
        subject: subject.trim(),
        message: message.trim(),
        timestamp: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setSubmittedRecord(newRecord)
      window.scrollTo({ top: 200, behavior: 'smooth' })
    }, 700)
  }

  // Reset form to send another inquiry
  const handleResetForm = () => {
    setName('')
    setEmail('')
    setCategory('general')
    setSubject('')
    setMessage('')
    setHasConsented(false)
    setErrors({})
    setSubmittedRecord(null)
  }

  // Copy placeholder contact email
  const handleCopyPlaceholder = (channelId: string, val: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(val)
      setCopiedChannelId(channelId)
      setTimeout(() => setCopiedChannelId(null), 2500)
    }
  }

  return (
    <div className="space-y-12 pb-16">
      {/* 1. PAGE HEADER & INTRODUCTION */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cp-card via-cp-card/90 to-cp-base border border-cp-border p-6 sm:p-10 text-center shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cp-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cp-gold/10 border border-cp-gold/20 text-cp-gold text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CoinPlus Communication & Inquiries</span>
          </div>

          <Typography variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-black text-cp-text-primary tracking-tight">
            Contact CoinPlus
          </Typography>

          <Typography variant="body" className="text-cp-text-secondary text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            We are here to help. Reach out to our team regarding spot trading questions, demonstration account inquiries,
            institutional partnerships, or platform security audits. Choose an inquiry category below or explore our direct support channels.
          </Typography>

          {/* Quick Route Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/support">
              <Button variant="outline" size="sm" className="text-xs">
                <Headphones className="w-3.5 h-3.5 mr-1.5 text-cp-gold" />
                Customer Support Tickets
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline" size="sm" className="text-xs">
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-cp-gold" />
                Self-Service Help Centre
              </Button>
            </Link>
            <Link to="/fees">
              <Button variant="outline" size="sm" className="text-xs">
                <Coins className="w-3.5 h-3.5 mr-1.5 text-cp-gold" />
                Fees & VIP Limits
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID (FORM / SUCCESS & SIDEBAR DETAILS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Contact Form or Confirmation State */}
        <div className="lg:col-span-8 space-y-6">
          {submittedRecord ? (
            /* Mock Submission Confirmation Card */
            <Card className="bg-cp-card border-cp-border overflow-hidden shadow-xl animate-fadeIn">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-cp-card via-cp-elevated/80 to-cp-card border-b border-cp-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cp-positive/15 border border-cp-positive/30 text-cp-positive flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="positive" size="sm">
                        Inquiry Received (Simulated)
                      </Badge>
                      <span className="text-xs text-cp-text-muted">Ref: {submittedRecord.referenceId}</span>
                    </div>
                    <Typography variant="h2" className="text-xl sm:text-2xl font-bold text-cp-text-primary">
                      Thank You, {submittedRecord.name}!
                    </Typography>
                    <p className="text-xs sm:text-sm text-cp-text-secondary leading-relaxed">
                      Your inquiry has been logged in this demonstration environment. In a live production system, an automated
                      confirmation receipt and reference tracking link would be dispatched immediately to{' '}
                      <span className="text-cp-gold font-medium">{submittedRecord.email}</span>.
                    </p>
                  </div>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                <div className="rounded-xl bg-cp-elevated/40 border border-cp-border p-5 space-y-4">
                  <h4 className="text-xs font-semibold text-cp-text-primary uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cp-gold" />
                    Inquiry Summary Details
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-cp-text-muted">Inquiry Category:</span>
                      <p className="text-cp-text-primary font-semibold mt-0.5">{submittedRecord.categoryLabel}</p>
                    </div>
                    <div>
                      <span className="text-cp-text-muted">Submission Timestamp:</span>
                      <p className="text-cp-text-primary font-semibold mt-0.5">{submittedRecord.timestamp}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-cp-text-muted">Subject:</span>
                      <p className="text-cp-text-primary font-semibold mt-0.5">{submittedRecord.subject}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-cp-text-muted">Submitted Message:</span>
                      <p className="text-cp-text-secondary bg-cp-base/60 p-3.5 rounded-lg border border-cp-border mt-1 whitespace-pre-wrap leading-relaxed">
                        {submittedRecord.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Demonstration Alert Banner */}
                <div className="p-4 rounded-xl bg-cp-gold/10 border border-cp-gold/25 flex items-start gap-3 text-xs text-cp-gold">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Demonstration Note:</strong> CoinPlus operates as an educational trading platform concept. No actual email
                    transmissions were initiated, and no external support agents have been notified.
                  </p>
                </div>

                {/* Post-Submission Actions */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="md" onClick={handleResetForm}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Submit Another Inquiry
                  </Button>
                  <Link to="/help">
                    <Button variant="outline" size="md">
                      Browse Knowledge Base
                    </Button>
                  </Link>
                  <Link to="/support">
                    <Button variant="secondary" size="md">
                      Visit Support Desk
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Interactive Contact Form */
            <Card className="bg-cp-card border-cp-border overflow-hidden shadow-xl">
              <CardHeader className="border-b border-cp-border/80 pb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-cp-text-primary flex items-center gap-2">
                      <Mail className="w-5 h-5 text-cp-gold" />
                      Send an Inquiry
                    </CardTitle>
                    <p className="text-xs text-cp-text-muted mt-1">
                      Complete the form below. All fields with an asterisk (<span className="text-cp-gold">*</span>) are required.
                    </p>
                  </div>
                  <Badge variant="gold" size="sm">
                    Direct Inquiry Form
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Input
                        label="Full Name *"
                        placeholder="e.g. Alex Vance"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value)
                          if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                        }}
                        leftIcon={<User className="w-4 h-4" />}
                        error={errors.name}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="e.g. alex@example.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                        }}
                        leftIcon={<Mail className="w-4 h-4" />}
                        error={errors.email}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Row 2: Inquiry Category Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none flex items-center justify-between">
                      <span>Inquiry Category *</span>
                      <span className="text-[11px] text-cp-text-muted font-normal">Select the topic that best matches your request</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                      {INQUIRY_CATEGORIES.map((cat) => {
                        const isSelected = category === cat.id
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setCategory(cat.id)}
                            disabled={isSubmitting}
                            className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                              isSelected
                                ? 'bg-cp-gold/15 border-cp-gold text-cp-text-primary shadow-sm'
                                : 'bg-cp-elevated/40 hover:bg-cp-elevated border-cp-border text-cp-text-secondary hover:text-cp-text-primary'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold ${isSelected ? 'text-cp-gold' : 'text-cp-text-primary'}`}>
                                  {cat.label}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-cp-gold" />}
                              </div>
                              <p className="text-[11px] text-cp-text-muted mt-1 line-clamp-2 leading-relaxed">
                                {cat.description}
                              </p>
                            </div>
                            <span className="text-[10px] text-cp-gold/80 font-mono mt-2">
                              Est: {cat.estimatedResponse}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 3: Subject */}
                  <div>
                    <Input
                      label="Subject *"
                      placeholder="Brief summary of your inquiry (e.g. Question regarding VIP Tier 2 requirements)"
                      value={subject}
                      onChange={(e) => {
                        setSubject(e.target.value)
                        if (errors.subject) setErrors((prev) => ({ ...prev, subject: undefined }))
                      }}
                      leftIcon={<FileText className="w-4 h-4" />}
                      error={errors.subject}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Row 4: Message with Live Character Guidance */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="contact-message" className="text-xs font-semibold text-cp-text-secondary tracking-wide select-none">
                        Message *
                      </label>
                      <div className="text-xs flex items-center gap-1.5">
                        <span
                          className={`font-mono ${
                            isMessageTooLong
                              ? 'text-cp-negative font-bold'
                              : messageLength >= MIN_MESSAGE_LENGTH
                              ? 'text-cp-positive'
                              : 'text-cp-text-muted'
                          }`}
                        >
                          {message.length} / {MAX_MESSAGE_LENGTH}
                        </span>
                        {messageLength >= MIN_MESSAGE_LENGTH && !isMessageTooLong && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-cp-positive inline" />
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        id="contact-message"
                        rows={6}
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }))
                        }}
                        disabled={isSubmitting}
                        placeholder="Please describe your question or proposal in detail. Include any relevant steps, demonstration error codes, or context..."
                        className={`w-full bg-cp-card border rounded-xl text-sm text-cp-text-primary placeholder:text-cp-text-muted/60 p-3.5 transition-all duration-200 focus:outline-none focus:bg-cp-elevated/40 leading-relaxed ${
                          errors.message
                            ? 'border-cp-negative focus:border-cp-negative focus:ring-1 focus:ring-cp-negative/50'
                            : 'border-cp-border hover:border-cp-border-light focus:border-cp-gold focus:ring-1 focus:ring-cp-gold/50'
                        }`}
                      />
                    </div>

                    {/* Character Guidance Notice */}
                    <div className="flex items-center justify-between text-[11px] pt-0.5">
                      {errors.message ? (
                        <p className="text-cp-negative flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.message}</span>
                        </p>
                      ) : isMessageTooShort ? (
                        <p className="text-cp-gold flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          <span>Please enter at least {MIN_MESSAGE_LENGTH - messageLength} more characters.</span>
                        </p>
                      ) : (
                        <p className="text-cp-text-muted">
                          Provide detailed notes to expedite simulated review. Minimum {MIN_MESSAGE_LENGTH} characters.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Demonstration Privacy & Consent Notice */}
                  <div className="p-4 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-3">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="contact-consent"
                        checked={hasConsented}
                        onChange={(e) => {
                          setHasConsented(e.target.checked)
                          if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }))
                        }}
                        disabled={isSubmitting}
                        className="mt-1 w-4 h-4 rounded border-cp-border bg-cp-card text-cp-gold focus:ring-cp-gold/40 focus:ring-offset-0 cursor-pointer accent-[#F0B93A]"
                      />
                      <label htmlFor="contact-consent" className="text-xs text-cp-text-secondary leading-relaxed cursor-pointer select-none">
                        I understand that CoinPlus is an educational fintech interface concept. Inquiries entered here
                        remain strictly local to my browser session and are not dispatched to any live customer service or email mailbox.
                      </label>
                    </div>

                    {errors.consent && (
                      <p className="text-xs text-cp-negative flex items-center gap-1 pl-7">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errors.consent}</span>
                      </p>
                    )}
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-w-[180px]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-cp-base border-t-transparent rounded-full animate-spin" />
                          <span>Sending Inquiry...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          <span>Submit Inquiry</span>
                        </div>
                      )}
                    </Button>

                    <p className="text-xs text-cp-text-muted text-center sm:text-right">
                      Simulated local transmission • Protected by CoinPlus demo tokens
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (4 cols): Configurable Placeholders & Direct Help Channels */}
        <div className="lg:col-span-4 space-y-6">
          {/* Official Demonstration Contact Channels Card */}
          <Card className="bg-cp-card border-cp-border">
            <CardHeader className="border-b border-cp-border/80 pb-4">
              <CardTitle className="text-base font-bold text-cp-text-primary flex items-center gap-2">
                <Building2 className="w-4 h-4 text-cp-gold" />
                Demonstration Inboxes
              </CardTitle>
              <p className="text-xs text-cp-text-muted mt-0.5">
                Configurable placeholder contact addresses
              </p>
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              {OFFICIAL_CONTACT_PLACEHOLDERS.map((chan) => (
                <div
                  key={chan.id}
                  className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-2 hover:border-cp-border-light transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-cp-text-primary">{chan.title}</span>
                    <Badge variant="neutral" size="sm">
                      {chan.badgeText}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-cp-base/80 border border-cp-border">
                    <span className="text-xs font-mono text-cp-gold truncate">
                      {chan.placeholderValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPlaceholder(chan.id, chan.placeholderValue)}
                      className="p-1 rounded text-cp-text-muted hover:text-cp-gold hover:bg-cp-elevated transition-colors shrink-0"
                      title="Copy placeholder address"
                    >
                      {copiedChannelId === chan.id ? (
                        <Check className="w-3.5 h-3.5 text-cp-positive" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-cp-text-muted">{chan.note}</p>
                </div>
              ))}

              <div className="p-3 rounded-lg bg-cp-elevated/20 border border-cp-border text-[11px] text-cp-text-muted space-y-1">
                <p className="font-semibold text-cp-text-secondary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cp-gold" />
                  Demonstration Availability
                </p>
                <p>
                  Platform knowledge base and automated sandbox endpoints operate 24/7. External mailboxes are demonstration identifiers only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Need Faster Resolution? Ticket Desk & Help Centre Links */}
          <Card className="bg-gradient-to-b from-cp-card to-cp-elevated/30 border border-cp-gold/30">
            <CardHeader className="pb-3">
              <Badge variant="gold" size="sm" className="w-fit mb-2">
                Immediate Self-Service
              </Badge>
              <CardTitle className="text-base font-bold text-cp-text-primary">
                Need Fast Resolution?
              </CardTitle>
              <p className="text-xs text-cp-text-muted mt-1">
                Skip waiting for inquiry reviews with our specialized real-time portals.
              </p>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-3">
              <Link
                to="/support"
                className="p-3.5 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5 text-cp-gold" />
                    Customer Support Tickets
                  </h5>
                  <p className="text-[11px] text-cp-text-muted">
                    Open, track, and test interactive simulated replies
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>

              <Link
                to="/help"
                className="p-3.5 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-cp-gold" />
                    Help Centre & Knowledge Base
                  </h5>
                  <p className="text-[11px] text-cp-text-muted">
                    24 detailed articles, FAQs, and step-by-step guides
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>

              <Link
                to="/fees"
                className="p-3.5 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-cp-gold" />
                    Fee Calculator & VIP Tiers
                  </h5>
                  <p className="text-[11px] text-cp-text-muted">
                    Check spot maker/taker rates and network fees
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-cp-text-muted group-hover:text-cp-gold group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            </CardContent>
          </Card>

          {/* Privacy & Security Demonstration Notice */}
          <div className="p-4 rounded-xl bg-cp-card border border-cp-border text-xs text-cp-text-muted space-y-2">
            <div className="flex items-center gap-2 text-cp-text-secondary font-semibold">
              <ShieldAlert className="w-4 h-4 text-cp-gold" />
              <span>Responsible Access Notice</span>
            </div>
            <p className="leading-relaxed">
              CoinPlus never asks for private keys, seed phrases, or one-time 2FA codes. All credentials in this project
              are demonstration artifacts.
            </p>
          </div>
        </div>
      </div>

      {/* 3. PUBLIC FOOTER WITH LEGAL & REGULATORY LINKS */}
      <section className="border-t border-cp-border/80 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/fees"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>SCHEDULES</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Fees & VIP Limits
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Transparent spot trading maker/taker tiers and 0% crypto deposit schedules.
            </p>
          </Link>

          <Link
            to="/kyc"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>COMPLIANCE</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Identity Verification (KYC)
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Explore Tier 1 and Tier 2 daily withdrawal allowances and AML verification standards.
            </p>
          </Link>

          <Link
            to="/settings"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>SECURITY</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              Security & Settings
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Manage simulated 2FA, biometric FIDO2 passkeys, and withdrawal address allowlists.
            </p>
          </Link>

          <Link
            to="/about"
            className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-cp-gold mb-1 font-semibold">
              <span>CONCEPT</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
              About CoinPlus
            </h4>
            <p className="text-xs text-cp-text-muted mt-1">
              Review mission, design principles, non-custodial architecture, and live interface previews.
            </p>
          </Link>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border text-center text-xs text-cp-text-muted space-y-1">
          <p className="font-semibold text-cp-text-secondary">
            Demonstration Disclaimer & Risk Disclosure
          </p>
          <p className="max-w-3xl mx-auto">
            CoinPlus is a cryptocurrency trading interface demonstration. Inquiries submitted via this page are not
            transmitted to external customer support systems. No physical location, telephone number, or external email
            is claimed or represented. Trading digital assets involves significant market risk.
          </p>
        </div>
      </section>
    </div>
  )
}

export default Contact
