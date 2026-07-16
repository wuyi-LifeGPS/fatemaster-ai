'use client'

import { useMemo, memo } from 'react'

const DAILY_ZEN = [
  { text: '春有百花秋有月，夏有凉风冬有雪。若无闲事挂心头，便是人间好时节。', author: '无门慧开禅师', theme: '当下' },
  { text: '菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。', author: '六祖慧能', theme: '空性' },
  { text: '身是菩提树，心如明镜台。时时勤拂拭，勿使惹尘埃。', author: '神秀', theme: '修行' },
  { text: '一花一世界，一叶一如来。', author: '《华严经》', theme: '微观' },
  { text: '青青翠竹，尽是法身；郁郁黄花，无非般若。', author: '《景德传灯录》', theme: '自然' },
  { text: '万法归一，一归何处。', author: '赵州从谂', theme: '归一' },
  { text: '吃茶去。', author: '赵州从谂', theme: '平常' },
  { text: '庭前柏树子。', author: '赵州从谂', theme: '指月' },
  { text: '狗子佛性。', author: '赵州从谂', theme: '佛性' },
  { text: '平常心是道。', author: '马祖道一', theme: '平常' },
  { text: '即心即佛。', author: '马祖道一', theme: '心性' },
  { text: '非心非佛。', author: '马祖道一', theme: '超越' },
  { text: '迷时师度，悟了自度。', author: '六祖慧能', theme: '觉悟' },
  { text: '不是风动，不是幡动，仁者心动。', author: '六祖慧能', theme: '心性' },
  { text: '本来无一物，何处惹尘埃。', author: '六祖慧能', theme: '空性' },
  { text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', author: '《金刚经》', theme: '无常' },
  { text: '凡所有相，皆是虚妄。若见诸相非相，即见如来。', author: '《金刚经》', theme: '虚妄' },
  { text: '应无所住而生其心。', author: '《金刚经》', theme: '无住' },
  { text: '色即是空，空即是色。', author: '《心经》', theme: '色空' },
  { text: '不生不灭，不垢不净，不增不减。', author: '《心经》', theme: '中道' },
  { text: '无智亦无得，以无所得故。', author: '《心经》', theme: '无得' },
  { text: '一念愚即般若绝，一念智即般若生。', author: '六祖慧能', theme: '一念' },
  { text: '佛法在世间，不离世间觉。离世觅菩提，恰如求兔角。', author: '六祖慧能', theme: '世间' },
  { text: '不是风动，不是幡动，仁者心动。', author: '六祖慧能', theme: '心动' },
  { text: '菩提只向心觅，何劳向外求玄。', author: '六祖慧能', theme: '向内' },
  { text: '迷人口说，智者心行。', author: '六祖慧能', theme: '行证' },
  { text: '不修禅定，不断烦恼。', author: '《维摩诘经》', theme: '不二' },
  { text: '直心是道场。', author: '《维摩诘经》', theme: '直心' },
  { text: '烦恼即菩提。', author: '《维摩诘经》', theme: '转化' },
  { text: '一即一切，一切即一。', author: '《华严经》', theme: '圆融' },
]

function getDailyZen(): typeof DAILY_ZEN[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_ZEN[dayOfYear % DAILY_ZEN.length]
}

function DailyZen() {
  const zen = useMemo(() => getDailyZen(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🧘</span>
          <h3 className="text-gold text-sm font-semibold">每日禅语</h3>
        </div>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5">
          {zen.theme}
        </span>
      </div>

      <div className="text-center py-2">
        <span className="text-4xl text-white/10 font-serif leading-none">"</span>
        <p className="text-white/80 text-sm leading-relaxed my-2 px-2">{zen.text}</p>
        <p className="text-moonly-muted text-xs">—— {zen.author}</p>
      </div>
    </div>
  )
}

export default memo(DailyZen)
