'use client'

import { useState } from 'react'
import { showToast } from './Toast'
import { hapticLight, hapticMedium } from '@/lib/haptic'

export default function DataBackup() {
  const [showModal, setShowModal] = useState(false)

  const handleExport = () => {
    hapticLight()
    try {
      const data: Record<string, string | null> = {}
      const keys = [
        'lifegps_profiles',
        'lifegps_history',
        'lifegps_recent_visits',
        'lifegps_usage_stats',
        'meditation_total_minutes',
        'book_reading_progress',
      ]
      keys.forEach(key => {
        data[key] = localStorage.getItem(key)
      })

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lifegps-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('数据已导出', 'success')
    } catch {
      showToast('导出失败', 'error')
    }
  }

  const handleImport = (file: File) => {
    hapticMedium()
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        Object.entries(data).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            localStorage.setItem(key, value as string)
          }
        })
        showToast('数据恢复成功，请刷新页面', 'success')
      } catch {
        showToast('文件格式错误', 'error')
      }
    }
    reader.readAsText(file)
  }

  return (
    <>
      <button
        onClick={() => {
          hapticLight()
          setShowModal(true)
        }}
        className="flex items-center gap-3 px-4 py-3 moonly-card hover:bg-white/5 transition w-full text-left"
      >
        <span className="text-lg">💾</span>
        <span className="flex-1 text-white text-sm">数据备份</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-muted">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#1a1428] border border-white/10 rounded-2xl w-full max-w-sm p-5 animate-fade-in-scale">
            <h3 className="text-gold text-base font-semibold mb-4">数据备份</h3>

            <div className="space-y-3">
              <button
                onClick={handleExport}
                className="w-full btn-gold py-2.5 text-sm"
              >
                📤 导出数据
              </button>

              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={e => e.target.files?.[0] && handleImport(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <button className="w-full btn-gold-outline py-2.5 text-sm">
                  📥 导入数据
                </button>
              </div>
            </div>

            <p className="text-moonly-muted text-xs mt-4 leading-relaxed">
              导出的文件包含您的八字档案、查询历史等所有本地数据。
              请妥善保管，不要分享给他人。
            </p>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-3 py-2 text-moonly-muted text-sm hover:text-white transition"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </>
  )
}
