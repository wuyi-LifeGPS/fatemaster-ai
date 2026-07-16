'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const FEATURES = [
  { icon: '🎯', title: '八字命盘', desc: '探索命运密码', href: '/ming', color: 'from-gold/20 to-orange/10' },
  { icon: '🔮', title: '智能占卜', desc: ' tarot · 六爻 · 解梦', href: '/bu', color: 'from-purple/20 to-pink/10' },
  { icon: '🧘', title: '正念修行', desc: '冥想 · 呼吸 · 禅语', href: '/xiu', color: 'from-teal/20 to-cyan/10' },
  { icon: '📚', title: '经典书库', desc: '道德经 · 心经 · 周易', href: '/shu', color: 'from-amber/20 to-yellow/10' },
]

const QUICK_TOOLS = [
  { icon: '☀️', title: '今日运势', href: '/wo/daily-fortune' },
  { icon: '👔', title: '穿衣指南', href: '/wo/dress-guide' },
  { icon: '♈', title: '星座运势', href: '/wo/horoscope' },
  { icon: '🔢', title: '幸运数字', href: '/bu/lucky-number' },
]

export default function HomePage() {
  const [hasProfile, setHasProfile] = useState(false)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('夜深了')
    else if (hour < 9) setGreeting('早上好')
    else if (hour < 12) setGreeting('上午好')
    else if (hour < 14) setGreeting('中午好')
    else if (hour < 18) setGreeting('下午好')
    else setGreeting('晚上好')

    const profiles = localStorage.getItem('bazi_profiles')
    if (profiles) {
      try {
        const parsed = JSON.parse(profiles)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasProfile(true)
        }
      } catch {}
    }
  }, [])

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-6 pb-24 animate-fade-in">
      {/* 顶部问候 */}
      <div className="mb-8">
        <h1 className="text-gold-gradient text-2xl font-bold mb-1">{greeting}，欢迎来到 LifeGPS</h1>
        <p className="text-moonly-secondary text-base">探索命理智慧，指引人生方向</p>
      </div>

      {/* 核心功能入口 */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {FEATURES.map(feature => (
          <Link
            key={feature.title}
            href={feature.href}
            className={`moonly-card p-5 hover:bg-white/5 transition group`}
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <div className="text-white font-semibold text-lg mb-1">{feature.title}</div>
            <div className="text-moonly-muted text-sm">{feature.desc}</div>
          </Link>
        ))}
      </div>

      {/* 快捷工具 */}
      <div className="mb-8">
        <h2 className="text-white font-semibold text-lg mb-4">⚡ 快捷工具</h2>
        <div className="grid grid-cols-4 gap-3">
          {QUICK_TOOLS.map(tool => (
            <Link
              key={tool.title}
              href={tool.href}
              className="moonly-card p-3 text-center hover:bg-white/5 transition"
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="text-white text-sm">{tool.title}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* 添加八字引导 */}
      {!hasProfile && (
        <div className="moonly-card p-6 text-center border border-[#c9a96e]/20">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-white font-semibold text-lg mb-2">开启您的命理之旅</h3>
          <p className="text-moonly-secondary text-sm mb-4">
            添加您的出生信息，解锁八字命盘、大运流年、流月流日等完整命理分析
          </p>
          <Link href="/bazi" className="btn-gold px-8 py-3 text-base font-semibold inline-block">
            添加我的八字
          </Link>
          <p className="text-moonly-muted text-sm mt-3">支持保存多个档案：自己、家人、朋友</p>
        </div>
      )}

      {/* 已有档案引导 */}
      {hasProfile && (
        <div className="moonly-card p-6 text-center">
          <div className="text-4xl mb-3">✨</div>
          <h3 className="text-white font-semibold text-lg mb-2">继续探索</h3>
          <p className="text-moonly-secondary text-sm mb-4">
            您已添加八字档案，可以查看命盘、运势分析、合婚对比等功能
          </p>
          <Link href="/ming" className="btn-gold px-8 py-3 text-base font-semibold inline-block">
            查看命盘
          </Link>
        </div>
      )}
    </div>
  )
}
