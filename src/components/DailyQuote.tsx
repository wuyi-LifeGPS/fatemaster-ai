'use client'

import { useMemo, memo } from 'react'

const DAILY_QUOTES = [
  { text: '命里有时终须有，命里无时莫强求。', author: '《增广贤文》', theme: '命运' },
  { text: '天行健，君子以自强不息。', author: '《周易》', theme: '奋斗' },
  { text: '地势坤，君子以厚德载物。', author: '《周易》', theme: '包容' },
  { text: '命由己造，福自己求。', author: '《了凡四训》', theme: '改命' },
  { text: '积善之家，必有余庆；积不善之家，必有余殃。', author: '《周易》', theme: '因果' },
  { text: '祸兮福之所倚，福兮祸之所伏。', author: '《道德经》', theme: '祸福' },
  { text: '上善若水，水善利万物而不争。', author: '《道德经》', theme: '智慧' },
  { text: '大道至简，知易行难。', author: '《道德经》', theme: '修行' },
  { text: '知人者智，自知者明。', author: '《道德经》', theme: '智慧' },
  { text: '君子和而不同，小人同而不和。', author: '《论语》', theme: '处世' },
  { text: '己所不欲，勿施于人。', author: '《论语》', theme: '仁德' },
  { text: '学而不思则罔，思而不学则殆。', author: '《论语》', theme: '学习' },
  { text: '三人行，必有我师焉。', author: '《论语》', theme: '谦逊' },
  { text: '千里之行，始于足下。', author: '《道德经》', theme: '行动' },
  { text: '天下难事，必作于易；天下大事，必作于细。', author: '《道德经》', theme: '细节' },
  { text: '塞翁失马，焉知非福。', author: '《淮南子》', theme: '祸福' },
  { text: '顺其自然，无为而治。', author: '《道德经》', theme: '无为' },
  { text: '静以修身，俭以养德。', author: '诸葛亮', theme: '修身' },
  { text: '非淡泊无以明志，非宁静无以致远。', author: '诸葛亮', theme: '志向' },
  { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈', theme: '勤奋' },
  { text: '博学之，审问之，慎思之，明辨之，笃行之。', author: '《中庸》', theme: '治学' },
  { text: '君子谋道不谋食。', author: '《论语》', theme: '追求' },
  { text: '不怨天，不尤人，下学而上达。', author: '《论语》', theme: '进取' },
  { text: '穷则独善其身，达则兼济天下。', author: '《孟子》', theme: '担当' },
  { text: '生于忧患，死于安乐。', author: '《孟子》', theme: '警醒' },
  { text: '老吾老，以及人之老；幼吾幼，以及人之幼。', author: '《孟子》', theme: '仁爱' },
  { text: '天时不如地利，地利不如人和。', author: '《孟子》', theme: '人和' },
  { text: '君子泰而不骄，小人骄而不泰。', author: '《论语》', theme: '修养' },
  { text: '见贤思齐焉，见不贤而内自省也。', author: '《论语》', theme: '自省' },
  { text: '温故而知新，可以为师矣。', author: '《论语》', theme: '学习' },
]

function getDailyQuote(): typeof DAILY_QUOTES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length]
}

function DailyQuote() {
  const quote = useMemo(() => getDailyQuote(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <h3 className="text-gold text-sm font-semibold">每日名言</h3>
        </div>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5">
          {quote.theme}
        </span>
      </div>

      <div className="text-center py-2">
        <span className="text-4xl text-white/10 font-serif leading-none">"</span>
        <p className="text-white/80 text-sm leading-relaxed my-2 px-2">{quote.text}</p>
        <p className="text-moonly-muted text-xs">—— {quote.author}</p>
      </div>
    </div>
  )
}

export default memo(DailyQuote)
