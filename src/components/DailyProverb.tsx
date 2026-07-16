'use client'

import { useMemo, memo } from 'react'

const PROVERBS = [
  { text: '命里有时终须有，命里无时莫强求。', meaning: '顺应天命，不可强求。' },
  { text: '三十年河东，三十年河西。', meaning: '运势会随时间变化，低谷时不必灰心。' },
  { text: '谋事在人，成事在天。', meaning: '尽力而为，结果由天定。' },
  { text: '吉人自有天相。', meaning: '善良的人会有上天保佑。' },
  { text: '塞翁失马，焉知非福。', meaning: '坏事可能变成好事。' },
  { text: '祸兮福所倚，福兮祸所伏。', meaning: '祸福相依，相互转化。' },
  { text: '天有不测风云，人有旦夕祸福。', meaning: '人生无常，珍惜当下。' },
  { text: '命由己造，福自己求。', meaning: '命运掌握在自己手中。' },
  { text: '积善之家，必有余庆。', meaning: '行善积德，福报后代。' },
  { text: '善有善报，恶有恶报。', meaning: '因果循环，报应不爽。' },
  { text: '滴水之恩，当涌泉相报。', meaning: '感恩图报，不忘恩情。' },
  { text: '种瓜得瓜，种豆得豆。', meaning: '因果报应，自作自受。' },
  { text: '人算不如天算。', meaning: '人再精明，也难逃天意。' },
  { text: '知足常乐，能忍自安。', meaning: '知足者常乐，能忍者自安。' },
  { text: '天道酬勤。', meaning: '勤奋的人终会得到回报。' },
  { text: '有志者事竟成。', meaning: '有决心的人最终会成功。' },
  { text: '千里之行，始于足下。', meaning: '伟大的事业从第一步开始。' },
  { text: '冰冻三尺，非一日之寒。', meaning: '事物的形成需要长期积累。' },
  { text: '吃得苦中苦，方为人上人。', meaning: '经历过磨难才能成就非凡。' },
  { text: '宝剑锋从磨砺出，梅花香自苦寒来。', meaning: '成功需要经历磨练。' },
  { text: '一分耕耘，一分收获。', meaning: '付出多少，收获多少。' },
  { text: '机会总是留给有准备的人。', meaning: '做好准备，才能抓住机会。' },
  { text: '人定胜天。', meaning: '人的努力可以改变命运。' },
  { text: '心诚则灵。', meaning: '心诚则感应，祈求自然灵验。' },
  { text: '信则有，不信则无。', meaning: '信仰的力量在于信念本身。' },
  { text: '风水轮流转。', meaning: '运势会变化，不必过于执着。' },
  { text: '否极泰来。', meaning: '坏到极点就会好转。' },
  { text: '时来运转。', meaning: '时机到来，运势就会转变。' },
  { text: '大难不死，必有后福。', meaning: '经历过劫难后会有福报。' },
  { text: '贵人相助，事半功倍。', meaning: '有贵人帮助，做事更容易成功。' },
]

function getDailyProverb(): typeof PROVERBS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return PROVERBS[dayOfYear % PROVERBS.length]
}

function DailyProverb() {
  const proverb = useMemo(() => getDailyProverb(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">📿</span>
        <h3 className="text-gold text-sm font-semibold">每日谚语</h3>
      </div>

      <div className="text-center py-2">
        <p className="text-white/80 text-sm leading-relaxed mb-2">{proverb.text}</p>
        <p className="text-moonly-muted text-xs">💡 {proverb.meaning}</p>
      </div>
    </div>
  )
}

export default memo(DailyProverb)
