import React, { useState, useId } from 'react'
import {
  TrendingUp,
  Maximize2,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Card, CardHeader, CardTitle } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import {
  ChartTimeframe,
  mockPortfolioChartHistory,
  ChartDataPoint,
} from '@/mock/dashboardData'
import { formatCurrency } from '@/utils/formatters'

export const PortfolioChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('1D')
  const [hoveredPoint, setHoveredPoint] = useState<ChartDataPoint | null>(null)
  const [hoverX, setHoverX] = useState<number | null>(null)
  const [currencyUnit, setCurrencyUnit] = useState<'USD' | 'BTC'>('USD')

  const gradientId = useId()
  const strokeGradId = useId()

  const timeframes: ChartTimeframe[] = ['1D', '1W', '1M', '3M', '1Y']
  const data = mockPortfolioChartHistory[timeframe]

  const values = data.map((d) => d.value)
  const minVal = Math.min(...values)
  const maxVal = Math.max(...values)
  const range = maxVal - minVal || 1

  // SVG dimensions
  const svgWidth = 800
  const svgHeight = 240
  const paddingX = 20
  const paddingTop = 25
  const paddingBottom = 35

  const chartInnerWidth = svgWidth - paddingX * 2
  const chartInnerHeight = svgHeight - paddingTop - paddingBottom

  // Generate SVG coordinates for each point
  const points = data.map((d, index) => {
    const x = paddingX + (index / (data.length - 1)) * chartInnerWidth
    const y =
      paddingTop + chartInnerHeight - ((d.value - minVal) / range) * chartInnerHeight
    return { x, y, data: d }
  })

  // Build SVG path string (smooth line)
  const pathD = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    // Smooth Bézier curve
    const prev = points[index - 1]
    const cx = (prev.x + point.x) / 2
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`
  }, '')

  // Area under line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    svgHeight - paddingBottom
  } L ${points[0].x} ${svgHeight - paddingBottom} Z`

  // Current display point (either hovered or the latest point)
  const activePoint = hoveredPoint || data[data.length - 1]
  const startVal = data[0].value
  const currentVal = activePoint.value
  const periodDiff = currentVal - startVal
  const periodPercentage = (periodDiff / startVal) * 100
  const isPositive = periodDiff >= 0

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const normalizedX = (mouseX / rect.width) * svgWidth

    // Find nearest point
    let closestPoint = points[0]
    let closestDist = Math.abs(points[0].x - normalizedX)

    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(points[i].x - normalizedX)
      if (dist < closestDist) {
        closestDist = dist
        closestPoint = points[i]
      }
    }

    setHoveredPoint(closestPoint.data)
    setHoverX(closestPoint.x)
  }

  const handleMouseLeave = () => {
    setHoveredPoint(null)
    setHoverX(null)
  }

  return (
    <Card variant="default" padding="none" className="overflow-hidden">
      {/* Chart Header */}
      <div className="p-4 sm:p-6 border-b border-cp-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cp-text-muted">
              Portfolio Performance
            </span>
            <Badge variant="gold" size="sm" withDot>
              Demo Feed
            </Badge>
          </div>

          <div className="flex items-baseline gap-3 mt-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-cp-text-primary">
              {currencyUnit === 'USD'
                ? formatCurrency(activePoint.value)
                : `${(activePoint.value / 68450.25).toFixed(4)} BTC`}
            </span>

            <span
              className={cn(
                'inline-flex items-center font-mono text-sm font-bold',
                isPositive ? 'text-cp-positive' : 'text-cp-negative'
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {isPositive ? '+' : ''}
              {formatCurrency(periodDiff)} ({isPositive ? '+' : ''}
              {periodPercentage.toFixed(2)}%)
            </span>
          </div>

          <span className="text-xs text-cp-text-muted mt-0.5 block">
            {hoveredPoint ? `Snapshot at ${hoveredPoint.label}` : `Past ${timeframe} growth overview`}
          </span>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Currency Unit Toggle */}
          <div className="flex items-center p-1 rounded-lg bg-cp-elevated border border-cp-border text-xs">
            <button
              type="button"
              onClick={() => setCurrencyUnit('USD')}
              className={cn(
                'px-2.5 py-1 rounded font-semibold transition-colors',
                currencyUnit === 'USD'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-muted hover:text-cp-text-primary'
              )}
            >
              USD
            </button>
            <button
              type="button"
              onClick={() => setCurrencyUnit('BTC')}
              className={cn(
                'px-2.5 py-1 rounded font-semibold transition-colors',
                currencyUnit === 'BTC'
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-muted hover:text-cp-text-primary'
              )}
            >
              BTC
            </button>
          </div>

          {/* Timeframe Switcher */}
          <div className="flex items-center p-1 rounded-lg bg-cp-elevated border border-cp-border">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={cn(
                  'px-3 py-1 rounded text-xs font-semibold transition-all duration-200 select-none',
                  timeframe === tf
                    ? 'bg-cp-card text-cp-gold shadow-sm border border-cp-gold/40'
                    : 'text-cp-text-muted hover:text-cp-text-primary'
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive SVG Chart Canvas */}
      <div className="relative p-2 sm:p-4 bg-gradient-to-b from-cp-card via-cp-card to-cp-elevated/40">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-64 cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Area Fill Gradient */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F0B93A" stopOpacity="0.25" />
              <stop offset="70%" stopColor="#F0B93A" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#F0B93A" stopOpacity="0" />
            </linearGradient>

            {/* Stroke Metallic Gradient */}
            <linearGradient id={strokeGradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F7C95C" />
              <stop offset="50%" stopColor="#F0B93A" />
              <stop offset="100%" stopColor="#D89C1D" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = paddingTop + ratio * chartInnerHeight
            const gridVal = maxVal - ratio * range
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#243042"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
                <text
                  x={svgWidth - paddingX + 5}
                  y={y + 3}
                  fill="#627185"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  ${(gridVal / 1000).toFixed(1)}k
                </text>
              </g>
            )
          })}

          {/* Area Fill */}
          <path d={areaD} fill={`url(#${gradientId})`} />

          {/* Main Trend Line */}
          <path
            d={pathD}
            fill="none"
            stroke={`url(#${strokeGradId})`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Time Labels on X-axis */}
          {points.map((p, i) => {
            // Display subset of labels to prevent crowding
            if (points.length > 8 && i % 2 !== 0 && i !== points.length - 1) return null
            return (
              <text
                key={i}
                x={p.x}
                y={svgHeight - 10}
                fill="#627185"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {p.data.label}
              </text>
            )
          })}

          {/* Interactive Tracking Line and Hover Dot */}
          {hoverX !== null && hoveredPoint && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={hoverX}
                y1={paddingTop}
                x2={hoverX}
                y2={svgHeight - paddingBottom}
                stroke="#F0B93A"
                strokeWidth="1.2"
                strokeDasharray="2 2"
              />

              {/* Point Node on the curve */}
              {points.find((p) => p.data === hoveredPoint) && (
                <circle
                  cx={hoverX}
                  cy={points.find((p) => p.data === hoveredPoint)!.y}
                  r="5"
                  fill="#F0B93A"
                  stroke="#101824"
                  strokeWidth="2.5"
                  className="shadow-gold-md animate-pulse"
                />
              )}
            </g>
          )}
        </svg>

        {/* Floating Tooltip Pill (when hovering) */}
        {hoveredPoint && hoverX !== null && (
          <div
            className="absolute top-3 pointer-events-none transform -translate-x-1/2 bg-cp-elevated border border-cp-gold/40 px-3 py-1.5 rounded-xl shadow-gold-sm text-xs font-mono z-20 flex items-center gap-2.5 transition-all duration-75"
            style={{
              left: `${(hoverX / svgWidth) * 100}%`,
            }}
          >
            <span className="text-cp-text-muted">{hoveredPoint.label}:</span>
            <span className="font-bold text-cp-gold">
              {formatCurrency(hoveredPoint.value)}
            </span>
          </div>
        )}
      </div>

      {/* Chart Footer Metrics Strip */}
      <div className="p-3 sm:px-6 bg-cp-elevated/50 border-t border-cp-border grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex flex-col">
          <span className="text-cp-text-muted">Period Low</span>
          <span className="font-mono font-semibold text-cp-text-primary">
            {formatCurrency(minVal)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-cp-text-muted">Period High</span>
          <span className="font-mono font-semibold text-cp-text-primary">
            {formatCurrency(maxVal)}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-cp-text-muted">Average Daily Vol</span>
          <span className="font-mono font-semibold text-cp-gold">$3.42M</span>
        </div>
        <div className="flex flex-col">
          <span className="text-cp-text-muted">Simulation Model</span>
          <span className="font-mono font-semibold text-cp-positive">Normal Random Walk</span>
        </div>
      </div>
    </Card>
  )
}

export default PortfolioChart
