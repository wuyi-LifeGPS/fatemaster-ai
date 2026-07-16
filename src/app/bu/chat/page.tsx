'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const SUGGESTIONS = [
  '我该如何提升我的事业运？',
  '我的事业何时能迎来转机？',
  '我的理想工作何时能到来？',
  '近期有什么需要注意的？',
]

// Loading spinner
function Spinner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default function BuChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: '关于你的本命星图，还有什么是你想知道的？\n我会为你尽心解答。' },
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
    <div className="flex flex-col h-screen moonly-bg moonly-content">
      {/* 顶部导航 - moonly深色 */}
      <div className="px-4 py-3 bg-moonly-bg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-moonly-secondary">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <div className="text-white font-medium text-sm">AI 命理师</div>
            <div className="text-moonly-muted text-[11px]">内容由AI生成</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-moonly-muted text-xs">{messages.filter(m => m.role === 'user').length} 次</span>
          <button
            onClick={() => setMessages([{ role: 'ai', text: '关于你的本命星图，还有什么是你想知道的？\n我会为你尽心解答。' }])}
            className="w-6 h-6 rounded-full bg-[#c9a96e]/20 flex items-center justify-center text-gold text-xs font-bold hover:bg-[#c9a96e]/30 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* 消息列表 */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
            <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden border border-white/10">
              {msg.role === 'ai' ? (
                <Image src="/images/ai-avatar-new.png" alt="AI" width={36} height={36} className="object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#6b5b95] to-moonly-bg flex items-center justify-center text-white text-xs font-bold">我</div>
              )}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-[#6b5b95]/40 to-[#6b5b95]/20 text-white border border-white/10'
                : 'bg-white/5 text-white/90 border border-white/10'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
              <Image src="/images/ai-avatar-new.png" alt="AI" width={36} height={36} className="object-cover" />
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
              <Spinner className="text-[#c9a96e]" />
            </div>
          </div>
        )}
      </div>

      {/* 快捷问题 */}
      {messages.length < 3 && (
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-moonly-secondary hover:bg-white/10 hover:text-white transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* 底部输入区 */}
      <div className="px-4 py-3 bg-moonly-bg/80 backdrop-blur-xl border-t border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6b5b95] to-moonly-bg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 border border-white/10">
            我
          </div>
          <div className="flex-1 flex items-center gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="请输入您的问题..."
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-moonly-muted focus:outline-none focus:border-[#c9a96e]/30"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c9a96e] to-[#a08050] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
