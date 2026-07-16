'use client'

import { usePathname } from 'next/navigation'
import AIFloatingButton from './AIFloatingButton'
import BottomNav from './BottomNav'

const HIDE_NAV_PAGES = ['/bazi', '/bu/chat', '/ming/records', '/ming/edit', '/ming/bazi', '/settings', '/history', '/naming', '/match', '/career', '/talent']

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = HIDE_NAV_PAGES.some(p => pathname?.startsWith(p))

  return (
    <>
      {children}
      {!hideNav && <AIFloatingButton />}
      {!hideNav && <BottomNav />}
    </>
  )
}
