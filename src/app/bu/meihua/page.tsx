'use client'

import { useState } from 'react'
import Link from 'next/link'

const MEIHUA_METHODS = [
  { name: '数字起卦', desc: '心想一事，报两个数字', icon: '🔢' },
  { name: '时间起卦', desc: '以当前时间起卦', icon: '⏰' },
  { name: '声音起卦', desc: '闻声起卦，捕捉灵感', icon: '👂' },
  { name: '方位起卦', desc: '以所见方位起卦', icon: '🧭' },
]

const GUA_NAMES: Record<string, string> = {
  '111': '乾', '011': '兑', '101': '离', '001': '震',
  '110': '巽', '010': '坎', '100': '艮', '000': '坤',
}

const GUA_IMAGES: Record<string, string> = {
  '乾': '☰', '兑': '☱', '离': '☲', '震': '☳',
  '巽': '☴', '坎': '☵', '艮': '☶', '坤': '☷',
}

const GUA_MEANINGS: Record<string, { nature: string; desc: string; advice: string }> = {
  '乾': { nature: '天', desc: '刚健有力，自强不息', advice: '保持积极向上的态度，主动把握机会。' },
  '兑': { nature: '泽', desc: '悦乐和畅，以和为贵', advice: '用愉悦的心情面对问题，沟通为上。' },
  '离': { nature: '火', desc: '光明美丽，依附文明', advice: '保持内心的光明，依附正道而行。' },
  '震': { nature: '雷', desc: '震动惊起，奋发有为', advice: '面对变化保持镇定，顺势而动。' },
  '巽': { nature: '风', desc: '柔顺入里，循序渐进', advice: '以柔克刚，循序渐进达成目标。' },
  '坎': { nature: '水', desc: '险陷重重，行险用险', advice: '谨慎行事，以智慧和诚信度过难关。' },
  '艮': { nature: '山', desc: '静止笃实，知止有定', advice: '适时停止，积蓄力量，等待时机。' },
  '坤': { nature: '地', desc: '厚德载物，柔顺包容', advice: '以宽厚包容的态度待人处事。' },
}

function getGuaFromNum(num: number): string {
  const n = ((num - 1) % 8 + 8) % 8
  const binary = n.toString(2).padStart(3, '0')
  return GUA_NAMES[binary] || '乾'
}

function generateGua(method: string, input?: string): { shang: string; xia: string; dong: number; full: string } {
  let shangNum: number, xiaNum: number, dongNum: number

  if (method === '数字起卦' && input) {
    const nums = input.split(/[,，\s]+/).map(Number).filter(n => !isNaN(n))
    if (nums.length >= 2) {
      shangNum = nums[0]
      xiaNum = nums[1]
      dongNum = nums.length >= 3 ? nums[2] : shangNum + xiaNum
    } else {
      shangNum = Math.floor(Math.random() * 100) + 1
      xiaNum = Math.floor(Math.random() * 100) + 1
      dongNum = shangNum + xiaNum
    }
  } else if (method === '时间起卦') {
    const now = new Date()
    shangNum = now.getHours() + 1
    xiaNum = now.getMinutes() + 1
    dongNum = now.getSeconds() + 1
  } else {
    shangNum = Math.floor(Math.random() * 100) + 1
    xiaNum = Math.floor(Math.random() * 100) + 1
    dongNum = shangNum + xiaNum
  }

  const shang = getGuaFromNum(shangNum)
  const xia = getGuaFromNum(xiaNum)
  const dong = ((dongNum - 1) % 6 + 6) % 6 + 1

  const shangBinary = Object.entries(GUA_NAMES).find(([_, v]) => v === shang)?.[0] || '111'
  const xiaBinary = Object.entries(GUA_NAMES).find(([_, v]) => v === xia)?.[0] || '000'
  const full = shangBinary + xiaBinary

  return { shang, xia, dong, full }
}

