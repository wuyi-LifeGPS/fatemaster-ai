import type { DaYunInfo, LiuNianInfo } from './bazi'

// ========== 十神 → 人话映射 ==========
const SHI_SHEN_HUMAN: Record<
  string,
  {
    title: string
    desc: string
    advice: string
    areas: { career: string; wealth: string; love: string; health: string }
  }
> = {
  正官: {
    title: '事业上升期',
    desc: '这十年适合求稳发展，按部就班更容易出成绩',
    advice: '别急着跳槽创业，稳扎稳打反而升得更快',
    areas: {
      career: '适合争取晋升、承担责任',
      wealth: '正财为主，收入稳定',
      love: '长辈介绍的对象更靠谱',
      health: '注意心脏和血压',
    },
  },
  七杀: {
    title: '压力挑战期',
    desc: '这十年压力与机会并存，熬过去就是跃迁',
    advice: '注意身体，重大决策多找信任的人商量',
    areas: {
      career: '攻坚克难，但别硬撑',
      wealth: '偏财有机会，但风险也大',
      love: '感情波动，需耐心经营',
      health: '注意肝脏、神经系统',
    },
  },
  正印: {
    title: '贵人扶持期',
    desc: '这十年容易遇到愿意帮你的人，适合充电学习',
    advice: '多参加培训、考证，贵人在学习和工作中出现',
    areas: {
      career: '适合学习深造、考取证书',
      wealth: '稳定增长，不求暴富',
      love: '贵人介绍良缘',
      health: '注意脾胃消化',
    },
  },
  偏印: {
    title: '灵感爆发期',
    desc: '这十年想法特别多，适合创意类、研究类工作',
    advice: '好想法要落地执行，空想会错过机会',
    areas: {
      career: '创意、策划、研究类工作有突破',
      wealth: '偏门收入增加',
      love: '想法多沟通少，注意表达',
      health: '注意神经系统、睡眠',
    },
  },
  正财: {
    title: '财运稳定期',
    desc: '这十年正财稳定，适合积累财富',
    advice: '稳健理财为主，别碰高风险投资',
    areas: {
      career: '适合财务、会计、管理工作',
      wealth: '收入稳定，适合买房储蓄',
      love: '适合成家，经济基础好',
      health: '注意肠胃消化',
    },
  },
  偏财: {
    title: '意外收获期',
    desc: '这十年偏财运不错，有意外之喜',
    advice: '见好就收，别贪',
    areas: {
      career: '适合销售、投资、副业',
      wealth: '意外之财，但不可依赖',
      love: '桃花旺，但需甄别',
      health: '注意呼吸系统',
    },
  },
  食神: {
    title: '才华绽放期',
    desc: '这十年表达能力、创造力很强',
    advice: '多输出、多展示，才华是这十年最大的资产',
    areas: {
      career: '适合创作、表演、教育',
      wealth: '靠才华变现',
      love: '魅力值高，社交活跃',
      health: '注意消化系统',
    },
  },
  伤官: {
    title: '变革突破期',
    desc: '这十年思维活跃，适合打破常规',
    advice: '创新是好事，但别跟领导/规则硬刚',
    areas: {
      career: '适合创新、技术突破、自由职业',
      wealth: '变革带来新机会',
      love: '言辞犀利，注意沟通方式',
      health: '注意呼吸道、喉咙',
    },
  },
  比肩: {
    title: '合作共赢期',
    desc: '这十年适合跟人合伙干，团队力量大',
    advice: '选对人比选项目更重要',
    areas: {
      career: '适合合伙、团队项目',
      wealth: '共同致富',
      love: '平等互助的感情模式',
      health: '注意肝胆',
    },
  },
  劫财: {
    title: '竞争激烈期',
    desc: '这十年竞争多，要注意守住基本盘',
    advice: '别轻易借贷，重要决策独立判断',
    areas: {
      career: '竞争激烈，需突出差异化',
      wealth: '守住本金，避免借贷',
      love: '防第三者介入',
      health: '注意意外伤灾',
    },
  },
}

// 运势等级 → 整体色调和建议
const FORTUNE_LEVEL_HUMAN: Record<
  string,
  { mood: string; color: string; advice: string }
> = {
  大吉: {
    mood: '整体非常顺',
    color: 'text-red-600',
    advice: '大胆推进，这十年是你的黄金期',
  },
  吉: {
    mood: '整体偏顺',
    color: 'text-amber-600',
    advice: '稳扎稳打，机会比风险多',
  },
  平: {
    mood: '整体平稳',
    color: 'text-blue-600',
    advice: '平平淡淡才是真，做好日常积累',
  },
  凶: {
    mood: '整体偏波折',
    color: 'text-slate-600',
    advice: '谨慎行事，守住就是胜利',
  },
  大凶: {
    mood: '整体较难',
    color: 'text-gray-600',
    advice: '降低预期，熬过去就是成长',
  },
}

