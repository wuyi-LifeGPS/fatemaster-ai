'use client'

import Link from 'next/link'

const FAQS = [
  {
    q: '如何添加八字档案？',
    a: '点击底部导航"命"→右上角"+"或点击"添加我的八字"按钮，输入姓名、出生年月日时即可。支持公历和农历切换。'
  },
  {
    q: 'AI命理师的回答可靠吗？',
    a: 'AI命理师基于传统命理学知识库，结合现代AI技术提供解读。内容仅供参考娱乐，不作为人生决策依据。'
  },
  {
    q: '如何查看大运流年？',
    a: '在命盘页面点击"大运"标签，即可查看当前大运及未来运势走势。点击具体大运可查看详细分析。'
  },
  {
    q: '可以保存多个八字档案吗？',
    a: '可以。点击命盘页面右上角档案名称，在下拉列表中选择"增加八字"即可添加新档案。最多支持20个档案。'
  },
  {
    q: '什么是喜用神？',
    a: '喜用神是八字命理中对命主最有利的五行元素。了解喜用神可以帮助你在生活中做出更有利的选择。'
  },
]

export default function HelpPage() {
  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-moonly-secondary">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">帮助与反馈</h1>
      </div>

      {/* 常见问题 */}
      <div className="space-y-3 mb-8">
        <h2 className="text-gold text-sm font-semibold mb-3">常见问题</h2>
        {FAQS.map((faq, i) => (
          <div key={i} className="moonly-card p-4">
            <h3 className="text-white text-sm font-medium mb-2">{faq.q}</h3>
            <p className="text-moonly-secondary text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* 快捷键 */}
      <div className="moonly-card p-4 mb-6">
        <h2 className="text-gold text-sm font-semibold mb-3">快捷键</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">全局搜索</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">Ctrl + K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">关闭弹窗</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">ESC</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-secondary text-sm">发送消息</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">Enter</span>
          </div>
        </div>
      </div>

      {/* 反馈 */}
      <div className="moonly-card p-4">
        <h2 className="text-gold text-sm font-semibold mb-3">意见反馈</h2>
        <p className="text-moonly-secondary text-sm mb-4">
          遇到问题或有建议？欢迎通过以下方式反馈：
        </p>
        <div className="space-y-2">
          <a
            href="mailto:feedback@lifegps.top"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            <span className="text-lg">📧</span>
            <span className="text-white text-sm">feedback@lifegps.top</span>
          </a>
        </div>
      </div>
    </div>
  )
}