export default function MeiHuaPage() {
  const [method, setMethod] = useState('')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<ReturnType<typeof generateGua> | null>(null)

  const castGua = () => {
    const gua = generateGua(method, input)
    setResult(gua)
  }

  const shangData = result ? GUA_MEANINGS[result.shang] : null
  const xiaData = result ? GUA_MEANINGS[result.xia] : null

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">梅花易数</h1>
          <p className="text-moonly-text-muted text-xs">象数起卦，随心而动</p>
        </div>
      </div>

      {!result ? (
        <>
          {/* 起卦方式选择 */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {MEIHUA_METHODS.map(m => (
              <button
                key={m.name}
                onClick={() => { setMethod(m.name); setInput('') }}
                className={`moonly-card p-4 text-center transition ${
                  method === m.name
                    ? 'border-moonly-gold/50 bg-moonly-gold/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{m.icon}</div>
                <div className="text-white font-medium text-sm">{m.name}</div>
                <div className="text-moonly-text-muted text-xs mt-1">{m.desc}</div>
              </button>
            ))}
          </div>

          {method === '数字起卦' && (
            <div className="moonly-card p-4 mb-6">
              <label className="text-white text-sm font-medium mb-2 block">输入两个数字（用逗号分隔）</label>
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="例如：36, 78"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-moonly-gold/30 mb-3"
              />
              <p className="text-moonly-text-muted text-xs">也可以输入三个数字，第三个为动爻</p>
            </div>
          )}

          {method && (
            <button
              onClick={castGua}
              className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition"
            >
              起卦
            </button>
          )}

          {!method && (
            <div className="moonly-card p-6 text-center">
              <div className="text-4xl mb-3">🌸</div>
              <div className="text-white font-medium mb-2">选择起卦方式</div>
              <div className="text-moonly-text-muted text-sm">梅花易数强调\"心诚则灵\"，起卦前请先静心凝神</div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-4">
          {/* 卦象结果 */}
          <div className="moonly-card p-6 text-center">
            <div className="text-moonly-text-muted text-xs mb-4">起卦方式：{method}</div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="text-center">
                <div className="text-4xl mb-1">{GUA_IMAGES[result.shang]}</div>
                <div className="text-moonly-gold font-bold">{result.shang}卦</div>
                <div className="text-moonly-text-muted text-xs">上卦</div>
              </div>
              <div className="text-moonly-gold text-2xl">×</div>
              <div className="text-center">
                <div className="text-4xl mb-1">{GUA_IMAGES[result.xia]}</div>
                <div className="text-moonly-gold font-bold">{result.xia}卦</div>
                <div className="text-moonly-text-muted text-xs">下卦</div>
              </div>
            </div>
            <div className="text-white text-lg font-bold mb-1">
              {result.shang}上{xiaData?.nature}下 → {result.xia}下{shangData?.nature}上
            </div>
            <div className="text-moonly-gold text-sm">动爻：第 {result.dong} 爻</div>
          </div>

          {/* 上卦解读 */}
          {shangData && (
            <div className="moonly-card p-4">
              <h3 className="text-gold text-sm font-semibold mb-2">☰ 上卦 · {result.shang}（{shangData.nature}）</h3>
              <p className="text-moonly-text-secondary text-sm">{shangData.desc}</p>
            </div>
          )}

          {/* 下卦解读 */}
          {xiaData && (
            <div className="moonly-card p-4">
              <h3 className="text-gold text-sm font-semibold mb-2">☷ 下卦 · {result.xia}（{xiaData.nature}）</h3>
              <p className="text-moonly-text-secondary text-sm">{xiaData.desc}</p>
            </div>
          )}

          {/* 综合建议 */}
          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">💡 综合指引</h3>
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              上卦{result.shang}为体，{shangData?.desc}；下卦{result.xia}为用，{xiaData?.desc}。
              动爻在第{result.dong}位，提示事情正在发生变化。
              {shangData?.advice}
            </p>
          </div>

          <button
            onClick={() => { setResult(null); setMethod(''); setInput('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新起卦
          </button>
        </div>
      )}
    </div>
  )
}
