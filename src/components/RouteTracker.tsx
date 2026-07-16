'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { addRecentVisit } from './RecentVisits'

const PAGE_LABELS: Record<string, string> = {
  '/ming': '命盘',
  '/bazi': '八字',
  '/career': '事业',
  '/match': '合婚',
  '/talent': '天赋',
  '/naming': '起名',
  '/daily': '日运',
  '/bu': '卜卦',
  '/bu/chat': 'AI对话',
  '/bu/tarot': '塔罗',
  '/bu/coin': '铜钱',
  '/xiu': '修行',
  '/shu': '书籍',
  '/wo': '我的',
  '/settings': '设置',
  '/history': '历史',
}

function getPageLabel(path: string): string {
  // 精确匹配
  if (PAGE_LABELS[path]) return PAGE_LABELS[path]
  // 前缀匹配
  for (const [prefix, label] of Object.entries(PAGE_LABELS)) {
    if (path.startsWith(prefix + '/')) return label
  }
  // 从路径提取最后一段
  const segments = path.split('/').filter(Boolean)
  return segments[segments.length - 1] || '页面'
}

export default function RouteTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname) {
      const label = getPageLabel(pathname)
      addRecentVisit(pathname, label)
    }
  }, [pathname])

  return null
}
