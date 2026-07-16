'use client'

import { useState } from 'react'
import Link from 'next/link'

const DREAM_DB: Record<string, { meaning: string; fortune: '吉' | '平' | '凶'; advice: string }> = {
  '蛇': { meaning: '蛇在梦中通常代表智慧、财富或潜在的危险。如果蛇没有攻击你，预示财运将至。', fortune: '吉', advice: '留意身边的机会，可能有意外收获。' },
  '水': { meaning: '水象征情感和潜意识。清澈的水代表心灵净化，浑浊的水则提示需要清理情绪。', fortune: '平', advice: '关注内心感受，适当放松自己。' },
  '飞': { meaning: '飞翔的梦代表渴望自由和突破限制。说明你内心有强烈的上进心和挣脱束缚的愿望。', fortune: '吉', advice: '勇敢追求自己的目标，现在正是好时机。' },
  '掉牙': { meaning: '掉牙通常与焦虑、无力感或对衰老的恐惧有关。也可能暗示你正在经历某种转变。', fortune: '平', advice: '接纳变化，不要过度焦虑，转变是成长的必经之路。' },
  '考试': { meaning: '梦见考试反映现实中的压力和自我要求过高。说明你在某方面感到准备不足或担心被评判。', fortune: '平', advice: '适当降低对自己的要求，你已经足够优秀。' },
  ' chase': { meaning: '被追赶的梦通常反映现实中逃避某个问题或压力。追赶者往往代表你内心不愿面对的部分。', fortune: '平', advice: '正视问题，逃避只会让压力更大。' },
  '怀孕': { meaning: '怀孕象征新的开始、创造力的萌芽或某个计划正在孕育中。不一定是字面意义。', fortune: '吉', advice: '珍惜并培育你心中的新想法，它可能带来惊喜。' },
  '死亡': { meaning: '梦中的死亡通常不是坏兆头，而是象征结束和重生。可能预示某段关系、工作或生活方式的终结。', fortune: '平', advice: '放下过去，迎接新的开始。' },
  '钱': { meaning: '梦见金钱通常反映对安全感和价值的追求。获得钱预示自信提升，失去钱则可能暗示对资源的担忧。', fortune: '吉', advice: '审视自己对财富的态度，平衡物质与精神。' },
  '火': { meaning: '火象征激情、能量和转变。温和的火焰是创造力的体现，失控的大火则警告需要控制情绪。', fortune: '平', advice: '将热情投入到有意义的事情中，注意情绪管理。' },
  '山': { meaning: '山代表障碍、挑战或目标。攀登象征努力向上，站在山顶则预示成就和视野开阔。', fortune: '吉', advice: '坚持不懈，目标就在前方。' },
  '鱼': { meaning: '鱼在传统文化中是富贵和余庆的象征。梦见鱼通常预示财运和好消息即将到来。', fortune: '吉', advice: '把握机会，财运将至。' },
  '雨': { meaning: '雨水洗涤尘埃，象征净化和新的开始。细雨温柔，暴雨则可能暗示情绪的宣泄。', fortune: '平', advice: '让情绪自然流动，雨后必有彩虹。' },
  '楼梯': { meaning: '楼梯象征人生阶段的过渡。向上走代表进步，向下走可能暗示需要回归基础或放慢脚步。', fortune: '平', advice: '脚踏实地，一步一个脚印。' },
  '门': { meaning: '门代表机会和选择。打开的门是机遇，关闭的门则是提示需要寻找新的路径。', fortune: '平', advice: '保持开放的心态，新的机会正在靠近。' },
  '狗': { meaning: '狗象征忠诚和朋友。友善的狗预示贵人相助，凶恶的狗则可能暗示身边有不可靠的人。', fortune: '吉', advice: '珍惜身边的朋友，他们是你宝贵的财富。' },
  '猫': { meaning: '猫代表独立、直觉和神秘。梦见猫提示要相信直觉，也可能暗示身边有难以捉摸的人或事。', fortune: '平', advice: '倾听内心的声音，直觉往往是对的。' },
  '车': { meaning: '车象征人生道路和方向。驾驶顺畅预示目标明确，出故障则提示需要调整方向。', fortune: '平', advice: '确认自己的人生方向是否需要调整。' },
  '房子': { meaning: '房子代表自我和内心世界。不同的房间对应不同的生活领域。新房子预示新开始，旧房子可能暗示怀旧。', fortune: '平', advice: '关注自己的内在需求，营造舒适的生活环境。' },
  '花': { meaning: '花象征美好、爱情和生命力。盛开的花预示好运，凋谢的花则可能暗示需要珍惜当下。', fortune: '吉', advice: '享受生活中的美好，感恩当下。' },
  '树': { meaning: '树象征成长、根基和生命力。茂盛的树预示繁荣，枯萎的树则提示需要关注健康或基础。', fortune: '吉', advice: '扎根当下，稳固基础才能茁壮成长。' },
  '头发': { meaning: '头发象征力量和形象。剪头发代表改变和放下，长头发则可能暗示对自我形象的关注。', fortune: '平', advice: '适当改变形象可能带来新的能量。' },
  '血': { meaning: '血象征生命力、情感和牺牲。少量出血可能预示付出后的回报，大量出血则提示需要注意健康。', fortune: '平', advice: '关注身体健康，适当休息。' },
  '鬼': { meaning: '梦中的鬼通常不是真的鬼魂，而是代表你内心的恐惧、愧疚或未解决的情绪。', fortune: '平', advice: '面对内心的阴影，接纳自己的全部。' },
  '明星': { meaning: '梦见明星反映你对成功和认可的渴望。也可能暗示你正在接近某个目标。', fortune: '吉', advice: '保持自信，你也有发光的一面。' },
}

