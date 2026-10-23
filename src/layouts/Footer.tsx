import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Cpu, Lock, ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { Badge } from '@/components/common/Badge'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cp-border bg-cp-card/50 text-cp-text-secondary transition-colors">
      {/* Top trust badges row */}
      <div className="border-b border-cp-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div className="p-2.5 rounded-lg bg-cp-gold/10 text-cp-gold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cp-text-primary">Institutional Security</h4>
                <p className="text-xs text-cp-text-muted mt-0.5">Cold storage & 1:1 asset backing verification</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div className="p-2.5 rounded-lg bg-cp-gold/10 text-cp-gold shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cp-text-primary">Ultra-Low Latency</h4>
                <p className="text-xs text-cp-text-muted mt-0.5">High-frequency matching engine with &lt;1ms execution</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-xl bg-cp-elevated/40 border border-cp-border">
              <div className="p-2.5 rounded-lg bg-cp-gold/10 text-cp-gold shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cp-text-primary">Strict Compliance</h4>
                <p className="text-xs text-cp-text-muted mt-0.5">Global regulatory standards & enterprise KYC/AML</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2">
            <Logo size="md" />
            <p className="mt-4 text-sm text-cp-text-muted max-w-sm leading-relaxed">
              CoinPlus is an elite cryptocurrency spot and derivatives exchange engineered for retail and institutional traders worldwide.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Badge variant="gold" size="sm" withDot>
                SOC-2 Certified
              </Badge>
              <Badge variant="neutral" size="sm">
                256-Bit SSL
              </Badge>
            </div>
          </div>

          {/* Column 1: Products */}
          <div>
            <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">
              Products
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/markets" className="hover:text-cp-gold transition-colors">Spot Trading</Link></li>
              <li><Link to="/trade" className="hover:text-cp-gold transition-colors flex items-center gap-1">Futures <ArrowUpRight className="w-3 h-3 text-cp-gold" /></Link></li>
              <li><Link to="/wallet" className="hover:text-cp-gold transition-colors">Yield & Earn</Link></li>
              <li><Link to="/wallet" className="hover:text-cp-gold transition-colors">CoinPlus Card</Link></li>
            </ul>
          </div>

          {/* Column 2: Tools & API */}
          <div>
            <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">
              Trading Tools
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><span className="hover:text-cp-gold cursor-pointer transition-colors">REST & WebSocket API</span></li>
              <li><span className="hover:text-cp-gold cursor-pointer transition-colors">TradingView Charts</span></li>
              <li><Link to="/fees" className="hover:text-cp-gold transition-colors">Fee Schedules</Link></li>
              <li><Link to="/status" className="hover:text-cp-gold transition-colors flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-cp-positive inline-block animate-pulse" />System Status</Link></li>
              <li><span className="hover:text-cp-gold cursor-pointer transition-colors">Historical Data</span></li>
            </ul>
          </div>

          {/* Column 3: Company & Support */}
          <div>
            <h5 className="text-xs font-bold text-cp-text-primary tracking-wider uppercase mb-4">
              Support
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/help" className="hover:text-cp-gold transition-colors">Help Centre 24/7</Link></li>
              <li><Link to="/support" className="hover:text-cp-gold transition-colors">Support Tickets</Link></li>
              <li><Link to="/contact" className="hover:text-cp-gold transition-colors">Contact Us</Link></li>
              <li><Link to="/settings" className="hover:text-cp-gold transition-colors">Security Advisories</Link></li>
              <li><Link to="/about" className="hover:text-cp-gold transition-colors">About CoinPlus</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-cp-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cp-text-muted">
          <p>© {new Date().getFullYear()} CoinPlus Exchange Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/terms" className="hover:text-cp-gold transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-cp-gold transition-colors">Privacy Policy</Link>
            <Link to="/risk-disclosure" className="hover:text-cp-gold transition-colors">Risk Disclosure</Link>
            <Link to="/compliance" className="hover:text-cp-gold transition-colors">Compliance Framework</Link>
          </div>
          <p className="text-center md:text-right max-w-xs">
            Trading digital assets involves significant market risk.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
