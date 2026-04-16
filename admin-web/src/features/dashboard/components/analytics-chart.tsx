import { useTranslation } from 'react-i18next'
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const weekdayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

export function AnalyticsChart() {
  const { t } = useTranslation()
  const data = weekdayKeys.map((day) => ({
    name: t(`dashboard.analyticsPanel.chart.days.${day}`),
    clicks: Math.floor(Math.random() * 900) + 100,
    uniques: Math.floor(Math.random() * 700) + 80,
  }))

  return (
    <ResponsiveContainer width='100%' height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id='areaGradient1' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#6366f1' stopOpacity={0.3} />
            <stop offset='100%' stopColor='#6366f1' stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id='areaGradient2' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#8b5cf6' stopOpacity={0.2} />
            <stop offset='100%' stopColor='#8b5cf6' stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' vertical={false} />
        <XAxis dataKey='name' stroke='#888' fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke='#888' fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            fontSize: 12,
          }}
        />
        <Area type='monotone' dataKey='clicks' stroke='#6366f1' fill='url(#areaGradient1)' strokeWidth={2} />
        <Area type='monotone' dataKey='uniques' stroke='#8b5cf6' fill='url(#areaGradient2)' strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
