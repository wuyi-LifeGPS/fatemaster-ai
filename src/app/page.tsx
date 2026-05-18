import Link from 'next/link'

export default function Home() {
  const services = [
    {
      title: '八字分析',
      desc: 'AI 智能八字分析系统，揭示个人命盘特质与发展规律',
      icon: '☯',
      href: '/bazi',
      color: 'from-amber-500 to-orange-600',
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
      <section className="relative bg-ink-900 text-fate-50 py-20 px-4 overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-fate-600 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fate-400 rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '32px 32px'}} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-sm mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            已接入 Kimi AI 深度分析
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif">
            LifeGPS · 人生导航
          </h1>
          <p className="text-xl md:text-2xl text-fate-200 mb-8 font-serif">
            人工智能驱动的东方智慧解析系统
          </p>
          <blockquote className="text-fate-300 italic text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            "除非你意识到你的潜意识，否则潜意识将主导你的人生，而你将其称为命运。"
            <span className="text-sm not-italic mt-3 block text-fate-400">— 卡尔·荣格</span>
          </blockquote>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/bazi"
              className="inline-block bg-fate-600 hover:bg-fate-500 text-white px-8 py-4 rounded-lg text-lg transition-all shadow-lg shadow-fate-600/30 hover:shadow-xl hover:shadow-fate-500/40 hover:-translate-y-0.5"
            >
              🔮 开始八字分析
            </Link>
            <Link
              href="/settings"
              className="inline-block bg-white/10 hover:bg-white/20 text-fate-200 px-6 py-4 rounded-lg text-sm transition-all backdrop-blur-sm"
            >
              ⚙️ 配置 AI Key
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center gap-8 text-sm text-fate-400">
            <span>✓ 免费体验</span>
            <span>✓ 无需注册</span>
            <span>✓ 专业排盘</span>
            <span>✓ 隐私保护</span>
          </div>
        </div>
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