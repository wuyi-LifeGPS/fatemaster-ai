'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

const DAILY_ZEN = [
  { text: '心若止水，万象皆空。', source: '禅宗' },
  { text: '本来无一物，何处惹尘埃。', source: '六祖坛经' },
  { text: '行到水穷处，坐看云起时。', source: '王维' },
  { text: '若无闲事挂心头，便是人间好时节。', source: '无门关' },
  { text: '一花一世界，一叶一菩提。', source: '华严经' },
  { text: '万法归一，一归何处。', source: '禅宗公案' },
  { text: '平常心是道。', source: '马祖道一' },
  { text: '放下屠刀，立地成佛。', source: '六祖坛经' },
  { text: '春有百花秋有月，夏有凉风冬有雪。', source: '无门关' },
  { text: '不识庐山真面目，只缘身在此山中。', source: '苏轼' },
]

const MEDITATION_CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'sleep', label: '助眠' },
  { key: 'focus', label: '专注' },
  { key: 'heal', label: '疗愈' },
  { key: 'energy', label: '能量' },
]

const MEDITATIONS = [
  {
    id: 'sleep-intro',
    title: '睡前放松',
    tag: '助眠',
    duration: 15,
    icon: '🌙',
    desc: '释放一天的疲惫，进入深度睡眠',
    plays: 12840,
  },
  {
    id: 'focus-breath',
    title: '呼吸专注',
    tag: '专注',
    duration: 10,
    icon: '🌬️',
    desc: '觉察呼吸，回归当下',
    plays: 8932,
  },
  {
    id: 'body-scan',
    title: '身体扫描',
    tag: '疗愈',
    duration: 20,
    icon: '✨',
    desc: '从头到脚，感受身体的每一个信号',
    plays: 6541,
  },
  {
    id: 'chakra',
    title: '七脉轮净化',
    tag: '能量',
    duration: 25,
    icon: '🌀',
    desc: '激活七轮能量，平衡身心',
    plays: 4320,
  },
  {
    id: 'higher-self',
    title: '与高我连接',
    tag: '疗愈',
    duration: 27,
    icon: '🔮',
    desc: '向内探索，连接内在智慧',
    plays: 3890,
  },
  {
    id: 'morning',
    title: '晨间唤醒',
    tag: '能量',
    duration: 8,
    icon: '☀️',
    desc: '开启充满活力的一天',
    plays: 7650,
  },
]

const SOUND_THERAPY = [
  {
    title: '432Hz 自然音疗',
    duration: 30,
    icon: '🎵',
    desc: '宇宙频率，深层放松',
  },
  {
    title: '颂钵疗愈',
    duration: 20,
    icon: '🥣',
    desc: '古老颂钵，振动身心',
  },
  {
    title: '雨声白噪音',
    duration: 60,
    icon: '🌧️',
    desc: '自然雨声，助眠专注',
  },
]

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export default function XiuPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [dailyZen] = useState(() => {
    const day = new Date().getDate()
    return DAILY_ZEN[day % DAILY_ZEN.length]
  })

  const [favorites, setFavorites] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'meditation' | 'sound'>('meditation')

  // 冥想播放器状态
