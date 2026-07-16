'use client'

import { useState, useRef, useEffect } from 'react'
import { showToast } from '@/components/Toast'
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

const CHAT_STORAGE_KEY = 'lifegps_chat_history'
const WELCOME_MESSAGE = { role: 'ai' as const, text: '关于你的本命星图，还有什么是你想知道的？\n我会为你尽心解答。', time: '' }

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
  time: string
}

function formatTime(date = new Date()): string {
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return [{ ...WELCOME_MESSAGE, time: formatTime() }]
  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // ignore
  }
  return [{ ...WELCOME_MESSAGE, time: formatTime() }]
}

function saveChatHistory(messages: ChatMessage[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  } catch {
    // ignore
  }
}

export default function BuChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadChatHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    saveChatHistory(messages)
  }, [messages])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  // 清理打字机定时器
  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current)
    }
  }, [])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    // 停止当前打字机
    if (typingRef.current) {
      clearInterval(typingRef.current)
      typingRef.current = null
    }
    const userText = input.trim()
    const now = formatTime()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText, time: now }])
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
      const fullText = data.result || '思考中...'
      const aiTime = formatTime()
      
      // 先添加空消息
      setMessages(prev => [...prev, { role: 'ai', text: '', time: aiTime }])
      setLoading(false)
      
      // 打字机效果
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (!last || last.role !== 'ai') return prev
          return [...prev.slice(0, -1), { ...last, text: fullText.slice(0, i) }]
        })
        if (i >= fullText.length) {
          if (typingRef.current) clearInterval(typingRef.current)
          typingRef.current = null
        }
      }, 25)
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: '抱歉，服务暂时不可用，请稍后重试。', time: formatTime() }])
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
            onClick={() => setMessages([{ role: 'ai', text: '关于你的本命星图，还有什么是你想知道的？\n我会为你尽心解答。', time: formatTime() }])}
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
            <div className="flex flex-col gap-1">
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#6b5b95]/40 to-[#6b5b95]/20 text-white border border-white/10'
                    : 'bg-white/5 text-white/90 border border-white/10'
                }`}
              >
                {msg.text}
              </div>
              <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.time && <span className="text-[10px] text-moonly-muted">{msg.time}</span>}
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(msg.text).then(() => showToast('已复制', 'success'))
                  }}
                  className="text-[10px] text-moonly-muted hover:text-white/60 px-1 py-0.5 rounded transition-colors flex items-center gap-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  复制
                </button>
              </div>
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

      {/* 操作栏 */}
      {messages.length > 1 && (
        <div className="px-4 py-2 flex justify-end">
          <button
            onClick={() => {
              if (window.confirm('确定要清空所有对话记录吗？')) {
                setMessages([WELCOME_MESSAGE])
                showToast('对话已清空', 'success')
              }
            }}
            className="text-xs text-moonly-muted hover:text-white/60 transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
            清空对话
          </button>
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
