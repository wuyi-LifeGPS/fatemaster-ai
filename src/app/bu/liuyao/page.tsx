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

// 卦象基本解读库
const HEXAGRAM_MEANING: Record<string, { general: string; advice: string }> = {
  '乾为天': { general: '天行健，君子以自强不息。象征刚健、创造、领导力。', advice: '宜积极进取，不宜消极等待。事业可大展宏图。' },
  '坤为地': { general: '地势坤，君子以厚德载物。象征包容、柔顺、承载。', advice: '宜守成不宜冒进，以柔克刚，静待时机。' },
  '屯': { general: '水雷屯，象征万物始生，充满艰难但蕴含生机。', advice: '创业初期多艰，宜稳扎稳打，不可急于求成。' },
  '蒙': { general: '山水蒙，象征启蒙、教育，如孩童蒙昧待开。', advice: '宜虚心求教，接受指导，不可自以为是。' },
  '需': { general: '水天需，象征等待、需求，如密云不雨。', advice: '宜耐心等待，时机未到不可强行。' },
  '讼': { general: '天水讼，象征争讼、矛盾，需以和为贵。', advice: '宜和解不宜争讼，退一步海阔天空。' },
  '师': { general: '地水师，象征军队、组织，需纪律严明。', advice: '宜团结众人，不可独断专行。' },
  '比': { general: '水地比，象征亲比、团结，如水附大地。', advice: '宜与人合作，亲近有德之人。' },
  '小畜': { general: '风天小畜，象征小有蓄积，力量尚薄。', advice: '宜积蓄力量，不可急功近利。' },
  '履': { general: '天泽履，象征履行、实践，如履薄冰。', advice: '宜谨慎行事，循礼而行则吉。' },
  '泰': { general: '地天泰，象征天地交泰，万物通顺。', advice: '宜把握良机，乘势而上。' },
  '否': { general: '天地否，象征闭塞不通，小人当道。', advice: '宜韬光养晦，坚守正道，等待转机。' },
  '同人': { general: '天火同人，象征志同道合，与人同心。', advice: '宜广结善缘，与人合作共事。' },
  '大有': { general: '火天大有，象征大丰收、大成就。', advice: '宜感恩惜福，不可骄奢淫逸。' },
  '谦': { general: '地山谦，象征谦虚，山在地下。', advice: '宜谦受益，满招损，谦虚待人则吉。' },
  '豫': { general: '雷地豫，象征喜悦、安乐，但需防乐极生悲。', advice: '宜适度享乐，不可沉迷。' },
  '随': { general: '泽雷随，象征随从、顺应，随遇而安。', advice: '宜顺势而为，不可逆流而动。' },
  '蛊': { general: '山风蛊，象征积弊、腐败，需革新除弊。', advice: '宜改革弊政，重振旗鼓。' },
  '临': { general: '地泽临，象征居高临下，审视全局。', advice: '宜把握大局，以德临人。' },
  '观': { general: '风地观，象征观察、瞻仰，如风行地上。', advice: '宜仔细观察，不可轻举妄动。' },
  '噬嗑': { general: '火雷噬嗑，象征咬合、决断，如口中含物。', advice: '宜果断决策，除去障碍。' },
  '贲': { general: '山火贲，象征文饰、修饰，美观而虚。', advice: '宜注重内涵，不可徒有其表。' },
  '剥': { general: '山地剥，象征剥落、衰败，如高山倾颓。', advice: '宜守静待变，不可逆势而动。' },
  '复': { general: '地雷复，象征反复、回归，一阳来复。', advice: '宜回归初心，重新开始。' },
  '无妄': { general: '天雷无妄，象征无妄之灾，不可妄为。', advice: '宜守正不妄，顺其自然。' },
  '大畜': { general: '山天大畜，象征大蓄积，蓄养贤能。', advice: '宜积蓄力量，厚积薄发。' },
  '颐': { general: '山雷颐，象征颐养、自养，如口中进食。', advice: '宜自食其力，谨慎养生。' },
  '大过': { general: '泽风大过，象征大过失，栋桡之险。', advice: '宜谨慎行事，不可冒险。' },
  '坎': { general: '坎为水，象征险陷、重重困难。', advice: '宜保持诚信，行险而不失其信。' },
  '离': { general: '离为火，象征光明、依附，如日月丽天。', advice: '宜依附正道，传播光明。' },
  '咸': { general: '泽山咸，象征感应、交感，男女相感。', advice: '宜真诚相待，以感通人。' },
  '恒': { general: '雷风恒，象征恒久、持久，如天地常久。', advice: '宜持之以恒，不可半途而废。' },
  '遁': { general: '天山遁，象征退避、隐遁，以退为进。', advice: '宜适时退避，保全实力。' },
  '大壮': { general: '雷天大壮，象征壮盛、强盛，但需防过刚。', advice: '宜刚健中正，不可恃强凌弱。' },
  '晋': { general: '火地晋，象征晋升、前进，如日出地上。', advice: '宜积极进取，以柔克刚。' },
  '明夷': { general: '地火明夷，象征光明受损，如日落地下。', advice: '宜韬光养晦，外愚内明。' },
  '家人': { general: '风火家人，象征家庭、家风，正家而天下定。', advice: '宜修身齐家，以正治家。' },
  '睽': { general: '火泽睽，象征乖离、分歧，如火泽不相交。', advice: '宜求同存异，化解分歧。' },
  '蹇': { general: '水山蹇，象征艰难、蹇滞，如山上有水。', advice: '宜见险而止，不可冒进。' },
  '解': { general: '雷水解，象征解脱、缓解，如雷雨作而万物解。', advice: '宜把握时机，解除困难。' },
  '损': { general: '山泽损，象征减损、损益，损下益上。', advice: '宜适度损己利人，以和为贵。' },
  '益': { general: '风雷益，象征增益、受益，损上益下。', advice: '宜把握良机，积极受益。' },
  '夬': { general: '泽天夬，象征决断、果决，如泽在天上。', advice: '宜果断决策，不可优柔寡断。' },
  '姤': { general: '天风姤，象征相遇、邂逅，一女遇五男。', advice: '宜谨慎行事，不可妄动。' },
  '萃': { general: '泽地萃，象征聚集、荟萃，如泽在地上。', advice: '宜聚集众人，共成大事。' },
  '升': { general: '地风升，象征上升、晋升，如木生于地。', advice: '宜积极进取，循序渐进。' },
  '困': { general: '泽水困，象征困顿、困境，如泽无水。', advice: '宜坚守正道，穷困中保持希望。' },
  '井': { general: '水风井，象征井泉、滋养，如木入水中。', advice: '宜修身养德，惠泽他人。' },
  '革': { general: '泽火革，象征变革、革新，如泽中有火。', advice: '宜把握时机，顺势变革。' },
  '鼎': { general: '火风鼎，象征鼎新、立器，如木上有火。', advice: '宜破旧立新，建立新秩序。' },
  '震': { general: '震为雷，象征震动、惊雷，恐惧修省。', advice: '宜谨慎修省，化危为机。' },
  '艮': { general: '艮为山，象征静止、止步，如高山仰止。', advice: '宜知止而后有定，不可冒进。' },
  '渐': { general: '风山渐，象征渐进、逐步，如木生于山。', advice: '宜循序渐进，不可急于求成。' },
  '归妹': { general: '雷泽归妹，象征婚嫁、归宿，少女从长男。', advice: '宜慎重选择，不可轻率。' },
  '丰': { general: '雷火丰，象征丰盛、盛大，如雷电交加。', advice: '宜把握盛时，防微杜渐。' },
  '旅': { general: '火山旅，象征旅行、羁旅，如火烧山上。', advice: '宜谨慎守中，不可冒进。' },
  '巽': { general: '巽为风，象征顺从、渗透，如风无孔不入。', advice: '宜柔顺处世，以退为进。' },
  '兑': { general: '兑为泽，象征喜悦、和悦，如泽润万物。', advice: '宜和悦待人，以和为贵。' },
  '涣': { general: '风水涣，象征涣散、离散，如风在水上。', advice: '宜凝聚人心，化解涣散。' },
  '节': { general: '水泽节，象征节制、节约，如水在泽上。', advice: '宜适度节制，不可过度。' },
  '中孚': { general: '风泽中孚，象征诚信、孚信，如风行泽上。', advice: '宜诚信为本，以信立身。' },
  '小过': { general: '雷山小过，象征小过失，小事可过。', advice: '宜谨慎行事，大事不可冒进。' },
  '既济': { general: '水火既济，象征成功、完成，水火相交。', advice: '宜居安思危，防微杜渐。' },
  '未济': { general: '火水未济，象征未完成，火水不交。', advice: '宜继续努力，不可半途而废。' },
}

