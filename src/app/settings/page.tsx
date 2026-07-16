'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
  analysisStyle: 'detailed' | 'concise' | 'professional'
  includeDailyFortune: boolean
  showTenGods: boolean
  showNaYin: boolean
  language: 'zh' | 'zh-TW'
  theme: 'dark' | 'light' | 'auto'
  enableNotifications: boolean
  dailyFortuneReminder: boolean
  reminderTime: string
}

const defaultSettings: Settings = {
  analysisStyle: 'detailed',
  includeDailyFortune: true,
  showTenGods: true,
  showNaYin: false,
  language: 'zh',
  theme: 'dark',
  enableNotifications: true,
  dailyFortuneReminder: false,
  reminderTime: '08:00',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [saved, setSaved] = useState(false)
  const [clearHistory, setClearHistory] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('lifegps_settings')
    if (stored) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) })
      } catch {
        // ignore parse error
      }
    }
  }, [])

  const update = (key: keyof Settings, value: any) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    localStorage.setItem('lifegps_settings', JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleClearHistory = () => {
    localStorage.removeItem('lifegps-history')
    setClearHistory(true)
    setTimeout(() => setClearHistory(false), 2000)
  }

  const handleExportData = () => {
    const data = {
      profiles: localStorage.getItem('bazi_profiles'),
      history: localStorage.getItem('lifegps-history'),
      settings: localStorage.getItem('lifegps_settings'),
      favorites: localStorage.getItem('meditation_favorites'),
      exportTime: new Date().toISOString(),
      version: '1.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lifegps-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.profiles) localStorage.setItem('bazi_profiles', data.profiles)
        if (data.history) localStorage.setItem('lifegps-history', data.history)
        if (data.settings) localStorage.setItem('lifegps_settings', data.settings)
        if (data.favorites) localStorage.setItem('meditation_favorites', data.favorites)
        alert('数据导入成功！')
        window.location.reload()
      } catch {
        alert('文件格式错误，请导入正确的备份文件')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
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
        <h1 className="text-gold-gradient text-xl font-bold">设置</h1>
      </div>

      {/* 主题设置 */}
      <section className="moonly-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 flex items-center justify-center text-lg">
            🎨
          </div>
          <div>
            <h2 className="text-white font-bold text-base">外观</h2>
            <p className="text-moonly-text-muted text-xs">自定义界面主题</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {([
            { key: 'dark', label: '深色', icon: '🌙' },
            { key: 'light', label: '浅色', icon: '☀️' },
            { key: 'auto', label: '自动', icon: '🔄' },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              onClick={() => update('theme', opt.key)}
              className={`p-3 rounded-xl text-center transition-all border ${
                settings.theme === opt.key
                  ? 'border-moonly-gold bg-moonly-gold/10 text-white'
                  : 'border-white/10 hover:border-white/20 text-white'
              }`}
            >
              <div className="text-2xl mb-1">{opt.icon}</div>
              <div className="font-medium text-sm">{opt.label}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 通知设置 */}
      <section className="moonly-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-teal-500/20 flex items-center justify-center text-lg">
            🔔
          </div>
          <div>
            <h2 className="text-white font-bold text-base">通知</h2>
            <p className="text-moonly-text-muted text-xs">管理每日提醒和推送</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">📱</span>
              <div>
                <div className="text-white text-sm font-medium">启用通知</div>
                <div className="text-moonly-text-muted text-xs">接收每日运势推送</div>
              </div>
            </div>
            <button
              onClick={() => update('enableNotifications', !settings.enableNotifications)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.enableNotifications ? 'bg-moonly-gold' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                  settings.enableNotifications ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">🌅</span>
              <div>
                <div className="text-white text-sm font-medium">每日运势提醒</div>
                <div className="text-moonly-text-muted text-xs">每天早上推送今日运势</div>
              </div>
            </div>
            <button
              onClick={() => update('dailyFortuneReminder', !settings.dailyFortuneReminder)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                settings.dailyFortuneReminder ? 'bg-moonly-gold' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                  settings.dailyFortuneReminder ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          {settings.dailyFortuneReminder && (
            <div className="border-t border-white/10 pt-4">
              <label className="block text-sm text-white mb-2">提醒时间</label>
              <input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => update('reminderTime', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
              />
            </div>
          )}
        </div>
      </section>

      {/* 分析偏好 */}
      <section className="moonly-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a96e]/30 to-moonly-purple/20 flex items-center justify-center text-lg">
            ⚙️
          </div>
          <div>
            <h2 className="text-white font-bold text-base">分析偏好</h2>
            <p className="text-moonly-text-muted text-xs">自定义命盘展示内容和分析风格</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-white mb-3">分析风格</label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { key: 'detailed', label: '详细版', desc: '全面解读' },
                { key: 'concise', label: '简洁版', desc: '快速核心' },
                { key: 'professional', label: '专业版', desc: '术语完整' },
              ] as const).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => update('analysisStyle', opt.key)}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    settings.analysisStyle === opt.key
                      ? 'border-moonly-gold bg-moonly-gold/10 text-white'
                      : 'border-white/10 hover:border-white/20 text-white'
                  }`}
                >
                  <div className="font-medium text-sm">{opt.label}</div>
                  <div className="text-xs text-moonly-text-muted mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-4">
            {[
              { key: 'showTenGods' as const, title: '显示十神信息', desc: '在命盘中标注每个干支的十神关系', icon: '🏷️' },
              { key: 'showNaYin' as const, title: '显示纳音五行', desc: '在四柱下方显示纳音属性（如「海中金」）', icon: '🔔' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="text-white text-sm font-medium">{item.title}</div>
                    <div className="text-moonly-text-muted text-xs">{item.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => update(item.key, !settings[item.key])}
                  className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                    settings[item.key] ? 'bg-moonly-gold' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                      settings[item.key] ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI 服务 */}
      <section className="moonly-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-moonly-purple/30 to-moonly-gold/20 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <h2 className="text-white font-bold text-base">AI 深度分析</h2>
            <p className="text-moonly-text-muted text-xs">智能解读已内置，无需配置</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2">
            <span>✓</span>
            <span>AI 深度分析服务已就绪，所有功能均可直接使用</span>
          </div>
          <p className="text-xs text-moonly-text-muted leading-relaxed">
            系统已内置 Kimi AI 分析能力，八字分析、合婚分析、事业合作等模块均可自动调用 AI 进行深度解读。
          </p>
        </div>
      </section>

      {/* 数据管理 */}
      <section className="moonly-card p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/30 to-rose-500/20 flex items-center justify-center text-lg">
            🗑️
          </div>
          <div>
            <h2 className="text-white font-bold text-base">数据管理</h2>
            <p className="text-moonly-text-muted text-xs">管理本地存储的数据</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">导出数据</div>
              <div className="text-moonly-text-muted text-xs">将所有数据导出为 JSON 文件备份</div>
            </div>
            <button
              onClick={handleExportData}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-moonly-gold/40 text-moonly-gold hover:bg-moonly-gold/10 transition-colors"
            >
              导出
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">导入数据</div>
              <div className="text-moonly-text-muted text-xs">从 JSON 备份文件恢复数据</div>
            </div>
            <label className="px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white hover:bg-white/5 transition-colors cursor-pointer">
              导入
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">清除分析历史</div>
              <div className="text-moonly-text-muted text-xs">删除保存在本地的所有命盘记录，不可恢复</div>
            </div>
            <button
              onClick={handleClearHistory}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                clearHistory
                  ? 'bg-green-400/10 text-green-400 border border-green-400/30'
                  : 'border border-red-400/40 text-red-400 hover:bg-red-400/10'
              }`}
            >
              {clearHistory ? '✓ 已清除' : '清除'}
            </button>
          </div>

          <div className="border-t border-white/10 pt-4 flex items-center justify-between">
            <div>
              <div className="text-white text-sm font-medium">清除所有数据</div>
              <div className="text-moonly-text-muted text-xs">删除所有本地数据，包括档案、历史记录、设置等</div>
            </div>
            <button
              onClick={() => {
                if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
                  localStorage.clear()
                  alert('所有数据已清除')
                  window.location.reload()
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-red-400/40 text-red-400 hover:bg-red-400/10 transition-colors"
            >
              全部清除
            </button>
          </div>
        </div>
      </section>

      {/* 关于 */}
      <section className="moonly-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c9a96e]/30 to-moonly-gold/10 flex items-center justify-center text-lg">
            ℹ️
          </div>
          <div>
            <h2 className="text-white font-bold text-base">关于</h2>
          </div>
        </div>
        <div className="text-sm text-moonly-text-secondary space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">LifeGPS</span>
            <span className="text-moonly-text-muted">·</span>
            <span>AI 命理分析系统 v0.2.0</span>
          </div>
          <p className="text-xs text-moonly-text-muted leading-relaxed">
            融合现代 AI 技术与传统命理智慧，以理性态度传承东方文化。
            八字分析仅供参考，人生方向由自己掌握。
          </p>
          <div className="flex gap-4 text-xs text-moonly-gold pt-2">
            <span>调候用神 · 扶抑辅助</span>
            <span>·</span>
            <span>专业排盘 · AI 解读</span>
          </div>
        </div>
      </section>

      {/* 保存提示 */}
      {saved && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-moonly-gold text-moonly-bg px-6 py-3 rounded-lg shadow-lg text-sm font-medium">
          ✅ 设置已保存
        </div>
      )}
    </div>
  )
}
