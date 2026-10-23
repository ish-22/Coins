import React from 'react'
import { Wallet } from 'lucide-react'
import { PagePlaceholder } from '@/components/common/PagePlaceholder'

export const Assets: React.FC = () => {
  return (
    <PagePlaceholder
      title="Wallet / Assets"
      subtitle="Complete asset custody overview, spot and funding account balances, token distribution, and transaction logs."
      category="Wallet & Funds"
      icon={Wallet}
      routePath="/assets"
      stats={[
        { label: 'Total Valuation', value: '$14,250.00', change: '+5.82%', isPositive: true },
        { label: 'Available Cash', value: '$4,120.50' },
        { label: 'In Orders', value: '$2,310.00' },
        { label: 'Total Cryptos', value: '8 Assets' },
      ]}
      suggestedRoutes={[
        { label: 'Deposit Crypto', href: '/deposit' },
        { label: 'Withdraw Assets', href: '/withdraw' },
        { label: 'Order History', href: '/orders' },
        { label: 'Go to Trade', href: '/trade' },
      ]}
    />
  )
}

export default Assets
