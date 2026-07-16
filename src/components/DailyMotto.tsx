'use client'

import { useMemo } from 'react'

const DAILY_MOTTOS = [
  { text: '天行健，君子以自强不息。', author: '《周易》', theme: '奋斗' },
  { text: '地势坤，君子以厚德载物。', author: '《周易》', theme: '包容' },
  { text: '知者不惑，仁者不忧，勇者不惧。', author: '《论语》', theme: '智慧' },
  { text: '己所不欲，勿施于人。', author: '《论语》', theme: '仁德' },
  { text: '学而不思则罔，思而不学则殆。', author: '《论语》', theme: '学习' },
  { text: '三人行，必有我师焉。', author: '《论语》', theme: '谦逊' },
  { text: '千里之行，始于足下。', author: '《道德经》', theme: '行动' },
  { text: '上善若水，水善利万物而不争。', author: '《道德经》', theme: '智慧' },
  { text: '知人者智，自知者明。', author: '《道德经》', theme: '智慧' },
  { text: '大道至简，知易行难。', author: '《道德经》', theme: '修行' },
  { text: '祸兮福之所倚，福兮祸之所伏。', author: '《道德经》', theme: '祸福' },
  { text: '塞翁失马，焉知非福。', author: '《淮南子》', theme: '祸福' },
  { text: '不积跬步，无以至千里。', author: '《荀子》', theme: '积累' },
  { text: '锲而舍之，朽木不折；锲而不舍，金石可镂。', author: '《荀子》', theme: '坚持' },
  { text: '青，取之于蓝，而青于蓝。', author: '《荀子》', theme: '超越' },
  { text: '业精于勤，荒于嬉；行成于思，毁于随。', author: '韩愈', theme: '勤奋' },
  { text: '师者，所以传道授业解惑也。', author: '韩愈', theme: '教育' },
  { text: '古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。', author: '苏轼', theme: '志向' },
  { text: '博观而约取，厚积而薄发。', author: '苏轼', theme: '积累' },
  { text: '不以物喜，不以己悲。', author: '范仲淹', theme: '心态' },
  { text: '先天下之忧而忧，后天下之乐而乐。', author: '范仲淹', theme: '担当' },
  { text: '问渠那得清如许？为有源头活水来。', author: '朱熹', theme: '学习' },
  { text: '纸上得来终觉浅，绝知此事要躬行。', author: '陆游', theme: '实践' },
  { text: '山重水复疑无路，柳暗花明又一村。', author: '陆游', theme: '希望' },
  { text: '宝剑锋从磨砺出，梅花香自苦寒来。', author: '《警世贤文》', theme: '磨砺' },
  { text: '海纳百川，有容乃大；壁立千仞，无欲则刚。', author: '林则徐', theme: '胸怀' },
  { text: '苟利国家生死以，岂因祸福避趋之。', author: '林则徐', theme: '担当' },
  { text: '落红不是无情物，化作春泥更护花。', author: '龚自珍', theme: '奉献' },
  { text: '我劝天公重抖擞，不拘一格降人才。', author: '龚自珍', theme: '人才' },
  { text: '少年易老学难成，一寸光阴不可轻。', author: '朱熹', theme: '珍惜' },
]

function getDailyMotto(): typeof DAILY_MOTTOS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_MOTTOS[dayOfYear % DAILY_MOTTOS.length]
}

export default function DailyMotto() {
  const motto = useMemo(() => getDailyMotto(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <h3 className="text-gold text-sm font-semibold">每日格言</h3>
        </div>
        <span className="text-[10px] text-moonly-muted px-2 py-0.5 rounded-full bg-white/5">
          {motto.theme}
        </span>
      </div>

      <div className="text-center py-2">
        <span className="text-4xl text-white/10 font-serif leading-none">"</span>
        <p className="text-white/80 text-sm leading-relaxed my-2 px-2">{motto.text}</p>
        <p className="text-moonly-muted text-xs">—— {motto.author}</p>
      </div>
    </div>
  )
}
