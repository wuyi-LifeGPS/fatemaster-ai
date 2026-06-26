'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// 六爻相关类型和常量
interface Yao {
  position: number    // 1-6，从下到上
  yaoType: 'yin' | 'yang' | 'old-yin' | 'old-yang'  // 阴、阳、老阴、老阳
  coins: number[]     // 三枚铜钱的正反面 [1,2,3] 正=1，反=0
}

interface Hexagram {
  yaoList: Yao[]
  benGua: string      // 本卦名称
  bianGua?: string    // 变卦名称（有动爻才有）
  dongYao: number[]   // 动爻位置
}

const HEXAGRAM_MAP: Record<string, string> = {
  // 上乾(111)
  '111111': '乾为天', '111011': '天泽履', '111101': '天火同人',
  '111001': '天雷无妄', '111110': '天风姤', '111010': '天水讼',
  '111100': '天山遁', '111000': '天地否',
  // 上兑(011)
  '011111': '泽天夬', '011011': '兑为泽', '011101': '泽火革',
  '011001': '泽雷随', '011110': '泽风大过', '011010': '泽水困',
  '011100': '泽山咸', '011000': '泽地萃',
  // 上离(101)
  '101111': '火天大有', '101011': '火泽睽', '101101': '离为火',
  '101001': '火雷噬嗑', '101110': '火风鼎', '101010': '火水未济',
  '101100': '火山旅', '101000': '火地晋',
  // 上震(001)
  '001111': '雷天大壮', '001011': '雷泽归妹', '001101': '雷火丰',
  '001001': '震为雷', '001110': '雷风恒', '001010': '雷水解',
  '001100': '雷山小过', '001000': '雷地豫',
  // 上巽(110)
  '110111': '风天小畜', '110011': '风泽中孚', '110101': '风火家人',
  '110001': '风雷益', '110110': '巽为风', '110010': '风水涣',
  '110100': '风山渐', '110000': '风地观',
  // 上坎(010)
  '010111': '水天需', '010011': '水泽节', '010101': '水火既济',
  '010001': '水雷屯', '010110': '水风井', '010010': '坎为水',
  '010100': '水山蹇', '010000': '水地比',
  // 上艮(100)
  '100111': '山天大畜', '100011': '山泽损', '100101': '山火贲',
  '100001': '山雷颐', '100110': '山风蛊', '100010': '山水蒙',
  '100100': '艮为山', '100000': '山地剥',
  // 上坤(000)
  '000111': '地天泰', '000011': '地泽临', '000101': '地火明夷',
  '000001': '地雷复', '000110': '地风升', '000010': '地水师',
  '000100': '地山谦', '000000': '坤为地',
}

// 摇卦函数：3枚铜钱，正面=3，反面=2
function tossCoins(): { coins: number[]; sum: number } {
  const coins = [
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
    Math.random() > 0.5 ? 3 : 2,
  ]
  const sum = coins.reduce((a, b) => a + b, 0)
  return { coins, sum }
}

function sumToYao(sum: number): 'yin' | 'yang' | 'old-yin' | 'old-yang' {
  // 3+3+3=9 老阳（阳动变阴）
  // 3+3+2=8 少阴（阴）
  // 3+2+2=7 少阳（阳）
  // 2+2+2=6 老阴（阴动变阳）
  if (sum === 9) return 'old-yang'
  if (sum === 8) return 'yin'
  if (sum === 7) return 'yang'
  return 'old-yin'
}

function getYaoSymbol(type: string): string {
  if (type === 'yang' || type === 'old-yang') return '━━━' // 阳爻
  return '━ ━' // 阴爻
}

function getYaoLabel(type: string): string {
  if (type === 'old-yang') return '老阳（动）'
  if (type === 'old-yin') return '老阴（动）'
  if (type === 'yang') return '少阳'
  return '少阴'
}

function getGuaName(yaoList: Yao[]): { ben: string; bian?: string; dong: number[] } {
  // 本卦
  const benBinary = yaoList.map(y => (y.yaoType === 'yang' || y.yaoType === 'old-yang') ? '1' : '0').join('')
  const ben = HEXAGRAM_MAP[benBinary] || '未知卦'
  
  // 动爻
  const dong = yaoList
    .map((y, i) => ({ pos: 6 - i, type: y.yaoType }))
    .filter(y => y.type === 'old-yang' || y.type === 'old-yin')
    .map(y => y.pos)
  
  // 变卦
  if (dong.length > 0) {
    const bianBinary = yaoList.map(y => {
      if (y.yaoType === 'old-yang') return '0' // 阳变阴
      if (y.yaoType === 'old-yin') return '1' // 阴变阳
      return (y.yaoType === 'yang') ? '1' : '0'
    }).join('')
    const bian = HEXAGRAM_MAP[bianBinary] || '未知卦'
    return { ben, bian, dong }
  }
  
  return { ben, dong: [] }
}

