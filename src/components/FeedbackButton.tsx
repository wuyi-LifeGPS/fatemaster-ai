'use client'

import { useState } from 'react'
import { showToast } from './Toast'
import { hapticLight } from '@/lib/haptic'

export default function FeedbackButton() {
  const [showForm, setShowForm] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [type, setType] = useState<'suggest' | 'bug' | 'other'>('suggest')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      showToast('请输入反馈内容', 'error')
      return
    }

    hapticLight()
    setSubmitting(true)

    // 保存到 localStorage（实际项目中可以发送到服务器）
    const feedbacks = JSON.parse(localStorage.getItem('lifegps_feedbacks') || '[]')
    feedbacks.push({
      id: Date.now().toString(),
      type,
      content: feedback,
      time: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    })
    localStorage.setItem('lifegps_feedbacks', JSON.stringify(feedbacks))

    // 模拟提交延迟
    await new Promise(r => setTimeout(r, 500))

    setSubmitting(false)
    setFeedback('')
    setShowForm(false)
    showToast('感谢您的反馈，我们会认真处理', 'success')
  }

  if (!showForm) {
    return (
      <button
        onClick={() => {
          hapticLight()
          setShowForm(true)
        }}
        className="fixed bottom-24 right-4 z-[70] w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition backdrop-blur-sm"
        title="反馈建议"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[180] flex items-end justify-center px-4 pb-8">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
      <div className="relative bg-[#1a1428] border border-white/10 rounded-3xl w-full max-w-sm p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-base">意见反馈</h3>
          <button
            onClick={() => setShowForm(false)}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 类型选择 */}
        <div className="flex gap-2 mb-4">
          {([
            { key: 'suggest' as const, label: '功能建议' },
            { key: 'bug' as const, label: '问题反馈' },
            { key: 'other' as const, label: '其他' },
          ]).map((item) => (
            <button
              key={item.key}
              onClick={() => setType(item.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                type === item.key
                  ? 'bg-gold text-[#1a1428]'
                  : 'bg-white/5 text-moonly-secondary hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="请描述您的建议或遇到的问题..."
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-muted resize-none focus:outline-none focus:border-gold/30 mb-4"
        />

        {/* 提交按钮 */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-gold text-[#1a1428] text-sm font-semibold hover:bg-gold/90 transition disabled:opacity-50"
        >
          {submitting ? '提交中...' : '提交反馈'}
        </button>
      </div>
    </div>
  )
}
