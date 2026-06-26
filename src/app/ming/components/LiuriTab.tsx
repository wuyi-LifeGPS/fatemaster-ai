'use client'

import { useMemo } from 'react'
import { TIAN_GAN, DI_ZHI, getShiShen, getWuXing, getTodayGanZhi } from '@/lib/bazi'

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}

const SHISHEN_EMOJI: Record<string, string> = {
  '正印': '👩‍🦰', '偏印': '🤓', '正官': '👨‍💼', '七杀': '⚔️',
  '正财': '💰', '偏财': '🎰', '比肩': '🤝', '劫财': '🏴‍☠️',
  '食神': '😋', '伤官': '😤',
}

function evaluateDay(dayMaster: string, dayGan: string, dayZhi: string): { score: number; fortuneLevel: string; advice: string } {
  let score = 50
  const dayMasterWX = getWuXing(dayMaster)
  const dayGanWX = getWuXing(dayGan)

  if (
    (dayMasterWX === '木' && dayGanWX === '水') ||
    (dayMasterWX === '火' && dayGanWX === '木') ||
    (dayMasterWX === '土' && dayGanWX === '火') ||
    (dayMasterWX === '金' && dayGanWX === '土') ||
    (dayMasterWX === '水' && dayGanWX === '金')
  ) {
    score += 10
  } else if (dayGanWX === dayMasterWX) {
    score += 3
  } else if (
    (dayMasterWX === '木' && dayGanWX === '金') ||
    (dayMasterWX === '火' && dayGanWX === '水') ||
    (dayMasterWX === '土' && dayGanWX === '木') ||
    (dayMasterWX === '金' && dayGanWX === '火') ||
    (dayMasterWX === '水' && dayGanWX === '土')
  ) {
    score -= 8
  } else {
    score -= 3
  }

  const shiShen = getShiShen(dayMaster, dayGan)
  const bonus: Record<string, number> = {
    '正印': 6, '偏印': 3, '正官': 5, '正财': 3, '食神': 3,
    '比肩': 0, '劫财': -2, '伤官': -5, '偏财': 0, '七杀': -8,
  }
  score += bonus[shiShen] || 0

  score = Math.min(95, Math.max(15, score))

  let fortuneLevel: string
  if (score >= 80) fortuneLevel = '大吉'
  else if (score >= 65) fortuneLevel = '吉'
  else if (score >= 45) fortuneLevel = '平'
  else if (score >= 30) fortuneLevel = '凶'
  else fortuneLevel = '大凶'

  let advice = ''
  if (shiShen === '正印') advice = '今日贵人运佳，适合拜访长辈、请教问题。工作中易得领导赏识。'
  else if (shiShen === '偏印') advice = '今日灵感充沛，适合独立思考、创意工作。但注意别钻牛角尖。'
  else if (shiShen === '正官') advice = '今日事业运旺，适合汇报工作、争取机会。遵守规则更易成功。'
  else if (shiShen === '七杀') advice = '今日压力较大，遇事冷静，不要冲动决策。适当运动释放压力。'
  else if (shiShen === '正财') advice = '今日财运平稳，适合处理财务、签约等事务。量入为出，不宜大额支出。'
  else if (shiShen === '偏财') advice = '今日偏财不错，可能有意外小收获。但投资需谨慎，见好就收。'
  else if (shiShen === '食神') advice = '今日心情愉悦，适合社交聚会、展示才华。口福不错，可小小犒劳自己。'
  else if (shiShen === '伤官') advice = '今日表达欲强，注意言辞分寸。创意迸发但别太锋芒毕露。'
  else if (shiShen === '比肩') advice = '今日适合合作共赢，多与朋友同事交流。团队协作事半功倍。'
  else if (shiShen === '劫财') advice = '今日竞争激烈，注意守住成果。避免借贷，重要决策独立判断。'
  else advice = '今日运势平稳，顺其自然即可。'

  return { score, fortuneLevel, advice }
}

