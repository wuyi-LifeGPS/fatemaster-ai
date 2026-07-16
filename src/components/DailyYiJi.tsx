'use client'

import { useMemo } from 'react'

// 简化的每日宜忌数据（基于日期哈希）
const YI_ACTIVITIES = [
  ['祭祀', '祈福', '求嗣', '开光'],
  ['出行', '嫁娶', '搬家', '开业'],
  ['动土', '安葬', '修造', '破土'],
  ['纳采', '订盟', '入学', '交易'],
  ['裁衣', '冠笄', '进人口', '安床'],
  ['入宅', '移徙', '求医', '治病'],
  ['会亲友', '竖柱', '上梁', '开仓'],
]

const JI_ACTIVITIES = [
  ['开市', '立券', '造船', '开池'],
  ['纳畜', '置产', '入殓', '除服'],
  ['成服', '移柩', '安葬', '破土'],
  ['斋醮', '安床', '出货财', '作灶'],
  ['伐木', '掘井', '词讼', '分居'],
  ['赴任', '经络', '栽种', '牧养'],
]

function getDailyYiJi(date: Date): { yi: string[]; ji: string[] } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const yiIndex = dayOfYear % YI_ACTIVITIES.length
  const jiIndex = dayOfYear % JI_ACTIVITIES.length

  return {
    yi: YI_ACTIVITIES[yiIndex],
    ji: JI_ACTIVITIES[jiIndex],
  }
}

export default function DailyYiJi() {
  const { yi, ji } = useMemo(() => getDailyYiJi(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">今日宜忌</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-xs">✓</span>
            <span className="text-green-400 text-xs font-medium">宜</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {yi.map((item) => (
              <span key={item} className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[10px]">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-xs">✗</span>
            <span className="text-red-400 text-xs font-medium">忌</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ji.map((item) => (
              <span key={item} className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px]">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
