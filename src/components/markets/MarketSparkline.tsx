import React from 'react'

export interface MarketSparklineProps {
  data: number[]
  isPositive: boolean
  width?: number
  height?: number
  className?: string
}

export const MarketSparkline: React.FC<MarketSparklineProps> = ({
  data,
  isPositive,
  width = 90,
  height = 30,
  className,
}) => {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const paddingY = 4
  const innerHeight = height - paddingY * 2

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = paddingY + innerHeight - ((val - min) / range) * innerHeight
    return { x, y }
  })

  // Build SVG path
  const pathD = points.reduce((acc, pt, index) => {
    if (index === 0) return `M ${pt.x} ${pt.y}`
    const prev = points[index - 1]
    const cx = (prev.x + pt.x) / 2
    return `${acc} C ${cx} ${prev.y}, ${cx} ${pt.y}, ${pt.x} ${pt.y}`
  }, '')

  const strokeColor = isPositive ? '#00D6A0' : '#FF5364'

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <path
        d={pathD}
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MarketSparkline
