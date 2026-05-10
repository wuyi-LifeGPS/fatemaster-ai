import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LifeGPS - 人生导航 · AI 命理分析系统',
  description: '融合现代AI技术与传统命理智慧，通过八字、紫微斗数、塔罗等工具，为您提供客观的命理解读与人生指引',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-fate-50 text-ink-900">
        {children}
      </body>
    </html>
  )
}
