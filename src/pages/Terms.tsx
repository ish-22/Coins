import React from 'react'
import { Link } from 'react-router-dom'
import { LegalLayout, TocItem, RelatedPolicy } from '@/components/legal/LegalLayout'

const TERMS_TOC: TocItem[] = [
  { id: 'sec-1-eligibility', title: '1. Account Eligibility & Geographic Limitations' },
  { id: 'sec-2-permitted-use', title: '2. Permitted Use & Prohibited Conduct' },
  { id: 'sec-3-intellectual-property', title: '3. Intellectual Property Rights & Licensing' },
  { id: 'sec-4-platform-availability', title: '4. Platform Availability, Latency & Maintenance' },
  { id: 'sec-5-account-responsibilities', title: '5. Account Responsibilities, Passkeys & 2FA' },
  { id: 'sec-6-third-party-services', title: '6. Third-Party Services & Blockchain Nodes' },
  { id: 'sec-7-termination', title: '7. Termination, Suspension & Restriction' },
  { id: 'sec-8-liability-disclaimers', title: '8. Disclaimers & Limitations of Liability' },
  { id: 'sec-9-disputes-governing-law', title: '9. Dispute Provisions & Governing Law (Draft)' },
  { id: 'sec-10-modifications', title: '10. Amendments & Notice of Policy Changes' },
]

const RELATED_POLICIES: RelatedPolicy[] = [
  {
    title: 'Privacy Policy',
    href: '/privacy',
    description: 'Categories of information processed, retention policies, and simulated user rights.',
    badgeText: 'Privacy',
  },
  {
    title: 'Risk Disclosure Statement',
    href: '/risk-disclosure',
    description: 'Cryptocurrency volatility, liquidity risks, cyber threats, and illustrative data boundaries.',
    badgeText: 'Risk Notice',
  },
  {
    title: 'Compliance Framework',
    href: '/compliance',
    description: 'Informational outline of AML/KYC, sanctions screening, and regulatory considerations.',
    badgeText: 'Compliance',
  },
]

