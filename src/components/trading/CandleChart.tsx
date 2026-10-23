import React, { useState, useMemo, useRef } from 'react'
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  BarChart2,
  Sliders,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from '@/components/common/Button'
import {
  CandleData,
  Timeframe,
  generateCandles,
} from '@/mock/tradingData'
import { formatCurrency } from '@/utils/formatters'

export interface CandleChartProps {
  basePrice: number
  pairSymbol: string
}

export const CandleChart: React.FC<CandleChartProps> = ({
  basePrice,
  pairSymbol,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('15m')
  const [indicators, setIndicators] = useState({ ma: true, boll: false, vol: true })
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null)
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const timeframes: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1D', '1W']

  // Generate data based on basePrice and timeframe
  const candles = useMemo(() => {
    return generateCandles(basePrice, timeframe)
  }, [basePrice, timeframe])

  // Compute Moving Averages
  const ma7Points = useMemo(() => {
    return candles.map((_, i) => {
      if (i < 6) return null
      const slice = candles.slice(i - 6, i + 1)
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / 7
      return avg
    })
  }, [candles])

  const ma25Points = useMemo(() => {
    return candles.map((_, i) => {
      if (i < 24) return null
      const slice = candles.slice(i - 24, i + 1)
      const avg = slice.reduce((acc, c) => acc + c.close, 0) / 25
      return avg
    })
  }, [candles])

  // Canvas bounds & scaling
  const svgWidth = 920
  const svgHeight = isFullscreen ? 620 : 440

  const paddingLeft = 15
  const paddingRight = 65
  const paddingTop = 25
  const pricePaneHeight = isFullscreen ? 450 : 310
  const volumePaneTop = pricePaneHeight + 20
  const volumePaneHeight = isFullscreen ? 110 : 75

  const chartInnerWidth = svgWidth - paddingLeft - paddingRight

  // Min and max for Price pane
  const prices = candles.flatMap((c) => [c.high, c.low])
  const minPrice = Math.min(...prices) * 0.998
  const maxPrice = Math.max(...prices) * 1.002
  const priceRange = maxPrice - minPrice || 1

  // Max volume for Volume pane
  const volumes = candles.map((c) => c.volume)
  const maxVol = Math.max(...volumes) || 1

  const candleWidth = (chartInnerWidth / candles.length) * 0.65
  const candleGap = chartInnerWidth / candles.length

  // Coordinate calculation helpers
  const getX = (index: number) => paddingLeft + index * candleGap + candleGap / 2
  const getY = (price: number) =>
    paddingTop + pricePaneHeight - ((price - minPrice) / priceRange) * pricePaneHeight
  const getVolY = (vol: number) =>
    volumePaneTop + volumePaneHeight - (vol / maxVol) * volumePaneHeight

  // MA Lines SVG Path string
  const ma7Path = ma7Points.reduce((acc, val, i) => {
    if (val === null) return ''
    const x = getX(i)
    const y = getY(val)
    return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, '')

  const ma25Path = ma25Points.reduce((acc, val, i) => {
    if (val === null) return ''
    const x = getX(i)
    const y = getY(val)
    return acc === '' ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, '')

  // Close price line path (for line chart mode)
  const lineChartPath = candles.reduce((acc, c, i) => {
    const x = getX(i)
    const y = getY(c.close)
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, '')

  const activeCandle = hoveredCandle || candles[candles.length - 1]
  const isBullish = activeCandle.close >= activeCandle.open

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    const normX = (mouseX / rect.width) * svgWidth
    const normY = (mouseY / rect.height) * svgHeight

    const candleIdx = Math.floor((normX - paddingLeft) / candleGap)
    if (candleIdx >= 0 && candleIdx < candles.length) {
      setHoveredCandle(candles[candleIdx])
      setCrosshairPos({ x: getX(candleIdx), y: normY })
    }
  }

  const handleMouseLeave = () => {
    setHoveredCandle(null)
    setCrosshairPos(null)
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full bg-cp-card border-b border-cp-border flex flex-col select-none transition-all',
        isFullscreen &&
          'fixed inset-0 z-50 bg-cp-bg border-none shadow-2xl overflow-hidden'
      )}
    >
      {/* Chart Control Toolbar */}
      <div className="px-3 sm:px-6 py-2 border-b border-cp-border flex flex-wrap items-center justify-between gap-2.5 bg-cp-card">
        {/* Left: Timeframe Switcher */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {timeframes.map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={cn(
                'px-2.5 py-1 text-xs font-semibold rounded-md transition-all',
                timeframe === tf
                  ? 'bg-cp-gold text-cp-bg shadow-sm'
                  : 'text-cp-text-muted hover:text-cp-text-primary hover:bg-cp-elevated'
              )}
            >
              {tf}
            </button>
          ))}

          <div className="h-4 w-px bg-cp-border mx-1" />

          {/* Chart Style Toggle */}
          <button
            type="button"
            onClick={() => setChartMode(chartMode === 'candles' ? 'line' : 'candles')}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
              chartMode === 'candles'
                ? 'text-cp-gold bg-cp-elevated'
                : 'text-cp-text-muted hover:text-cp-text-primary'
            )}
            title="Toggle between Candlesticks and Line chart"
          >
            {chartMode === 'candles' ? 'Candles' : 'Line'}
          </button>
        </div>

        {/* Right: Technical Indicators & Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Indicator toggles */}
          <button
            type="button"
            onClick={() => setIndicators((prev) => ({ ...prev, ma: !prev.ma }))}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors border',
              indicators.ma
                ? 'border-cp-gold/60 text-cp-gold bg-cp-gold/10'
                : 'border-cp-border text-cp-text-muted hover:text-cp-text-primary'
            )}
          >
            MA
          </button>

          <button
            type="button"
            onClick={() => setIndicators((prev) => ({ ...prev, boll: !prev.boll }))}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors border',
              indicators.boll
                ? 'border-cp-gold/60 text-cp-gold bg-cp-gold/10'
                : 'border-cp-border text-cp-text-muted hover:text-cp-text-primary'
            )}
          >
            BOLL
          </button>

          <button
            type="button"
            onClick={() => setIndicators((prev) => ({ ...prev, vol: !prev.vol }))}
            className={cn(
              'px-2.5 py-1 text-xs font-semibold rounded-md transition-colors border',
              indicators.vol
                ? 'border-cp-gold/60 text-cp-gold bg-cp-gold/10'
                : 'border-cp-border text-cp-text-muted hover:text-cp-text-primary'
            )}
          >
            VOL
          </button>

          <div className="h-4 w-px bg-cp-border mx-1" />

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-cp-text-muted hover:text-cp-gold hover:bg-cp-elevated transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Chart'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Active OHLCV Legend Bar */}
      <div className="px-3 sm:px-6 py-1.5 bg-cp-card/80 border-b border-cp-border/40 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono">
        <span className="font-sans font-bold text-cp-text-primary">{pairSymbol}</span>
        <span className="text-cp-text-muted">T: <span className="text-cp-text-primary">{activeCandle.time}</span></span>
        <span className="text-cp-text-muted">O: <span className="text-cp-text-primary">{activeCandle.open.toFixed(2)}</span></span>
        <span className="text-cp-text-muted">H: <span className="text-cp-positive">{activeCandle.high.toFixed(2)}</span></span>
        <span className="text-cp-text-muted">L: <span className="text-cp-negative">{activeCandle.low.toFixed(2)}</span></span>
        <span className="text-cp-text-muted">
          C:{' '}
          <span className={cn('font-bold', isBullish ? 'text-cp-positive' : 'text-cp-negative')}>
            {activeCandle.close.toFixed(2)}
          </span>
        </span>
        <span className="text-cp-text-muted">
          Vol: <span className="text-cp-gold">{activeCandle.volume} BTC</span>
        </span>

        {indicators.ma && (
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-[#F0B93A]">MA(7): 68,340.10</span>
            <span className="text-[#38BDF8]">MA(25): 67,890.50</span>
          </div>
        )}
      </div>

      {/* Main SVG Candlestick & Volume Canvas */}
      <div className="relative flex-1 bg-gradient-to-b from-cp-card via-cp-card to-cp-elevated/40">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-80 sm:h-[400px] cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Horizontal Price Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * pricePaneHeight
            const priceVal = maxPrice - ratio * priceRange

            return (
              <g key={ratio}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="#243042"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                />
                <text
                  x={svgWidth - paddingRight + 6}
                  y={y + 3}
                  fill="#627185"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="start"
                >
                  {priceVal.toFixed(2)}
                </text>
              </g>
            )
          })}

          {/* Volume Pane Separator Line */}
          {indicators.vol && (
            <g>
              <line
                x1={paddingLeft}
                y1={volumePaneTop - 8}
                x2={svgWidth - paddingRight}
                y2={volumePaneTop - 8}
                stroke="#243042"
                strokeWidth="1"
              />
              <text
                x={paddingLeft + 4}
                y={volumePaneTop + 8}
                fill="#627185"
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                VOLUME
              </text>
            </g>
          )}

          {/* Bollinger Bands (if enabled) */}
          {indicators.boll && (
            <g>
              <path
                d={ma7Path}
                fill="none"
                stroke="rgba(240, 185, 58, 0.4)"
                strokeWidth="1.2"
                strokeDasharray="4 2"
              />
            </g>
          )}

          {/* Moving Average 7 (Gold) */}
          {indicators.ma && ma7Path && (
            <path
              d={ma7Path}
              fill="none"
              stroke="#F0B93A"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Moving Average 25 (Cyan) */}
          {indicators.ma && ma25Path && (
            <path
              d={ma25Path}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Line Chart Mode */}
          {chartMode === 'line' && (
            <path
              d={lineChartPath}
              fill="none"
              stroke="#F0B93A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Candlesticks Rendering */}
          {chartMode === 'candles' &&
            candles.map((c, i) => {
              const x = getX(i)
              const yHigh = getY(c.high)
              const yLow = getY(c.low)
              const yOpen = getY(c.open)
              const yClose = getY(c.close)

              const isBull = c.close >= c.open
              const candleColor = isBull ? '#00D6A0' : '#FF5364'

              const bodyTop = Math.min(yOpen, yClose)
              const bodyHeight = Math.max(Math.abs(yClose - yOpen), 2)

              return (
                <g key={i}>
                  {/* Upper & Lower Wick Line */}
                  <line
                    x1={x}
                    y1={yHigh}
                    x2={x}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.4"
                  />

                  {/* Candle Body Rect */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="1"
                  />
                </g>
              )
            })}

          {/* Volume Histogram Bars */}
          {indicators.vol &&
            candles.map((c, i) => {
              const x = getX(i)
              const volY = getVolY(c.volume)
              const barHeight = volumePaneTop + volumePaneHeight - volY
              const isBull = c.close >= c.open
              const barColor = isBull
                ? 'rgba(0, 214, 160, 0.45)'
                : 'rgba(255, 83, 100, 0.45)'

              return (
                <rect
                  key={`vol-${i}`}
                  x={x - candleWidth / 2}
                  y={volY}
                  width={candleWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="1"
                />
              )
            })}

          {/* Time Labels on X-axis */}
          {candles.map((c, i) => {
            if (i % 6 !== 0) return null
            const x = getX(i)

            return (
              <text
                key={`time-${i}`}
                x={x}
                y={svgHeight - 12}
                fill="#627185"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                textAnchor="middle"
              >
                {c.time}
              </text>
            )
          })}

          {/* Interactive Crosshair Tracking */}
          {crosshairPos && (
            <g>
              {/* Vertical line across full height */}
              <line
                x1={crosshairPos.x}
                y1={paddingTop}
                x2={crosshairPos.x}
                y2={svgHeight - 25}
                stroke="#F0B93A"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />

              {/* Horizontal line across price pane */}
              <line
                x1={paddingLeft}
                y1={crosshairPos.y}
                x2={svgWidth - paddingRight}
                y2={crosshairPos.y}
                stroke="#F0B93A"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />

              {/* Price Tag pill on Right Y-axis */}
              <g
                transform={`translate(${svgWidth - paddingRight}, ${
                  crosshairPos.y - 9
                })`}
              >
                <rect width="60" height="18" fill="#F0B93A" rx="3" />
                <text
                  x="30"
                  y="12"
                  fill="#080B12"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {(
                    maxPrice -
                    ((crosshairPos.y - paddingTop) / pricePaneHeight) * priceRange
                  ).toFixed(2)}
                </text>
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}

export default CandleChart
