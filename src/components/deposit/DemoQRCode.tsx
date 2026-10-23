import React from 'react'

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
  // Deterministic pseudo-random pattern based on string hash for authentic matrix look
  const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // 21x21 QR matrix grid
  const matrixSize = 21
  const modules: boolean[][] = Array(matrixSize)
    .fill(false)
    .map(() => Array(matrixSize).fill(false))

  // Helper to draw standard 7x7 Finder pattern
  const drawFinderPattern = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 ||
          r === 6 ||
          c === 0 ||
          c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          modules[startY + r][startX + c] = true
        } else {
          modules[startY + r][startX + c] = false
        }
      }
    }
  }

  // Draw 3 primary corner finder patterns
  drawFinderPattern(0, 0)
  drawFinderPattern(14, 0)
  drawFinderPattern(0, 14)

  // Timing lines
  for (let i = 8; i < 13; i++) {
    modules[6][i] = i % 2 === 0
    modules[i][6] = i % 2 === 0
  }

  // Fill data modules deterministically
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      // Avoid finder patterns & center logo
      const inFinder1 = r < 8 && c < 8
      const inFinder2 = r < 8 && c > 12
      const inFinder3 = r > 12 && c < 8
      const inCenter = r >= 8 && r <= 12 && c >= 8 && c <= 12

      if (!inFinder1 && !inFinder2 && !inFinder3 && !inCenter) {
        modules[r][c] = ((r * c + hash + r * 7 + c * 13) % 7) > 3
      }
    }
  }

  const cellSize = 100 / matrixSize

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      title={`Simulated Deposit QR Code: ${value}`}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full bg-[#101824] rounded-xl p-2 border border-[#243042] shadow-gold-sm"
      >
        <defs>
          <linearGradient id="qrGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F7C95C" />
            <stop offset="50%" stopColor="#F0B93A" />
            <stop offset="100%" stopColor="#D89C1D" />
          </linearGradient>
        </defs>

        {/* Matrix Modules */}
        {modules.map((row, r) =>
          row.map((active, c) => {
            if (!active) return null
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize + 0.5}
                y={r * cellSize + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill="url(#qrGoldGrad)"
                rx="0.5"
              />
            )
          })
        )}

        {/* Central CoinPlus Hexagon Emblem */}
        <polygon
          points="50,39 59,44 59,56 50,61 41,56 41,44"
          fill="#141E2B"
          stroke="#F0B93A"
          strokeWidth="1.2"
        />
        <circle cx="50" cy="50" r="3.5" fill="#F0B93A" />
      </svg>
    </div>
  )
}

export default DemoQRCode
