'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen moonly-bg moonly-content flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">🌙</div>
      <h1 className="text-gold-gradient text-2xl font-bold mb-2">迷路了</h1>
      <p className="text-moonly-secondary text-sm mb-8 max-w-xs">
        这个页面似乎不在星图之中，让我们回到正轨
      </p>
      <Link
        href="/"
        className="btn-gold px-8 py-3 text-sm font-medium"
      >
        返回首页
      </Link>
    </div>
  )
}
