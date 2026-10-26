import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

export interface DemoQRCodeProps {
  value: string
  size?: number
  className?: string
}

export const DemoQRCode: React.FC<DemoQRCodeProps> = ({
  value,
  size = 180,
  className,
}) => {
  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      title={`Deposit QR Code for Trust Wallet & Web3 Wallets: ${value}`}
    >
      <div className="w-full h-full bg-[#101824] rounded-xl p-3 border border-[#243042] shadow-gold-sm flex items-center justify-center">
        <QRCodeSVG
          value={value}
          size={size - 24}
          fgColor="#F0B93A"
          bgColor="#101824"
          level="M"
          includeMargin={false}
        />
      </div>
    </div>
  )
}

export default DemoQRCode

