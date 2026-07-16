'use client'

import { useState } from 'react'
import Link from 'next/link'

// Loading spinner component
function Spinner() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

const HEXAGRAM_NAMES: Record<string, string> = {
  '777777': '乾为天', '777778': '天风姤', '777787': '天山遁', '777788': '天地否',
  '777877': '风地观', '777878': '山地剥', '777887': '火地晋', '777888': '火天大有',
  '778777': '坎为水', '778778': '水泽节', '778787': '水雷屯', '778788': '水火既济',
  '778877': '泽火革', '778878': '雷火丰', '778887': '地火明夷', '778888': '地水师',
  '787777': '艮为山', '787778': '山火贲', '787787': '山天大畜', '787788': '山泽损',
  '787877': '火泽睽', '787878': '天泽履', '787887': '风泽中孚', '787888': '风山渐',
  '788777': '震为雷', '788778': '雷地豫', '788787': '雷水解', '788788': '雷风恒',
  '788877': '地风升', '788878': '水风井', '788887': '泽风大过', '788888': '泽雷随',
  '877777': '巽为风', '877778': '风天小畜', '877787': '风火家人', '877788': '风雷益',
  '877877': '天雷无妄', '877878': '火雷噬嗑', '877887': '山雷颐', '877888': '山风蛊',
  '878777': '离为火', '878778': '火山旅', '878787': '火风鼎', '878788': '水火未济',
  '878877': '山水蒙', '878878': '风水涣', '878887': '天水讼', '878888': '天火同人',
  '887777': '坤为地', '887778': '地雷复', '887787': '地泽临', '887788': '地天泰',
  '887877': '雷天大壮', '887878': '泽天夬', '887887': '水天需', '887888': '水地比',
  '888777': '兑为泽', '888778': '泽水困', '888787': '泽地萃', '888788': '泽山咸',
  '888877': '水山蹇', '888878': '地山谦', '888887': '雷山小过', '888888': '雷泽归妹',
}

function tossCoin(): number {
  return Math.random() > 0.5 ? 3 : 2 // 3 = 阳（字面朝上），2 = 阴（花面朝上）
}

function getLineSymbol(yao: number): string {
  if (yao === 7) return '⚊' // 少阳（阳爻，不变）
  if (yao === 8) return '⚋' // 少阴（阴爻，不变）
  if (yao === 9) return '⚌' // 老阳（阳爻，变）
  return '⚍' // 老阴（阴爻，变）
}

function getYaoFromCoins(coins: number[]): number {
  const sum = coins[0] + coins[1] + coins[2]
  if (sum === 9) return 7 // 少阳（两反一正）
  if (sum === 8) return 8 // 少阴（两正一反）
  if (sum === 7) return 9 // 老阳（三正）
  return 6 // 老阴（三反）
}

