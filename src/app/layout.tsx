import type { Metadata } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'LifeGPS · 人生导航',
  description: '融合现代AI技术与传统命理智慧，通过八字、紫微、塔罗等工具，为您提供客观的命理解读与人生指引',
  manifest: '/manifest.json',
  themeColor: '#1e1c35',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LifeGPS',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
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
          <div className="moonly-content relative max-w-md mx-auto min-h-screen pb-20">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </div>
      </body>
    </html>
  )
}
