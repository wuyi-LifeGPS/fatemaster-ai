'use client'

import { useMemo } from 'react'

function getLuckyNumbers(date: Date): number[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const numbers: number[] = []
  for (let i = 0; i < 6; i++) {
    numbers.push(((dayOfYear * 17 + i * 31) % 99) + 1)
  }
  return Array.from(new Set(numbers)).slice(0, 5).sort((a, b) => a - b)
}

function getUnluckyNumbers(date: Date): number[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const numbers: number[] = []
  for (let i = 0; i < 4; i++) {
    numbers.push(((dayOfYear * 23 + i * 47) % 99) + 1)
  }
  return Array.from(new Set(numbers)).slice(0, 3).sort((a, b) => a - b)
}

export default function LuckyNumbers() {
  const lucky = useMemo(() => getLuckyNumbers(new Date()), [])
  const unlucky = useMemo(() => getUnluckyNumbers(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🔢</span>
        <h3 className="text-gold text-sm font-semibold">今日数字</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</span>
            <span className="text-green-400 text-xs font-medium">幸运数字</span>
          </div>
          <div className="flex gap-2">
            {lucky.map((num) => (
              <div
                key={num}
                className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-sm"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✗</span>
            <span className="text-red-400 text-xs font-medium">忌讳数字</span>
          </div>
          <div className="flex gap-2">
            {unlucky.map((num) => (
              <div
                key={num}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-sm"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