export const Terms: React.FC = () => {
  return (
    <LegalLayout
      title="Terms of Service"
      shortSummary="Please review this draft legal agreement governing user access, permitted conduct, and intellectual property on the CoinPlus cryptocurrency platform concept."
      badgeText="Draft Agreement — Legal Review Required"
      lastUpdated="October 2026 • Version 1.0 (Demonstration Draft)"
      toc={TERMS_TOC}
      relatedPolicies={RELATED_POLICIES}
    >
      {/* SECTION 1 */}
      <section id="sec-1-eligibility" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">01.</span>
          Account Eligibility & Geographic Limitations
        </h2>
        <p>
          By accessing or using the CoinPlus platform demonstration interface (the "Interface"), you represent and
          warrant that you are at least eighteen (18) years of age (or the legal age of majority in your jurisdiction of
          residence) and possess full legal capacity to enter into these terms.
        </p>
        <p>
          In a prospective commercial deployment, access will be restricted from jurisdictions subject to international
          sanctions, financial action task force (FATF) blacklists, or local prohibitions on digital asset transactions.
          Users are strictly responsible for confirming that their access to digital asset platforms complies with all
          local statutory requirements and currency regulations.
        </p>
      </section>

      {/* SECTION 2 */}
      <section id="sec-2-permitted-use" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">02.</span>
          Permitted Use & Prohibited Conduct
        </h2>
        <p>
          The Interface is made available solely for lawful informational, educational, and evaluation purposes. You
          agree not to engage in any of the following prohibited activities:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-cp-text-secondary">
          <li>Attempting to probe, scan, or breach the security posture or vulnerability of any platform component;</li>
          <li>Engaging in market manipulation, wash trading, front-running, or deceptive order placements;</li>
          <li>Deploying automated crawlers, scrapers, or bots in violation of API rate-limiting thresholds;</li>
          <li>Transmitting malicious code, Trojans, ransomware, or denial-of-service payloads;</li>
          <li>Utilizing platform endpoints for money laundering, terrorist financing, or sanctions evasion;</li>
          <li>Impersonating CoinPlus operators, staff, or other registered users.</li>
        </ul>
      </section>

      {/* SECTION 3 */}
      <section id="sec-3-intellectual-property" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">03.</span>
          Intellectual Property Rights & Licensing
        </h2>
        <p>
          All trademarks, service marks, logos, user interface designs, visual layouts, geometric coin marks, and
          proprietary code comprising the CoinPlus interface are the exclusive intellectual property of CoinPlus
          Exchange Ltd. (and its concept licensors).
        </p>
        <p>
          You are granted a limited, revocable, non-exclusive, non-sublicensable licence to view and interact with the
          demonstration interface for personal evaluation. No rights, titles, or interests in any trademarks or proprietary
          software are transferred by virtue of your access.
        </p>
      </section>

      {/* SECTION 4 */}
      <section id="sec-4-platform-availability" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">04.</span>
          Platform Availability, Latency & Maintenance
        </h2>
        <p>
          CoinPlus strives to maintain high availability across all matching engine and market data endpoints. However,
          the platform is provided on an "as is" and "as available" basis without express or implied operational guarantees.
        </p>
        <p>
          Service interruptions may occur due to routine system upgrades, network congestion, hardware failures, or
          external telecommunication outages. CoinPlus reserves the right to suspend or limit trading operations, order
          placement, or asset transfers during scheduled or emergency maintenance windows as detailed in our{' '}
          <Link to="/status" className="text-cp-gold hover:underline">
            System Status
          </Link>{' '}
          page.
        </p>
      </section>

      {/* SECTION 5 */}
      <section id="sec-5-account-responsibilities" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">05.</span>
          Account Responsibilities, Passkeys & 2FA
        </h2>
        <p>
          You are exclusively responsible for maintaining the confidentiality and integrity of your authentication
          credentials, including account passwords, FIDO2 biometric passkeys, TOTP two-factor authenticator seeds, and
          anti-phishing codes.
        </p>
        <p>
          Any action initiated through your credentials will be deemed executed by you. CoinPlus staff will never request
          your private keys, recovery seed phrases, or one-time verification tokens. You must notify platform operators
          immediately via the{' '}
          <Link to="/support" className="text-cp-gold hover:underline">
            Support Desk
          </Link>{' '}
          upon discovering any unauthorized login or suspicious device activity.
        </p>
      </section>

      {/* SECTION 6 */}
      <section id="sec-6-third-party-services" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">06.</span>
          Third-Party Services & Blockchain Protocols
        </h2>
        <p>
          The Interface may display pricing feeds, network fee metrics, and analytics provided by independent third
          parties. CoinPlus does not endorse, control, or assume liability for the accuracy, uptime, or conduct of
          external decentralized networks, smart contracts, or blockchain node providers.
        </p>
        <p>
          Blockchain protocols operate independently. Transactions transmitted across public distributed ledgers are
          subject to variable network gas fees, miner/validator prioritization, and potential chain reorganizations over
          which CoinPlus exerts no technical control.
        </p>
      </section>

      {/* SECTION 7 */}
      <section id="sec-7-termination" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">07.</span>
          Termination, Suspension & Restriction
        </h2>
        <p>
          CoinPlus reserves the right to immediately suspend, freeze, or terminate your account access, in whole or in
          part, if:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-cp-text-secondary">
          <li>You breach any material provision of these Terms of Service;</li>
          <li>We detect unauthorized or suspicious device access or location velocity anomalies;</li>
          <li>Requested by competent law enforcement, regulatory authorities, or court orders;</li>
          <li>Your account verification fails AML/KYC requirements or sanctions screening standards.</li>
        </ul>
      </section>

      {/* SECTION 8 */}
      <section id="sec-8-liability-disclaimers" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">08.</span>
          Disclaimers & Limitations of Liability
        </h2>
        <p className="font-semibold text-cp-text-primary">
          TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE LAW, COINPLUS, ITS AFFILIATES, OFFICERS, DIRECTORS, AND
          EMPLOYEES DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>
        <p>
          IN NO EVENT SHALL COINPLUS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES,
          INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR DIGITAL ASSETS, ARISING OUT OF OR IN CONNECTION WITH YOUR
          ACCESS OR INABILITY TO ACCESS THE INTERFACE, REGARDLESS OF THE LEGAL THEORY ASSERTED.
        </p>
      </section>

      {/* SECTION 9 */}
      <section id="sec-9-disputes-governing-law" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">09.</span>
          Dispute Provisions & Governing Law (Draft Review)
        </h2>
        <p>
          <em>
            Note for Legal Counsel: Specific arbitration rules, class action waivers, informal resolution periods, and
            governing law jurisdictions must be determined upon corporate incorporation and commercial licensing.
          </em>
        </p>
        <p>
          This draft anticipates a mandatory good-faith informal dispute resolution procedure lasting not less than thirty
          (30) days before initiating formal proceedings, followed by binding individual commercial arbitration in an
          internationally recognized arbitration seat.
        </p>
      </section>

      {/* SECTION 10 */}
      <section id="sec-10-modifications" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">10.</span>
          Amendments & Notice of Policy Changes
        </h2>
        <p>
          CoinPlus reserves the right to amend, update, or replace these Terms of Service at any time. Material changes
          will be notified via platform broadcast banners or announcements at least fourteen (14) days prior to their
          effective date. Your continued access to the platform following notice constitutes acceptance of the amended
          terms.
        </p>
      </section>
    </LegalLayout>
  )
}

export default Terms