export default function LiuYaoPage() {
  const [step, setStep] = useState<'intro' | 'tossing' | 'result'>('intro')
  const [currentToss, setCurrentToss] = useState(0) // 当前第几次摇卦 1-6
  const [yaoList, setYaoList] = useState<Yao[]>([])
  const [coinsAnimating, setCoinsAnimating] = useState(false)
  const [lastCoins, setLastCoins] = useState<number[]>([])
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState<Hexagram | null>(null)

  const startDivination = () => {
    if (!question.trim()) return
    setStep('tossing')
    setCurrentToss(0)
    setYaoList([])
    setResult(null)
  }

  const tossOnce = () => {
    if (coinsAnimating) return
    setCoinsAnimating(true)
    
    // 动画延迟 1.5 秒
    setTimeout(() => {
      const { coins, sum } = tossCoins()
      const yaoType = sumToYao(sum)
      const newYao: Yao = {
        position: 6 - currentToss, // 从下往上
        yaoType,
        coins,
      }
      
      setLastCoins(coins)
      setYaoList(prev => [newYao, ...prev]) // 新爻在底部
      setCurrentToss(prev => prev + 1)
      setCoinsAnimating(false)
      
      if (currentToss + 1 >= 6) {
        // 完成6次
        setTimeout(() => {
          const finalList = [newYao, ...yaoList].reverse()
          const { ben, bian, dong } = getGuaName(finalList)
          setResult({
            yaoList: finalList,
            benGua: ben,
            bianGua: bian,
            dongYao: dong,
          })
          setStep('result')
        }, 500)
      }
    }, 1500)
  }

  const reset = () => {
    setStep('intro')
    setQuestion('')
    setYaoList([])
    setCurrentToss(0)
    setResult(null)
    setLastCoins([])
  }

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* 头部返回 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-text-secondary">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">六爻卜卦</h1>
          <p className="text-moonly-text-muted text-xs">三枚铜钱，问事占断</p>
        </div>
      </div>

      {step === 'intro' && (
        <div className="space-y-6">
          {/* 说明卡片 */}
          <div className="moonly-card p-5">
            <h3 className="text-white font-bold mb-3">如何起卦</h3>
            <div className="space-y-2 text-sm text-moonly-text-secondary">
              <p>1. 心中默念所问之事</p>
              <p>2. 摇动三枚铜钱六次</p>
              <p>3. 根据正反面组合确定爻象</p>
              <p>4. 从下到上排列成卦</p>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg text-xs text-moonly-text-muted">
              <p>正面（字）= 3，反面（花）= 2</p>
              <p>9 = 老阳（动），8 = 少阴，7 = 少阳，6 = 老阴（动）</p>
            </div>
          </div>

          {/* 输入问题 */}
          <div className="moonly-card p-5">
            <label className="text-white font-medium text-sm mb-2 block">您想问什么？</label>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="例如：这次合作能否成功？近期事业发展如何？"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-moonly-text-muted focus:outline-none focus:border-moonly-gold/30 resize-none"
              rows={3}
            />
            <button
              onClick={startDivination}
              disabled={!question.trim()}
              className="w-full mt-4 btn-gold py-3 text-sm font-semibold disabled:opacity-40"
            >
              开始摇卦
            </button>
          </div>
        </div>
      )}

      {step === 'tossing' && (
        <div className="space-y-6">
          {/* 进度 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-moonly-text-secondary text-sm">第 {currentToss + 1} / 6 次</span>
            <span className="text-moonly-text-muted text-xs">
              {currentToss === 0 ? '初爻' : currentToss === 1 ? '二爻' : currentToss === 2 ? '三爻' : currentToss === 3 ? '四爻' : currentToss === 4 ? '五爻' : '上爻'}
            </span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-moonly-gold transition-all duration-300" style={{ width: `${(currentToss / 6) * 100}%` }} />
          </div>

          {/* 铜钱动画区 */}
          <div className="moonly-card p-8 flex flex-col items-center justify-center min-h-[200px]">
            {coinsAnimating ? (
              <div className="flex gap-4 items-center">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-bounce" style={{ animationDelay: `${i * 100}ms` }}>
                    <span className="text-amber-900 text-lg font-bold">通</span>
                  </div>
                ))}
              </div>
            ) : lastCoins.length > 0 ? (
              <div className="flex gap-4 items-center">
                {lastCoins.map((coin, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    coin === 3 ? 'bg-gradient-to-br from-amber-300 to-amber-500' : 'bg-gradient-to-br from-stone-600 to-stone-800'
                  }`}>
                    <span className={`text-lg font-bold ${coin === 3 ? 'text-amber-900' : 'text-stone-300'}`}>
                      {coin === 3 ? '正' : '反'}
                    </span>
                  </div>
                ))}
                <div className="ml-4 text-moonly-gold text-sm font-medium">
                  {getYaoLabel(sumToYao(lastCoins.reduce((a, b) => a + b, 0)))}
                </div>
              </div>
            ) : (
              <div className="text-moonly-text-muted text-sm">点击按钮开始摇卦</div>
            )}
          </div>

          {/* 已摇出的爻 */}
          {yaoList.length > 0 && (
            <div className="moonly-card p-5">
              <h3 className="text-white font-bold text-sm mb-3">已摇出爻象（从下到上）</h3>
              <div className="space-y-1">
                {yaoList.map((yao, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-moonly-text-muted text-xs w-8">{yao.position}爻</span>
                    <span className={`text-lg font-mono ${yao.yaoType.includes('old') ? 'text-moonly-gold' : 'text-white'}`}>
                      {getYaoSymbol(yao.yaoType)}
                    </span>
                    <span className="text-xs text-moonly-text-muted">{getYaoLabel(yao.yaoType)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 摇卦按钮 */}
          {currentToss < 6 && (
            <button
              onClick={tossOnce}
              disabled={coinsAnimating}
              className="w-full btn-gold py-3 text-sm font-semibold disabled:opacity-40"
            >
              {coinsAnimating ? '铜钱摇动中...' : '摇卦'}
            </button>
          )}
        </div>
      )}

      {step === 'result' && result && (
        <div className="space-y-6">
          {/* 卦象结果 */}
          <div className="moonly-card p-5 text-center">
            <div className="text-moonly-text-muted text-xs mb-2">本卦</div>
            <div className="text-gold-gradient text-2xl font-bold mb-1">{result.benGua}</div>
            {result.bianGua && (
              <div className="mt-2">
                <div className="text-moonly-text-muted text-xs mb-1">变卦</div>
                <div className="text-white text-lg font-medium">{result.bianGua}</div>
              </div>
            )}
            {result.dongYao.length > 0 && (
              <div className="mt-3 text-moonly-gold text-sm">
                动爻：第 {result.dongYao.join('、')} 爻
              </div>
            )}
          </div>

          {/* 卦象展示 */}
          <div className="moonly-card p-5">
            <h3 className="text-white font-bold text-sm mb-4">卦象</h3>
            <div className="space-y-2">
              {result.yaoList.map((yao, idx) => (
                <div key={idx} className="flex items-center justify-center gap-3">
                  <span className="text-moonly-text-muted text-xs w-8 text-right">{yao.position}爻</span>
                  <span className={`text-2xl font-mono tracking-wider ${yao.yaoType.includes('old') ? 'text-moonly-gold' : 'text-white'}`}>
                    {getYaoSymbol(yao.yaoType)}
                  </span>
                  <span className="text-xs text-moonly-text-muted w-16">{getYaoLabel(yao.yaoType)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 问题 */}
          <div className="moonly-card p-5">
            <div className="text-moonly-text-muted text-xs mb-1">所问之事</div>
            <div className="text-white text-sm">{question}</div>
          </div>

          {/* AI 解读（占位） */}
          <div className="moonly-card p-5">
            <h3 className="text-white font-bold text-sm mb-3">AI 解读</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              <p className="mb-2">根据您的卦象，{result.benGua} 提示：</p>
              <p>此卦为{result.dongYao.length > 0 ? '动卦' : '静卦'}，{result.dongYao.length > 0 
                ? `动爻在第 ${result.dongYao.join('、')} 爻，说明事情有变化，需要关注变卦 ${result.bianGua} 的启示。`
                : '六爻皆静，说明事情目前处于稳定状态，可按本卦象理解。'}
              </p>
              <p className="mt-2 text-moonly-text-muted">（完整AI解读功能开发中，后续将接入专业六爻解卦库）</p>
            </div>
          </div>

          <button onClick={reset} className="w-full btn-gold py-3 text-sm font-semibold">
            再占一卦
          </button>
        </div>
      )}
    </div>
  )
}
