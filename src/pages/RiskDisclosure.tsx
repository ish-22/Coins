import React from 'react'
import { Link } from 'react-router-dom'
import { LegalLayout, TocItem, RelatedPolicy } from '@/components/legal/LegalLayout'
import { AlertTriangle, TrendingDown, Lock, Zap, Scale, FileWarning, Globe, ShieldAlert } from 'lucide-react'

const RISK_TOC: TocItem[] = [
  { id: 'sec-1-nature', title: '1. General Nature of Digital Asset Risk & Capital Loss' },
  { id: 'sec-2-volatility', title: '2. Extreme Market Volatility & Rapid Price Fluctuations' },
  { id: 'sec-3-liquidity', title: '3. Market Depth, Liquidity & Slippage Risks' },
  { id: 'sec-4-technology', title: '4. Software, Cybersecurity & Smart Contract Vulnerabilities' },
  { id: 'sec-5-blockchain', title: '5. Blockchain Transaction Irreversibility & Wallet Addresses' },
  { id: 'sec-6-network-fees', title: '6. Network Gas Fees, Mempool Delays & Confirmations' },
  { id: 'sec-7-regulatory', title: '7. Regulatory Uncertainty & Jurisdictional Legal Risks' },
  { id: 'sec-8-demo-difference', title: '8. Critical Difference: Illustrative vs. Real Market Data' },
]

const RELATED_POLICIES: RelatedPolicy[] = [
  {
    title: 'Terms of Service',
    href: '/terms',
    description: 'User access covenants, platform availability, and liability limitations.',
    badgeText: 'Terms',
  },
  {
    title: 'Compliance Framework',
    href: '/compliance',
    description: 'Legal considerations, licensing benchmarks, and AML/KYC obligations.',
    badgeText: 'Compliance',
  },
  {
    title: 'Fees & Limits',
    href: '/fees',
    description: 'Detailed illustrative spot trading maker/taker schedules and network costs.',
    badgeText: 'Schedules',
  },
]

