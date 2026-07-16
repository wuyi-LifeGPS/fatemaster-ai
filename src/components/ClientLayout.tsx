'use client'

import { usePathname } from 'next/navigation'
import AIFloatingButton from './AIFloatingButton'
import PageProgress from './PageProgress'
import NetworkStatus from './NetworkStatus'
import ErrorBoundary from './ErrorBoundary'
import ScrollToTop from './ScrollToTop'
import BottomNav from './BottomNav'

const HIDE_NAV_PAGES = [
  '/bazi',
  '/bu/chat',
  '/ming/records',
  '/ming/edit',
  '/ming/bazi',
  '/settings',
  '/history',
  '/naming',
  '/match',
  '/career',
  '/talent',
  '/daily',
  '/bu/liuyao',
  '/bu/coin',
  '/bu/meihua',
  '/bu/bazi-match',
  '/bu/job-fortune',
  '/bu/business-fortune',
  '/bu/move-fortune',
  '/bu/health-fortune',
  '/bu/invest-fortune',
  '/bu/love-fortune',
  '/bu/exam-fortune',
  '/bu/travel-fortune',
  '/bu/plant-fortune',
  '/bu/pet-fortune',
  '/bu/lucky-color',
  '/bu/lucky-number',
  '/bu/lucky-direction',
  '/bu/birth-chart',
  '/bu/mole',
  '/bu/daily-hexagram',
  '/bu/numerology',
  '/bu/zodiac-match',
  '/bu/name',
  '/bu/fengshui',
  '/bu/palm',
  '/bu/face',
  '/bu/ziwei',
  '/bu/jiemeng',
  '/bu/huangli',
  '/bu/tarot',
  '/bu/oracle',
  '/wo/horoscope',
  '/wo/compare',
  '/wo/dress-guide',
  '/wo/daily-fortune',
  '/xiu/breath',
  '/xiu/chakra',
  '/shu/detail',
  '/shu/heart-power',
]

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = HIDE_NAV_PAGES.some(p => pathname?.startsWith(p))

  return (
    <>
      <PageProgress />
      <NetworkStatus />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <ScrollToTop />
      {!hideNav && <AIFloatingButton />}
      {!hideNav && <BottomNav />}
    </>
  )
}
