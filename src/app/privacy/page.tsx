'use client'

import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-moonly-secondary">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">隐私政策</h1>
      </div>

      <div className="space-y-4">
        <div className="moonly-card p-4">
          <h2 className="text-gold text-sm font-semibold mb-2">1. 信息收集</h2>
          <p className="text-moonly-secondary text-sm leading-relaxed">
            我们收集的信息包括：出生日期时间（用于八字计算）、用户输入的问题（用于AI对话）。
            所有数据仅存储在您的本地设备中，不会上传至我们的服务器。
          </p>
        </div>

        <div className="moonly-card p-4">
          <h2 className="text-gold text-sm font-semibold mb-2">2. 数据存储</h2>
          <p className="text-moonly-secondary text-sm leading-relaxed">
            您的所有数据（包括八字档案、查询历史、聊天记录）均存储在浏览器本地存储（localStorage）中。
            我们不会将您的个人数据传输到任何第三方服务器。AI对话通过端到端加密的方式与Kimi API通信。
          </p>
        </div>

        <div className="moonly-card p-4">
          <h2 className="text-gold text-sm font-semibold mb-2">3. 数据安全</h2>
          <p className="text-moonly-secondary text-sm leading-relaxed">
            我们采用行业标准的安全措施保护您的数据。但由于数据存储在本地，建议您定期备份重要数据。
            清除浏览器缓存或卸载应用将导致数据丢失。
          </p>
        </div>

        <div className="moonly-card p-4">
          <h2 className="text-gold text-sm font-semibold mb-2">4. 数据删除</h2>
          <p className="text-moonly-secondary text-sm leading-relaxed">
            您随时可以删除您的数据。在设置页面中可以清除所有本地数据，或单独删除八字档案和查询历史。
          </p>
        </div>

        <div className="moonly-card p-4">
          <h2 className="text-gold text-sm font-semibold mb-2">5. 联系我们</h2>
          <p className="text-moonly-secondary text-sm leading-relaxed">
            如有任何隐私相关问题，请联系：feedback@lifegps.top
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <span className="text-moonly-muted text-xs">最后更新：2025年7月</span>
      </div>
    </div>
  )
}
