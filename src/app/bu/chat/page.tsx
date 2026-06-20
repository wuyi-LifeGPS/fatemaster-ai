'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SUGGESTIONS = [
  '我该如何提升事业运？',
  '今年感情运势如何？',
  '适合在什么方向发展？',
  '与健康有关的需要注意什么？',
]

export default function BuChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '你好，我是你的AI命理师。关于命盘、运势、合婚、事业等任何问题，都可以向我提问。' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `你是一位专业的AI命理师，精通八字、紫微斗数、风水等传统命理学。用户问：${userText}\n请用专业但易懂的语言回答，控制在300字以内。`,
        }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'ai', text: data.result || '思考中...' }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: '抱歉，服务暂时不可用，请稍后重试。' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] animate-fade-in">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-text-secondary">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-moonly-gold/20">
            <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} className="object-cover" />
          </div>
          <div>
            <div className="text-white font-medium text-sm">AI 命理师</div>
            <div className="text-moonly-text-muted text-xs">内容由 AI 生成</div>
          </div>
        </div>
        <div className="text-moonly-gold text-xs">0 次</div>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-moonly-purple' : 'border border-moonly-gold/20'}`}>
              {msg.role === 'ai' ? (
                <Image src="/images/ai-avatar.png" alt="AI" width={32} height={32} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">我</div>
              )}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-moonly-purple text-white'
                : 'bg-white/5 text-white border border-white/8'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full border border-moonly-gold/20 flex-shrink-0">
              <Image src="/images/ai-avatar.png" alt="AI" width={32} height={32} className="object-cover" />
            </div>
            <div className="bg-white/5 border border-white/8 rounded-2xl px-4 py-2.5">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-moonly-gold animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-moonly-gold animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-moonly-gold animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 建议问题 */}
      {messages.length < 3 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-moonly-text-secondary hover:bg-white/10 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* 输入区 */}
      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="请输入您的问题..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-moonly-text-muted focus:outline-none focus:border-moonly-gold/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-full bg-moonly-gold flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1428" strokeWidth="2.5">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
