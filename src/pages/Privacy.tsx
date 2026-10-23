import React from 'react'
import { Link } from 'react-router-dom'
import { LegalLayout, TocItem, RelatedPolicy } from '@/components/legal/LegalLayout'

const PRIVACY_TOC: TocItem[] = [
  { id: 'sec-1-scope', title: '1. Scope & Important Demonstration Notice' },
  { id: 'sec-2-categories', title: '2. Categories of Information a Future Service Might Collect' },
  { id: 'sec-3-purposes', title: '3. Legal Bases & Purposes of Data Processing' },
  { id: 'sec-4-retention', title: '4. Data Retention Schedules & Disposal Criteria' },
  { id: 'sec-5-sharing', title: '5. Information Sharing, Disclosure & Third Parties' },
  { id: 'sec-6-security', title: '6. Security Practices, Cryptography & Storage Standards' },
  { id: 'sec-7-user-rights', title: '7. Individual Privacy Rights & Regulatory Inquiries' },
  { id: 'sec-8-cookies', title: '8. Cookies, Tracking & Browser Local Storage' },
  { id: 'sec-9-contact', title: '9. Data Protection Officer & Privacy Inquiries' },
]

const RELATED_POLICIES: RelatedPolicy[] = [
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'Account eligibility, permitted conduct, and intellectual property provisions.',
    badgeText: 'Terms',
  },
  {
    title: 'Compliance Framework',
    href: '/compliance',
    description: 'Statutory AML/KYC requirements, sanctions screening, and data protection benchmarks.',
    badgeText: 'Compliance',
  },
  {
    title: 'Risk Disclosure Statement',
    href: '/risk-disclosure',
    description: 'Cryptocurrency volatility, liquidity risks, cyber threats, and illustrative data boundaries.',
    badgeText: 'Risk Notice',
  },
]

