import type { Metadata } from 'next'
import './globals.css'
import ToastContainer from '@/components/Toast'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'LifeGPS · 人生导航',
  description: '融合现代AI技术与传统命理智慧，通过八字、紫微、塔罗等工具，为您提供客观的命理解读与人生指引',
  keywords: ['八字', '命理', '紫微斗数', '塔罗', '运势', 'AI算命', '人生导航', 'LifeGPS'],
  authors: [{ name: 'LifeGPS' }],
  creator: 'LifeGPS',
  robots: 'index, follow',
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
  openGraph: {
    title: 'LifeGPS · 人生导航',
    description: '融合现代AI技术与传统命理智慧，为您提供客观的命理解读与人生指引',
    type: 'website',
    locale: 'zh_CN',
    siteName: 'LifeGPS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LifeGPS · 人生导航',
    description: '融合现代AI技术与传统命理智慧，为您提供客观的命理解读与人生指引',
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
        <ToastContainer />
        <div className="moonly-bg">
          <div className="moonly-content relative max-w-md mx-auto min-h-screen pb-20">
            <ClientLayout>{children}</ClientLayout>
          </div>
        </div>
      </body>
    </html>
  )
}
