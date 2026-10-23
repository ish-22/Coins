import React from 'react'
import { Link } from 'react-router-dom'
import { LegalLayout, TocItem, RelatedPolicy } from '@/components/legal/LegalLayout'
import { ShieldCheck, BookOpen, Scale, FileText, CheckCircle2, AlertTriangle, Globe } from 'lucide-react'

const COMPLIANCE_TOC: TocItem[] = [
  { id: 'sec-1-framework-purpose', title: '1. Purpose & Pre-Launch Compliance Assessment' },
  { id: 'sec-2-licensing', title: '2. Virtual Asset Service Provider (VASP) Licensing Benchmarks' },
  { id: 'sec-3-aml-cdd', title: '3. Anti-Money Laundering (AML) & Customer Due Diligence (KYC)' },
  { id: 'sec-4-sanctions', title: '4. International Sanctions Screening & Wallet Filtering' },
  { id: 'sec-5-transaction-monitoring', title: '5. Ongoing Transaction Monitoring & Suspicious Reporting' },
  { id: 'sec-6-consumer-protection', title: '6. Consumer Protection, Disclosures & Dispute Resolution' },
  { id: 'sec-7-data-protection', title: '7. Data Protection, Record Keeping & Regulatory Inquiries' },
  { id: 'sec-8-jurisdiction-restrictions', title: '8. Jurisdictional Restrictions, Geo-Fencing & Prohibited Markets' },
]

const RELATED_POLICIES: RelatedPolicy[] = [
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'User access covenants, platform availability, and liability limitations.',
    badgeText: 'Terms',
  },
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'Categories of personal information processed and data protection safeguards.',
    badgeText: 'Privacy',
  },
  {
    title: 'Risk Disclosure Statement',
    href: '/risk-disclosure',
    description: 'Cryptocurrency volatility, liquidity risks, cyber threats, and illustrative data boundaries.',
    badgeText: 'Risk Notice',
  },
]

