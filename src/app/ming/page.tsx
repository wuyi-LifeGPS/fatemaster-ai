'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { showToast } from '@/components/Toast'
import Link from 'next/link'
import { getProfiles, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, calculateDaYun, getWuXing, getShiShen, getCangGan, getYinYang, SHI_SHEN_MAP, DaYunInfo } from '@/lib/bazi'
import useKeyboard from '@/hooks/useKeyboard'
import PullToRefresh from '@/components/PullToRefresh'
import { FavoriteButton } from '@/components/FavoriteButton'
import CopyButton from '@/components/CopyButton'
import LunarDateDisplay from '@/components/LunarDateDisplay'
import DailyYiJi from '@/components/DailyYiJi'
import SolarTermDisplay from '@/components/SolarTermDisplay'
import ZodiacFortune from '@/components/ZodiacFortune'
import LuckyColor from '@/components/LuckyColor'
import LuckyHours from '@/components/LuckyHours'
import DailyQuote from '@/components/DailyQuote'
import WuxingEnergy from '@/components/WuxingEnergy'
import DirectionGuide from '@/components/DirectionGuide'
import LuckyNumbers from '@/components/LuckyNumbers'
import FengShuiTip from '@/components/FengShuiTip'
import HealthTip from '@/components/HealthTip'
import WeeklyFortune from '@/components/WeeklyFortune'
import HoroscopeWidget from '@/components/HoroscopeWidget'
import TarotDaily from '@/components/TarotDaily'
import MeditationTimer from '@/components/MeditationTimer'
import GratitudeJournal from '@/components/GratitudeJournal'
import DreamJournal from '@/components/DreamJournal'
import HabitTracker from '@/components/HabitTracker'
import CountdownWidget from '@/components/CountdownWidget'
import DailyPoem from '@/components/DailyPoem'
import DailyTrivia from '@/components/DailyTrivia'
import DailyWisdom from '@/components/DailyWisdom'
import DailyProverb from '@/components/DailyProverb'
import DailyJoke from '@/components/DailyJoke'
import DailyChallenge from '@/components/DailyChallenge'

import DailyTip from '@/components/DailyTip'
import RecentVisits from '@/components/RecentVisits'
import QuickShortcuts from '@/components/QuickShortcuts'
import ShareButton from '@/components/ShareButton'
import LiunianTab from './components/LiunianTab'
import LiuyueTab from './components/LiuyueTab'
import LiuriTab from './components/LiuriTab'

// ===== 常量 =====
const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80', '火': '#f87171', '土': '#fbbf24', '金': '#e2e8f0', '水': '#60a5fa',
}
const TABS = [
  { key: 'mingpan', label: '命盘' },
  { key: 'dayun', label: '大运' },
  { key: 'liunian', label: '年运' },
  { key: 'liuyue', label: '月运' },
  { key: 'liuri', label: '日运' },
] as const
type TabKey = typeof TABS[number]['key']

const ZODIAC_EMOJI: Record<string, string> = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐲', '蛇': '🐍',
  '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}
const SHISHEN_EMOJI: Record<string, string> = {
  '正印': '👩‍🦰', '偏印': '🤓', '正官': '👨‍💼', '七杀': '⚔️',
  '正财': '💰', '偏财': '🎰', '比肩': '🤝', '劫财': '🏴‍☠️',
  '食神': '😋', '伤官': '😤',
}

// ===== 工具函数 =====
function getAge(birthYear: number) { return new Date().getFullYear() - birthYear }
function formatDate(p: BaziProfile) {
  const type = p.isLunar ? '农历' : '公历'
  return `${type}${p.year}年${p.month}月${p.day}日 ${p.birthTimeLabel}出生`
}
function getZodiac(year: number) {
  return ['猴','鸡','狗','猪','鼠','牛','虎','兔','龙','蛇','马','羊'][year % 12]
}
function getZodiacEmoji(year: number) { return ZODIAC_EMOJI[getZodiac(year)] || '🐷' }
function getConstellation(month: number, day: number) {
  const dates = [20,19,21,20,21,22,23,23,23,24,23,22]
  const signs = ['摩羯座','水瓶座','双鱼座','白羊座','金牛座','双子座','巨蟹座','狮子座','处女座','天秤座','天蝎座','射手座']
  return day < dates[month-1] ? signs[month-1] : signs[month % 12]
}
function getWuXingText(gan: string, zhi: string) { return getWuXing(gan) + getWuXing(zhi) }

function countShiShen(pillars: any[], dayMaster: string) {
  const counts: Record<string, number> = { '正印':0,'偏印':0,'正官':0,'七杀':0,'正财':0,'偏财':0,'比肩':0,'劫财':0,'食神':0,'伤官':0 }
  pillars.forEach((p, i) => {
    if (i !== 2) { const ss = getShiShen(dayMaster, p.gan); if (counts[ss] !== undefined) counts[ss]++ }
  })
  pillars.forEach(p => {
    getCangGan(p.zhi).forEach(gan => { const ss = SHI_SHEN_MAP[dayMaster]?.[gan]; if (ss && counts[ss] !== undefined) counts[ss]++ })
  })
  return counts
}

// ===== 弹窗辅助组件 =====
function ModalBigNumber({ value, unit, label }: { value: string; unit?: string; label?: string }) {
  return (
    <div className="py-3">
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-bold text-white">{value}</span>
        {unit && <span className="text-xl text-white/50">{unit}</span>}
      </div>
      {label && <p className="text-xs text-moonly-muted mt-1">{label}</p>}
    </div>
  )
}

function ModalStatGrid({ items }: { items: { value: string; label: string; sub?: string }[] }) {
  return (
    <div className="grid grid-cols-4 gap-2 mt-4">
      {items.map((item, i) => (
        <div key={i} className="text-center p-2 rounded-xl bg-white/5">
          <div className="text-white font-semibold text-base">{item.value}</div>
          <div className="text-xs text-moonly-muted mt-0.5">{item.label}</div>
          {item.sub && <div className="text-xs text-moonly-muted">{item.sub}</div>}
        </div>
      ))}
    </div>
  )
}

function ModalCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 mt-3">
      {title && <div className="text-gold text-sm font-semibold mb-2">{title}</div>}
      {children}
    </div>
  )
}

