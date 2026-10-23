import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  ShieldAlert,
  ArrowUp,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Printer,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { Card, CardContent } from '@/components/common/Card'

export interface TocItem {
  id: string
  title: string
}

export interface RelatedPolicy {
  title: string
  href: string
  description: string
  badgeText: string
}

export interface LegalLayoutProps {
  title: string
  shortSummary: string
  badgeText?: string
  lastUpdated?: string
  toc: TocItem[]
  children: React.ReactNode
  relatedPolicies?: RelatedPolicy[]
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  shortSummary,
  badgeText = 'Draft Legal Document',
  lastUpdated = 'October 2026 • Version 1.0 (Demonstration Draft)',
  toc,
  children,
  relatedPolicies,
}) => {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id || '')
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Track scroll for active TOC and back-to-top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)

      // Find visible section
      for (let i = toc.length - 1; i >= 0; i--) {
        const el = document.getElementById(toc[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 160) {
            setActiveId(toc[i].id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -90
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-10 pb-16 animate-fadeIn">
      {/* 1. BREADCRUMBS & HERO HEADER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-cp-card via-cp-card/90 to-cp-base border border-cp-border p-6 sm:p-10 shadow-xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cp-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-4 text-center sm:text-left">
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-cp-text-muted">
            <Link to="/" className="hover:text-cp-gold transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-cp-text-muted/60" />
            <span className="text-cp-text-secondary">Legal & Regulatory</span>
            <ChevronRight className="w-3.5 h-3.5 text-cp-text-muted/60" />
            <span className="text-cp-gold font-medium">{title}</span>
          </nav>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
            <Badge variant="gold" size="sm">
              {badgeText}
            </Badge>
            <span className="text-xs text-cp-text-muted font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cp-gold" />
              {lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-cp-text-primary tracking-tight">
            {title}
          </h1>

          <p className="text-sm sm:text-base text-cp-text-secondary max-w-3xl leading-relaxed">
            {shortSummary}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save PDF
            </Button>
            <Link to="/compliance">
              <Button variant="secondary" size="sm" className="text-xs">
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-cp-gold" />
                Compliance Framework Outline
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. DRAFT MATERIAL & LEGAL ADVICE DISCLAIMER BANNER */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200/90 flex items-start gap-3 shadow-md">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p className="font-bold text-amber-200">
            DRAFT INFORMATIONAL MATERIAL — NOT JURISDICTION-SPECIFIC LEGAL ADVICE
          </p>
          <p>
            This document is a demonstrative draft prepared solely for the CoinPlus platform technology and user
            interface demonstration. CoinPlus does not operate a registered cryptocurrency exchange, nor does it possess
            regulatory licences, consumer registrations, or legal entity incorporation. Prior to any commercial release
            or live asset handling, this text must be comprehensively reviewed, revised, and sanctioned by qualified
            legal counsel within the relevant operational jurisdictions.
          </p>
        </div>
      </div>

      {/* 3. DOCUMENT BODY WITH STICKY TABLE OF CONTENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Table of Contents Sidebar (4 cols on lg) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <Card className="bg-[#0c121c] border-cp-border">
            <div className="p-4 border-b border-cp-border/80 flex items-center justify-between">
              <span className="text-xs font-bold text-cp-text-primary uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-cp-gold" />
                Table of Contents
              </span>
              <span className="text-[10px] text-cp-text-muted font-mono">{toc.length} Sections</span>
            </div>

            <nav className="p-2 space-y-1 max-h-[70vh] overflow-y-auto scrollbar-none" aria-label="Table of contents">
              {toc.map((item, idx) => {
                const isActive = activeId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150 flex items-start gap-2.5 ${
                      isActive
                        ? 'bg-cp-gold/15 text-cp-gold font-bold border border-cp-gold/30 shadow-sm'
                        : 'text-cp-text-secondary hover:text-cp-text-primary hover:bg-cp-elevated/60'
                    }`}
                  >
                    <span className="font-mono text-[10px] text-cp-text-muted shrink-0 mt-0.5">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <span className="line-clamp-2 leading-relaxed">{item.title}</span>
                  </button>
                )
              })}
            </nav>
          </Card>

          {/* Quick Contact & Assistance */}
          <div className="p-4 rounded-xl bg-cp-card border border-cp-border space-y-2 text-xs">
            <span className="font-semibold text-cp-text-primary block">Have Legal or Compliance Questions?</span>
            <p className="text-cp-text-muted text-[11px] leading-relaxed">
              Contact our simulated compliance desk or explore our self-service Help Centre for platform documentation.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <Link to="/contact" className="text-cp-gold hover:underline font-semibold text-[11px]">
                Contact Inquiries →
              </Link>
              <span className="text-cp-text-muted">•</span>
              <Link to="/help" className="text-cp-gold hover:underline font-semibold text-[11px]">
                Help Centre →
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Document Text Area (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-8">
          <Card className="bg-[#0c121c] border-cp-border">
            <CardContent className="p-6 sm:p-10 space-y-10 text-cp-text-secondary text-sm leading-relaxed">
              {children}
            </CardContent>
          </Card>

          {/* Back to top control */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs text-cp-text-muted">
            <span>You have reached the end of this draft document.</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-cp-gold hover:underline font-semibold"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. RELATED POLICIES CROSS-LINK STRIP */}
      {relatedPolicies && relatedPolicies.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-cp-border">
          <div>
            <h3 className="text-lg font-bold text-cp-text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cp-gold" />
              Related Legal & Compliance Documentation
            </h3>
            <p className="text-xs text-cp-text-muted mt-0.5">
              Review complementary policy frameworks, risk notifications, and platform rules
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedPolicies.map((pol) => (
              <Link
                key={pol.href}
                to={pol.href}
                className="p-4 rounded-xl bg-cp-card hover:bg-cp-elevated border border-cp-border hover:border-cp-gold/40 transition-all group flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" size="sm" className="text-[10px] py-0 px-1.5">
                      {pol.badgeText}
                    </Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-cp-text-muted group-hover:text-cp-gold group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h4 className="text-sm font-bold text-cp-text-primary group-hover:text-cp-gold transition-colors">
                    {pol.title}
                  </h4>
                  <p className="text-xs text-cp-text-muted leading-relaxed line-clamp-2">
                    {pol.description}
                  </p>
                </div>

                <span className="text-[11px] text-cp-gold font-semibold flex items-center gap-1">
                  Read Document <ExternalLink className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-cp-gold text-cp-base font-bold shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

export default LegalLayout