export const Compliance: React.FC = () => {
  return (
    <LegalLayout
      title="Compliance Framework Outline"
      shortSummary="This document provides an informational benchmark outline of the statutory regulatory, anti-money laundering (AML), sanctions screening, and consumer protection frameworks required before commercial platform activation."
      badgeText="Informational Compliance Blueprint"
      lastUpdated="October 2026 • Version 1.0 (Demonstration Blueprint)"
      toc={COMPLIANCE_TOC}
      relatedPolicies={RELATED_POLICIES}
    >
      {/* SECTION 1 */}
      <section id="sec-1-framework-purpose" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">01.</span>
          Purpose & Pre-Launch Compliance Assessment
        </h2>
        <div className="p-4 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs leading-relaxed text-cp-text-secondary space-y-1">
          <p className="font-bold text-cp-gold">Blueprint Scope & Notice:</p>
          <p>
            This document outlines the requisite regulatory competencies, procedural controls, and institutional
            policies that must be formally implemented, audited, and approved by qualified legal counsel and national
            supervisory authorities prior to transitioning CoinPlus from a demonstration prototype into a commercial
            operating exchange.
          </p>
        </div>
        <p>
          Operating a compliant digital asset platform demands rigorous cross-border alignment with evolving financial
          services regulations, financial intelligence reporting standards, and institutional risk governance.
        </p>
      </section>

      {/* SECTION 2 */}
      <section id="sec-2-licensing" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">02.</span>
          Virtual Asset Service Provider (VASP) Licensing Benchmarks
        </h2>
        <p>
          Depending on target operating jurisdictions and whether custodial or fiat off-ramp services are provided, the
          platform must obtain applicable authorizations prior to commercial launch:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">European Union (MiCA)</span>
            <p className="text-cp-text-muted">
              Crypto-Asset Service Provider (CASP) authorization under the Markets in Crypto-Assets Regulation (MiCA),
              mandating capital adequacy, prudential custody separation, and market abuse monitoring.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">United Kingdom (FCA)</span>
            <p className="text-cp-text-muted">
              Registration with the Financial Conduct Authority (FCA) under Money Laundering Regulations (MLRs) and
              compliance with the Financial Promotions Regime for cryptoassets.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">United States (FinCEN & State MTs)</span>
            <p className="text-cp-text-muted">
              Registration as a Money Services Business (MSB) with the Financial Crimes Enforcement Network (FinCEN) and
              state-by-state Money Transmitter Licences (MTLs) or Trust Charters.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">Middle East (VARA & ADGM)</span>
            <p className="text-cp-text-muted">
              Virtual Asset Service Provider licensing through Dubai’s Virtual Assets Regulatory Authority (VARA) or the
              Financial Services Regulatory Authority (FSRA) of Abu Dhabi Global Market.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="sec-3-aml-cdd" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">03.</span>
          Anti-Money Laundering (AML) & Customer Due Diligence (KYC)
        </h2>
        <p>
          A commercial rollout requires a risk-based Customer Due Diligence (CDD) framework modeled after the
          demonstration tiers showcased on the platform:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-cp-text-secondary">
          <li>
            <strong>Tier 1 (Basic Verification):</strong> Government-issued photo identification verification, optical
            character recognition (OCR) cross-referencing, and automated biometric liveness detection.
          </li>
          <li>
            <strong>Tier 2 (Enhanced Due Diligence):</strong> Certified proof of residential address verification (utility
            invoices, bank statements within 90 days), source of wealth declarations, and enhanced screening.
          </li>
          <li>
            <strong>Politically Exposed Persons (PEP):</strong> Automated daily screening against global databases of PEPs,
            their close family members, and known commercial associates.
          </li>
          <li>
            <strong>Adverse Media Inquiries:</strong> Automated natural language processing against global sanctions and
            adverse legal media databases.
          </li>
        </ul>
      </section>

      {/* SECTION 4 */}
      <section id="sec-4-sanctions" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">04.</span>
          International Sanctions Screening & Wallet Filtering
        </h2>
        <p>
          Compliance policies must mandate strict screening against applicable sanctions enforcement lists, including:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-cp-text-secondary">
          <li>US Office of Foreign Assets Control (OFAC) Specially Designated Nationals (SDN) lists;</li>
          <li>United Nations Security Council Consolidated Sanctions Lists;</li>
          <li>European Union Consolidated Financial Sanctions Lists;</li>
          <li>UK HM Treasury (OFSI) Financial Sanctions Regime.</li>
        </ul>
        <p>
          Furthermore, on-chain blockchain transaction screening software must evaluate all incoming and outgoing wallet
          addresses to identify, freeze, and report funds linked to sanctioned entities, darknet marketplaces, ransomware
          strains, or mixers/tumblers.
        </p>
      </section>

      {/* SECTION 5 */}
      <section id="sec-5-transaction-monitoring" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">05.</span>
          Ongoing Transaction Monitoring & Suspicious Reporting
        </h2>
        <p>
          Platforms must maintain real-time monitoring of customer deposit, withdrawal, and order book velocity:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>Detecting structuring patterns (smurfing) designed to evade statutory currency reporting thresholds;</li>
          <li>Identifying geographic location velocity anomalies (e.g. logins spanning distant continents in minutes);</li>
          <li>Filing Suspicious Activity Reports (SARs) or Suspicious Transaction Reports (STRs) with competent authorities;</li>
          <li>Complying with the FATF "Travel Rule" by transmitting originator and beneficiary information for transfers.</li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section id="sec-6-consumer-protection" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">06.</span>
          Consumer Protection, Disclosures & Dispute Resolution
        </h2>
        <p>
          Treating customers fairly and providing upfront transparency are cornerstones of sustainable digital asset
          platforms:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>Clear, unambiguous publication of all spot maker/taker fees, deposit charges, and withdrawal gas costs;</li>
          <li>Prominent, understandable risk disclosures displayed prior to account onboarding and trade execution;</li>
          <li>Independent, segregated accounting ensuring customer digital assets are never commingled with corporate funds;</li>
          <li>A documented, prompt complaint-handling process with escalations to external ombudsman services where statutory.</li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section id="sec-7-data-protection" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">07.</span>
          Data Protection, Record Keeping & Regulatory Inquiries
        </h2>
        <p>
          Statutory record-keeping mandates require retaining complete customer onboarding documentation, trade books,
          and communication records for a minimum period (commonly 5 to 7 years) to assist lawful regulatory audits.
        </p>
        <p>
          Simultaneously, compliance teams must balance these obligations against data minimization principles, ensuring
          that personal customer identity data is protected under robust cryptographic architectures and access-controlled
          vaults.
        </p>
      </section>

      {/* SECTION 8 */}
      <section id="sec-8-jurisdiction-restrictions" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">08.</span>
          Jurisdictional Restrictions, Geo-Fencing & Prohibited Markets
        </h2>
        <p>
          A production platform must enforce technical geo-blocking and IP fencing to restrict access from embargoed or
          unauthorized regions. Countries typically subject to restrictions include jurisdictions under comprehensive
          international sanctions, FATF blacklisted nations, or regions where exchange operations are prohibited by
          domestic statute.
        </p>
      </section>
    </LegalLayout>
  )
}

export default Compliance
