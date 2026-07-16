'use client'

import { useMemo, useState } from 'react'

const TRIVIA = [
  { category: '八字', content: '八字中的「日主」代表命主自己，是整个命盘的核心。' },
  { category: '五行', content: '五行相生：木生火，火生土，土生金，金生水，水生木。' },
  { category: '天干', content: '十天干：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。' },
  { category: '地支', content: '十二地支：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。' },
  { category: '生肖', content: '生肖与地支一一对应：子鼠、丑牛、寅虎、卯兔、辰龙、巳蛇、午马、未羊、申猴、酉鸡、戌狗、亥猪。' },
  { category: '节气', content: '二十四节气是中国古代订立的一种用来指导农事的补充历法。' },
  { category: '命格', content: '八字格局有正官格、七杀格、正财格、偏财格、正印格、偏印格、食神格、伤官格等。' },
  { category: '大运', content: '大运十年一变，是人生运势的重要周期。' },
  { category: '流年', content: '流年即每年的运势，与大运配合可判断当年吉凶。' },
  { category: '冲合', content: '地支六冲：子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲。' },
  { category: '合化', content: '地支三合：申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金。' },
  { category: '十神', content: '十神是根据日干与其他干支的关系来确定的，包括正官、七杀、正印、偏印、正财、偏财、食神、伤官、比肩、劫财。' },
  { category: '喜用神', content: '喜用神是八字中对命主最有利的五行，能补救命局的不足。' },
  { category: '身强身弱', content: '身强指日主有根有气，能担财官；身弱指日主无力，需印比生扶。' },
  { category: '藏干', content: '地支中藏有天干，称为藏干，如寅中藏甲、丙、戊。' },
  { category: '纳音', content: '纳音五行是另一种五行分类法，如甲子乙丑为海中金。' },
  { category: '紫微斗数', content: '紫微斗数是另一种命理体系，以紫微星为主，配合十四主星论断。' },
  { category: '风水', content: '风水学认为环境的气场会影响人的运势，通过调整布局来改善。' },
  { category: '面相', content: '面相学认为人的五官和面部特征可以反映性格和命运。' },
  { category: '手相', content: '手相学通过分析手掌的纹路来预测命运和性格。' },
  { category: '塔罗', content: '塔罗牌起源于中世纪欧洲，共有78张牌，分为大阿卡纳和小阿卡纳。' },
  { category: '星座', content: '西方星座分为黄道十二宫，每个星座对应不同的性格特征。' },
  { category: '易经', content: '《易经》是中国最古老的典籍之一，以八卦推演万物变化。' },
  { category: '奇门遁甲', content: '奇门遁甲是中国古代最高层次的预测学，被称为「帝王之术」。' },
  { category: '六壬', content: '六壬神课是中国古代三大秘术之一，以大六壬课推算吉凶。' },
  { category: '太乙神数', content: '太乙神数是中国古代三大秘术之首，主要用于推算国运。' },
  { category: '梅花易数', content: '梅花易数由邵雍创立，以象数推演，简便灵活。' },
  { category: '铁板神数', content: '铁板神数以生辰八字推算一生，号称「铁版定数」。' },
  { category: '姓名学', content: '姓名学认为名字的笔画和五行会影响人的运势。' },
  { category: '择日', content: '择日学选择吉日良辰进行重要活动，以趋吉避凶。' },
]

function getDailyTrivia(): typeof TRIVIA[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return TRIVIA[dayOfYear % TRIVIA.length]
}

export default function DailyTrivia() {
  const [showMore, setShowMore] = useState(false)
  const trivia = useMemo(() => getDailyTrivia(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💡</span>
          <h3 className="text-gold text-sm font-semibold">命理冷知识</h3>
        </div>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5">
          {trivia.category}
        </span>
      </div>

      <p className="text-white/80 text-sm leading-relaxed mb-2">{trivia.content}</p>

      <button
        onClick={() => setShowMore(!showMore)}
        className="text-xs text-moonly-muted hover:text-white transition"
      >
        {showMore ? '收起更多' : '了解更多'}
      </button>

      {showMore && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {TRIVIA.filter((t) => t.category === trivia.category && t.content !== trivia.content).slice(0, 3).map((t, i) => (
            <div key={i} className="p-2 rounded-lg bg-white/5">
              <p className="text-white/60 text-xs leading-relaxed">{t.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