export const Privacy: React.FC = () => {
  return (
    <LegalLayout
      title="Privacy Policy"
      shortSummary="This draft policy outlines categories of personal information a prospective commercial digital asset platform would collect, the purposes of processing, user rights, and data protection practices."
      badgeText="Draft Policy — Legal Review Required"
      lastUpdated="October 2026 • Version 1.0 (Demonstration Draft)"
      toc={PRIVACY_TOC}
      relatedPolicies={RELATED_POLICIES}
    >
      {/* SECTION 1 */}
      <section id="sec-1-scope" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">01.</span>
          Scope & Important Demonstration Notice
        </h2>
        <div className="p-3.5 rounded-xl bg-cp-card border border-cp-border text-xs leading-relaxed text-cp-text-secondary space-y-1">
          <p className="font-semibold text-cp-gold">Demonstration Environment Limitation:</p>
          <p>
            In this demonstration build of CoinPlus, no personal data, identity documents, or passwords are transmitted
            to remote production databases or commercial identity providers. Any data entered into demonstration forms
            (such as `/account` or `/kyc`) is processed locally within your browser session. This draft policy describes
            the prospective standards applicable to a live commercial deployment.
          </p>
        </div>
        <p>
          This Privacy Policy describes how personal information would be collected, maintained, utilized, and
          protected upon the deployment of a commercial CoinPlus trading ecosystem.
        </p>
      </section>

      {/* SECTION 2 */}
      <section id="sec-2-categories" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">02.</span>
          Categories of Information a Future Service Might Collect
        </h2>
        <p>
          To deliver institutional-grade trading, comply with international anti-money laundering (AML) statutes, and
          safeguard customer accounts, a future production exchange would collect:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">Identity Information</span>
            <p className="text-cp-text-muted">
              Full legal name, date of birth, nationality, government-issued identification numbers (passport, national ID,
              or driver's licence), and biometric facial verification selfies.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">Contact Information</span>
            <p className="text-cp-text-muted">
              Verified email address, residential physical address, proof of address utility statements, and mobile
              telephone numbers.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">Financial & Transaction Data</span>
            <p className="text-cp-text-muted">
              Cryptocurrency wallet deposit/withdrawal addresses, transaction hashes, trading pair volumes, order histories,
              and source-of-wealth declarations.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-cp-elevated/40 border border-cp-border space-y-1">
            <span className="font-bold text-cp-text-primary block">Technical & Device Telemetry</span>
            <p className="text-cp-text-muted">
              IP addresses, device identifiers, browser fingerprint parameters, operating system versions, and session
              timestamp velocity logs.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="sec-3-purposes" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">03.</span>
          Legal Bases & Purposes of Data Processing
        </h2>
        <p>Personal information would be processed under the following legal bases:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-cp-text-secondary">
          <li>
            <strong>Performance of Contract:</strong> To open accounts, process spot limit/market orders, manage balances,
            and maintain continuous platform access;
          </li>
          <li>
            <strong>Legal & Regulatory Compliance:</strong> To satisfy mandatory statutory AML/CTF obligations, customer
            due diligence (CDD) screening, and reporting to relevant financial intelligence units (FIUs);
          </li>
          <li>
            <strong>Legitimate Interests:</strong> To detect fraudulent unauthorized logins, prevent account takeovers,
            enhance trading engine latency, and secure platform infrastructure;
          </li>
          <li>
            <strong>Consent:</strong> For non-essential telemetry tracking or opt-in marketing newsletters, which can be
            withdrawn at any time.
          </li>
        </ul>
      </section>

      {/* SECTION 4 */}
      <section id="sec-4-retention" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">04.</span>
          Data Retention Schedules & Disposal Criteria
        </h2>
        <p>
          In a production setting, statutory financial and anti-money laundering legislation universally requires exchanges
          to retain customer identification and transaction records for a mandatory statutory period (typically five (5)
          to seven (7) years) following account closure or trade execution.
        </p>
        <p>
          Once retention requirements expire, customer records would be permanently deleted, anonymized for aggregate
          performance telemetry, or purged in accordance with industry disposal standards.
        </p>
      </section>

      {/* SECTION 5 */}
      <section id="sec-5-sharing" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">05.</span>
          Information Sharing, Disclosure & Third Parties
        </h2>
        <p>CoinPlus will never sell or rent customer personal information. Data may be shared strictly with:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>Identity verification and document validation vendors under strict data processing agreements (DPAs);</li>
          <li>Blockchain analytics and transaction monitoring tools for illicit funds and sanctioned address screening;</li>
          <li>Cloud hosting, security CDN, and database infrastructure providers bound by confidentiality covenants;</li>
          <li>Regulatory authorities, law enforcement agencies, or courts pursuant to binding lawful process.</li>
        </ul>
      </section>

      {/* SECTION 6 */}
      <section id="sec-6-security" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">06.</span>
          Security Practices, Cryptography & Storage Standards
        </h2>
        <p>
          CoinPlus is architected around security-by-design principles, modeling best-in-class financial technology
          practices:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>End-to-end Transport Layer Security (TLS 1.3) with strict forward secrecy across all public endpoints;</li>
          <li>Advanced Encryption Standard (AES-256) encryption for sensitive data at rest;</li>
          <li>Hardware-backed FIDO2 / WebAuthn biometric passkey authentication to eliminate credential stuffing;</li>
          <li>Cold storage isolation for user funds with multi-party computation (MPC) access thresholds.</li>
        </ul>
      </section>

      {/* SECTION 7 */}
      <section id="sec-7-user-rights" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">07.</span>
          Individual Privacy Rights & Regulatory Inquiries
        </h2>
        <p>
          Subject to applicable data protection regimes (such as the GDPR, UK Data Protection Act, or equivalent regional
          statutes), users will enjoy statutory rights including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>The right to request confirmation of and access to your personal data;</li>
          <li>The right to rectify inaccurate, outdated, or incomplete records;</li>
          <li>The right to request data erasure (subject to mandatory AML statutory retention exceptions);</li>
          <li>The right to object to or restrict certain processing activities;</li>
          <li>The right to data portability in a machine-readable format.</li>
        </ul>
      </section>

      {/* SECTION 8 */}
      <section id="sec-8-cookies" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">08.</span>
          Cookies, Tracking & Browser Local Storage
        </h2>
        <p>
          In this frontend demonstration, CoinPlus utilizes browser `localStorage` and `sessionStorage` strictly to store
          functional preferences (such as pinned watchlist tickers, simulated session tokens, and helpful/unhelpful FAQ
          votes). No cross-site marketing cookies or tracking beacons are deployed.
        </p>
        <p>
          Users may clear local storage or configure browser settings to reject cookies at any time; however, some
          interactive demonstration states may reset to defaults upon refreshing.
        </p>
      </section>

      {/* SECTION 9 */}
      <section id="sec-9-contact" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">09.</span>
          Data Protection Officer & Privacy Inquiries
        </h2>
        <p>
          For inquiries regarding this draft policy or to submit simulated data access questions, please contact our
          demonstration channel:
        </p>
        <div className="p-3.5 rounded-xl bg-cp-elevated/40 border border-cp-border text-xs space-y-1">
          <span className="font-semibold text-cp-text-primary block">Demonstration Privacy Channel:</span>
          <span className="font-mono text-cp-gold block">privacy.desk@coinplus.demo.local</span>
          <span className="text-[10px] text-cp-text-muted block">
            Note: This is a demonstration channel placeholder. Commercial deployments will publish verified supervisory
            authority contacts.
          </span>
        </div>
      </section>
    </LegalLayout>
  )
}

export default Privacy
