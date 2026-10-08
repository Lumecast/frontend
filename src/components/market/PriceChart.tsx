import type { PricePoint } from '@/lib/api/types'

interface PriceChartProps {
  data: PricePoint[]
  height?: number
  color?: string
  className?: string
}

function getMinMax(data: PricePoint[]) {
  if (data.length === 0) return { min: 0, max: 1 }
  const prices = data.map((d) => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const padding = (max - min) * 0.1 || 0.1
  return { min: Math.max(0, min - padding), max: Math.min(1, max + padding) }
}

export function PriceChart({ data, height = 200, color = 'hsl(var(--brand-600))', className = '' }: PriceChartProps) {
  if (data.length === 0) {
    return (
      <div className={`h-[${height}px] ${className}`} aria-hidden="true">
        <svg viewBox="0 0 400 200" className="w-full h-full text-muted-foreground" preserveAspectRatio="none">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="14">
            No price data available
          </text>
        </svg>
      </div>
    )
  }

  const { min, max } = getMinMax(data)
  const width = 400
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const xScale = (i: number) => padding + (i / (data.length - 1)) * chartWidth
  const yScale = (price: number) => padding + chartHeight - ((price - min) / (max - min)) * chartHeight

  const points = data
    .map((d, i) => `${xScale(i)},${yScale(d.price)}`)
    .join(' ')

  const areaPoints = [
    `${padding},${padding + chartHeight}`,
    ...points.split(' '),
    `${padding + chartWidth},${padding + chartHeight}`,
  ].join(' ')

  const latestPrice = data[data.length - 1].price
  const priceChange = data.length > 1 ? latestPrice - data[0].price : 0
  const changeColor = priceChange >= 0 ? 'hsl(var(--success-500))' : 'hsl(var(--danger-500))'

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">Price History</span>
        <span className="text-sm font-mono" style={{ color: changeColor }}>
          {(latestPrice * 100).toFixed(1)}¢
          {' '}
          <span
            className={`text-xs ${priceChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}
          >
            {priceChange >= 0 ? '+' : ''}{(priceChange * 100).toFixed(1)}¢
          </span>
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto text-brand-600"
        preserveAspectRatio="none"
        role="img"
        aria-label="Price history chart"
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill="url(#priceGradient)" />
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xScale(i)}
            cy={yScale(d.price)}
            r="3"
            fill={color}
            stroke="white"
            strokeWidth="1"
            className="opacity-0 hover:opacity-100 transition-opacity"
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>{new Date(data[0].timestamp).toLocaleDateString()}</span>
        <span>{new Date(data[data.length - 1].timestamp).toLocaleDateString()}</span>
      </div>
    </div>
  )
}