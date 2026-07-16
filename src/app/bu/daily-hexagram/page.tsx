'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const HEXAGRAMS = [
  { name: '乾', meaning: '天', desc: '元亨利贞，大吉之象。', advice: '宜进取，宜领导，不宜退缩。' },
  { name: '坤', meaning: '地', desc: '厚德载物，柔顺之象。', advice: '宜包容，宜辅佐，不宜争执。' },
  { name: '屯', meaning: '水雷', desc: '万物始生，艰难之象。', advice: '宜坚持，宜积累，不宜冒进。' },
  { name: '蒙', meaning: '山水', desc: '童蒙求我，启蒙之象。', advice: '宜学习，宜请教，不宜自满。' },
  { name: '需', meaning: '水天', desc: '密云不雨，等待之象。', advice: '宜等待，宜准备，不宜急躁。' },
  { name: '讼', meaning: '天水', desc: '慎讼终吉，争讼之象。', advice: '宜和解，宜退让，不宜争讼。' },
  { name: '师', meaning: '地水', desc: '贞丈人吉，行险之象。', advice: '宜团结，宜纪律，不宜散乱。' },
  { name: '比', meaning: '水地', desc: '比之自内，亲比之象。', advice: '宜合作，宜亲和，不宜孤立。' },
  { name: '小畜', meaning: '风天', desc: '密云不雨，小有蓄积。', advice: '宜积蓄，宜等待，不宜大动。' },
  { name: '履', meaning: '天泽', desc: '履虎尾，不咥人，亨。', advice: '宜谨慎，宜礼貌，不宜冒犯。' },
  { name: '泰', meaning: '天地', desc: '小往大来，通泰之象。', advice: '宜进取，宜交流，不宜闭塞。' },
  { name: '否', meaning: '地天', desc: '大往小来，否塞之象。', advice: '宜守成，宜等待，不宜妄动。' },
  { name: '同人', meaning: '天火', desc: '同人于野，亨通之象。', advice: '宜合作，宜交友，不宜孤僻。' },
  { name: '大有', meaning: '火天', desc: '元亨，大有之象。', advice: '宜分享，宜节制，不宜骄傲。' },
  { name: '谦', meaning: '地山', desc: '亨，君子有终。', advice: '宜谦虚，宜退让，不宜张扬。' },
  { name: '豫', meaning: '雷地', desc: '利建侯行师，豫悦之象。', advice: '宜预防，宜准备，不宜懈怠。' },
  { name: '随', meaning: '泽雷', desc: '元亨利贞，随顺之象。', advice: '宜随和，宜适应，不宜固执。' },
  { name: '蛊', meaning: '山风', desc: '元亨，振蛊之象。', advice: '宜改革，宜创新，不宜守旧。' },
  { name: '临', meaning: '地泽', desc: '元亨利贞，临莅之象。', advice: '宜监督，宜指导，不宜放任。' },
  { name: '观', meaning: '风地', desc: '盥而不荐，观瞻之象。', advice: '宜观察，宜思考，不宜盲从。' },
  { name: '噬嗑', meaning: '火雷', desc: '亨，利用狱，咬合之象。', advice: '宜果断，宜执行，不宜犹豫。' },
  { name: '贲', meaning: '山火', desc: '亨小利，文饰之象。', advice: '宜修饰，宜包装，不宜浮夸。' },
  { name: '剥', meaning: '山地', desc: '不利有攸往，剥落之象。', advice: '宜退守，宜保全，不宜进取。' },
  { name: '复', meaning: '地雷', desc: '亨，出入无疾，复返之象。', advice: '宜回归，宜反省，不宜冒进。' },
  { name: '无妄', meaning: '天雷', desc: '元亨利贞，无妄之象。', advice: '宜真诚，宜自然，不宜虚伪。' },
  { name: '大畜', meaning: '山天', desc: '利贞，不家食吉，大畜之象。', advice: '宜积蓄，宜准备，不宜消耗。' },
  { name: '颐', meaning: '山雷', desc: '贞吉，自求口实，颐养之象。', advice: '宜养生，宜自养，不宜依赖。' },
  { name: '大过', meaning: '泽风', desc: '栋桡，大过之象。', advice: '宜谨慎，宜补救，不宜大意。' },
  { name: '坎', meaning: '水', desc: '维心亨，习坎之象。', advice: '宜坚定，宜信心，不宜恐惧。' },
  { name: '离', meaning: '火', desc: '利贞亨，离明之象。', advice: '宜光明，宜智慧，不宜阴暗。' },
  { name: '咸', meaning: '泽山', desc: '亨利贞，取女吉，交感之象。', advice: '宜感应，宜沟通，不宜冷漠。' },
  { name: '恒', meaning: '雷风', desc: '亨无咎，利贞，恒久之象。', advice: '宜坚持，宜持久，不宜多变。' },
  { name: '遁', meaning: '天山', desc: '亨小利贞，退避之象。', advice: '宜退避，宜等待，不宜对抗。' },
  { name: '大壮', meaning: '雷天', desc: '利贞，大壮之象。', advice: '宜节制，宜谨慎，不宜强横。' },
  { name: '晋', meaning: '火地', desc: '康侯用锡马蕃庶，晋升之象。', advice: '宜进取，宜晋升，不宜退缩。' },
  { name: '明夷', meaning: '地火', desc: '利艰贞，明夷之象。', advice: '宜忍耐，宜韬晦，不宜显露。' },
  { name: '家人', meaning: '风火', desc: '利女贞，家人之象。', advice: '宜家庭，宜和睦，不宜争执。' },
  { name: '睽', meaning: '火泽', desc: '小事吉，乖睽之象。', advice: '宜求同，宜存异，不宜对立。' },
  { name: '蹇', meaning: '水山', desc: '利西南，不利东北，蹇难之象。', advice: '宜等待，宜求助，不宜冒进。' },
  { name: '解', meaning: '雷水', desc: '利西南，无所往，解难之象。', advice: '宜行动，宜解决，不宜拖延。' },
  { name: '损', meaning: '山泽', desc: '有孚，元吉，减损之象。', advice: '宜减损，宜节制，不宜贪婪。' },
  { name: '益', meaning: '风雷', desc: '利有攸往，利涉大川，增益之象。', advice: '宜增益，宜进取，不宜保守。' },
  { name: '夬', meaning: '泽天', desc: '扬于王庭，决去之象。', advice: '宜果断，宜决策，不宜犹豫。' },
  { name: '姤', meaning: '天风', desc: '女壮，勿用取女，遇合之象。', advice: '宜谨慎，宜观察，不宜轻信。' },
  { name: '萃', meaning: '泽地', desc: '亨，王假有庙，萃聚之象。', advice: '宜聚集，宜团结，不宜分散。' },
  { name: '升', meaning: '地风', desc: '元亨，用见大人，上升之象。', advice: '宜上升，宜发展，不宜停滞。' },
  { name: '困', meaning: '泽水', desc: '亨，贞大人吉，困厄之象。', advice: '宜坚持，宜忍耐，不宜放弃。' },
  { name: '井', meaning: '水风', desc: '改邑不改井，井养之象。', advice: '宜守成，宜养护，不宜改变。' },
  { name: '革', meaning: '泽火', desc: '己日乃孚，元亨利贞，变革之象。', advice: '宜改革，宜创新，不宜守旧。' },
  { name: '鼎', meaning: '火风', desc: '元吉亨，鼎新之象。', advice: '宜更新，宜建设，不宜保守。' },
  { name: '震', meaning: '雷', desc: '亨，震来虩虩，震惊之象。', advice: '宜警惕，宜准备，不宜大意。' },
  { name: '艮', meaning: '山', desc: '艮其背，不获其身，止之象。', advice: '宜停止，宜克制，不宜妄动。' },
  { name: '渐', meaning: '风山', desc: '女归吉，渐进之象。', advice: '宜渐进，宜稳步，不宜急躁。' },
  { name: '归妹', meaning: '雷泽', desc: '征凶，无攸利，归妹之象。', advice: '宜谨慎，宜等待，不宜冒进。' },
  { name: '丰', meaning: '雷火', desc: '亨，王假之，丰大之象。', advice: '宜分享，宜节制，不宜骄傲。' },
  { name: '旅', meaning: '火山', desc: '小亨，旅贞吉，旅行之象。', advice: '宜谨慎，宜适应，不宜冒进。' },
  { name: '巽', meaning: '风', desc: '小亨，利有攸往，巽顺之象。', advice: '宜柔顺，宜适应，不宜刚强。' },
  { name: '兑', meaning: '泽', desc: '亨，利贞，悦乐之象。', advice: '宜喜悦，宜交流，不宜忧郁。' },
  { name: '涣', meaning: '风水', desc: '亨，王假有庙，涣散之象。', advice: '宜凝聚，宜团结，不宜分散。' },
  { name: '节', meaning: '水泽', desc: '亨，苦节不可贞，节制之象。', advice: '宜节制，宜适度，不宜极端。' },
  { name: '中孚', meaning: '风泽', desc: '豚鱼吉，中信之象。', advice: '宜诚信，宜真诚，不宜虚伪。' },
  { name: '小过', meaning: '雷山', desc: '亨，利贞，小过之象。', advice: '宜谨慎，宜小心，不宜大意。' },
  { name: '既济', meaning: '水火', desc: '亨小利，初吉终乱，既济之象。', advice: '宜守成，宜谨慎，不宜大意。' },
  { name: '未济', meaning: '火水', desc: '亨，小狐汔济，未济之象。', advice: '宜努力，宜坚持，不宜放弃。' },
]

