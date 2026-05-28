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
    <main className="min-h-screen bg-[#0a0808] text-white/80">
      {/* Hero Section - 罗盘背景 + 标题浮层 */}
      <section className="relative min-h-[85vh] text-white pt-16 pb-8 px-4 overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(88, 60, 120, 0.6) 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, rgba(180, 120, 60, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(60, 80, 140, 0.5) 0%, transparent 50%), #0c0a0a',
        }}>
        {/* 背景粒子 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{
                background: i % 2 === 0 ? '#c9935a' : '#7c6fae',
                left: `${(i * 17 + 13) % 100}%`,
                top: `${(i * 23 + 7) % 100}%`,
                animation: `float ${8 + (i % 5) * 3}s ease-in-out infinite`,
                animationDelay: `${(i * 1.3) % 8}s`,
              }}
            />
          ))}
        </div>

        {/* 右上角设置 */}
        <div className="absolute top-4 right-4 z-30">
          <Link
            href="/settings"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            设置
          </Link>
        </div>

        {/* 顶部导航 */}
        <div className="relative z-30 max-w-6xl mx-auto mb-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
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
                className={`group relative flex flex-col items-center px-2 py-1.5 rounded-md text-sm md:text-base transition-all ${
                  item.available
                    ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer'
                    : 'text-white/30 cursor-not-allowed'
                }`}
              >
                <span className="flex items-center gap-1">
                  <span className="text-fate-400 font-serif text-xs">{item.num}</span>
                  <span className="font-serif">{item.label}</span>
                </span>
                <span className="text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 leading-none">
                  {item.subtitle}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 罗盘层 */}
        <div className="relative z-10 flex justify-center">
          <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[520px] lg:h-[520px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* === 固定底盘：十字线 + 指北箭头 === */}
              <g>
                {/* 十字线 */}
                <line x1="200" y1="8" x2="200" y2="392" stroke="rgba(201,147,90,0.12)" strokeWidth="1" />
                <line x1="8" y1="200" x2="392" y2="200" stroke="rgba(201,147,90,0.12)" strokeWidth="1" />
                {/* 指北箭头 */}
                <polygon points="200,12 194,28 206,28" fill="#c9935a" opacity="0.7" />
                <text x="200" y="42" textAnchor="middle" fill="#c9935a" fontSize="12" fontFamily="Georgia, serif" opacity="0.7">N</text>
                {/* 底盘同心圆 */}
                <circle cx="200" cy="200" r="195" fill="none" stroke="rgba(201,147,90,0.08)" strokeWidth="1" />
              </g>

              {/* === 外圈旋转：360度刻度 + 天干 === */}
              <g style={{ animation: 'spin 80s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(201,147,90,0.15)" strokeWidth="1" />
                <circle cx="200" cy="200" r="178" fill="none" stroke="rgba(201,147,90,0.08)" strokeWidth="0.5" />
                {/* 360度刻度 */}
                {[...Array(72)].map((_, i) => {
                  const angle = (i * 5 * Math.PI) / 180
                  const isMajor = i % 6 === 0
                  const isMedium = i % 2 === 0
                  const r1 = isMajor ? 170 : (isMedium ? 176 : 182)
                  const r2 = 188
                  const x1 = 200 + r1 * Math.cos(angle)
                  const y1 = 200 + r1 * Math.sin(angle)
                  const x2 = 200 + r2 * Math.cos(angle)
                  const y2 = 200 + r2 * Math.sin(angle)
                  return (
                    <line
                      key={`tick-${i}`}
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isMajor ? 'rgba(201,147,90,0.35)' : 'rgba(201,147,90,0.15)'}
                      strokeWidth={isMajor ? 1.5 : 0.5}
                    />
                  )
                })}
                {/* 天干 */}
                {['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].map((gan, i) => {
                  const angle = ((i * 36 - 90) * Math.PI) / 180
                  const x = 200 + 162 * Math.cos(angle)
                  const y = 200 + 162 * Math.sin(angle)
                  return (
                    <text
                      key={gan}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(201,147,90,0.55)"
                      fontSize="13"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{gan}</text>
                  )
                })}
              </g>

              {/* === 第二圈旋转：地支 === */}
              <g style={{ animation: 'spin-reverse 55s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="158" fill="none" stroke="rgba(201,147,90,0.12)" strokeWidth="1" />
                <circle cx="200" cy="200" r="148" fill="none" stroke="rgba(201,147,90,0.06)" strokeWidth="0.5" />
                {/* 地支 */}
                {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((zhi, i) => {
                  const angle = ((i * 30 - 90) * Math.PI) / 180
                  const x = 200 + 136 * Math.cos(angle)
                  const y = 200 + 136 * Math.sin(angle)
                  return (
                    <text
                      key={zhi}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(201,147,90,0.5)"
                      fontSize="15"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{zhi}</text>
                  )
                })}
              </g>

              {/* === 第三圈固定：方位 === */}
              <g>
                <circle cx="200" cy="200" r="124" fill="none" stroke="rgba(124,111,174,0.1)" strokeWidth="1" />
                <circle cx="200" cy="200" r="114" fill="none" stroke="rgba(124,111,174,0.06)" strokeWidth="0.5" />
                {/* 方位 */}
                {[
                  { text: '北', sub: '' },
                  { text: '东北', sub: '' },
                  { text: '东', sub: '' },
                  { text: '东南', sub: '' },
                  { text: '南', sub: '' },
                  { text: '西南', sub: '' },
                  { text: '西', sub: '' },
                  { text: '西北', sub: '' },
                ].map((dir, i) => {
                  const angle = ((i * 45 - 90) * Math.PI) / 180
                  const x = 200 + 104 * Math.cos(angle)
                  const y = 200 + 104 * Math.sin(angle)
                  return (
                    <text
                      key={dir.text}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(124,111,174,0.4)"
                      fontSize="11"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{dir.text}</text>
                  )
                })}
              </g>

              {/* === 第四圈旋转：八卦 === */}
              <g style={{ animation: 'spin 40s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="92" fill="none" stroke="rgba(124,111,174,0.15)" strokeWidth="1" />
                <circle cx="200" cy="200" r="84" fill="none" stroke="rgba(124,111,174,0.08)" strokeWidth="0.5" />
                {/* 八卦 */}
                {['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'].map((gua, i) => {
                  const angle = ((i * 45 - 90) * Math.PI) / 180
                  const x = 200 + 74 * Math.cos(angle)
                  const y = 200 + 74 * Math.sin(angle)
                  return (
                    <text
                      key={gua}
                      x={x} y={y}
                      textAnchor="middle"
                      fill="rgba(124,111,174,0.5)"
                      fontSize="14"
                      fontFamily="Georgia, 'Times New Roman', serif"
                      dy="0.35em"
                    >{gua}</text>
                  )
                })}
              </g>

              {/* === 中心层：太极图 === */}
              <g style={{ animation: 'spin-reverse 30s linear infinite', transformOrigin: '200px 200px' }}>
                <circle cx="200" cy="200" r="62" fill="none" stroke="rgba(201,147,90,0.1)" strokeWidth="1" />
                <circle cx="200" cy="200" r="54" fill="none" stroke="rgba(201,147,90,0.06)" strokeWidth="0.5" />
                {/* 太极阴阳鱼 */}
                <path
                  d="M 200 146 A 54 54 0 0 1 200 254 A 27 27 0 0 0 200 200 A 27 27 0 0 1 200 146"
                  fill="rgba(201,147,90,0.12)"
                />
                <path
                  d="M 200 146 A 54 54 0 0 0 200 254 A 27 27 0 0 1 200 200 A 27 27 0 0 0 200 146"
                  fill="rgba(124,111,174,0.12)"
                />
                <circle cx="200" cy="173" r="5" fill="rgba(124,111,174,0.3)" />
                <circle cx="200" cy="227" r="5" fill="rgba(201,147,90,0.3)" />
              </g>

              {/* === 中心光点 === */}
              <g>
                <circle cx="200" cy="200" r="5" fill="rgba(201,147,90,0.7)">
                  <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
                  <animate attributeName="r" values="4;6;4" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="200" r="12" fill="none" stroke="rgba(201,147,90,0.15)" strokeWidth="1">
                  <animate attributeName="r" values="10;18;10" dur="4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.2;0;0.2" dur="4s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>

            {/* 标题层 - 绝对定位覆盖罗盘中心，整体下移使标题位于中心点 */}
            <div className="absolute inset-0 z-20 flex flex-col items-center text-center px-4 translate-y-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl mb-2 font-slidefu text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tracking-wide"
                style={{ fontWeight: 400 }}
              >
                <span className="text-white/90">知命改运</span>
                <span className="text-fate-400 mx-1 sm:mx-2">·</span>
                <span>人生导航</span>
              </h1>
              <p className="text-base sm:text-lg text-white/60 mb-3 font-serif drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
                古老东方智慧解析系统
              </p>
              <blockquote className="text-white/40 italic text-sm max-w-md mx-auto mb-5 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]"
              >
                "除非你意识到你的潜意识，否则潜意识将主导你的人生，而你将其称为命运。"
                <span className="text-xs not-italic mt-1 block text-white/30">— 卡尔·荣格</span>
              </blockquote>

              <Link
                href="/bazi"
                className="inline-block bg-fate-600 hover:bg-fate-500 text-white px-8 py-3 rounded-lg text-base transition-all shadow-lg shadow-fate-600/30 hover:shadow-xl hover:shadow-fate-500/40 hover:-translate-y-0.5"
              >
                🔮 开始八字分析
              </Link>
            </div>
          </div>
        </div>

        {/* 底部渐变过渡到暗色 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0808] to-transparent" />
      </section>

      {/* Core Concepts - 暗色主题 */}
      <section className="py-16 px-4 bg-[#0a0808]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 font-serif text-white">核心理念</h2>
          <p className="text-center text-white/50 mb-12">以理性态度传承东方智慧，用现代技术赋能命理分析</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'AI 智能，科学解析', desc: '融合现代 AI 技术与传统命理智慧，通过大数据分析和机器学习，提供客观的命理解读，让玄学不再玄' },
              { icon: '📜', title: '文化传承，理性态度', desc: '以开放理性的态度传承东方智慧，去芜存菁，不迷信、不神化，让千年命理文化以更健康的方式融入现代生活' },
              { icon: '🌟', title: '自主探索，独立思考', desc: '我们相信每个人都是自己命运的解读者。通过 AI 工具赋能，让每个人都能独立进行命理分析，自主思考人生方向' },
            ].map((item) => (
              <div key={item.title} className="bg-white/[0.03] border border-white/10 p-6 rounded-lg hover:bg-white/[0.06] hover:border-white/20 transition-all">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 font-serif text-white">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services - 暗色主题 */}
      <section className="py-16 px-4 bg-[#0a0808]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold font-serif text-white">分析系统</h2>
            <Link
              href="/history"
              className="text-sm text-fate-400 hover:text-fate-300 flex items-center gap-1 px-3 py-1.5 rounded-md hover:bg-white/5 transition-colors"
            >
              📜 查询历史
            </Link>
          </div>
          <p className="text-center text-white/50 mb-12">探索我们的智能解析服务</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="group bg-white/[0.03] border border-white/10 p-6 rounded-xl hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-1 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} text-white text-xl mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-serif text-white">{service.title}</h3>
                <p className="text-white/60">{service.desc}</p>
                <span className="text-fate-400 mt-4 inline-block text-sm font-medium group-hover:translate-x-1 transition-transform">
                  进入分析 →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - 暗色主题 */}
      <footer className="bg-[#050505] text-white/40 py-12 px-4 text-center border-t border-white/5">
        <p className="text-lg font-serif mb-2 text-white/60">LifeGPS · AI 分析个人特质，洞察发展潜力</p>
        <p className="text-sm text-white/30 mb-6">无需注册，免费体验，深度洞察</p>
        <div className="flex justify-center gap-6 text-sm text-white/25">
          <span>Powered by Kimi AI</span>
          <span>·</span>
          <span>传统命理 × 现代 AI</span>
        </div>
      </footer>
    </main>
  )
}