// ===== 详细内容生成 =====
function getModuleDetail(moduleId: string, data: any, profile: BaziProfile): { title: string; subtitle?: string; content: React.ReactNode } {
  const { pillars, dayMaster, bodyStrength, pattern, tiaoHou, wuXingFullCount } = data

  switch (moduleId) {
    case 'bazi': {
      const baziStr = pillars.map((p: any) => p.gan + p.zhi).join(' ')
      return {
        title: '八字排盘',
        subtitle: baziStr,
        content: (
          <div className="space-y-3">
            <ModalBigNumber value="8" unit="字" label={`${profile.name}的八字命盘`} />
            <div className="space-y-2">
              {pillars.map((p: any, i: number) => {
                const labels = ['年柱（祖上根基）', '月柱（父母兄弟）', '日柱（夫妻宫）', '时柱（子女晚年）']
                return (
                  <ModalCard key={i} title={labels[i]}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: `${WUXING_COLOR[getWuXing(p.gan)]}20`, color: WUXING_COLOR[getWuXing(p.gan)] }}>{p.gan}</div>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold" style={{ background: `${WUXING_COLOR[getWuXing(p.zhi)]}20`, color: WUXING_COLOR[getWuXing(p.zhi)] }}>{p.zhi}</div>
                      <div className="text-white/50 text-base">
                        <div>天干{getWuXing(p.gan)} · 地支{getWuXing(p.zhi)}</div>
                        <div className="text-white/30">藏干：{getCangGan(p.zhi).join('、')}</div>
                      </div>
                    </div>
                  </ModalCard>
                )
              })}
            </div>
            <ModalCard title="四柱含义">
              <p className="text-white/60 text-sm leading-relaxed">
                年柱代表祖上根基与早年运势；月柱代表父母兄弟与青年运；日柱（日干为日主）代表自身与配偶；时柱代表子女与晚年运势。
                四柱合参，方能全面论断命主一生吉凶祸福。
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'summary': {
      const wx = getWuXing(dayMaster)
      const midAge = Math.max(30, getAge(profile.year) + 5)
      return {
        title: '人生总评',
        subtitle: `${dayMaster}${wx}命 · ${bodyStrength?.strength || '——'}`,
        content: (
          <div className="space-y-3">
            <ModalCard title="命格概述">
              <p className="text-white/70 text-sm leading-relaxed">
                此命日主为<span className="text-gold font-semibold">{dayMaster}{wx}</span>，{getYinYang(dayMaster)}性，
                属"{pattern?.patternName || '普通'}"之格局。{bodyStrength?.strength === '强' ? '早年主顺遂，才华横溢，能担财官显贵。' : bodyStrength?.strength === '偏弱' ? '早年主磨砺，需借助印星、比劫之力方能成事。' : '早年主平稳，能屈能伸，进退有度。'}
              </p>
            </ModalCard>
            <ModalStatGrid items={[
              { value: `${getAge(profile.year)}`, label: '当前年龄', sub: '岁' },
              { value: `${midAge}`, label: '中年转运', sub: '岁后' },
              { value: pattern?.patternName?.split('/')[0]?.trim() || '——', label: '命格' },
              { value: bodyStrength?.strength || '——', label: '身强身弱' },
            ]} />
            <ModalCard title="运势周期">
              <div className="space-y-2 text-sm text-white/60">
                <p><span className="text-gold">早年（1-30岁）</span>：{bodyStrength?.strength === '强' ? '学业顺利，才华初显' : bodyStrength?.strength === '偏弱' ? '积累磨砺，厚积薄发' : '平稳发展，循序渐进'}</p>
                <p><span className="text-gold">中年（{midAge}-60岁）</span>：事业渐入佳境，大运转入{wx === '金' || wx === '水' ? '火土' : '金水'}之地。</p>
                <p><span className="text-gold">晚年（60岁后）</span>：{tiaoHou?.tiaoHouGod?.join('、') || '贵人'}为用神，福禄双全，安享天伦。</p>
              </div>
            </ModalCard>
          </div>
        )
      }
    }
    case 'wuxing': {
      const wxItems = [
        { label: '金', color: '#e2e8f0', key: '金', organ: '肺、大肠', nature: '肃杀、收敛', dir: '西方', season: '秋季' },
        { label: '木', color: '#4ade80', key: '木', organ: '肝、胆', nature: '生发、条达', dir: '东方', season: '春季' },
        { label: '水', color: '#60a5fa', key: '水', organ: '肾、膀胱', nature: '滋润、下行', dir: '北方', season: '冬季' },
        { label: '火', color: '#f87171', key: '火', organ: '心、小肠', nature: '温热、上升', dir: '南方', season: '夏季' },
        { label: '土', color: '#fbbf24', key: '土', organ: '脾、胃', nature: '生化、承载', dir: '中央', season: '四季' },
      ]
      const total = Object.values(wuXingFullCount || {}).reduce((a: number, b: unknown) => a + ((b as number) || 0), 0) || 1
      const maxItem = wxItems.reduce((max, item) => (wuXingFullCount?.[item.key] || 0) > (wuXingFullCount?.[max.key] || 0) ? item : max, wxItems[0])
      const minItem = wxItems.reduce((min, item) => (wuXingFullCount?.[item.key] || 0) < (wuXingFullCount?.[min.key] || 0) ? item : min, wxItems[0])
      return {
        title: '五行能量',
        subtitle: `${maxItem.label}最旺 · ${minItem.label}偏弱`,
        content: (
          <div className="space-y-3">
            <ModalStatGrid items={wxItems.map(item => ({
              value: `${wuXingFullCount?.[item.key] || 0}`,
              label: item.label,
              sub: `${Math.round(((wuXingFullCount?.[item.key] || 0) / total) * 100)}%`
            }))} />
            <ModalCard title="五行分布">
              <div className="space-y-3">
                {wxItems.map(item => {
                  const val = wuXingFullCount?.[item.key] || 0
                  const pct = Math.round((val / total) * 100)
                  return (
                    <div key={item.key}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold" style={{ color: item.color }}>{item.label}</span>
                        <span className="text-xs text-moonly-muted">{val} · {pct}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.max(pct, 5)}%`, backgroundColor: item.color }} />
                      </div>
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-moonly-muted">脏腑：{item.organ}</span>
                        <span className="text-xs text-moonly-muted">方位：{item.dir}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ModalCard>
            <ModalCard title="健康建议">
              <p className="text-white/60 text-sm leading-relaxed">
                {maxItem.label}偏旺，需注意{maxItem.organ.split('、')[0]}系统健康；
                {minItem.label}偏弱，建议在生活中多补充{minItem.label}属性元素，如多接触{minItem.dir}方、{minItem.season}相关的颜色与环境。
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'rizhu': {
      const wx = getWuXing(dayMaster)
      const personality = wx === '金' ? '刚毅果断、重义气、讲原则，有领导力，但易固执。' : wx === '木' ? '仁慈正直、有上进心、善于规划，但易优柔寡断。' : wx === '水' ? '聪明机智、善于变通、有谋略，但易多疑。' : wx === '火' ? '热情开朗、积极向上、有感染力，但易冲动。' : '稳重踏实、诚信可靠、有耐心，但易保守。'
      return {
        title: '日主详解',
        subtitle: `${dayMaster}${wx} · ${getYinYang(dayMaster)}性`,
        content: (
          <div className="space-y-3">
            <div className="text-center py-2">
              <span className="text-6xl font-bold" style={{ color: WUXING_COLOR[wx] }}>{dayMaster}</span>
              <p className="text-gold text-lg mt-1">{wx} · {getYinYang(dayMaster)}性</p>
            </div>
            <ModalStatGrid items={[
              { value: dayMaster, label: '日干' },
              { value: wx, label: '五行' },
              { value: getYinYang(dayMaster), label: '阴阳' },
              { value: pillars[1].zhi, label: '月令' },
            ]} />
            <ModalCard title="性格特征">
              <p className="text-white/70 text-sm leading-relaxed">{personality}</p>
            </ModalCard>
            <ModalCard title="生于{pillars[1].zhi}月">
              <p className="text-white/60 text-sm leading-relaxed">
                月令{pillars[1].zhi}，五行属{getWuXing(pillars[1].zhi)}，
                {getWuXing(pillars[1].zhi) === wx ? '与日主同气，得月令生扶，日主有力。' : getWuXing(pillars[1].zhi) === '土' && wx === '金' ? '土生金，得月令相生，日主得助。' : `月令五行${getWuXing(pillars[1].zhi)}与日主${wx}关系需结合全局分析。`}
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'geju':
      return {
        title: '格局详解',
        subtitle: pattern?.patternName || '——',
        content: (
          <div className="space-y-3">
            <div className="text-center py-2">
              <span className="text-4xl font-bold text-gold">{pattern?.patternName?.split('/')[0]?.trim() || '——'}</span>
            </div>
            <ModalStatGrid items={[
              { value: pattern?.monthBenQi || '——', label: '月令本气' },
              { value: pattern?.monthBenQiShiShen || '——', label: '对应十神' },
              { value: pattern?.patternType || '——', label: '格局类型' },
              { value: bodyStrength?.strength || '——', label: '身强身弱' },
            ]} />
            <ModalCard title="格局说明">
              <p className="text-white/70 text-sm leading-relaxed">{pattern?.patternDesc || '格局分析加载中...'}</p>
            </ModalCard>
            <ModalCard title="喜忌分析">
              <div className="space-y-2 text-sm text-white/60">
                <p><span className="text-gold">喜神</span>：{pattern?.usefulGod?.join('、') || '根据具体组合分析'}</p>
                <p><span className="text-white/40">忌神</span>：{pattern?.avoidGod?.join('、') || '根据具体组合分析'}</p>
              </div>
            </ModalCard>
          </div>
        )
      }
    case 'shenruo': {
      const score = bodyStrength?.score || 0
      const maxScore = 10
      const pct = Math.round((score / maxScore) * 100)
      return {
        title: '身强身弱',
        subtitle: `${bodyStrength?.strength || '——'} · 得分 ${score}/${maxScore}`,
        content: (
          <div className="space-y-3">
            <ModalBigNumber value={`${score}`} unit={`/${maxScore}`} label={bodyStrength?.strength || ''} />
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold" style={{ width: `${pct}%` }} />
            </div>
            <ModalStatGrid items={[
              { value: `${bodyStrength?.monthScore || 0}`, label: '月令得分', sub: '权重最大' },
              { value: `${bodyStrength?.rootScore || 0}`, label: '地支根气' },
              { value: `${bodyStrength?.ganScore || 0}`, label: '天干得分' },
              { value: `${bodyStrength?.helperGan?.length || 0}`, label: '帮身之神' },
            ]} />
            <ModalCard title="判断依据">
              <p className="text-white/60 text-sm leading-relaxed">
                身强身弱主要看三方面：月令对日主的生扶（得分{bodyStrength?.monthScore || 0}）、
                地支藏干的根气（得分{bodyStrength?.rootScore || 0}）、
                天干对日主的生扶（得分{bodyStrength?.ganScore || 0}）。
                总分{score}分，{score >= 7 ? '身强，能担财官，宜克泄耗。' : score <= 3 ? '身弱，需印比帮身，宜生扶。' : '中和，宜顺势而行。'}
              </p>
            </ModalCard>
            <ModalCard title="调候建议">
              <p className="text-white/60 text-sm leading-relaxed">{bodyStrength?.description || ''}</p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'xiyongshen': {
      const gods = tiaoHou?.tiaoHouGod || []
      return {
        title: '喜用神',
        subtitle: gods.join('、') || '——',
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 py-3">
              {gods.map((god: string, i: number) => (
                <div key={i} className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: `${WUXING_COLOR[getWuXing(god)]}20`, color: WUXING_COLOR[getWuXing(god)] }}>
                  {getWuXing(god)}
                </div>
              ))}
            </div>
            <ModalStatGrid items={[
              { value: tiaoHou?.climate || '——', label: '命局气候' },
              { value: gods[0] || '——', label: '首选用神' },
              { value: gods[1] || '——', label: '次选用神' },
              { value: pattern?.avoidGod?.[0] || '——', label: '主要忌神' },
            ]} />
            <ModalCard title="调候说明">
              <p className="text-white/60 text-sm leading-relaxed">{tiaoHou?.tiaoHouReason || ''}</p>
            </ModalCard>
            <ModalCard title="用神建议">
              <div className="space-y-2 text-sm text-white/60">
                <p>生活中可多接触{gods.map((g: string) => getWuXing(g)).join('、')}属性的元素：</p>
                <p className="text-white/40">· 颜色：{gods.map((g: string) => getWuXing(g) === '金' ? '白色、金色' : getWuXing(g) === '木' ? '绿色、青色' : getWuXing(g) === '水' ? '黑色、蓝色' : getWuXing(g) === '火' ? '红色、紫色' : '黄色、棕色').join('、')}</p>
                <p className="text-white/40">· 方位：{gods.map((g: string) => getWuXing(g) === '金' ? '西方' : getWuXing(g) === '木' ? '东方' : getWuXing(g) === '水' ? '北方' : getWuXing(g) === '火' ? '南方' : '中央').join('、')}</p>
              </div>
            </ModalCard>
          </div>
        )
      }
    }
    case 'shishen': {
      const counts = countShiShen(pillars, dayMaster)
      const shishenDesc: Record<string, string> = {
        '正印': '代表母亲、学业、贵人、庇护，主聪明、善良、有涵养。',
        '偏印': '代表偏门学识、灵感、独创性，主机智、敏感、有才艺。',
        '正官': '代表丈夫（女命）、上司、名誉，主正直、负责、守规矩。',
        '七杀': '代表偏夫（女命）、压力、竞争，主果断、有魄力、敢冒险。',
        '正财': '代表妻子（男命）、正当收入，主务实、节俭、重信用。',
        '偏财': '代表父亲、意外之财，主慷慨、善交际、有商业头脑。',
        '比肩': '代表兄弟姐妹、朋友，主独立、自信、有主见。',
        '劫财': '代表竞争对手、破耗，主果断、好胜，但易冲动。',
        '食神': '代表子女、才华、福气，主温和、聪慧、有口福。',
        '伤官': '代表创造力、表现力，主聪明、好胜，但易傲慢。',
      }
      const sorted = Object.entries(counts).sort((a, b) => (b[1] as number) - (a[1] as number))
      const top3 = sorted.slice(0, 3)
      return {
        title: '十神详解',
        subtitle: `最旺${top3[0]?.[0] || '——'} · 次旺${top3[1]?.[0] || '——'}`,
        content: (
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(counts).map(([name, count]) => (
                <div key={name} className="flex flex-col items-center gap-0.5 p-2 rounded-xl bg-white/5">
                  <span className="text-xl">{SHISHEN_EMOJI[name]}</span>
                  <span className="text-xs text-moonly-muted">{name}</span>
                  <span className="text-gold text-sm font-semibold">{count}个</span>
                </div>
              ))}
            </div>
            <ModalCard title="十神分布分析">
              <p className="text-white/60 text-sm leading-relaxed">
                命局最旺<span className="text-gold">{top3[0]?.[0]}</span>（{top3[0]?.[1]}个），
                次旺<span className="text-gold">{top3[1]?.[0]}</span>（{top3[1]?.[1]}个），
                {top3[2]?.[0]}（{top3[2]?.[1]}个）。
                整体十神{Object.values(counts).filter(v => v > 0).length >= 8 ? '分布均衡' : '略有偏颇'}，人生方向明确。
              </p>
            </ModalCard>
            {top3.map(([name, count], i) => (
              <ModalCard key={name} title={`${i + 1}. ${name} ${SHISHEN_EMOJI[name]} (${count}个)`}>
                <p className="text-white/60 text-sm leading-relaxed">{shishenDesc[name]}</p>
              </ModalCard>
            ))}
          </div>
        )
      }
    }
    case 'career': {
      const dirs = getCareerDirection(data)
      const careerMap: Record<string, { industries: string; traits: string }> = {
        '金': { industries: '金融、法律、机械、珠宝、军警、外科医生', traits: '果断、严谨、重规则' },
        '木': { industries: '教育、文化、出版、园林、中医、宗教', traits: '仁慈、有规划、善沟通' },
        '水': { industries: '物流、旅游、贸易、演艺、侦探、心理咨询', traits: '机智、善变、有谋略' },
        '火': { industries: '餐饮、能源、光学、美容、传媒、电子', traits: '热情、积极、有感染力' },
        '土': { industries: '房地产、建筑、农业、矿产、仓储、古董', traits: '稳重、诚信、有耐心' },
      }
      return {
        title: '事业方向',
        subtitle: `五行属${dirs.join('、')}的行业有利`,
        content: (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 py-2">
              {dirs.map((dir, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold" style={{ background: `${WUXING_COLOR[dir]}20`, color: WUXING_COLOR[dir] }}>{dir}</div>
                  <p className="text-xs text-moonly-muted mt-1">{careerMap[dir]?.traits}</p>
                </div>
              ))}
            </div>
            <ModalCard title="推荐行业">
              <div className="space-y-2">
                {dirs.map((dir, i) => (
                  <div key={i} className="p-2 rounded-lg bg-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" style={{ color: WUXING_COLOR[dir] }}>五行属{dir}</span>
                    </div>
                    <p className="text-xs text-moonly-muted">{careerMap[dir]?.industries}</p>
                  </div>
                ))}
              </div>
            </ModalCard>
            <ModalCard title="事业建议">
              <p className="text-white/60 text-sm leading-relaxed">
                选择与自己五行相生的行业，能够事半功倍。同时，结合自身兴趣与专业能力，方能长远发展。
                {dirs.includes(getWuXing(dayMaster)) ? `日主属${getWuXing(dayMaster)}，从事同类五行行业可得天时地利。` : `日主属${getWuXing(dayMaster)}，从事${dirs.join('、')}属性行业可得生扶之力。`}
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'wealth': {
      const trend = getWealthTrend(data, profile)
      const wealthLevel = trend.label === '中晚年发迹' ? 85 : trend.label === '稳扎稳打' ? 70 : 55
      return {
        title: '财运走势',
        subtitle: trend.label,
        content: (
          <div className="space-y-3">
            <ModalBigNumber value={`${wealthLevel}`} unit="%" label={trend.description} />
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold" style={{ width: `${wealthLevel}%` }} />
            </div>
            <ModalStatGrid items={[
              { value: trend.label, label: '整体趋势' },
              { value: pattern?.patternType === '正财' || pattern?.patternType === '偏财' ? '偏旺' : '平稳', label: '财星状态' },
              { value: bodyStrength?.strength === '强' ? '能担' : '需谨慎', label: '担财能力' },
              { value: '中晚年', label: '最佳时期' },
            ]} />
            <ModalCard title="财运分析">
              <p className="text-white/60 text-sm leading-relaxed">
                {pattern?.patternType === '正财' || pattern?.patternType === '偏财'
                  ? '财星旺相，适合投资理财，但需注意风险控制，不宜贪多冒进。'
                  : '财运平稳，建议稳健理财，量入为出，积少成多。'}
                大运流年遇财星透出，或行至财旺之地，为求财最佳时机。
              </p>
            </ModalCard>
            <ModalCard title="理财建议">
              <div className="space-y-2 text-sm text-white/60">
                <p>· {bodyStrength?.strength === '强' ? '身强能担财，可适当进取投资' : '身弱需谨慎，以稳健储蓄为主'}</p>
                <p>· 财星为{pattern?.patternType || '正财'}，正财主稳定收入，偏财主意外之财</p>
                <p>· 避免在忌神年份进行大额投资</p>
              </div>
            </ModalCard>
          </div>
        )
      }
    }
    case 'love': {
      const score = getLoveScore(data, profile)
      return {
        title: '感情分析',
        subtitle: `${score}分 · ${score >= 70 ? '桃花旺盛' : score >= 50 ? '平稳' : '多磨'}`,
        content: (
          <div className="space-y-3">
            <ModalBigNumber value={`${score}`} unit="分" label={score >= 70 ? '感情顺遂，异性缘佳' : score >= 50 ? '感情平稳，需主动经营' : '感情多磨，宜晚婚'} />
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-pink-500/60 to-pink-400" style={{ width: `${score}%` }} />
            </div>
            <ModalStatGrid items={[
              { value: profile.gender === '男' ? '正财/偏财' : '正官/七杀', label: '配偶星' },
              { value: pillars[2]?.zhi || '——', label: '夫妻宫' },
              { value: isChong(pillars[2]?.zhi, pillars[1]?.zhi) ? '有冲' : '安稳', label: '婚姻宫' },
              { value: score >= 70 ? '顺遂' : score >= 50 ? '平稳' : '多磨', label: '感情运势' },
            ]} />
            <ModalCard title="感情特征">
              <p className="text-white/60 text-sm leading-relaxed">
                {profile.gender === '男'
                  ? `正财为妻星，偏财为情人星。${score >= 70 ? '财星得力，妻子贤淑，感情美满。' : '财星状态一般，需用心经营感情。'}`
                  : `正官为夫星，七杀为偏夫星。${score >= 70 ? '官星得力，丈夫有能力，婚姻和谐。' : '官星状态一般，择偶需谨慎。'}`}
              </p>
            </ModalCard>
            <ModalCard title="婚姻建议">
              <p className="text-white/60 text-sm leading-relaxed">
                日支{pillars[2]?.zhi}为夫妻宫，{isChong(pillars[2]?.zhi, pillars[1]?.zhi) ? '夫妻宫与月令相冲，婚姻中需注意沟通与包容。' : '夫妻宫安稳，婚姻较为和谐，但仍需用心经营。'}
                {score < 50 ? '建议晚婚，先立业后成家，待运势好转后再考虑婚姻大事。' : '适婚年龄可主动寻觅良缘，把握正缘时机。'}
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    case 'health': {
      const score = getHealthScore(data)
      const wxHealth: Record<string, { organ: string; advice: string; color: string }> = {
        '金': { organ: '肺、大肠、呼吸系统', advice: '多吃白色食物，如银耳、百合、白萝卜', color: '#e2e8f0' },
        '木': { organ: '肝、胆、眼睛、筋络', advice: '多吃绿色食物，如菠菜、芹菜、绿豆', color: '#4ade80' },
        '水': { organ: '肾、膀胱、生殖系统', advice: '多吃黑色食物，如黑豆、黑芝麻、海带', color: '#60a5fa' },
        '火': { organ: '心、小肠、血液循环', advice: '多吃红色食物，如红枣、西红柿、红豆', color: '#f87171' },
        '土': { organ: '脾、胃、消化系统', advice: '多吃黄色食物，如南瓜、玉米、黄豆', color: '#fbbf24' },
      }
      const counts = Object.entries(wuXingFullCount || {}).sort((a, b) => (a[1] as number) - (b[1] as number))
      const weakWx = counts[0]?.[0] || '土'
      const strongWx = counts[counts.length - 1]?.[0] || '火'
      return {
        title: '健康分析',
        subtitle: `${score}分 · ${score >= 70 ? '体质良好' : score >= 50 ? '一般' : '偏弱'}`,
        content: (
          <div className="space-y-3">
            <ModalBigNumber value={`${score}`} unit="分" label={score >= 70 ? '体质较好，注意保养' : score >= 50 ? '体质一般，需加强锻炼' : '体质偏弱，注意调养'} />
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-green-500/60 to-green-400" style={{ width: `${score}%` }} />
            </div>
            <ModalStatGrid items={[
              { value: wxHealth[weakWx].organ.split('、')[0], label: '需注意', sub: weakWx },
              { value: wxHealth[strongWx].organ.split('、')[0], label: '较强', sub: strongWx },
              { value: bodyStrength?.strength || '——', label: '体质' },
              { value: score >= 70 ? '良好' : score >= 50 ? '一般' : '偏弱', label: '健康指数' },
            ]} />
            <ModalCard title="体质分析">
              <p className="text-white/60 text-sm leading-relaxed">
                五行<span style={{ color: WUXING_COLOR[weakWx] }}>{weakWx}</span>偏弱，
                需注意{wxHealth[weakWx].organ}方面的健康。
                五行<span style={{ color: WUXING_COLOR[strongWx] }}>{strongWx}</span>偏旺，
                {strongWx === '火' ? '心火易旺，需注意情绪管理。' : strongWx === '水' ? '肾气充足，但易寒凉。' : strongWx === '木' ? '肝气旺盛，易急躁。' : strongWx === '金' ? '肺气充足，但易干燥。' : '脾胃功能较强，但易湿热。'}
              </p>
            </ModalCard>
            <ModalCard title="养生建议">
              <p className="text-white/60 text-sm leading-relaxed">
                {wxHealth[weakWx].advice}，有助于补充{weakWx}气。
                同时注意作息规律，避免熬夜，适当运动，保持心情愉悦。
                建议定期进行{wxHealth[weakWx].organ.split('、')[0]}方面的体检。
              </p>
            </ModalCard>
          </div>
        )
      }
    }
    default:
      return { title: '详细说明', content: <p className="text-xs text-moonly-muted">详细内容加载中...</p> }
  }
}

function isChong(zhi1: string, zhi2: string): boolean {
  const chong: Record<string, string> = { '子': '午', '午': '子', '丑': '未', '未': '丑', '寅': '申', '申': '寅', '卯': '酉', '酉': '卯', '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳' }
  return chong[zhi1] === zhi2
}

function getCareerDirection(data: any): string[] {
  const { tiaoHou, pattern } = data
  const gods = tiaoHou?.tiaoHouGod || []
  const directions: string[] = []
  gods.forEach((g: string) => { const wx = getWuXing(g); if (wx && !directions.includes(wx)) directions.push(wx) })
  if (directions.length === 0) directions.push('木', '火')
  return directions.slice(0, 2)
}

function getWealthTrend(data: any, profile: BaziProfile) {
  const { pattern, bodyStrength } = data
  if (pattern?.patternType === '正财' || pattern?.patternType === '偏财') return { label: '中晚年发迹', description: '财星当令，中年后财源广进' }
  if (bodyStrength?.strength === '强') return { label: '稳扎稳打', description: '身强能担财，财运平稳上升' }
  return { label: '厚积薄发', description: '先积后扬，中年后转运' }
}

function getLoveScore(data: any, profile: BaziProfile): number {
  const { pillars, dayMaster } = data
  let score = 50
  if (profile.gender === '男') {
    if (pillars.some((p: any) => { const ss = getShiShen(dayMaster, p.gan); return ss === '正财' || ss === '偏财' })) score += 15
  } else {
    if (pillars.some((p: any) => { const ss = getShiShen(dayMaster, p.gan); return ss === '正官' || ss === '七杀' })) score += 15
  }
  if (pillars[2]?.zhi && pillars[1]?.zhi && isChong(pillars[2].zhi, pillars[1].zhi)) score -= 10
  return Math.min(100, Math.max(20, score))
}

function getHealthScore(data: any): number {
  const { bodyStrength, wuXingFullCount } = data
  let score = 60
  if (bodyStrength?.strength === '中和') score += 15
  const counts = Object.values(wuXingFullCount || {}) as number[]
  if (counts.length && Math.max(...counts) - Math.min(...counts) <= 2) score += 10
  return Math.min(100, Math.max(30, score))
}

function getDimensionStars(daYun: DaYunInfo, gender: '男' | '女') {
  const score = daYun.score, ss = daYun.shiShen
  const base = Math.min(5, Math.max(1, Math.round(score / 20)))
  let career = base, love = base, wealth = base, health = base
  if (['正官', '七杀'].includes(ss)) career = Math.min(5, career + 1)
  if (['比肩', '劫财'].includes(ss)) career = Math.max(1, career - 1)
  if (gender === '男' && ['正财', '偏财'].includes(ss)) love = Math.min(5, love + 1)
  if (gender === '女' && ['正官', '七杀'].includes(ss)) love = Math.min(5, love + 1)
  if (['伤官', '劫财'].includes(ss)) love = Math.max(1, love - 1)
  if (['正财', '偏财', '食神'].includes(ss)) wealth = Math.min(5, wealth + 1)
  if (['正印', '偏印', '比肩'].includes(ss)) wealth = Math.max(1, wealth - 1)
  if (['正印', '偏印'].includes(ss)) health = Math.min(5, health + 1)
  if (['七杀', '伤官'].includes(ss)) health = Math.max(1, health - 1)
  return { career, love, wealth, health }
}

function getDayunDescription(daYun: DaYunInfo, dayMaster: string) {
  const { ganZhi, shiShen, score, keywords } = daYun
  const wx = getWuXing(daYun.gan)
  let desc = `进入${ganZhi}运，天干${shiShen}透出，五行属${wx}。`
  if (score >= 80) desc += `此运整体运势极佳，${keywords.slice(0, 2).join('、')}，机遇良多，宜积极把握。`
  else if (score >= 65) desc += `此运运势良好，${keywords.slice(0, 2).join('、')}，稳步发展，适合积累与布局。`
  else if (score >= 45) desc += `此运运势平稳，需稳扎稳打，注意${keywords[0] || '细节'}，以守为攻。`
  else if (score >= 30) desc += `此运挑战较多，${keywords[0] || '需谨慎'}，宜守不宜攻，避免冒进。`
  else desc += `此运较为艰难，需格外谨慎，以稳为主，静待时机。`
  return desc
}

function getFortuneLabel(level: string) {
  const map: Record<string, string> = { '大吉': '大吉', '吉': '吉', '平': '平', '凶': '凶', '大凶': '大凶' }
  return map[level] || '平'
}

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return <span className="inline-flex gap-0.5">{Array.from({ length: max }).map((_, i) => <span key={i} className={i < count ? 'text-gold' : 'text-white/20'}>★</span>)}</span>
}

// ===== 底部弹窗组件 =====
function BottomSheet({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  useKeyboard({ onEscape: onClose })
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const startYRef = useRef(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDragY(0)
  }, [title])

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const sheet = sheetRef.current
    if (!sheet) return
    // 只有当触摸在顶部区域（handle 或 header）或者在内容顶部滚动位置为0时才允许拖动
    const rect = sheet.getBoundingClientRect()
    const scrollTop = sheet.querySelector('.bottom-sheet-body')?.scrollTop || 0
    if (touch.clientY - rect.top < 80 || scrollTop <= 0) {
      setIsDragging(true)
      startYRef.current = touch.clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const deltaY = e.touches[0].clientY - startYRef.current
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (dragY > 120) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div
        ref={sheetRef}
        className="bottom-sheet"
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bottom-sheet-handle" />
        <div className="bottom-sheet-header flex items-center justify-center relative py-2">
          <div className="text-center">
            <span className="text-gold font-semibold text-base">{title}</span>
            {subtitle && <p className="text-xs text-moonly-muted mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="bottom-sheet-body">{children}</div>
      </div>
    </>
  )
}

// ===== 主组件 =====
export default function MingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('mingpan')
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [baziData, setBaziData] = useState<any>(null)
  const [daYunData, setDaYunData] = useState<DaYunInfo[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalModule, setModalModule] = useState<string | null>(null)

  useEffect(() => {
    const list = getProfiles()
    setProfiles(list)
    if (list[0]) setCurrentId(list[0].id)
    setLoading(false)
    
    // 读取 URL tab 参数
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab') as TabKey
      if (tab && ['mingpan', 'dayun', 'liunian', 'liuyue', 'liuri'].includes(tab)) {
        setActiveTab(tab)
      }
    }
  }, [])

  useEffect(() => {
    if (!currentId) return
    const profile = profiles.find(p => p.id === currentId)
    if (!profile) return
    const birthDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`
    const birthTime = `${String(profile.hour).padStart(2, '0')}:00`
    try { setBaziData(calculateBazi(birthDate, birthTime)) } catch (e) { console.error(e) }
  }, [currentId, profiles])

  useEffect(() => {
    if (!baziData || !currentId) return
    const profile = profiles.find(p => p.id === currentId)
    if (!profile) return
    const birthDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`
    const gender = profile.gender === '男' ? 'male' : 'female'
    try {
      const dayun = calculateDaYun(baziData.pillars[0].gan, baziData.pillars[1].gan, baziData.pillars[1].zhi, baziData.dayMaster, gender, birthDate, baziData.pillars)
      setDaYunData(dayun)
    } catch (e) { console.error(e) }
  }, [baziData, currentId, profiles])

  const currentProfile = useMemo(() => profiles.find(p => p.id === currentId), [profiles, currentId])

  // 下拉刷新
  const handleRefresh = async () => {
    const list = getProfiles()
    setProfiles(list)
    // 重新触发 baziData 和 daYunData 的计算
    if (currentId && list.find(p => p.id === currentId)) {
      setBaziData(null)
      setDaYunData(null)
      // 短暂延迟让 React 重新渲染 effect
      await new Promise(r => setTimeout(r, 50))
      const profile = list.find(p => p.id === currentId)
      if (profile) {
        const birthDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`
        const birthTime = `${String(profile.hour).padStart(2, '0')}:00`
        try { setBaziData(calculateBazi(birthDate, birthTime)) } catch (e) { console.error(e) }
      }
    }
  }

  const modalContent = useMemo(() => {
    if (!modalModule || !baziData || !currentProfile) return null
    return getModuleDetail(modalModule, baziData, currentProfile)
  }, [modalModule, baziData, currentProfile])

  if (!loading && profiles.length === 0) return <EmptyState />
  if (!currentProfile) return null

  return (
    <div className="min-h-screen moonly-bg moonly-content animate-fade-in relative">
      <ProfileHeader 
        profile={currentProfile} 
        baziData={baziData} 
        profiles={profiles}
        currentId={currentId}
        onSwitchProfile={setCurrentId}
      />

      <div className="px-4 pt-2">
        <LunarDateDisplay />
      </div>

      <PullToRefresh onRefresh={handleRefresh}>
        <QuickShortcuts />
        <RecentVisits />
        <DailyTip />
        <DailyYiJi />
        <SolarTermDisplay />
        <ZodiacFortune />
        <LuckyColor />
        <LuckyHours />
        <DailyQuote />
        <WuxingEnergy />
        <DirectionGuide />
        <LuckyNumbers />
        <FengShuiTip />
        <HealthTip />
        <WeeklyFortune />
        <HoroscopeWidget />
        <TarotDaily />
        <MeditationTimer />
        <GratitudeJournal />
        <DreamJournal />
        <HabitTracker />
        <CountdownWidget />
        <DailyPoem />
        <DailyTrivia />
        <DailyWisdom />
        <DailyProverb />
        <DailyJoke />
        <DailyChallenge />

        <div className="flex items-center justify-center gap-5 px-4 py-3 border-b border-white/5">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`top-tab text-sm font-medium py-1 relative ${activeTab === tab.key ? 'active' : ''}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 pb-24 space-y-4">
        {activeTab === 'mingpan' && baziData && <MingPanTab data={baziData} profile={currentProfile} onOpenModal={setModalModule} />}
        {activeTab === 'dayun' && daYunData && <DayunTab daYunList={daYunData} profile={currentProfile} dayMaster={baziData?.dayMaster} />}
        {activeTab === 'dayun' && !daYunData && <LoadingTab />}
        {activeTab === 'liunian' && daYunData && <LiunianTab daYunList={daYunData} dayMaster={baziData?.dayMaster} />}
        {activeTab === 'liuyue' && <LiuyueTab dayMaster={baziData?.dayMaster} />}
        {activeTab === 'liuri' && <LiuriTab dayMaster={baziData?.dayMaster} />}
      </div>

      </PullToRefresh>

      {modalContent && (
        <BottomSheet title={modalContent.title} subtitle={modalContent.subtitle} onClose={() => setModalModule(null)}>
          {modalContent.content}
        </BottomSheet>
      )}
    </div>
  )
}

// ===== 子组件 =====

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in relative">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#6b5b95] to-[#1e1c35] flex items-center justify-center mb-6 border border-white/10">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">探索您的命盘</h2>
      <p className="text-moonly-secondary text-sm mb-8 max-w-xs">添加您的出生信息，解锁八字命盘、大运流年、流月流日等完整命理分析</p>
      <Link href="/bazi" className="btn-gold px-8 py-3 text-sm font-semibold">添加我的八字</Link>
      <p className="text-moonly-muted text-sm mt-4">支持保存多个档案：自己、家人、朋友</p>
    </div>
  )
}

function LoadingTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-2 border-[#c9a96e]/30 border-t-[#c9a96e] animate-spin mb-4" />
      <p className="text-moonly-secondary text-sm">正在计算中...</p>
    </div>
  )
}

function ProfileHeader({ profile, baziData, profiles, currentId, onSwitchProfile }: { profile: BaziProfile; baziData: any; profiles: BaziProfile[]; currentId: string | null; onSwitchProfile: (id: string) => void }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const age = getAge(profile.year)
  const zodiacEmoji = getZodiacEmoji(profile.year)
  const zodiac = getZodiac(profile.year)
  const constellation = getConstellation(profile.month, profile.day)
  const wuxingText = baziData?.pillars?.map((p: any) => getWuXingText(p.gan, p.zhi)).join(' ') || ''
  const baziStr = baziData?.pillars?.map((p: any) => p.gan + p.zhi).join(' ') || ''

  // 点击外部关闭下拉
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showDropdown])

  return (
    <div className="px-4 pt-3 pb-2 relative">
      <div className="flex items-center justify-between mb-4">
        <Link href="/" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70"><path d="M15 18l-6-6 6-6" /></svg>
        </Link>
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition"
          >
            <span className="text-white font-medium text-base">{profile.name}</span>
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="rgba(255,255,255,0.5)" 
              strokeWidth="2"
              className={`transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          
          {/* 下拉档案列表 */}
          {showDropdown && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1a1428] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
              <div className="p-2">
                <div className="text-xs text-moonly-muted px-3 py-2">切换档案</div>
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSwitchProfile(p.id)
                      setShowDropdown(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                      p.id === currentId 
                        ? 'bg-[#c9a96e]/15 border border-[#c9a96e]/30' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                      {ZODIAC_EMOJI[getZodiac(p.year)] || '🐷'}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-white text-sm font-medium">{p.name}</div>
                      <div className="text-xs text-moonly-muted">{p.gender} · {getAge(p.year)}岁 · {p.birthTimeLabel}</div>
                    </div>
                    {p.id === currentId && (
                      <div className="w-4 h-4 rounded-full bg-[#c9a96e] flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1428" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="border-t border-white/5 p-2">
                <Link 
                  href="/bazi" 
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-gold text-sm font-medium"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  增加八字
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/bu/bazi-match"
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
            title="八字合婚"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
          <ShareButton
            title={`${profile.name}的八字命盘`}
            text={`姓名：${profile.name}\n出生：${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}\n八字：${baziStr}\n五行：${wuxingText}`}
          />
          <FavoriteButton
            type="profile"
            title={profile.name}
            subtitle={`${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}`}
            data={{ id: profile.id }}
          />
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-3xl mb-3">{zodiacEmoji}</div>
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-white font-semibold text-base">{profile.name}</span>
          <span className="text-xs text-moonly-muted">·</span>
          <span className="text-white/60 text-base">{age}岁</span>
          <span className="text-xs text-moonly-muted">·</span>
          <span className="text-white/60 text-base">{profile.gender}</span>
        </div>
        <div className="text-center space-y-0.5 mb-3">
          <p className="text-sm text-moonly-secondary">{formatDate(profile)}</p>
          <p className="text-xs text-moonly-muted">生肖：{zodiac}{zodiacEmoji} · 星座：{constellation}</p>
          <p className="text-xs text-moonly-muted">八字：{baziStr}</p>
          <p className="text-xs text-moonly-muted">五行：{wuxingText}</p>
        </div>
        <Link href={`/ming/edit?id=${profile.id}`} className="px-5 py-1.5 rounded-full border border-white/15 text-xs text-moonly-muted hover:bg-white/5 transition">修改档案</Link>
      </div>
    </div>
  )
}

function MingPanTab({ data, profile, onOpenModal }: { data: any; profile: BaziProfile; onOpenModal: (id: string) => void }) {
  const { pillars, dayMaster, cangGanDetail, bodyStrength, pattern, tiaoHou, wuXingFullCount } = data
  const baziStr = pillars.map((p: any) => p.gan + p.zhi).join(' ')
  const wuxingText = pillars.map((p: any) => getWuXingText(p.gan, p.zhi)).join(' ')
  const shishenCount = useMemo(() => countShiShen(pillars, dayMaster), [pillars, dayMaster])
  const lifeSummary = useMemo(() => {
    const { dayMaster, bodyStrength, pattern, tiaoHou } = data
    const wx = getWuXing(dayMaster)
    let s = `此命日主为${dayMaster}${wx}，${getYinYang(dayMaster)}性，属"${pattern?.patternName || '普通'}"之格局。`
    if (bodyStrength?.strength === '强') s += '早年主顺遂，才华横溢，能担财官显贵。'
    else if (bodyStrength?.strength === '偏弱') s += '早年主磨砺，需借助印星、比劫之力方能成事。'
    else s += '早年主平稳，能屈能伸，进退有度。'
    s += `中年（${Math.max(30, getAge(profile.year) + 5)}岁后）事业渐入佳境。`
    s += `晚年主安宁，${tiaoHou?.tiaoHouGod?.join('、') || '贵人'}为用神，福禄双全。`
    return s
  }, [data, profile])
  const careerDirs = useMemo(() => getCareerDirection(data), [data])
  const wealthTrend = useMemo(() => getWealthTrend(data, profile), [data, profile])
  const loveScore = useMemo(() => getLoveScore(data, profile), [data, profile])
  const healthScore = useMemo(() => getHealthScore(data), [data])

  return (
    <div className="space-y-4">
      <div onClick={() => onOpenModal('bazi')} className="info-card-black clickable p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gold text-sm font-semibold">八字排盘</h3>
          <CopyButton text={profile.name + '的八字：' + baziStr + '\n五行：' + wuxingText} label="复制" />
        </div>
        <div className="flex gap-2">
          {pillars.map((p: any, i: number) => {
            const labels = ['年柱', '月柱', '日柱', '时柱']
            const isDay = i === 2
            const ss = isDay ? (profile.gender === '男' ? '元男' : '元女') : getShiShen(dayMaster, p.gan)
            const cg = cangGanDetail[i]?.cangGan?.[0]
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <span className="text-xs text-moonly-muted mb-1.5">{labels[i]}</span>
                <div className="w-full rounded-xl bg-black/20 border border-white/5 p-2.5 flex flex-col items-center gap-1.5">
                  <span className="text-xl font-bold" style={{ color: WUXING_COLOR[getWuXing(p.gan)] || '#fff' }}>{p.gan}</span>
                  <span className="text-xl font-bold" style={{ color: WUXING_COLOR[getWuXing(p.zhi)] || '#fff' }}>{p.zhi}</span>
                  {cg && <span className="text-xs text-moonly-muted">{cg.gan}·{cg.shiShen}</span>}
                </div>
                <span className="text-xs text-moonly-muted mt-1">{ss}</span>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-white/5">
          {pillars.map((p: any, i: number) => <span key={i} className="text-xs text-moonly-muted">{p.gan}{p.zhi}{['年','月','日','时'][i]}</span>)}
        </div>
      </div>

      <div onClick={() => onOpenModal('summary')} className="info-card-black clickable p-4 animate-fade-in">
        <h3 className="text-gold text-sm font-semibold mb-2">人生总评</h3>
        <p className="text-sm text-moonly-secondary leading-relaxed">{lifeSummary}</p>
      </div>

      <WuXingBarChart count={wuXingFullCount} onClick={() => onOpenModal('wuxing')} />

      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => onOpenModal('rizhu')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">日主</h3>
          <div className="text-center py-1"><span className="text-2xl font-bold" style={{ color: WUXING_COLOR[getWuXing(dayMaster)] }}>{dayMaster}{getWuXing(dayMaster)}</span></div>
          <p className="text-xs text-moonly-muted leading-relaxed mt-1">{getYinYang(dayMaster)}性之金，主刚毅果断、重义气。</p>
        </div>
        <div onClick={() => onOpenModal('geju')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">格局</h3>
          <div className="text-center py-1"><span className="text-3xl font-bold text-gold">{pattern?.patternName?.split('/')[0]?.trim() || '——'}</span></div>
          <p className="text-xs text-moonly-muted leading-relaxed mt-1">{pattern?.patternDesc || '格局分析加载中...'}</p>
        </div>
      </div>

      <div onClick={() => onOpenModal('shenruo')} className="info-card-black clickable p-4 animate-fade-in">
        <h3 className="text-gold text-sm font-semibold mb-2">身强身弱</h3>
        <div className="flex items-center justify-between mb-2"><span className="text-white font-semibold text-base">{bodyStrength?.strength || '——'}</span><span className="text-xs text-moonly-muted">{Math.round((bodyStrength?.score || 0) * 10)}/10</span></div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold" style={{ width: `${Math.min(100, ((bodyStrength?.score || 0) / 5) * 100)}%` }} /></div>
        <p className="text-xs text-moonly-muted mt-2">{bodyStrength?.description || ''}</p>
      </div>

      <div onClick={() => onOpenModal('xiyongshen')} className="info-card-black clickable p-4 animate-fade-in">
        <h3 className="text-gold text-sm font-semibold mb-2">喜用神</h3>
        <div className="flex items-center gap-3 py-1">
          {tiaoHou?.tiaoHouGod?.map((god: string, i: number) => (
            <span key={i} className="text-2xl font-bold" style={{ color: WUXING_COLOR[getWuXing(god)] }}>{getWuXing(god)}</span>
          ))}
        </div>
        <p className="text-xs text-moonly-muted mt-1">{tiaoHou?.tiaoHouReason || ''}</p>
      </div>

      <ShiShenGrid count={shishenCount} onClick={() => onOpenModal('shishen')} />

      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => onOpenModal('career')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">事业方向</h3>
          <div className="flex items-center gap-2 py-1">{careerDirs.map((dir, i) => <span key={i} className="text-xl font-bold" style={{ color: WUXING_COLOR[dir] }}>{dir}</span>)}</div>
          <p className="text-xs text-moonly-muted">五行属{careerDirs.join('、')}的行业有利</p>
        </div>
        <div onClick={() => onOpenModal('wealth')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">财运走势</h3>
          <div className="text-gold font-semibold text-sm py-0.5">{wealthTrend.label}</div>
          <p className="text-xs text-moonly-muted">{wealthTrend.description}</p>
          <svg viewBox="0 0 100 30" className="w-full h-6 mt-1"><path d="M0 25 Q25 20 50 15 T100 5" fill="none" stroke="#c9a96e" strokeWidth="1.5" /><circle cx="100" cy="5" r="2" fill="#c9a96e" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div onClick={() => onOpenModal('love')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">感情</h3>
          <div className="flex items-baseline gap-1 py-1"><span className="text-3xl font-bold text-gold">{loveScore}</span><span className="text-xs text-moonly-muted">分</span></div>
          <p className="text-xs text-moonly-muted">{loveScore >= 70 ? '感情顺遂，桃花旺盛' : loveScore >= 50 ? '感情平稳，需主动经营' : '感情多磨，宜晚婚'}</p>
        </div>
        <div onClick={() => onOpenModal('health')} className="info-card-black clickable p-4 animate-fade-in">
          <h3 className="text-gold text-sm font-semibold mb-2">健康</h3>
          <div className="flex items-baseline gap-1 py-1"><span className="text-3xl font-bold text-green-400">{healthScore}</span><span className="text-xs text-moonly-muted">分</span></div>
          <p className="text-xs text-moonly-muted">{healthScore >= 70 ? '体质较好，注意保养' : healthScore >= 50 ? '体质一般，需加强锻炼' : '体质偏弱，注意调养'}</p>
        </div>
      </div>
    </div>
  )
}

function WuXingBarChart({ count, onClick }: { count: Record<string, number>; onClick: () => void }) {
  const items = [
    { label: '金', color: '#e2e8f0', key: '金' }, { label: '木', color: '#4ade80', key: '木' },
    { label: '水', color: '#60a5fa', key: '水' }, { label: '火', color: '#f87171', key: '火' },
    { label: '土', color: '#fbbf24', key: '土' },
  ]
  const max = Math.max(...Object.values(count), 1)
  return (
    <div onClick={onClick} className="info-card-black clickable p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">五行能量</h3>
      <div className="space-y-2.5">
        {items.map(item => {
          const val = count[item.key] || 0
          const pct = (val / max) * 100
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-xs text-moonly-muted w-4">{val}</span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden relative"><div className="h-full rounded-full opacity-80" style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: item.color }} /></div>
              <span className="text-xs w-4 text-center" style={{ color: item.color }}>{item.label}</span>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-moonly-muted mt-3 leading-relaxed">【五行能量说明】五行平衡为理想状态，若某行过旺或过弱，则相应五行对应的脏腑或运势可能偏弱。</p>
    </div>
  )
}

function ShiShenGrid({ count, onClick }: { count: Record<string, number>; onClick: () => void }) {
  const items = [
    { key: '正印', label: '正印' }, { key: '正官', label: '正官' }, { key: '正财', label: '正财' },
    { key: '比肩', label: '比肩' }, { key: '食神', label: '食神' }, { key: '偏印', label: '偏印' },
    { key: '七杀', label: '七杀' }, { key: '偏财', label: '偏财' }, { key: '劫财', label: '劫财' },
    { key: '伤官', label: '伤官' },
  ]
  const sorted = Object.entries(count).sort((a, b) => (b[1] as number) - (a[1] as number))
  return (
    <div onClick={onClick} className="info-card-black clickable p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">十神</h3>
      <div className="grid grid-cols-5 gap-2">
        {items.map(item => (
          <div key={item.key} className="flex flex-col items-center gap-0.5">
            <span className="text-xs text-moonly-muted">{item.label}</span>
            <span className="text-xl">{SHISHEN_EMOJI[item.key]}</span>
            <span className="text-xs text-moonly-muted">{count[item.key] || 0}个</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-moonly-muted mt-3 leading-relaxed">
        命局最旺{sorted[0]?.[0] || '食神'}，{sorted[1]?.[0] || '伤官'}次之，整体十神{Object.values(count).filter(v => v > 0).length >= 8 ? '分布均衡' : '略有偏颇'}，人生方向明确。
      </p>
    </div>
  )
}

function DayunTab({ daYunList, profile, dayMaster }: { daYunList: DaYunInfo[]; profile: BaziProfile; dayMaster?: string }) {
  const currentIndex = daYunList.findIndex(d => d.isCurrent)
  const currentDayun = daYunList[currentIndex] || daYunList[0]
  const stars = getDimensionStars(currentDayun, profile.gender)
  return (
    <div className="space-y-4">
      <div className="moonly-card p-4 animate-fade-in">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-5xl font-bold text-gold">{currentDayun.score}</span>
          <span className="text-lg text-[#c9a96e]-light">{getFortuneLabel(currentDayun.fortuneLevel)}</span>
        </div>
        <div className="mb-2"><span className="text-white font-semibold text-lg">{currentDayun.ganZhi}运</span><span className="text-moonly-secondary text-sm ml-2">· {currentDayun.startYear}-{currentDayun.endYear}</span></div>
        <div className="text-moonly-muted text-sm mb-4">第{currentDayun.index}步大运 · {currentDayun.startAge}岁起运</div>
        <div className="space-y-2">
          {(['事业','爱情','财运','健康'] as const).map((label, i) => <div key={label} className="flex items-center justify-between"><span className="text-moonly-secondary text-sm">{label}</span><StarRating count={[stars.career, stars.love, stars.wealth, stars.health][i]} /></div>)}
        </div>
      </div>
      <div className="moonly-card p-4 animate-fade-in">
        <h3 className="text-gold text-sm font-semibold mb-2">大运简述</h3>
        <p className="text-moonly-secondary text-sm leading-relaxed">{dayMaster ? getDayunDescription(currentDayun, dayMaster) : '大运描述加载中...'}</p>
      </div>
      <div className="moonly-card p-4 animate-fade-in">
        <h3 className="text-gold text-sm font-semibold mb-3">大运走势</h3>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div style={{ minWidth: `${Math.max(340, daYunList.length * 72)}px` }}>
            <DayunChart daYunList={daYunList} currentIndex={currentIndex >= 0 ? currentIndex : 0} />
            <div className="flex gap-2 mt-2 pb-2">{daYunList.map((d, i) => (
              <div key={i} className={`shrink-0 w-16 text-center p-2 rounded-lg border ${d.isCurrent ? 'border-[#c9a96e]/40 bg-[#c9a96e]/10' : 'border-white/5 bg-white/5'}`}>
                <div className={`text-xs font-semibold ${d.isCurrent ? 'text-gold' : 'text-white'}`}>{d.ganZhi}</div>
                <div className="text-[10px] text-moonly-muted mt-0.5">{d.startYear}-{d.endYear}</div>
                <div className="text-[10px] text-moonly-muted">{Math.floor(d.startAge)}-{Math.floor(d.endAge)}岁</div>
                <div className={`text-[10px] mt-0.5 font-medium ${d.score >= 65 ? 'text-green-400' : d.score >= 45 ? 'text-slate-400' : 'text-red-400'}`}>{d.score} · {getFortuneLabel(d.fortuneLevel)}</div>
              </div>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DayunChart({ daYunList, currentIndex }: { daYunList: DaYunInfo[]; currentIndex: number }) {
  const width = Math.max(600, daYunList.length * 72), height = 180
  const padding = { top: 20, right: 20, bottom: 35, left: 35 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const points = daYunList.map((d, i) => ({
    x: padding.left + (daYunList.length > 1 ? (i / (daYunList.length - 1)) : 0.5) * chartWidth,
    y: padding.top + (1 - d.score / 100) * chartHeight,
  }))
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const fillPath = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs><linearGradient id="dayunFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(201,169,110,0.2)" /><stop offset="100%" stopColor="rgba(201,169,110,0)" /></linearGradient></defs>
      {[25,50,75].map(y => <line key={y} x1={padding.left} y1={padding.top + (1 - y/100) * chartHeight} x2={width - padding.right} y2={padding.top + (1 - y/100) * chartHeight} stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />)}
      {[0,50,100].map(y => <text key={y} x={padding.left - 5} y={padding.top + (1 - y/100) * chartHeight + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9">{y}</text>)}
      <path d={fillPath} fill="url(#dayunFill)" /><path d={pathD} fill="none" stroke="#c9a96e" strokeWidth="2" />
      {points.map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r={i === currentIndex ? 6 : 3} fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.6)'} stroke={i === currentIndex ? '#fff' : 'none'} strokeWidth={i === currentIndex ? 2 : 0} /><text x={p.x} y={p.y - (i === currentIndex ? 10 : 8)} textAnchor="middle" fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.5)'} fontSize={i === currentIndex ? '11' : '9'} fontWeight={i === currentIndex ? 'bold' : 'normal'}>{daYunList[i].score}</text></g>)}
      {daYunList.map((d, i) => <text key={i} x={points[i].x} y={height - 10} textAnchor="middle" fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.4)'} fontSize="9" fontWeight={i === currentIndex ? 'bold' : 'normal'}>{d.ganZhi}</text>)}
    </svg>
  )
}


