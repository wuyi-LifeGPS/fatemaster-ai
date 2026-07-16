'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const ZODIAC_SIGNS = [
  { name: '白羊座', date: '3.21-4.19', icon: '♈', element: '火' },
  { name: '金牛座', date: '4.20-5.20', icon: '♉', element: '土' },
  { name: '双子座', date: '5.21-6.21', icon: '♊', element: '风' },
  { name: '巨蟹座', date: '6.22-7.22', icon: '♋', element: '水' },
  { name: '狮子座', date: '7.23-8.22', icon: '♌', element: '火' },
  { name: '处女座', date: '8.23-9.22', icon: '♍', element: '土' },
  { name: '天秤座', date: '9.23-10.23', icon: '♎', element: '风' },
  { name: '天蝎座', date: '10.24-11.22', icon: '♏', element: '水' },
  { name: '射手座', date: '11.23-12.21', icon: '♐', element: '火' },
  { name: '摩羯座', date: '12.22-1.19', icon: '♑', element: '土' },
  { name: '水瓶座', date: '1.20-2.18', icon: '♒', element: '风' },
  { name: '双鱼座', date: '2.19-3.20', icon: '♓', element: '水' },
]

const HOROSCOPE_TEMPLATES = [
  {
    overview: '今日整体运势平稳，适合按部就班地完成既定计划。',
    love: '感情方面需要多沟通，避免误解。单身者有机会遇到有趣的人。',
    career: '工作上保持专注，不要被琐事分心。下午时段效率较高。',
    wealth: '财运一般，不宜进行大额投资或冲动消费。',
    health: '注意劳逸结合，适当休息有助于恢复精力。',
  },
  {
    overview: '今日运势较旺，适合主动出击，把握机会。',
    love: '感情运势不错，适合表达心意或安排约会。',
    career: '工作上有突破的可能，大胆提出你的想法。',
    wealth: '财运较好，可能有意外收获，但别贪心。',
    health: '精力充沛，适合运动锻炼。',
  },
  {
    overview: '今日运势稍弱，宜静不宜动，保持低调。',
    love: '感情容易有摩擦，多包容对方，避免争执。',
    career: '工作上可能遇到阻碍，耐心解决，不要急躁。',
    wealth: '财运不佳，守住本金，避免借贷。',
    health: '注意休息，避免熬夜，多喝水。',
  },
]

function generateHoroscope(sign: string) {
  const day = new Date().getDate()
  const template = HOROSCOPE_TEMPLATES[day % HOROSCOPE_TEMPLATES.length]
  return {
    ...template,
    luckyNumber: ((day + sign.length) % 9) + 1,
    luckyColor: ['红色', '蓝色', '绿色', '黄色', '紫色', '白色', '黑色', '粉色', '橙色'][day % 9],
  }
}

export default function HoroscopePage() {
  const [selectedSign, setSelectedSign] = useState<string>('')
  const [horoscope, setHoroscope] = useState<ReturnType<typeof generateHoroscope> | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('selected_zodiac')
    if (saved) {
      setSelectedSign(saved)
      setHoroscope(generateHoroscope(saved))
    }
  }, [])

  const handleSelect = (sign: string) => {
    setSelectedSign(sign)
    setHoroscope(generateHoroscope(sign))
    localStorage.setItem('selected_zodiac', sign)
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">星座运势</h1>
          <p className="text-moonly-text-muted text-xs">每日星座运程</p>
        </div>
      </div>

      {/* 星座选择 */}
      {!selectedSign ? (
        <div className="grid grid-cols-3 gap-3">
          {ZODIAC_SIGNS.map((sign) => (
            <button
              key={sign.name}
              onClick={() => handleSelect(sign.name)}
              className="moonly-card p-4 text-center hover:bg-white/5 transition"
            >
              <div className="text-2xl mb-1">{sign.icon}</div>
              <div className="text-white text-sm font-medium">{sign.name}</div>
              <div className="text-moonly-text-muted text-xs">{sign.date}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {/* 已选星座 */}
          <div className="moonly-card p-4 text-center">
            <div className="text-3xl mb-2">{ZODIAC_SIGNS.find(s => s.name === selectedSign)?.icon}</div>
            <div className="text-white text-lg font-bold">{selectedSign}</div>
            <button
              onClick={() => setSelectedSign('')}
              className="text-moonly-gold text-xs mt-2 hover:underline"
            >
              切换星座
            </button>
          </div>

          {horoscope && (
            <>
              {/* 总运 */}
              <div className="moonly-card p-4">
                <h3 className="text-gold text-sm font-semibold mb-2">✨ 整体运势</h3>
                <p className="text-moonly-text-secondary text-sm leading-relaxed">{horoscope.overview}</p>
              </div>

              {/* 分项运势 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="moonly-card p-4">
                  <h4 className="text-pink-400 text-sm font-semibold mb-2">💕 感情</h4>
                  <p className="text-moonly-text-secondary text-xs leading-relaxed">{horoscope.love}</p>
                </div>
                <div className="moonly-card p-4">
                  <h4 className="text-blue-400 text-sm font-semibold mb-2">💼 事业</h4>
                  <p className="text-moonly-text-secondary text-xs leading-relaxed">{horoscope.career}</p>
                </div>
                <div className="moonly-card p-4">
                  <h4 className="text-yellow-400 text-sm font-semibold mb-2">💰 财运</h4>
                  <p className="text-moonly-text-secondary text-xs leading-relaxed">{horoscope.wealth}</p>
                </div>
                <div className="moonly-card p-4">
                  <h4 className="text-green-400 text-sm font-semibold mb-2">🏃 健康</h4>
                  <p className="text-moonly-text-secondary text-xs leading-relaxed">{horoscope.health}</p>
                </div>
              </div>

              {/* 幸运信息 */}
              <div className="moonly-card p-4">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-moonly-text-muted text-xs mb-1">幸运数字</div>
                    <div className="text-gold text-xl font-bold">{horoscope.luckyNumber}</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div className="text-center">
                    <div className="text-moonly-text-muted text-xs mb-1">幸运颜色</div>
                    <div className="text-gold text-xl font-bold">{horoscope.luckyColor}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
