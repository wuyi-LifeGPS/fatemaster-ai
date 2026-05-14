import Link from 'next/link'

export default function Home() {
  const services = [
    {
      title: '八字分析',
      desc: 'AI 智能八字分析系统，揭示个人命盘特质与发展规律',
      icon: '☯',
      href: '/bazi',
    },
    {
      title: '每日运势',
      desc: '基于八字的每日运势分析，助你把握每日吉凶',
      icon: '🌅',
      href: '/daily',
    },
    {
      title: '合婚分析',
      desc: '基于八字的深度匹配分析，揭示双方关系契合度',
      icon: '💑',
      href: '/match',
    },
    {
      title: '事业合作',
      desc: '基于八字的商业关系分析，助你了解合作潜力与挑战',
      icon: '🤝',
      href: '/career',
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-ink-900 text-fate-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-serif">
            LifeGPS · 人生导航
          </h1>
          <p className="text-xl md:text-2xl text-fate-200 mb-8 font-serif">
            人工智能驱动的东方智慧解析系统
          </p>
          <blockquote className="text-fate-300 italic text-lg max-w-2xl mx-auto mb-12">
            "除非你意识到你的潜意识，否则潜意识将主导你的人生，而你将其称为命运。"
            <br />
            <span className="text-sm not-italic mt-2 block">— 卡尔·荣格</span>
          </blockquote>
          <Link
            href="/bazi"
            className="inline-block bg-fate-600 hover:bg-fate-500 text-white px-8 py-4 rounded-lg text-lg transition-colors"
          >
            开始八字分析
          </Link>
          <div className="mt-4">
            <Link
              href="/settings"
              className="text-fate-300 hover:text-fate-100 text-sm underline underline-offset-4"
            >
              ⚙ 设置
            </Link>
          </div>
        </div>
      </section>

      {/* Core Concepts */}
      <section className="py-16 px-4 bg-fate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">核心理念</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 font-serif">AI 智能，科学解析</h3>
              <p className="text-ink-600">
                融合现代 AI 技术与传统命理智慧，通过大数据分析和机器学习，提供客观的命理解读，让玄学不再玄
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 font-serif">文化传承，理性态度</h3>
              <p className="text-ink-600">
                以开放理性的态度传承东方智慧，去芜存菁，不迷信、不神化，让千年命理文化以更健康的方式融入现代生活
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3 font-serif">自主探索，独立思考</h3>
              <p className="text-ink-600">
                我们相信每个人都是自己命运的解读者。通过 AI 工具赋能，让每个人都能独立进行命理分析，自主思考人生方向
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 font-serif">分析系统</h2>
          <p className="text-center text-ink-500 mb-8">探索我们的智能解析服务</p>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-fate-100"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2 font-serif">{service.title}</h3>
                <p className="text-ink-600">{service.desc}</p>
                <span className="text-fate-600 mt-4 inline-block">进入分析 →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 text-fate-300 py-8 px-4 text-center">
        <p className="mb-2">LifeGPS · AI 分析个人特质，洞察发展潜力</p>
        <p className="text-sm text-fate-400">无需注册，免费体验，深度洞察</p>
      </footer>
    </main>
  )
}