export default function CoinDivinationPage() {
  const [step, setStep] = useState<'intro' | 'tossing' | 'result'>('intro')
  const [currentLine, setCurrentLine] = useState(0)
  const [lines, setLines] = useState<number[]>([])
  const [currentCoins, setCurrentCoins] = useState<number[]>([])
  const [isTossing, setIsTossing] = useState(false)

  const handleToss = () => {
    if (isTossing) return
    setIsTossing(true)
    setCurrentCoins([])

    // 动画效果
    let tossCount = 0
    const interval = setInterval(() => {
      setCurrentCoins([tossCoin(), tossCoin(), tossCoin()])
      tossCount++
      if (tossCount >= 8) {
        clearInterval(interval)
        const finalCoins = [tossCoin(), tossCoin(), tossCoin()]
        setCurrentCoins(finalCoins)
        const yao = getYaoFromCoins(finalCoins)
        const newLines = [...lines, yao]
        setLines(newLines)
        setIsTossing(false)

        if (newLines.length >= 6) {
          setStep('result')
        } else {
          setCurrentLine(newLines.length)
        }
      }
    }, 100)
  }

  const getHexagramKey = (yaoList: number[]) => {
    return yaoList.map(y => y % 2 === 1 ? '7' : '8').join('')
  }

  const getChangingKey = (yaoList: number[]) => {
    return yaoList.map(y => {
      if (y === 6) return '8'
      if (y === 9) return '7'
      return y === 7 ? '7' : '8'
    }).join('')
  }

  const reset = () => {
    setStep('intro')
    setCurrentLine(0)
    setLines([])
    setCurrentCoins([])
    setIsTossing(false)
  }

  const hexagramKey = lines.length === 6 ? getHexagramKey(lines) : ''
  const hexagramName = HEXAGRAM_NAMES[hexagramKey] || '未知卦象'
  const hasChanging = lines.some(y => y === 6 || y === 9)

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
          <h1 className="text-gold-gradient text-xl font-bold">金钱卦</h1>
          <p className="text-moonly-text-muted text-xs">三枚铜钱，六爻成卦</p>
        </div>
      </div>

      {step === 'intro' && (
        <div className="space-y-6">
          <div className="moonly-card p-5 text-center">
            <div className="text-4xl mb-3">🪙</div>
            <h3 className="text-white text-lg font-bold mb-2">金钱卦占卜</h3>
            <p className="text-moonly-text-secondary text-sm leading-relaxed mb-4">
              传统六爻占卜法，通过三枚铜钱六次投掷，得到六爻卦象。
              心中默念所问之事，点击开始投掷。
            </p>
            <button
              onClick={() => setStep('tossing')}
              className="px-6 py-3 bg-gradient-to-r from-moonly-gold to-yellow-500 text-moonly-bg font-bold rounded-xl"
            >
              开始占卜
            </button>
          </div>

          <div className="moonly-card p-4">
            <h4 className="text-gold text-sm font-semibold mb-2">📖 占卜方法</h4>
            <ol className="text-sm text-moonly-text-secondary space-y-1.5 list-decimal list-inside">
              <li>心中默念所问之事</li>
              <li>双手合握三枚铜钱</li>
              <li>摇晃后撒在桌面</li>
              <li>记录每次结果（正面/反面）</li>
              <li>重复六次，从下往上记录</li>
            </ol>
          </div>
        </div>
      )}

      {step === 'tossing' && (
        <div className="space-y-6">
          <div className="text-center mb-4">
            <div className="text-moonly-gold text-sm mb-1">第 {currentLine + 1} / 6 爻</div>
            <div className="text-white/40 text-xs">{currentLine < 3 ? '下卦' : '上卦'} · {currentLine % 3 === 0 ? '初爻' : currentLine % 3 === 1 ? '中爻' : '上爻'}</div>
          </div>

          {/* 铜钱显示 */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                  isTossing ? 'animate-bounce' : ''
                } ${
                  currentCoins[i] === 3
                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900'
                    : currentCoins[i] === 2
                    ? 'bg-gradient-to-br from-slate-400 to-slate-600 text-slate-900'
                    : 'bg-white/10'
                }`}
              >
                {currentCoins[i] === 3 ? '字' : currentCoins[i] === 2 ? '花' : '?'}
              </div>
            ))}
          </div>

          {/* 已得爻象 */}
          {lines.length > 0 && (
            <div className="moonly-card p-4">
              <div className="text-xs text-moonly-gold mb-2">已得爻象（从下到上）</div>
              <div className="flex flex-col items-center gap-1">
                {[...lines].reverse().map((yao, i) => (
                  <div key={i} className="text-2xl text-white">
                    {getLineSymbol(yao)}
                    <span className="text-xs text-white/40 ml-2">
                      {yao === 6 ? '老阴（变）' : yao === 7 ? '少阳' : yao === 8 ? '少阴' : '老阳（变）'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleToss}
            disabled={isTossing}
            className="w-full py-4 bg-gradient-to-r from-moonly-gold to-yellow-500 text-moonly-bg font-bold rounded-xl disabled:opacity-50"
          >
            {isTossing ? '投掷中...' : currentCoins.length === 0 ? '点击投掷' : '再次投掷'}
          </button>
        </div>
      )}

      {step === 'result' && lines.length === 6 && (
        <div className="space-y-6">
          <div className="moonly-card p-5 text-center">
            <div className="text-3xl mb-2">☯️</div>
            <h3 className="text-gold text-xl font-bold mb-1">{hexagramName}</h3>
            <p className="text-white/40 text-sm">卦象编号：{hexagramKey}</p>
          </div>

          {/* 本卦 */}
          <div className="moonly-card p-4">
            <div className="text-xs text-moonly-gold mb-3">本卦</div>
            <div className="flex flex-col items-center gap-1">
              {[...lines].reverse().map((yao, i) => (
                <div key={i} className="text-3xl text-white">
                  {getLineSymbol(yao)}
                </div>
              ))}
            </div>
          </div>

          {/* 变卦（如果有） */}
          {hasChanging && (
            <div className="moonly-card p-4">
              <div className="text-xs text-moonly-gold mb-3">变卦</div>
              <div className="flex flex-col items-center gap-1">
                {[...lines].reverse().map((yao, i) => {
                  const changed = yao === 6 ? 7 : yao === 9 ? 8 : yao
                  return (
                    <div key={i} className={`text-3xl ${yao === 6 || yao === 9 ? 'text-moonly-gold' : 'text-white'}`}>
                      {getLineSymbol(changed)}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 解读 */}
          <div className="moonly-card p-4">
            <h4 className="text-gold text-sm font-semibold mb-2">📝 简易解读</h4>
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              {hexagramName.includes('乾') && '乾卦象征天，代表刚健有力。问事业可积极进取，问感情需主动表达。'}
              {hexagramName.includes('坤') && '坤卦象征地，代表柔顺包容。宜守不宜攻，以静制动，顺势而为。'}
              {hexagramName.includes('坎') && '坎卦象征水，代表险陷。当前可能有困难，需谨慎行事，不可冒进。'}
              {hexagramName.includes('离') && '离卦象征火，代表光明。前景光明，但需依附正道，不可投机取巧。'}
              {hexagramName.includes('震') && '震卦象征雷，代表震动。可能有突发变化，保持镇定，处变不惊。'}
              {hexagramName.includes('艮') && '艮卦象征山，代表停止。知止而后有定，适时止步反而有利。'}
              {hexagramName.includes('巽') && '巽卦象征风，代表顺从。以柔克刚，循序渐进，不可急躁。'}
              {hexagramName.includes('兑') && '兑卦象征泽，代表喜悦。心情愉悦，人际关系和谐，适合社交。'}
              {!hexagramName.includes('乾') && !hexagramName.includes('坤') && !hexagramName.includes('坎') && !hexagramName.includes('离') && !hexagramName.includes('震') && !hexagramName.includes('艮') && !hexagramName.includes('巽') && !hexagramName.includes('兑') && '此卦象复杂，建议结合具体所问之事，参考《周易》原文解读。'}
            </p>
            {hasChanging && (
              <p className="text-moonly-gold text-sm mt-2">
                注意：本卦有变爻，事情可能有转折，需关注变化趋势。
              </p>
            )}
          </div>

          <button
            onClick={reset}
            className="w-full py-3 border border-moonly-gold/40 text-moonly-gold rounded-xl hover:bg-moonly-gold/10 transition-colors"
          >
            重新占卜
          </button>
        </div>
      )}
    </div>
  )
}
