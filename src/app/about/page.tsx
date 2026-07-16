'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-moonly-secondary">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">关于</h1>
      </div>

      {/* 品牌介绍 */}
      <div className="moonly-card p-5 text-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#6b5b95] mx-auto mb-4 flex items-center justify-center text-3xl border-2 border-[#c9a96e]/30">
          🧭
        </div>
        <h2 className="text-white text-lg font-bold mb-2">LifeGPS · 人生导航</h2>
        <p className="text-moonly-secondary text-sm leading-relaxed">
          融合现代AI技术与传统命理智慧，为你的人生提供方向指引。
          我们致力于用科技赋能传统文化，让命理学变得更加科学、易懂、实用。
        </p>
      </div>

      {/* 核心功能 */}
      <div className="moonly-card p-4 mb-6">
        <h2 className="text-gold text-sm font-semibold mb-3">核心功能</h2>
        <div className="space-y-3">
          {[
            { icon: '🎯', title: '八字分析', desc: '基于出生年月日时，解析命盘格局、五行能量、十神分布' },
            { icon: '💕', title: '合婚分析', desc: '对比双方八字，分析婚姻匹配度与相处建议' },
            { icon: '💼', title: '事业合作', desc: '分析事业方向、合作运势，助力职业发展' },
            { icon: '🌟', title: '天赋分析', desc: '结合多元智能理论，发现你的潜在天赋' },
            { icon: '✨', title: '姓名学', desc: '分析姓名笔划吉凶，提供起名建议' },
            { icon: '🎴', title: 'AI命理师', desc: '24小时在线，解答你的命理疑惑' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="text-white text-sm font-medium">{item.title}</div>
                <div className="text-moonly-muted text-xs">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 版本信息 */}
      <div className="moonly-card p-4 mb-6">
        <h2 className="text-gold text-sm font-semibold mb-3">版本信息</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">版本</span>
            <span className="text-white text-sm">v2.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">更新日期</span>
            <span className="text-white text-sm">2025年7月</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">技术支持</span>
            <span className="text-white text-sm">Kimi AI</span>
          </div>
        </div>
      </div>

      {/* 免责声明 */}
      <div className="moonly-card p-4">
        <h2 className="text-gold text-sm font-semibold mb-3">免责声明</h2>
        <p className="text-moonly-secondary text-sm leading-relaxed">
          LifeGPS 提供的命理分析内容仅供参考娱乐，不构成任何形式的决策依据。
          人生道路由自己掌控，命理分析不能替代专业医疗、法律或财务建议。
        </p>
      </div>
      <div className="mt-6 text-center">
        <Link href="/privacy" className="text-moonly-muted text-xs hover:text-gold transition">
          隐私政策
        </Link>
      </div>
    </div>
  )
}