// ========== 阶段标签 ==========
export function getDaYunStageLabel(
  index: number,
  fortuneLevel: string
): string {
  if (index <= 2) {
    if (['大吉', '吉'].includes(fortuneLevel)) return '上升期'
    return '积累期'
  }
  if (index <= 4) {
    if (['大吉', '吉'].includes(fortuneLevel)) return '黄金期'
    return '稳定期'
  }
  if (index <= 6) {
    if (['大吉', '吉'].includes(fortuneLevel)) return '收获期'
    return '守成期'
  }
  return '沉淀期'
}

// ========== 大运一句话人话结论 ==========
export function getDaYunHumanSummary(daYun: DaYunInfo): string {
  const s = SHI_SHEN_HUMAN[daYun.shiShen]
  const f = FORTUNE_LEVEL_HUMAN[daYun.fortuneLevel]
  if (!s || !f)
    return `${daYun.ganZhi}运，${f?.mood || '运势一般'}`
  return `${s.title} · ${f.mood} · ${s.desc}`
}

export function getDaYunOneLiner(daYun: DaYunInfo): string {
  const s = SHI_SHEN_HUMAN[daYun.shiShen]
  const f = FORTUNE_LEVEL_HUMAN[daYun.fortuneLevel]
  if (!s || !f) return f?.advice || '顺其自然'
  return `${s.advice} · ${f.advice}`
}

// ========== 大运四维度建议 ==========
export function getDaYunAdvice(daYun: DaYunInfo): {
  career: string
  wealth: string
  love: string
  health: string
} {
  const s = SHI_SHEN_HUMAN[daYun.shiShen]
  if (!s) {
    return {
      career: '适合稳定发展',
      wealth: '稳健理财',
      love: '顺其自然',
      health: '注意日常保养',
    }
  }
  return s.areas
}

// ========== 十神简释 ==========
export function getShiShenSimpleMeaning(shiShen: string): string {
  const map: Record<string, string> = {
    正官: '事业/晋升',
    七杀: '压力/挑战',
    正印: '贵人/学习',
    偏印: '灵感/创意',
    正财: '稳定收入',
    偏财: '意外之财',
    食神: '才华/输出',
    伤官: '变革/突破',
    比肩: '合作/团队',
    劫财: '竞争/守成',
  }
  return map[shiShen] || shiShen
}

// ========== 流年人话 ==========
export function getLiuNianHumanSummary(liuNian: LiuNianInfo): string {
  const s = SHI_SHEN_HUMAN[liuNian.shiShen]
  const moodMap: Record<string, string> = {
    大吉: '非常顺',
    吉: '比较顺',
    平: '平稳',
    凶: '有波折',
    大凶: '需谨慎',
  }
  if (!s) return `${liuNian.ganZhi}年，${moodMap[liuNian.fortuneLevel] || '运势一般'}`
  return `${s.title.replace('期', '')} · ${moodMap[liuNian.fortuneLevel]}`
}

export function getLiuNianOneLiner(liuNian: LiuNianInfo): string {
  const s = SHI_SHEN_HUMAN[liuNian.shiShen]
  if (!s) return '顺其自然'
  return s.advice
}

// ========== 雷达图数据 ==========
export interface RadarData {
  labels: string[]
  values: number[]
}

export function getRadarData(
  currentDaYun: DaYunInfo
): RadarData {
  const s = SHI_SHEN_HUMAN[currentDaYun.shiShen]
  const baseScore = currentDaYun.score

  let career = baseScore
  let wealth = baseScore
  let love = baseScore
  let health = baseScore
  let social = baseScore
  let growth = baseScore

  if (s) {
    const ss = currentDaYun.shiShen
    if (['正官', '七杀'].includes(ss))
      career = Math.min(95, career + 10)
    if (['正印', '偏印'].includes(ss))
      career = Math.max(30, career - 5)
    if (['正财', '偏财'].includes(ss))
      wealth = Math.min(95, wealth + 10)
    if (['正财', '偏财', '食神'].includes(ss))
      love = Math.min(95, love + 5)
    if (['七杀', '伤官'].includes(ss))
      love = Math.max(30, love - 5)
    if (['七杀', '伤官', '劫财'].includes(ss))
      health = Math.max(30, health - 8)
    if (['正印', '正官'].includes(ss))
      health = Math.min(95, health + 5)
    if (['正印', '比肩', '食神'].includes(ss))
      social = Math.min(95, social + 8)
    if (['七杀', '伤官', '劫财'].includes(ss))
      social = Math.max(30, social - 5)
    if (['正印', '偏印', '食神'].includes(ss))
      growth = Math.min(95, growth + 8)
  }

  return {
    labels: ['事业', '财运', '感情', '健康', '人际', '成长'],
    values: [career, wealth, love, health, social, growth],
  }
}