function getDailyHexagram() {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('daily_hexagram')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.date === today) return parsed.hexagram
  }
  const index = new Date().getDate() % HEXAGRAMS.length
  const hexagram = HEXAGRAMS[index]
  localStorage.setItem('daily_hexagram', JSON.stringify({ date: today, hexagram }))
  return hexagram
}

export default function DailyHexagramPage() {
  const [hexagram, setHexagram] = useState<typeof HEXAGRAMS[0] | null>(null)

  useEffect(() => {
    setHexagram(getDailyHexagram())
  }, [])

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
          <h1 className="text-gold-gradient text-xl font-bold">每日一卦</h1>
          <p className="text-moonly-muted text-xs">周易六十四卦，今日指引</p>
        </div>
      </div>

      {hexagram && (
        <div className="space-y-4 animate-fade-in">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">☯️</div>
            <div className="text-gold text-3xl font-bold mb-2">{hexagram.name}卦</div>
            <div className="text-[#c9a96e] text-sm font-medium mb-3">{hexagram.meaning}</div>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {hexagram.desc}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 今日指引</h3>
            <p className="text-moonly-secondary text-sm leading-relaxed">
              {hexagram.advice}
            </p>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">📅 今日信息</h3>
            <div className="text-moonly-secondary text-sm space-y-1">
              <div>日期：{new Date().toLocaleDateString('zh-CN')}</div>
              <div>农历：{new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</div>
              <div>星期：{new Date().toLocaleDateString('zh-CN', { weekday: 'long' })}</div>
            </div>
          </div>

          <div className="text-center text-moonly-muted text-xs">
            每日一卦，明日更新
          </div>
        </div>
      )}
    </div>
  )
}