const [playingId, setPlayingId] = useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const activeMeditation = MEDITATIONS.find(m => m.id === playingId)

  // 初始化音频上下文
  const initAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  // 播放颂钵声
  const playBowlSound = () => {
    initAudio()
    const ctx = audioRef.current!
    
    // 创建主增益节点
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.3
    masterGain.connect(ctx.destination)
    gainRef.current = masterGain

    // 创建多个振荡器模拟颂钵和声
    const frequencies = [180, 220, 280, 360]
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = i === 0 ? 'sine' : 'sine'
      osc.frequency.value = freq
      
      gain.gain.value = 0.15 / (i + 1)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3 + i * 0.5)
      
      osc.connect(gain)
      gain.connect(masterGain)
      
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 4 + i * 0.5)
    })
  }

  // 播放持续的冥想音
  const playMeditationTone = () => {
    initAudio()
    const ctx = audioRef.current!
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
    }

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    
    osc.type = 'sine'
    osc.frequency.value = 432 // 432Hz 宇宙频率
    
    gain.gain.value = 0.08
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    
    osc.start()
    
    oscillatorRef.current = osc
    gainRef.current = gain
  }

  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
      } catch {}
      oscillatorRef.current = null
    }
    if (gainRef.current) {
      gainRef.current = null
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('meditation_favorites')
    if (saved) setFavorites(JSON.parse(saved))
  }, [])

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(next)
    localStorage.setItem('meditation_favorites', JSON.stringify(next))
  }

  const startMeditation = (id: string, durationMinutes: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPlayingId(id)
    setRemainingSeconds(durationMinutes * 60)
    setIsPaused(false)
    // 播放开始提示音
    playBowlSound()
    // 延迟后播放持续音
    setTimeout(() => {
      if (audioRef.current) {
        playMeditationTone()
      }
    }, 3500)
  }

  const togglePause = () => {
    setIsPaused(prev => {
      if (!prev) {
        // 暂停
        stopAudio()
      } else {
        // 继续
        playMeditationTone()
      }
      return !prev
    })
  }

  const stopMeditation = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    stopAudio()
    setPlayingId(null)
    setRemainingSeconds(0)
    setIsPaused(false)
  }

  useEffect(() => {
    if (playingId && !isPaused && remainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // 冥想结束
            if (timerRef.current) clearInterval(timerRef.current)
            setPlayingId(null)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playingId, isPaused, remainingSeconds])

  const filtered = activeCategory === 'all'
    ? MEDITATIONS
    : MEDITATIONS.filter(m => m.tag === MEDITATION_CATEGORIES.find(c => c.key === activeCategory)?.label)

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in relative">
      <h1 className="text-gold-gradient text-xl font-bold mb-2">修</h1>
      <p className="text-moonly-secondary text-sm mb-4">正念冥想，回归内心</p>

      {/* 每日一禅 */}
      <div className="moonly-card p-4 mb-6 border border-[#c9a96e]/20">
        <div className="text-[10px] text-[#c9a96e] mb-2 tracking-wider">每日一禅</div>
        <div className="text-white text-base leading-relaxed mb-2">
          「{dailyZen.text}」
        </div>
        <div className="text-moonly-muted text-xs text-right">
          — {dailyZen.source}
        </div>
      </div>

      {/* 顶部 Tab */}
      <div className="flex gap-1 mb-6 bg-white/5 rounded-full p-1">
        <button
          onClick={() => setActiveTab('meditation')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'meditation'
              ? 'bg-[#c9a96e] text-moonly-bg font-semibold'
              : 'text-moonly-secondary hover:text-white'
          }`}
        >
          冥想
        </button>
        <button
          onClick={() => setActiveTab('sound')}
          className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
            activeTab === 'sound'
              ? 'bg-[#c9a96e] text-moonly-bg font-semibold'
              : 'text-moonly-secondary hover:text-white'
          }`}
        >
          声音
        </button>
      </div>

      {activeTab === 'meditation' ? (
        <>
          {/* 快速入口 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link href="/xiu/breath" className="moonly-card p-4 flex items-center gap-3 hover:bg-white/5 transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/10 flex items-center justify-center text-lg">
                🌬️
              </div>
              <div>
                <div className="text-white text-sm font-medium">呼吸练习</div>
                <div className="text-moonly-muted text-xs">调整呼吸节奏</div>
              </div>
            </Link>
            <Link href="/xiu/chakra" className="moonly-card p-4 flex items-center gap-3 hover:bg-white/5 transition">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center text-lg">
                💫
              </div>
              <div>
                <div className="text-white text-sm font-medium">脉轮清理</div>
                <div className="text-moonly-muted text-xs">七轮净化冥想</div>
              </div>
            </Link>
          </div>

          {/* 自定义计时器 */}
          <div className="moonly-card p-4 mb-6">
            <div className="text-white text-sm font-medium mb-3">⏱️ 自定义冥想</div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="120"
                placeholder="分钟"
                className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a96e]/30"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = parseInt((e.target as HTMLInputElement).value, 10)
                    if (val > 0) startMeditation('custom', val)
                  }
                }}
              />
              <span className="text-moonly-muted text-sm">分钟</span>
              <button
                onClick={() => {
                  const input = document.querySelector('input[type="number"]') as HTMLInputElement
                  const val = parseInt(input.value, 10)
                  if (val > 0) startMeditation('custom', val)
                }}
                className="btn-gold-outline px-4 py-2 text-sm"
              >
                开始
              </button>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6">
            {MEDITATION_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === cat.key
                    ? 'bg-[#c9a96e] text-moonly-bg font-semibold'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 冥想列表 */}
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="moonly-card p-3 flex items-center gap-3 group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#c9a96e]/10 to-[#6b5b95]/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">{item.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-moonly-muted flex-shrink-0">
                      {item.tag}
                    </span>
                  </div>
                  <div className="text-moonly-muted text-xs mt-0.5">{item.desc}</div>
                  <div className="text-moonly-muted text-xs mt-1">
                    {item.duration} 分钟 · {item.plays.toLocaleString()} 次播放
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                      favorites.includes(item.id)
                        ? 'bg-[#c9a96e]/20 text-[#c9a96e]'
                        : 'bg-white/5 text-moonly-muted hover:bg-white/10'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(item.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                  {playingId === item.id ? (
                    <button
                      onClick={togglePause}
                      className="w-10 h-10 rounded-full bg-[#c9a96e]/20 flex items-center justify-center hover:bg-[#c9a96e]/30 transition border border-[#c9a96e]/30"
                    >
                      {isPaused ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                          <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => startMeditation(item.id, item.duration)}
                      className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center hover:bg-[#c9a96e]/20 transition border border-[#c9a96e]/20"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* 音疗列表 */}
          <div className="space-y-3">
            {SOUND_THERAPY.map(item => (
              <div key={item.title} className="moonly-card p-3 flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{item.title}</div>
                  <div className="text-moonly-muted text-xs mt-0.5">{item.desc}</div>
                  <div className="text-moonly-muted text-xs mt-1">{item.duration} 分钟</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#c9a96e]/10 flex items-center justify-center hover:bg-[#c9a96e]/20 transition border border-[#c9a96e]/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 冥想播放浮层 */}
      {playingId && activeMeditation && (
        <div className="fixed inset-x-0 bottom-20 z-[70] px-4">
          <div className="p-4 rounded-2xl border border-[#c9a96e]/30 bg-[#1a1428]/95 backdrop-blur-md shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c9a96e]/20 to-[#6b5b95]/20 flex items-center justify-center text-2xl flex-shrink-0">
                {activeMeditation.icon}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium text-sm truncate">{activeMeditation.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#c9a96e]/15 text-[#c9a96e] flex-shrink-0">
                    {activeMeditation.tag}
                  </span>
                </div>
                <div className="text-[#c9a96e] text-base font-bold tabular-nums tracking-wider mt-0.5">
                  {formatTime(remainingSeconds)}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={togglePause}
                  className="w-10 h-10 rounded-full bg-[#c9a96e]/20 flex items-center justify-center hover:bg-[#c9a96e]/30 transition border border-[#c9a96e]/30"
                >
                  {isPaused ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gold">
                      <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={stopMeditation}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-red-500/20 transition border border-white/10"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                </button>
              </div>
            </div>
            {/* 进度条 */}
            <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#c9a96e] to-[#e0c896] rounded-full transition-all duration-500"
                style={{ width: `${((activeMeditation.duration * 60 - remainingSeconds) / (activeMeditation.duration * 60)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