export const RiskDisclosure: React.FC = () => {
  return (
    <LegalLayout
      title="Risk Disclosure Statement"
      shortSummary="Trading cryptocurrencies carries substantial financial, technical, and regulatory risks. This disclosure outlines key risks that market participants must evaluate before engaging with digital assets."
      badgeText="Important Risk Notice — Legal Review Required"
      lastUpdated="October 2026 • Version 1.0 (Demonstration Draft)"
      toc={RISK_TOC}
      relatedPolicies={RELATED_POLICIES}
    >
      {/* SECTION 1 */}
      <section id="sec-1-nature" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">01.</span>
          General Nature of Digital Asset Risk & Capital Loss
        </h2>
        <div className="p-4 rounded-xl bg-cp-negative/10 border border-cp-negative/30 text-xs text-cp-negative space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4" />
            High Risk Warning:
          </p>
          <p className="leading-relaxed">
            Trading digital assets involves a high degree of risk and is not suitable for all investors. You may sustain
            a total loss of all invested funds. You should not invest capital that you cannot afford to lose.
          </p>
        </div>
        <p>
          Cryptocurrencies are speculative digital assets that lack statutory deposit insurance (such as FDIC, FSCS, or
          equivalent national protection schemes). No governmental or central bank authority guarantees or backs the
          value of digital currencies.
        </p>
      </section>

      {/* SECTION 2 */}
      <section id="sec-2-volatility" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">02.</span>
          Extreme Market Volatility & Rapid Price Fluctuations
        </h2>
        <p>
          Cryptocurrency valuations can experience sudden and severe intraday price swings. Markets operate 24 hours a
          day, 365 days a year without official market opening or closing bells or automatic circuit breakers.
        </p>
        <p>
          Price movements are influenced by complex and unpredictable factors, including global macroeconomic shifts,
          speculative sentiment, regulatory enforcement actions, technological protocol upgrades, and media commentary.
          Past performance is never an indicator or guarantee of future returns.
        </p>
      </section>

      {/* SECTION 3 */}
      <section id="sec-3-liquidity" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">03.</span>
          Market Depth, Liquidity & Slippage Risks
        </h2>
        <p>
          Liquidity across specific cryptocurrency trading pairs can fluctuate rapidly. During periods of thin liquidity
          or market stress, placing large market orders may result in substantial slippage—where the executed average
          price deviates significantly from the quoted best bid or ask.
        </p>
        <p>
          CoinPlus strongly encourages traders to understand order mechanics, including the use of Limit and Stop-Limit
          orders, to mitigate involuntary price slippage during periods of violent market expansion or contraction.
        </p>
      </section>

      {/* SECTION 4 */}
      <section id="sec-4-technology" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">04.</span>
          Software, Cybersecurity & Smart Contract Vulnerabilities
        </h2>
        <p>
          Digital assets exist entirely as cryptographic code distributed across peer-to-peer networks. They remain
          vulnerable to unforeseen software bugs, consensus protocol failures, hard forks, mining/validator concentration
          attacks, and cyber security breaches.
        </p>
        <p>
          Decentralized applications (dApps), smart contracts, and cross-chain bridging protocols carry independent
          technical risks. Flaws in third-party decentralized protocols may result in permanent freezing, theft, or total
          destruction of underlying locked collateral.
        </p>
      </section>

      {/* SECTION 5 */}
      <section id="sec-5-blockchain" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">05.</span>
          Blockchain Transaction Irreversibility & Wallet Addresses
        </h2>
        <p>
          Transactions executed on public decentralized distributed ledgers are cryptographically irreversible. Once a
          transaction hash is verified by network validators and added to a block, it cannot be cancelled, modified, or
          reversed by CoinPlus or any other central intermediary.
        </p>
        <p>
          Sending cryptocurrency to an incorrect, unsupported, or incompatible address or omitting a required destination
          tag or memo (such as for XRP Ledger transfers) will universally result in the permanent, irrecoverable loss of
          those digital assets.
        </p>
      </section>

      {/* SECTION 6 */}
      <section id="sec-6-network-fees" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">06.</span>
          Network Gas Fees, Mempool Delays & Confirmations
        </h2>
        <p>
          Transferring digital assets incurs mandatory blockchain network fees (often termed "gas"). Network fees are paid
          directly to decentralized miners and validators, not to CoinPlus.
        </p>
        <p>
          During periods of intense on-chain demand, network fees can spike precipitously, occasionally making small
          transfers economically impractical. Furthermore, network congestion may lead to extended delays in transaction
          mempool processing and confirmation block inclusion.
        </p>
      </section>

      {/* SECTION 7 */}
      <section id="sec-7-regulatory" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">07.</span>
          Regulatory Uncertainty & Jurisdictional Legal Risks
        </h2>
        <p>
          The legal and regulatory framework governing digital assets, virtual currency service providers, and decentralized
          finance remains evolving and subject to material divergence across international jurisdictions.
        </p>
        <p>
          Future legislative changes, regulatory enforcement actions, central bank directives, or national prohibitions
          may adversely impact the liquidity, transferability, legality, or value of cryptocurrencies, potentially
          preventing platforms from continuing operations within affected territories.
        </p>
      </section>

      {/* SECTION 8 */}
      <section id="sec-8-demo-difference" className="space-y-3">
        <h2 className="text-lg font-bold text-cp-text-primary flex items-center gap-2 border-b border-cp-border pb-2">
          <span className="text-cp-gold font-mono">08.</span>
          Critical Difference: Illustrative vs. Real Market Data
        </h2>
        <div className="p-4 rounded-xl bg-cp-gold/10 border border-cp-gold/30 text-xs text-cp-text-secondary space-y-1.5 leading-relaxed">
          <p className="font-bold text-cp-gold">Important Platform Demonstration Distinction:</p>
          <p>
            The CoinPlus interface is currently an educational design demonstration. Order books, candlestick quotes,
            simulated fills, and account wallet balances displayed throughout this application are <strong>illustrative mock data</strong>.
          </p>
          <p>
            They do not reflect live production execution, live blockchain balances, or guaranteed market liquidity. Do not
            base real-world financial or investment decisions on the mock metrics presented in this demonstration environment.
          </p>
        </div>
      </section>
    </LegalLayout>
  )
}

export default RiskDisclosure
