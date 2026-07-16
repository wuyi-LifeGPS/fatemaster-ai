'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProfiles, removeProfile, BaziProfile, setDefaultProfile } from '@/lib/bazi-profiles'

function getAge(year: number): number {
  return new Date().getFullYear() - year
}

function getZodiacIcon(year: number): string {
  const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
  return animals[year % 12]
}

function formatDate(profile: BaziProfile): string {
  const type = profile.isLunar ? '农历' : '阳历'
  return `${type} ${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}`
}

export default function BaziRecordsPage() {
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setProfiles(getProfiles())
  }, [])

  const handleDelete = (id: string) => {
    removeProfile(id)
    setProfiles(getProfiles())
    setShowDeleteId(null)
  }

  const handleSetDefault = (id: string) => {
    setDefaultProfile(id)
    setProfiles(getProfiles())
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 标题 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-gold-gradient text-xl font-bold">八字记录</h1>
        <Link href="/bazi" className="text-gold text-sm flex items-center gap-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          新增
        </Link>
      </div>

      {/* 列表 */}
      {profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <p className="text-moonly-secondary text-sm">暂无八字记录</p>
          <p className="text-moonly-muted text-xs mt-1">点击右上角添加第一个八字</p>
        </div>
      ) : (
        <div className="space-y-3">
          {profiles.map((profile, idx) => (
            <div key={profile.id} className="moonly-card p-4 relative">
              {idx === 0 && (
                <div className="absolute top-2 right-2 text-[10px] text-gold bg-[#c9a96e]/10 px-1.5 py-0.5 rounded">
                  默认
                </div>
              )}
              <div className="flex items-center gap-3">
                {/* 生肖 */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#c9a96e]/20 to-[#c9a96e]/5 border border-[#c9a96e]/30 flex items-center justify-center text-lg font-bold text-gold">
                  {getZodiacIcon(profile.year)}
                </div>

                {/* 信息 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{profile.name}</span>
                    <span className="text-[#c9a96e] text-xs">· {getAge(profile.year)}岁</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${profile.gender === '男' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
                      {profile.gender}
                    </span>
                  </div>
                  <p className="text-moonly-muted text-xs mt-0.5">{formatDate(profile)}</p>
                </div>

                {/* 操作 */}
                <div className="flex items-center gap-1">
                  {idx !== 0 && (
                    <button
                      onClick={() => handleSetDefault(profile.id)}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
                      title="设为默认"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteId(showDeleteId === profile.id ? null : profile.id)}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* 删除确认 */}
              {showDeleteId === profile.id && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                  <span className="text-moonly-muted text-xs">确认删除？</span>
                  <button
                    onClick={() => handleDelete(profile.id)}
                    className="px-3 py-1 rounded bg-red-500/20 text-red-300 text-xs hover:bg-red-500/30 transition"
                  >
                    删除
                  </button>
                  <button
                    onClick={() => setShowDeleteId(null)}
                    className="px-3 py-1 rounded bg-white/5 text-moonly-secondary text-xs hover:bg-white/10 transition"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
