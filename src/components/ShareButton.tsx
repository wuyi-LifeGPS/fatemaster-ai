'use client'

import { useState, useCallback } from 'react'
import { showToast } from './Toast'
import { hapticLight } from '@/lib/haptic'

interface ShareButtonProps {
  title?: string
  text?: string
  url?: string
  children?: React.ReactNode
  className?: string
}

export default function ShareButton({
  title = 'LifeGPS · 人生导航',
  text = '来看看我的八字命盘分析',
  url,
  children,
  className = '',
}: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const hasNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  const handleShare = useCallback(async (type: string) => {
    hapticLight()
    setShowMenu(false)

    if (type === 'native' && hasNativeShare) {
      try {
        await (navigator as any).share({ title, text, url: shareUrl })
        showToast('分享成功', 'success')
      } catch {
        // 用户取消，不提示
      }
      return
    }

    if (type === 'native' && !hasNativeShare) {
      showToast('您的设备不支持原生分享', 'error')
      return
    }

    if (type === 'copy') {
      try {
        await navigator.clipboard.writeText(`${text}\n${shareUrl}`)
        showToast('链接已复制到剪贴板', 'success')
      } catch {
        const textarea = document.createElement('textarea')
        textarea.value = `${text}\n${shareUrl}`
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        showToast('链接已复制到剪贴板', 'success')
      }
      return
    }

    if (type === 'wechat') {
      showToast('请截图或复制链接，在微信中分享', 'info')
    }
  }, [title, text, shareUrl, hasNativeShare])

  return (
    <div className="relative">
      <button
        onClick={() => {
          hapticLight()
          setShowMenu(!showMenu)
        }}
        className={className || 'w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition'}
      >
        {children || (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        )}
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-2 w-44 bg-[#1a1428] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[160] animate-fade-in-scale">
            {hasNativeShare && (
              <button
                onClick={() => handleShare('native')}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition text-left"
              >
                <span className="text-lg">📤</span>
                <span>系统分享</span>
              </button>
            )}
            <button
              onClick={() => handleShare('copy')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition text-left"
            >
              <span className="text-lg">🔗</span>
              <span>复制链接</span>
            </button>
            <button
              onClick={() => handleShare('wechat')}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5 transition text-left"
            >
              <span className="text-lg">💬</span>
              <span>微信分享</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
