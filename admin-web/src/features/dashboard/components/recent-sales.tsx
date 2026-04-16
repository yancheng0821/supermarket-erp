import { useTranslation } from 'react-i18next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const recentSales = [
  {
    id: 'customer1',
    profile: '/avatars/01.png',
    fallback: '王一',
    amount: '+¥1,999.00',
  },
  {
    id: 'customer2',
    profile: '/avatars/02.png',
    fallback: '张子',
    amount: '+¥39.00',
  },
  {
    id: 'customer3',
    profile: '/avatars/03.png',
    fallback: '陈语',
    amount: '+¥299.00',
  },
  {
    id: 'customer4',
    profile: '/avatars/04.png',
    fallback: '周景',
    amount: '+¥99.00',
  },
  {
    id: 'customer5',
    profile: '/avatars/05.png',
    fallback: '赵可',
    amount: '+¥39.00',
  },
] as const

export function RecentSales() {
  const { t } = useTranslation()

  return (
    <div className='space-y-8'>
      {recentSales.map((sale) => {
        const name = t(`dashboard.recentSalesPanel.items.${sale.id}.name`)
        const email = t(`dashboard.recentSalesPanel.items.${sale.id}.email`)

        return (
          <div key={sale.id} className='flex items-center gap-4'>
            <Avatar
              className={
                sale.id === 'customer2'
                  ? 'flex h-9 w-9 items-center justify-center space-y-0 border'
                  : 'h-9 w-9'
              }
            >
              <AvatarImage
                src={sale.profile}
                alt={t('dashboard.recentSalesPanel.avatarAlt', { name })}
              />
              <AvatarFallback>{sale.fallback}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>{name}</p>
                <p className='text-sm text-muted-foreground'>{email}</p>
              </div>
              <div className='font-medium'>{sale.amount}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
