'use client'

import { hapticLight } from '@/lib/haptic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { path: '/ming', label: '命', icon: MingIcon },
  { path: '/bu', label: '卜', icon: BuIcon },
  { path: '/xiu', label: '修', icon: XiuIcon },
  { path: '/shu', label: '书', icon: ShuIcon },
  { path: '/wo', label: '我', icon: WoIcon },
]

function MingIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#c9a96e' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}

function BuIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#c9a96e' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function XiuIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#c9a96e' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function ShuIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#c9a96e' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
    </svg>
  )
}

function WoIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#c9a96e' : 'rgba(255,255,255,0.35)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default function BottomNav() {
  const pathname = usePathname()
  
  // 不在底部导航显示的路径
  const hideNavPaths = ['/records', '/chat']
  if (hideNavPaths.some(p => pathname.startsWith(p))) return null

  return (
    <nav className="tab-nav fixed bottom-0 left-0 right-0 z-30 pb-safe">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path || pathname.startsWith(tab.path + '/')
          const Icon = tab.icon
          return (
            <Link
              key={tab.path}
              href={tab.path}
              onClick={() => hapticLight()}
              className={`tab-item flex flex-col items-center gap-0.5 py-1 px-3 ${isActive ? 'active' : ''}`}
            >
              <span className="tab-icon"><Icon active={isActive} /></span>
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
