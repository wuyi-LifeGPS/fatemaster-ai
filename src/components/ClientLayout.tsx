'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AIFloatingButton from './AIFloatingButton'
import UsageStatsPanel, { trackVisit } from './UsageStats'
import UpdatePrompt from './UpdatePrompt'
import Onboarding from './Onboarding'
import PageTransition from './PageTransition'
import GlobalSearch from './GlobalSearch'
import RouteTracker from './RouteTracker'
import PageProgress from './PageProgress'
import NetworkStatus from './NetworkStatus'
import ErrorBoundary from './ErrorBoundary'
import ScrollToTop from './ScrollToTop'
import BottomNav from './BottomNav'
import FeedbackButton from './FeedbackButton'
import { useDoubleTapToTop } from '@/hooks/useSwipe'

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

  // 双击返回顶部
  useDoubleTapToTop()

  useEffect(() => {
    trackVisit()

    // 注册 Service Worker（PWA 支持）
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 静默失败，不影响正常使用
      })
    }

    // 应用字体大小设置
    try {
      const settings = JSON.parse(localStorage.getItem('lifegps_settings') || '{}')
      const fontSize = settings.fontSize || 'normal'
      const sizes: Record<string, string> = { small: '14px', normal: '16px', large: '18px' }
      document.documentElement.style.fontSize = sizes[fontSize] || '16px'
    } catch {
      // ignore
    }
  }, [pathname])

  return (
    <>
      <UpdatePrompt />
      <Onboarding />
      <PageTransition />
      <GlobalSearch />
      <RouteTracker />
      <PageProgress />
      <NetworkStatus />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <ScrollToTop />
      <FeedbackButton />
      {!hideNav && <AIFloatingButton />}
      {!hideNav && <BottomNav />}
    </>
  )
}
