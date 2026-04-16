import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const monthKeys = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const

export function Overview() {
  const { t } = useTranslation()
  const data = monthKeys.map((month) => ({
    name: t(`dashboard.overviewChart.months.${month}`),
    total: Math.floor(Math.random() * 5000) + 1000,
  }))

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <defs>
          <linearGradient id='barGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#6366f1' />
            <stop offset='100%' stopColor='#c7d2fe' />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' vertical={false} />
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          direction='ltr'
          stroke='#888888'
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) =>
            `${t('dashboard.overviewChart.currencyPrefix')}${value}`
          }
        />
        <Tooltip
          cursor={{ fill: 'rgba(99, 102, 241, 0.06)' }}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid #e8e8e8',
            boxShadow: '0 2px 8px rgba(0,0,0,.08)',
            fontSize: 12,
          }}
        />
        <Bar
          dataKey='total'
          fill='url(#barGradient)'
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
