'use client'

import { useState } from 'react'
import { hapticMedium } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

const QUIZZES = [
  {
    question: '你更喜欢哪种天气？',
    options: [
      { text: '☀️ 阳光明媚', score: 3 },
      { text: '🌧️ 细雨绵绵', score: 2 },
      { text: '❄️ 雪花飘飘', score: 1 },
      { text: '🌈 雨后彩虹', score: 4 },
    ],
  },
  {
    question: '遇到困难时，你的第一反应是？',
    options: [
      { text: '💪 迎难而上', score: 4 },
      { text: '🤔 冷静分析', score: 3 },
      { text: '🙋 寻求帮助', score: 2 },
      { text: '🍃 顺其自然', score: 1 },
    ],
  },
  {
    question: '你更在意哪种财富？',
    options: [
      { text: '💰 物质财富', score: 3 },
      { text: '📚 知识财富', score: 4 },
      { text: '❤️ 人脉财富', score: 2 },
      { text: '😊 快乐财富', score: 1 },
    ],
  },
]

const RESULTS = [
  { min: 3, max: 5, title: '🌊 水型人格', desc: '你像水一样柔韧，善于适应环境，有着极强的包容心和直觉力。' },
  { min: 6, max: 8, title: '🔥 火型人格', desc: '你像火一样热情，充满活力和创造力，总能给周围带来温暖。' },
  { min: 9, max: 11, title: '⛰️ 土型人格', desc: '你像大地一样稳重可靠，做事踏实，是朋友们信赖的依靠。' },
]

export default function FortuneQuiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const handleAnswer = (optionScore: number) => {
    hapticMedium()
    const newScore = score + optionScore
    setScore(newScore)

    if (currentQ < QUIZZES.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setFinished(true)
      showToast('测试完成！', 'success')
    }
  }

  const reset = () => {
    setStarted(false)
    setCurrentQ(0)
    setScore(0)
    setFinished(false)
  }

  const result = RESULTS.find(r => score >= r.min && score <= r.max) || RESULTS[0]

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🎯</span>
        <h3 className="text-gold text-sm font-semibold">命理小测试</h3>
      </div>

      {!started ? (
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-gold/10 mx-auto mb-3 flex items-center justify-center text-3xl">
            🧩
          </div>
          <p className="text-white/80 text-sm mb-4">3道题，测出你的五行人格</p>
          <button
            onClick={() => { hapticMedium(); setStarted(true); }}
            className="px-6 py-2 rounded-full bg-gold/20 text-gold text-sm font-medium hover:bg-gold/30 transition-colors"
          >
            开始测试
          </button>
        </div>
      ) : finished ? (
        <div className="text-center py-4 animate-fade-in">
          <p className="text-gold font-bold text-xl mb-2">{result.title}</p>
          <p className="text-white/80 text-sm leading-relaxed mb-4">{result.desc}</p>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-full bg-white/5 text-xs text-white/60 hover:bg-white/10 transition-colors"
          >
            再测一次
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-moonly-muted">问题 {currentQ + 1}/{QUIZZES.length}</span>
            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gold rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / QUIZZES.length) * 100}%` }}
              />
            </div>
          </div>

          <p className="text-white text-sm font-medium mb-3">{QUIZZES[currentQ].question}</p>

          <div className="space-y-2">
            {QUIZZES[currentQ].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt.score)}
                className="w-full text-left px-3 py-2.5 rounded-lg bg-white/5 text-sm text-white/80 hover:bg-white/10 transition-colors"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
