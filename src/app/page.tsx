'use client'

import Link from 'next/link'

export default function Home() {
  const navItems = [
    { num: '一', label: '命', subtitle: '八字分析', href: '/bazi', available: true },
    { num: '二', label: '运', subtitle: '大运流年', href: '/bazi', available: true },
    { num: '三', label: '风水', subtitle: '改运建议', href: '/bazi', available: true },
    { num: '四', label: '积阴德', subtitle: '积德行善', href: '#', available: false },
    { num: '五', label: '读书', subtitle: '学习书架', href: '#', available: false },
    { num: '六', label: '名', subtitle: '姓名分析', href: '/naming', available: true },
    { num: '七', label: '相', subtitle: '面相手相', href: '#', available: false },
    { num: '八', label: '敬神', subtitle: '阴符经', href: '#', available: false },
    { num: '九', label: '遇贵人', subtitle: '神煞合盘', href: '/match', available: true },
    { num: '十', label: '养生', subtitle: '健康建议', href: '#', available: false },
  ]

  const services = [
    {
      title: '八字分析',
      desc: 'AI 智能八字分析系统，揭示个人命盘特质与发展规律',
      icon: '☯',
      href: '/bazi',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: '姓名学分析',
      desc: '三才五格姓名分析，AI智能起名推荐',
      icon: '✍',
      href: '/naming',
      color: 'from-purple-500 to-violet-600',
    },
    {
      title: '每日运势',
      desc: '基于八字的每日运势分析，助你把握每日吉凶',
      icon: '🌅',
      href: '/daily',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: '合婚分析',
      desc: '基于八字的深度匹配分析，揭示双方关系契合度',
      icon: '💑',
      href: '/match',
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: '事业合作',
      desc: '基于八字的商业关系分析，助你了解合作潜力与挑战',
      icon: '🤝',
      href: '/career',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white py-16 px-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(88, 60, 120, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(180, 120, 60, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(60, 80, 140, 0.5) 0%, transparent 50%), #0c0a0a',
        }}>
        {/* 背景粒子效果 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{
                background: i % 2 === 0 ? '#c9935a' : '#7c6fae',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>

        {/* 右上角设置 */}
        <div className="absolute top-4 right-4 z-20">
          <Link
            href="/settings"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            设置
          </Link>
        </div>

        {/* 顶部导航：一命二运三风水... */}
        <div className="relative z-10 max-w-6xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.available ? item.href : '#'}
                onClick={(e) => {
                  if (!item.available) {
                    e.preventDefault()
                    alert('功能即将上线，敬请期待')
                  }
                }}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs md:text-sm transition-all ${
                  item.available
                    ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer'
                    : 'text-white/30 cursor-not-allowed'
                }`}
              >
                <span className="text-fate-400 font-serif text-xs">{item.num}</span>
                <span className="font-serif">{item.label}</span>
                <span className="hidden md:inline text-white/40 text-xs">·{item.subtitle}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 动态罗盘 */}
        <div className="relative z-10 flex justify-center mb-8">
          <div className="relative w-48 h-48 md:w-56 md:h-56">
            {/* 外圈旋转 */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ animation: 'spin 60s linear infinite' }}
              viewBox="0 0 200 200"
            >
              {/* 外圈刻度 */}
              <circle cx="100" cy="100" r="95" fill="none" stroke="rgba(201,147,90,0.2)" strokeWidth="1" />
              {[...Array(24)].map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180
                const x1 = 100 + 85 * Math.cos(angle)
                const y1 = 100 + 85 * Math.sin(angle)
                const x2 = 100 + 95 * Math.cos(angle)
                const y2 = 100 + 95 * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(201,147,90,0.3)"
                    strokeWidth={i % 6 === 0 ? 2 : 1}
                  />
                )
              })}
              {/* 外圈文字 */}
              {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((zhi, i) => {
                const angle = ((i * 30 - 90) * Math.PI) / 180
                const x = 100 + 78 * Math.cos(angle)
                const y = 100 + 78 * Math.sin(angle)
                return (
                  <text
                    key={zhi}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(201,147,90,0.5)"
                    fontSize="10"
                    fontFamily="Georgia, serif"
                  >
                    {zhi}
                  </text>
                )
              })}
            </svg>

            {/* 中圈反向旋转 */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ animation: 'spin-reverse 45s linear infinite' }}
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(124,111,174,0.2)" strokeWidth="1" />
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180
                const x1 = 100 + 60 * Math.cos(angle)
                const y1 = 100 + 60 * Math.sin(angle)
                const x2 = 100 + 70 * Math.cos(angle)
                const y2 = 100 + 70 * Math.sin(angle)
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(124,111,174,0.3)"
                    strokeWidth={2}
                  />
                )
              })}
              {['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'].map((gua, i) => {
                const angle = ((i * 45 - 90) * Math.PI) / 180
                const x = 100 + 52 * Math.cos(angle)
                const y = 100 + 52 * Math.sin(angle)
                return (
                  <text
                    key={gua}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="rgba(124,111,174,0.5)"
                    fontSize="9"
                    fontFamily="Georgia, serif"
                  >
                    {gua}
                  </text>
                )
              })}
            </svg>

            {/* 内圈 */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ animation: 'spin 30s linear infinite' }}
              viewBox="0 0 200 200"
            >
              <circle cx="100" cy="100" r="45" fill="none" stroke="rgba(201,147,90,0.15)" strokeWidth="1" />
              <circle cx="100" cy="100" r="35" fill="none" stroke="rgba(124,111,174,0.15)" strokeWidth="1" />
              {/* 太极分割线 */}
              <path
                d="M 100 65 A 35 35 0 0 1 100 135 A 17.5 17.5 0 0 0 100 100 A 17.5 17.5 0 0 1 100 65"
                fill="rgba(201,147,90,0.2)"
              />
              <path
                d="M 100 65 A 35 35 0 0 0 100 135 A 17.5 17.5 0 0 1 100 100 A 17.5 17.5 0 0 0 100 65"
                fill="rgba(124,111,174,0.2)"
              />
              <circle cx="100" cy="82.5" r="4" fill="rgba(124,111,174,0.4)" />
              <circle cx="100" cy="117.5" r="4" fill="rgba(201,147,90,0.4)" />
            </svg>

            {/* 中心光点 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(201,147,90,0.8) 0%, transparent 70%)',
                  animation: 'pulse-glow 3s ease-in-out infinite',
                }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">
            LifeGPS · 人生导航
          </h1>
          <p className="text-xl md:text-2xl text-white/60 mb-8 font-serif">
            古老东方智慧解析系统
          </p>
          <blockquote className="text-white/40 italic text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            "除非你意识到你的潜意识，否则潜意识将主导你的人生，而你将其称为命运。"
            <span className="text-sm not-italic mt-3 block text-white/30">— 卡尔·荣格</span>
          </blockquote>

          <div className="flex justify-center">
            <Link
              href="/bazi"
              className="inline-block bg-fate-600 hover:bg-fate-500 text-white px-8 py-4 rounded-lg text-lg transition-all shadow-lg shadow-fate-600/30 hover:shadow-xl hover:shadow-fate-500/40 hover:-translate-y-0.5"
            >
              🔮 开始八字分析
            </Link>
          </div>
        </div>

        {/* 底部渐变过渡 */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-fate-50 to-transparent" />
      </section>

      {/* Core Concepts */}
      <section className="py-16 px-4 bg-fate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 font-serif">核心理念</h2>
          <p className="text-center text-ink-500 mb-12">以理性态度传承东方智慧，用现代技术赋能命理分析</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'AI 智能，科学解析', desc: '融合现代 AI 技术与传统命理智慧，通过大数据分析和机器学习，提供客观的命理解读，让玄学不再玄' },
              { icon: '📜', title: '文化传承，理性态度', desc: '以开放理性的态度传承东方智慧，去芜存菁，不迷信、不神化，让千年命理文化以更健康的方式融入现代生活' },
              { icon: '🌟', title: '自主探索，独立思考', desc: '我们相信每个人都是自己命运的解读者。通过 AI 工具赋能，让每个人都能独立进行命理分析，自主思考人生方向' },
            ].map((item) => (
              <div key={item.title} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-serif">{item.title}</h3>
                <p className="text-ink-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold font-serif">分析系统</h2>
            <Link
              href="/history"
              className="text-sm text-fate-600 hover:text-fate-700 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-fate-50 transition-colors"
            >
              📜 查询历史
            </Link>
          </div>
          <p className="text-center text-ink-500 mb-12">探索我们的智能解析服务</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-fate-100 hover:border-fate-300 hover:-translate-y-1"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} text-white text-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif">{service.title}</h3>
                <p className="text-ink-600">{service.desc}</p>
                <span className="text-fate-600 mt-4 inline-block text-sm font-medium group-hover:translate-x-1 transition-transform">
                  进入分析 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 text-fate-300 py-12 px-4 text-center">
        <p className="text-lg font-serif mb-2">LifeGPS · AI 分析个人特质，洞察发展潜力</p>
        <p className="text-sm text-fate-400 mb-6">无需注册，免费体验，深度洞察</p>
        <div className="flex justify-center gap-6 text-sm text-fate-500">
          <span>Powered by Kimi AI</span>
          <span>·</span>
          <span>传统命理 × 现代 AI</span>
        </div>
      </footer>
    </main>
  )
}
