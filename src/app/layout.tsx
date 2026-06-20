import type { Metadata } from 'next'
import './globals.css'
import AIFloatingButton from '@/components/AIFloatingButton'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  title: 'LifeGPS · 人生导航',
  description: '融合现代AI技术与传统命理智慧，通过八字、紫微、塔罗等工具，为您提供客观的命理解读与人生指引',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        <div className="moonly-bg">
          <div className="relative z-10 max-w-md mx-auto min-h-screen pb-20">
            {children}
          </div>
          <AIFloatingButton />
          <BottomNav />
        </div>
      </body>
    </html>
  )
}
