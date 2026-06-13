'use client'

import Link from 'next/link'

export default function Home() {
  const navItems = [
    { num: '一', label: '命', subtitle: '八字命理', href: '/bazi', available: true },
    { num: '二', label: '运', subtitle: '大运流年', href: '/bazi', available: true },
    { num: '三', label: '风水', subtitle: '改运建议', href: '/bazi', available: true },
    { num: '四', label: '积阴德', subtitle: '积德行善', href: '/daily', available: true },
    { num: '五', label: '读书', subtitle: '学习书架', href: '#', available: false },
    { num: '六', label: '名', subtitle: '姓名分析', href: '/naming', available: true },
    { num: '七', label: '相', subtitle: '面相手相', href: '#', available: false },
    { num: '八', label: '敬神', subtitle: '阴符经', href: '#', available: false },
    { num: '九', label: '遇贵人', subtitle: '合婚合作', href: '/match', available: true },
    { num: '十', label: '养生', subtitle: '健康建议', href: '#', available: false },
    { num: '天赋', label: '天赋', subtitle: '天赋解码', href: '/talent', available: true },
  ]

  const services = [
    {
      title: '八字分析',
      desc: 'AI 智能八字分析系统，揭示个人命盘特质与发展规律',
      icon: '☯',
      href: '/bazi',
      color: 'border-amber-200',
      accent: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      title: '姓名学分析',
      desc: '三才五格姓名分析，AI智能起名推荐',
      icon: '✍',
      href: '/naming',
      color: 'border-purple-200',
      accent: 'text-purple-700',
      bg: 'bg-purple-50',
    },
    {
      title: '每日运势',
      desc: '基于八字的每日运势分析，助你把握每日吉凶',
      icon: '🌅',
      href: '/daily',
      color: 'border-orange-200',
      accent: 'text-orange-700',
      bg: 'bg-orange-50',
    },
    {
      title: '合婚分析',
      desc: '基于八字的深度匹配分析，揭示双方关系契合度',
      icon: '💑',
      href: '/match',
      color: 'border-pink-200',
      accent: 'text-pink-700',
      bg: 'bg-pink-50',
    },
    {
      title: '事业合作',
      desc: '基于八字的商业关系分析，助你了解合作潜力与挑战',
      icon: '🤝',
      href: '/career',
      color: 'border-green-200',
      accent: 'text-green-700',
      bg: 'bg-green-50',
    },
    {
      title: '天赋分析',
      desc: '融合八字命理 × 多元智能理论，发现你的天赋密码与职业方向',
      icon: '🧬',
      href: '/talent',
      color: 'border-teal-200',
      accent: 'text-teal-700',
      bg: 'bg-teal-50',
    },
  ]

  return (
    <main className="min-h-screen bg-[#f5f0e6]">
      {/* Hero Section - 东方美学留白风格 */}
      <section className="relative min-h-[70vh] pt-12 pb-16 px-4 overflow-hidden bg-[#f5f0e6]">
        {/* 右上角设置 */}
        <div className="absolute top-4 right-4 z-30">
          <Link
            href="/settings"
            className="text-gray-500 hover:text-[#8b1a1a] text-sm transition-colors"
          >
            设置
          </Link>
        </div>

        {/* 顶部导航 - 移动端横向滚动 */}
        <div className="relative z-30 max-w-6xl mx-auto mb-12">
          <div className="flex overflow-x-auto scrollbar-hide justify-start md:justify-center gap-2 md:gap-3 whitespace-nowrap px-4 md:px-0 pb-2">
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
                className={`group relative inline-flex flex-col items-center px-2 py-1.5 rounded-md text-sm md:text-base transition-all shrink-0 ${
                  item.available
                    ? 'text-gray-600 hover:text-[#8b1a1a] hover:bg-stone-100 cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="text-[#8b1a1a] font-serif text-xs">{item.num}</span>
                  <span className="font-serif">{item.label}</span>
                </span>
                <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 leading-none">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 罗盘 + 标题层 */}
        <div className="relative z-10 flex flex-col items-center">
          {/* 简化罗盘 - 东方暗色调 */}
          <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[360px] md:h-[360px] mb-8">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 底盘 */}
              <g>
                <line x1="200" y1="20" x2="200" y2="380" stroke="rgba(139,26,26,0.15)" strokeWidth="1" />
                <line x1="20" y1="200" x2="380" y2="200" stroke="rgba(139,26,26,0.15)" strokeWidth="1" />
                <circle cx="200" cy="200" r="190" fill="none" stroke="rgba(139,26,26,0.08)" strokeWidth="1" />
              </g>

              {/* 外圈 - 天干 */}
              <g style={{ animation: 'spin 120s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(139,26,26,0.1)" strokeWidth="1" />
                {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map((gan, i) => {
                  const angle = ((i * 36 - 90) * Math.PI) / 180
                  const x = 200 + 160 * Math.cos(angle)
                  const y = 200 + 160 * Math.sin(angle)
                  return (
                    <text
                      key={gan}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(139,26,26,0.4)"
                      fontSize="14"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{gan}</text>
                  )
                })}
              </g>

              {/* 中圈 - 地支 */}
              <g style={{ animation: 'spin-reverse 80s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(139,26,26,0.12)" strokeWidth="1" />
                {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((zhi, i) => {
                  const angle = ((i * 30 - 90) * Math.PI) / 180
                  const x = 200 + 120 * Math.cos(angle)
                  const y = 200 + 120 * Math.sin(angle)
                  return (
                    <text
                      key={zhi}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(139,26,26,0.35)"
                      fontSize="16"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{zhi}</text>
                  )
                })}
              </g>

              {/* 内圈 - 八卦 */}
              <g style={{ animation: 'spin 60s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(139,26,26,0.1)" strokeWidth="1" />
                {['坎', '艮', '震', '巽', '离', '坤', '兑', '乾'].map((gua, i) => {
                  const angle = ((i * 45 - 90) * Math.PI) / 180
                  const x = 200 + 70 * Math.cos(angle)
                  const y = 200 + 70 * Math.sin(angle)
                  return (
                    <text
                      key={gua}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(139,26,26,0.3)"
                      fontSize="14"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{gua}</text>
                  )
                })}
              </g>

              {/* 中心太极 - 暗红水墨风格 */}
              <g>
                <circle cx="200" cy="200" r="50" fill="none" stroke="rgba(139,26,26,0.1)" strokeWidth="1" />
                <path
                  d="M 200 150 A 50 50 0 0 1 200 250 A 25 25 0 0 0 200 200 A 25 25 0 0 1 200 150"
                  fill="rgba(139,26,26,0.15)"
                />
                <path
                  d="M 200 150 A 50 50 0 0 0 200 250 A 25 25 0 0 1 200 200 A 25 25 0 0 0 200 150"
                  fill="rgba(139,26,26,0.08)"
                />
                <circle cx="200" cy="175" r="4" fill="rgba(139,26,26,0.2)" />
                <circle cx="200" cy="225" r="4" fill="rgba(139,26,26,0.12)" />
              </g>

              {/* 中心点 */}
              <g>
                <circle cx="200" cy="200" r="4" fill="rgba(139,26,26,0.5)" />
              </g>
            </svg>
          </div>

          {/* 标题区域 - 留白更多 */}
          <div className="text-center px-4">
            <h1 className="text-[28px] sm:text-4xl md:text-5xl mb-4 font-serif font-bold text-[#8b1a1a] tracking-wide whitespace-nowrap"
              style={{ fontWeight: 700 }}
            >
              <span>知命改运</span>
              <span className="mx-1 sm:mx-2 text-[#1a1a1a]">·</span>
              <span>人生导航</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 mb-3 font-serif">
              古老东方智慧解析系统
            </p>
            <blockquote className="text-gray-400 italic text-sm max-w-md mx-auto mb-8 leading-relaxed">
              "除非你意识到你的潜意识，否则潜意识将主导你的人生，而你将其称为命运。"
              <span className="text-xs not-italic mt-1 block text-gray-300">— 卡尔·荣格</span>
            </blockquote>

            <Link
              href="/bazi"
              className="inline-block bg-white hover:bg-[#8b1a1a] text-[#8b1a1a] hover:text-white border border-[#8b1a1a] px-8 py-3 rounded-xl text-base transition-all"
            >
              🔮 开始八字分析
            </Link>
          </div>
        </div>
      </section>

      {/* Core Concepts - 米黄背景上的白色卡片 */}
      <section className="py-16 px-4 bg-[#f5f0e6]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 font-serif text-[#1a1a1a]">核心理念</h2>
          <p className="text-center text-gray-500 mb-12">以理性态度传承东方智慧，用现代技术赋能命理分析</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'AI 智能，科学解析', desc: '融合现代 AI 技术与传统命理智慧，通过大数据分析和机器学习，提供客观的命理解读，让玄学不再玄' },
              { icon: '📜', title: '文化传承，理性态度', desc: '以开放理性的态度传承东方智慧，去芜存菁，不迷信、不神化，让千年命理文化以更健康的方式融入现代生活' },
              { icon: '🌟', title: '自主探索，独立思考', desc: '我们相信每个人都是自己命运的解读者。通过 AI 工具赋能，让每个人都能独立进行命理分析，自主思考人生方向' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 border border-stone-200 hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-serif text-[#1a1a1a]">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - 米黄背景上的白色卡片 */}
      <section className="py-16 px-4 bg-[#f5f0e6]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold font-serif text-[#1a1a1a]">分析系统</h2>
            <Link
              href="/history"
              className="text-sm text-[#8b1a1a] hover:text-[#6b1414] flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-stone-100 transition-colors"
            >
              📜 查询历史
            </Link>
          </div>
          <p className="text-center text-gray-500 mb-12">探索我们的智能解析服务</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white rounded-xl p-6 border border-stone-200 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${service.bg} ${service.accent} text-xl mb-4 border ${service.color} group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif text-[#1a1a1a]">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <span className="text-[#8b1a1a] mt-4 inline-block text-sm font-medium group-hover:translate-x-1 transition-transform">
                  进入分析 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - 米黄背景 */}
      <footer className="bg-[#f5f0e6] text-gray-400 py-12 px-4 text-center border-t border-stone-200">
        <p className="text-lg font-serif mb-2 text-gray-600">LifeGPS · AI 分析个人特质，洞察发展潜力</p>
        <p className="text-sm text-gray-400 mb-6">无需注册，免费体验，深度洞察</p>
        <div className="flex justify-center gap-6 text-sm text-gray-400">
          <span>Powered by Kimi AI</span>
          <span>·</span>
          <span>传统命理 × 现代 AI</span>
        </div>
      </footer>
    </main>
  )
}