function getHexagramMeaning(name: string): { general: string; advice: string } {
  return HEXAGRAM_MEANING[name] || { general: '此卦象显示事情有其内在的规律，需细心体察。', advice: '宜静观其变，审时度势。' }
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

          {/* AI 解读 */}
          <div className="moonly-card p-5">
            <h3 className="text-white font-bold text-sm mb-3">AI 解读</h3>
            {(() => {
              const meaning = getHexagramMeaning(result.benGua)
              return (
                <div className="text-moonly-text-secondary text-sm leading-relaxed space-y-3">
                  <div>
                    <span className="text-moonly-gold font-medium">本卦 {result.benGua}：</span>
                    <span>{meaning.general}</span>
                  </div>
                  <div>
                    <span className="text-moonly-gold font-medium">建议：</span>
                    <span>{meaning.advice}</span>
                  </div>
                  {result.bianGua && (
                    <div>
                      <span className="text-moonly-gold font-medium">变卦 {result.bianGua} 启示：</span>
                      <span>此卦有{result.dongYao.length}个动爻，事情将有变化。变卦提示事情的发展趋势，需关注环境变化，灵活应对。</span>
                    </div>
                  )}
                  <div className="p-3 moonly-card text-xs text-moonly-text-muted">
                    <p>💡 所问：{question}</p>
                    <p className="mt-1">{result.dongYao.length > 0
                      ? `动爻在第 ${result.dongYao.join('、')} 爻，主事情有变，需结合变卦综合判断。`
                      : '六爻皆静，事情发展平稳，可按本卦理解。'}</p>
                  </div>
                </div>
              )
            })()}
          </div>

          <button onClick={reset} className="w-full btn-gold py-3 text-sm font-semibold">
            再占一卦
          </button>
        </div>
      )}
    </div>
  )
}
