'use client'

import { useMemo, useState, memo } from 'react'

const JOKES = [
  { setup: '为什么算命先生总是戴眼镜？', punchline: '因为看相需要看得更清楚。' },
  { setup: '为什么八字大师从不迷路？', punchline: '因为他们知道自己的「大运」在哪里。' },
  { setup: '为什么五行缺木的人喜欢种树？', punchline: '因为想给自己补补「木」。' },
  { setup: '为什么风水师搬家很讲究？', punchline: '因为他们要给自己找个「龙穴」。' },
  { setup: '为什么算命先生说你有「桃花运」？', punchline: '因为你最近总是去买桃花盆栽。' },
  { setup: '为什么八字合婚要看两个人的生辰？', punchline: '因为算命先生说：「合不合，八字说了算。」' },
  { setup: '为什么十二生肖里老鼠排第一？', punchline: '因为它会「鼠」你最厉害！' },
  { setup: '为什么金牛座的人很固执？', punchline: '因为牛的性格就是这样，拉都拉不动。' },
  { setup: '为什么水瓶座的人很聪明？', punchline: '因为脑子里装的都是水，流动得快。' },
  { setup: '为什么天蝎座的人很神秘？', punchline: '因为蝎子的尾巴藏在后面，你看不到。' },
  { setup: '为什么摩羯座的人很勤奋？', punchline: '因为山羊是攀岩高手，一步一个脚印。' },
  { setup: '为什么射手座的人爱自由？', punchline: '因为箭射出去就不会回头。' },
  { setup: '为什么算命先生说你有「财运」？', punchline: '因为你最近总是去捡钱。' },
  { setup: '为什么八字大师看手相？', punchline: '因为手掌上的纹路也是「命」的一部分。' },
  { setup: '为什么风水师总说「左青龙右白虎」？', punchline: '因为左边有龙，右边有虎，谁还敢来？' },
  { setup: '为什么命理师喜欢喝茶？', punchline: '因为「茶」字拆开是「人在草木间」，很符合自然之道。' },
  { setup: '为什么算命先生说你有「官运」？', punchline: '因为你最近总是去做官梦。' },
  { setup: '为什么八字大师从不算错？', punchline: '因为算错了就说「天机不可泄露」。' },
  { setup: '为什么风水师看房子要先看大门？', punchline: '因为「门」是气的入口，气进不来就「没运气」。' },
  { setup: '为什么命理师总说「时机未到」？', punchline: '因为时机到了就不值钱了。' },
]

function getDailyJoke(): typeof JOKES[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return JOKES[dayOfYear % JOKES.length]
}

function DailyJoke() {
  const [showPunchline, setShowPunchline] = useState(false)
  const joke = useMemo(() => getDailyJoke(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">😄</span>
        <h3 className="text-gold text-sm font-semibold">每日一笑</h3>
      </div>

      <div className="text-center py-2">
        <p className="text-white/80 text-sm leading-relaxed mb-3">{joke.setup}</p>
        <button
          onClick={() => setShowPunchline(!showPunchline)}
          className="px-4 py-1.5 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition"
        >
          {showPunchline ? '收起答案' : '揭晓答案'}
        </button>
        {showPunchline && (
          <p className="text-moonly-muted text-sm mt-3 animate-fade-in">{joke.punchline}</p>
        )}
      </div>
    </div>
  )
}

export default memo(DailyJoke)
