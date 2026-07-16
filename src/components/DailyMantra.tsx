'use client'

import { useMemo, memo } from 'react'

const DAILY_MANTRAS = [
  { text: '嗡嘛呢叭咪吽', emoji: '🙏', meaning: '观音菩萨心咒，慈悲为怀。' },
  { text: '嗡阿吽', emoji: '✨', meaning: '三字总持咒，净化身心。' },
  { text: '南无阿弥陀佛', emoji: '🌟', meaning: '念佛往生，一心不乱。' },
  { text: '嗡班扎萨埵吽', emoji: '💎', meaning: '金刚萨埵心咒，忏悔业障。' },
  { text: '嗡嘛呢叭咪吽', emoji: '❤️', meaning: '六字大明咒，普度众生。' },
  { text: '嗡达咧嘟达咧嘟咧梭哈', emoji: '🌸', meaning: '绿度母心咒，救度苦难。' },
  { text: '嗡阿惹巴扎那谛', emoji: '📚', meaning: '文殊菩萨心咒，开启智慧。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🕊️', meaning: '慈悲咒，心怀善念。' },
  { text: '嗡啊吽班扎咕噜贝玛悉地吽', emoji: '🔮', meaning: '莲花生大士心咒，加持护佑。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🌈', meaning: '慈悲为怀，广结善缘。' },
  { text: '南无阿弥陀佛', emoji: '⭐', meaning: '佛号念诵，功德无量。' },
  { text: '嗡嘛呢叭咪吽', emoji: '💫', meaning: '慈悲喜舍，四无量心。' },
  { text: '嗡阿吽', emoji: '☀️', meaning: '身口意净化，三密相应。' },
  { text: '嗡班扎萨埵吽', emoji: '🌊', meaning: '忏悔业障，清净身心。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🌙', meaning: '慈悲夜咒，安眠护佑。' },
  { text: '嗡达咧嘟达咧嘟咧梭哈', emoji: '🍃', meaning: '救度咒，脱离苦难。' },
  { text: '嗡阿惹巴扎那谛', emoji: '💡', meaning: '智慧咒，开启明悟。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🔥', meaning: '慈悲火咒，烧尽烦恼。' },
  { text: '嗡啊吽班扎咕噜贝玛悉地吽', emoji: '⛰️', meaning: '加持咒，稳固修行。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🌺', meaning: '慈悲花咒，花开见佛。' },
  { text: '南无阿弥陀佛', emoji: '🦋', meaning: '往生咒，极乐净土。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🌻', meaning: '慈悲阳咒，光明普照。' },
  { text: '嗡阿吽', emoji: '❄️', meaning: '净化咒，冰清玉洁。' },
  { text: '嗡班扎萨埵吽', emoji: '⚡', meaning: '忏悔雷咒，震醒迷途。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🌏', meaning: '慈悲地咒，普度众生。' },
  { text: '嗡达咧嘟达咧嘟咧梭哈', emoji: '🌈', meaning: '救度虹咒，彩虹桥渡。' },
  { text: '嗡阿惹巴扎那谛', emoji: '📖', meaning: '智慧书咒，博学多闻。' },
  { text: '嗡嘛呢叭咪吽', emoji: '🎵', meaning: '慈悲音咒，梵音悦耳。' },
  { text: '嗡啊吽班扎咕噜贝玛悉地吽', emoji: '🏔️', meaning: '加持山咒，稳如泰山。' },
  { text: '嗡嘛呢叭咪吽', emoji: '💎', meaning: '慈悲宝咒，珍宝无量。' },
]

function getDailyMantra(): typeof DAILY_MANTRAS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return DAILY_MANTRAS[dayOfYear % DAILY_MANTRAS.length]
}

function DailyMantra() {
  const mantra = useMemo(() => getDailyMantra(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🕉️</span>
        <h3 className="text-gold text-sm font-semibold">每日咒语</h3>
      </div>

      <div className="text-center py-3">
        <div className="w-16 h-16 rounded-full bg-gold/10 mx-auto mb-3 flex items-center justify-center text-3xl">
          {mantra.emoji}
        </div>
        <p className="text-gold font-medium text-lg mb-2">{mantra.text}</p>
        <p className="text-white/60 text-sm">{mantra.meaning}</p>
      </div>
    </div>
  )
}

export default memo(DailyMantra)
