'use client'

import { useState, useEffect, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

interface BreathingGuideProps {
  onComplete?: () => void
}

const BREATHING_PATTERNS = [
  {
    name: '平衡呼吸',
    emoji: '🌊',
    desc: '吸气4秒 - 屏息4秒 - 呼气4秒',
    sequence: [
      { phase: '吸气', duration: 4000, color: '#60a5fa' },
      { phase: '屏息', duration: 4000, color: '#fbbf24' },
      { phase: '呼气', duration: 4000, color: '#4ade80' },
    ],
  },
  {
    name: '放松呼吸',
    emoji: '🌸',
    desc: '吸气4秒 - 呼气6秒',
    sequence: [
      { phase: '吸气', duration: 4000, color: '#60a5fa' },
      { phase: '呼气', duration: 6000, color: '#4ade80' },
    ],
  },
  {
    name: '4-7-8 呼吸',
    emoji: '🌙',
    desc: '吸气4秒 - 屏息7秒 - 呼气8秒',
    sequence: [
      { phase: '吸气', duration: 4000, color: '#60a5fa' },
      { phase: '屏息', duration: 7000, color: '#fbbf24' },
      { phase: '呼气', duration: 8000, color: '#4ade80' },
    ],
  },
]

export default function BreathingGuide({ onComplete }: BreathingGuideProps) {
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [progress, setProgress] = useState(0)
  const [cycles, setCycles] = useState(0)

  const pattern = BREATHING_PATTERNS[selectedPattern]

  useEffect(() => {
    if (!isRunning) return

    let startTime = Date.now()
    const currentSeq = pattern.sequence[currentPhase]
    const duration = currentSeq.duration

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)

      if (elapsed >= duration) {
        if (currentPhase < pattern.sequence.length - 1) {
          setCurrentPhase(currentPhase + 1)
        } else {
          setCurrentPhase(0)
          setCycles((c) => c + 1)
        }
        startTime = Date.now()
      }
    }, 50)

    return () => clearInterval(interval)
  }, [isRunning, currentPhase, pattern])

  const handleStart = useCallback(() => {
    hapticLight()
    setIsRunning(true)
    setCurrentPhase(0)
    setProgress(0)
    setCycles(0)
    showToast('开始呼吸练习', 'info')
  }, [])

  const handleStop = useCallback(() => {
    hapticLight()
    setIsRunning(false)
    setCurrentPhase(0)
    setProgress(0)
    if (cycles > 0) {
      showToast(`完成 ${cycles} 轮呼吸练习`, 'success')
      onComplete?.()
    }
  }, [cycles, onComplete])

  const currentSeq = pattern.sequence[currentPhase]

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌬️</span>
          <h3 className="text-gold text-sm font-semibold">呼吸引导</h3>
        </div>
        {isRunning && (
          <span className="text-[10px] text-moonly-muted">
            已完成 {cycles} 轮
          </span>
        )}
      </div>

      {!isRunning ? (
        <div>
          <div className="space-y-2 mb-3">
            {BREATHING_PATTERNS.map((p, i) => (
              <button
                key={i}
                onClick={() => { hapticLight(); setSelectedPattern(i) }}
                className={`w-full p-3 rounded-xl text-left transition ${
                  selectedPattern === i
                    ? 'bg-white/10 border border-gold/30'
                    : 'bg-white/5 hover:bg-white/8'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-moonly-muted text-xs">{p.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleStart}
            className="w-full py-2.5 rounded-xl btn-gold text-sm"
          >
            开始练习
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div
            className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-1000"
            style={{
              background: `${currentSeq.color}20`,
              boxShadow: `0 0 40px ${currentSeq.color}30`,
              transform: currentSeq.phase === '吸气' ? 'scale(1.2)' : currentSeq.phase === '呼气' ? 'scale(0.8)' : 'scale(1)',
            }}
          >
            <span className="text-4xl">
              {currentSeq.phase === '吸气' ? '🌊' : currentSeq.phase === '屏息' ? '✨' : '🌸'}
            </span>
          </div>

          <p className="text-white text-lg font-semibold mb-1">{currentSeq.phase}</p>
          <p className="text-moonly-muted text-sm mb-3">
            {Math.ceil((currentSeq.duration * (1 - progress / 100)) / 1000)} 秒
          </p>

          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width: `${progress}%`,
                backgroundColor: currentSeq.color,
              }}
            />
          </div>

          <button
            onClick={handleStop}
            className="px-6 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition"
          >
            结束练习
          </button>
        </div>
      )}
    </div>
  )
}