const SHI_CHEN_LUCK: Record<string, string[]> = {
  '子': ['凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉'],
  '丑': ['吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶'],
  '寅': ['吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉'],
  '卯': ['凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉'],
  '辰': ['凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶'],
  '巳': ['吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉'],
  '午': ['吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶'],
  '未': ['凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉'],
  '申': ['吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉'],
  '酉': ['凶', '吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶'],
  '戌': ['吉', '凶', '吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉'],
  '亥': ['凶', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶'],
}

const SHI_CHEN_NAMES = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时']

const DAY_ADVICE: Record<string, string[]> = {
  '吉': ['宜主动出击，把握机会', '适合重要决策和签约', '人际关系融洽，多社交'],
  '大吉': ['诸事顺遂，大胆推进', '适合启动新项目', '贵人运极旺，主动联络'],
  '平': ['平稳度日，做好本分', '适合整理归纳、复盘', '不宜冒险，守成为主'],
  '凶': ['谨言慎行，低调行事', '避免重大决策和签约', '注意身体健康，早休息'],
  '大凶': ['以静制动，少出门', '重要事项延后处理', '多休息，调养身心'],
}

export default function LiuriTab({ dayMaster }: { dayMaster?: string }) {
  const today = useMemo(() => getTodayGanZhi(), [])
  const evaluation = useMemo(() => {
    if (!dayMaster) return null
    return evaluateDay(dayMaster, today.day.gan, today.day.zhi)
  }, [dayMaster, today])

  const dayShiShen = dayMaster ? getShiShen(dayMaster, today.day.gan) : ''

  if (!evaluation) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin mb-4" />
        <p className="text-moonly-text-secondary text-sm">加载中...</p>
      </div>
    )
  }

  const advices = DAY_ADVICE[evaluation.fortuneLevel] || DAY_ADVICE['平']
  const fortuneColor = evaluation.score >= 65 ? 'text-green-400' : evaluation.score >= 45 ? 'text-slate-400' : 'text-orange-400'
  const fortuneBg = evaluation.score >= 65 ? 'bg-green-500/10' : evaluation.score >= 45 ? 'bg-slate-500/10' : 'bg-orange-500/10'

  return (
    <div className="space-y-4">
      {/* 今日干支 */}
      <div className="moonly-card p-4">
        <div className="text-center mb-4">
          <p className="text-white/40 text-sm">{today.dateStr} · 星期{today.weekday}</p>
        </div>
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">年柱</div>
            <div className="w-14 h-14 rounded-xl bg-white/5 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: WUXING_COLOR[getWuXing(today.year.gan)] || '#fff' }}>{today.year.gan}</span>
              <span className="text-xs text-white/50">{today.year.zhi}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">月柱</div>
            <div className="w-14 h-14 rounded-xl bg-white/5 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: WUXING_COLOR[getWuXing(today.month.gan)] || '#fff' }}>{today.month.gan}</span>
              <span className="text-xs text-white/50">{today.month.zhi}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-white/40 mb-1">日柱</div>
            <div className="w-14 h-14 rounded-xl bg-moonly-gold/10 border border-moonly-gold/30 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gold">{today.day.gan}</span>
              <span className="text-xs text-white/50">{today.day.zhi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 今日运势评分 */}
      <div className="moonly-card p-4">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold text-gold">{evaluation.score}</span>
          <span className={`text-xl font-medium ${fortuneColor}`}>{evaluation.fortuneLevel}</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-white/60 text-sm">日主{dayMaster}遇</span>
          <span className="text-lg font-bold" style={{ color: WUXING_COLOR[getWuXing(today.day.gan)] || '#fff' }}>{today.day.gan}{today.day.zhi}</span>
          <span className="text-white/60 text-sm">日</span>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{SHISHEN_EMOJI[dayShiShen] || '✨'}</span>
          <span className="text-white/70 text-sm">天干十神：<span className="text-gold">{dayShiShen}</span></span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold" 
            style={{ width: `${evaluation.score}%` }} 
          />
        </div>
      </div>

      {/* 今日建议 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">今日运势解读</h3>
        <p className="text-white/70 text-sm leading-relaxed mb-4">{evaluation.advice}</p>
        
        <h3 className="text-gold text-sm font-semibold mb-3">行动建议</h3>
        <div className="space-y-2">
          {advices.map((a, i) => (
            <div key={i} className={`flex items-start gap-2 py-2 px-3 rounded-lg ${fortuneBg}`}>
              <span className="text-gold mt-0.5">{i + 1}.</span>
              <span className="text-white/70 text-sm">{a}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 今日宜忌 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="moonly-card p-4">
          <h3 className="text-green-400 text-sm font-semibold mb-2 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            宜
          </h3>
          <div className="space-y-1">
            {evaluation.score >= 65 ? (
              <>
                <span className="text-white/60 text-sm block">签约合作</span>
                <span className="text-white/60 text-sm block">社交聚会</span>
                <span className="text-white/60 text-sm block">求财投资</span>
              </>
            ) : evaluation.score >= 45 ? (
              <>
                <span className="text-white/60 text-sm block">整理归纳</span>
                <span className="text-white/60 text-sm block">学习充电</span>
                <span className="text-white/60 text-sm block">稳步前行</span>
              </>
            ) : (
              <>
                <span className="text-white/60 text-sm block">静心修养</span>
                <span className="text-white/60 text-sm block">陪伴家人</span>
                <span className="text-white/60 text-sm block">早休息</span>
              </>
            )}
          </div>
        </div>
        <div className="moonly-card p-4">
          <h3 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            忌
          </h3>
          <div className="space-y-1">
            {evaluation.score >= 65 ? (
              <>
                <span className="text-white/60 text-sm block">冲动消费</span>
                <span className="text-white/60 text-sm block">口舌之争</span>
                <span className="text-white/60 text-sm block">过度劳累</span>
              </>
            ) : evaluation.score >= 45 ? (
              <>
                <span className="text-white/60 text-sm block">冒险投机</span>
                <span className="text-white/60 text-sm block">重大变动</span>
                <span className="text-white/60 text-sm block">轻信他人</span>
              </>
            ) : (
              <>
                <span className="text-white/60 text-sm block">重大决策</span>
                <span className="text-white/60 text-sm block">远行奔波</span>
                <span className="text-white/60 text-sm block">借贷担保</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 时辰吉凶 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">十二时辰吉凶</h3>
        <div className="grid grid-cols-2 gap-2">
          {(() => {
            const luckArr = SHI_CHEN_LUCK[today.day.zhi] || []
            const currentHour = new Date().getHours()
            const currentIdx = Math.floor(((currentHour + 1) % 24) / 2)
            return SHI_CHEN_NAMES.map((name, i) => {
              const luck = luckArr[i] || '平'
              const isCurrent = i === currentIdx
              const luckColor = luck === '吉' ? 'text-green-400 bg-green-500/10 border-green-500/20' : luck === '凶' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-moonly-text-muted bg-white/5 border-white/10'
              return (
                <div
                  key={name}
                  className={`p-2 rounded-lg border text-xs ${luckColor} ${isCurrent ? 'ring-1 ring-moonly-gold/50' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{name}</span>
                    <span>{luck === '吉' ? '✓' : luck === '凶' ? '✗' : '○'}</span>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </div>
    </div>
  )
}