const FORTUNE_COLOR = {
  '吉': 'text-green-400 bg-green-500/10 border-green-500/20',
  '平': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  '凶': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

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

export default function ZhouGongJieMengPage() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!query.trim()) return
    setLoading(true)
    
    setTimeout(() => {
      const q = query.trim()
      
      // 模糊匹配
      let match: string | null = null
      for (const key of Object.keys(DREAM_DB)) {
        if (q.includes(key) || key.includes(q)) {
          match = key
          break
        }
      }
      
      setResult(match)
      if (match && !history.includes(q)) {
        setHistory(prev => [q, ...prev].slice(0, 10))
      }
      setLoading(false)
    }, 500)
  }

  const data = result ? DREAM_DB[result] : null

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 头部 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">周公解梦</h1>
          <p className="text-moonly-text-muted text-xs">输入梦境关键词，探寻吉凶</p>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="moonly-card p-4 mb-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="输入梦境关键词，如：蛇、水、飞..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-text-muted focus:outline-none focus:border-moonly-gold/30"
          />
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-5 py-3 btn-gold text-sm font-semibold disabled:opacity-30 flex items-center gap-2"
          >
            {loading ? <Spinner /> : '解梦'}
          </button>
        </div>
      </div>

      {/* 结果 */}
      {data && (
        <div className="moonly-card p-5 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">梦见「{result}」</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${FORTUNE_COLOR[data.fortune]}`}>
              {data.fortune}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-gold text-sm font-semibold mb-1">梦境解析</h3>
              <p className="text-moonly-text-secondary text-sm leading-relaxed">{data.meaning}</p>
            </div>
            <div>
              <h3 className="text-gold text-sm font-semibold mb-1">建议</h3>
              <p className="text-moonly-text-secondary text-sm leading-relaxed">{data.advice}</p>
            </div>
          </div>
        </div>
      )}

      {result === null && query && !loading && (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-moonly-text-secondary text-sm">暂未收录此梦境，试试其他关键词</p>
        </div>
      )}

      {/* 热门梦境 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">常见梦境</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(DREAM_DB).slice(0, 15).map(key => (
            <button
              key={key}
              onClick={() => { setQuery(key); setResult(key); }}
              className="px-3 py-1.5 rounded-full bg-white/5 text-moonly-text-secondary text-xs hover:bg-white/10 hover:text-white transition"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* 历史 */}
      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-moonly-text-muted text-xs mb-2">最近解梦</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => { setQuery(h); handleSearch(); }}
                className="px-3 py-1.5 rounded-full bg-white/5 text-moonly-text-secondary text-xs hover:bg-white/10 transition"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
