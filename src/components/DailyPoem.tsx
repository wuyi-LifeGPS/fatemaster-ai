'use client'

import { useMemo, useState, memo } from 'react'

const POEMS = [
  {
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: ['床前明月光，疑是地上霜。', '举头望明月，低头思故乡。'],
    meaning: '以明月寄托思乡之情，意境清幽深远。',
  },
  {
    title: '登鹳雀楼',
    author: '王之涣',
    dynasty: '唐',
    content: ['白日依山尽，黄河入海流。', '欲穷千里目，更上一层楼。'],
    meaning: '登高望远，寓意人生不断追求进步。',
  },
  {
    title: '春晓',
    author: '孟浩然',
    dynasty: '唐',
    content: ['春眠不觉晓，处处闻啼鸟。', '夜来风雨声，花落知多少。'],
    meaning: '春天的清晨，生机盎然，时光易逝。',
  },
  {
    title: '望庐山瀑布',
    author: '李白',
    dynasty: '唐',
    content: ['日照香炉生紫烟，遥看瀑布挂前川。', '飞流直下三千尺，疑是银河落九天。'],
    meaning: '以瀑布的壮丽景象，象征人生的气势磅礴。',
  },
  {
    title: '题西林壁',
    author: '苏轼',
    dynasty: '宋',
    content: ['横看成岭侧成峰，远近高低各不同。', '不识庐山真面目，只缘身在此山中。'],
    meaning: '当局者迷，旁观者清，需跳出局限看问题。',
  },
  {
    title: '观书有感',
    author: '朱熹',
    dynasty: '宋',
    content: ['半亩方塘一鉴开，天光云影共徘徊。', '问渠那得清如许？为有源头活水来。'],
    meaning: '知识不断更新，方能保持清醒明达。',
  },
  {
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元',
    content: ['枯藤老树昏鸦，小桥流水人家，古道西风瘦马。', '夕阳西下，断肠人在天涯。'],
    meaning: '以萧瑟秋景衬托游子的孤独与思乡之情。',
  },
  {
    title: '水调歌头',
    author: '苏轼',
    dynasty: '宋',
    content: ['明月几时有？把酒问青天。', '不知天上宫阙，今夕是何年。'],
    meaning: '对月抒怀，表达对人生和宇宙的哲思。',
  },
  {
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐',
    content: ['千山鸟飞绝，万径人踪灭。', '孤舟蓑笠翁，独钓寒江雪。'],
    meaning: '以孤独垂钓的形象，象征高洁的品格。',
  },
  {
    title: '饮酒',
    author: '陶渊明',
    dynasty: '晋',
    content: ['结庐在人境，而无车马喧。', '问君何能尔？心远地自偏。'],
    meaning: '心静自然凉，远离尘嚣，内心自得安宁。',
  },
]

function getDailyPoem(): typeof POEMS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return POEMS[dayOfYear % POEMS.length]
}

function DailyPoem() {
  const [expanded, setExpanded] = useState(false)
  const poem = useMemo(() => getDailyPoem(), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">📜</span>
          <h3 className="text-gold text-sm font-semibold">每日诗词</h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-moonly-muted text-xs hover:text-white transition"
        >
          {expanded ? '收起' : '展开'}
        </button>
      </div>

      <div className="text-center">
        <p className="text-white font-medium text-base mb-1">{poem.title}</p>
        <p className="text-moonly-muted text-xs mb-3">
          [{poem.dynasty}] {poem.author}
        </p>
        <div className="space-y-1 mb-3">
          {poem.content.map((line, i) => (
            <p key={i} className="text-white/80 text-sm">{line}</p>
          ))}
        </div>
        {expanded && (
          <div className="p-2 rounded-lg bg-white/5 animate-fade-in">
            <p className="text-moonly-muted text-xs leading-relaxed">{poem.meaning}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(DailyPoem)
