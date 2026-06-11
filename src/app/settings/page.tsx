'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
  analysisStyle: 'detailed' | 'concise' | 'professional'
  includeDailyFortune: boolean
  showTenGods: boolean
  showNaYin: boolean
  language: 'zh' | 'zh-TW'
}

const defaultSettings: Settings = {
  analysisStyle: 'detailed',
  includeDailyFortune: true,
  showTenGods: true,
  showNaYin: false,
  language: 'zh',
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

  return (
    <main className="min-h-screen bg-[#0a0e27]">
      {/* Header */}
      <header className="bg-[#121a35] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">设置</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* 分析偏好 */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-lg">
              ⚙️
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">分析偏好</h2>
              <p className="text-xs text-white/40">自定义命盘展示内容和分析风格</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">分析风格</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: 'detailed', label: '详细版', desc: '全面解读' },
                  { key: 'concise', label: '简洁版', desc: '快速核心' },
                  { key: 'professional', label: '专业版', desc: '术语完整' },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => update('analysisStyle', opt.key)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      settings.analysisStyle === opt.key
                        ? 'border-fate-600 bg-white text-fate-800 ring-1 ring-fate-600'
                        : 'border-gray-200 hover:border-fate-400 hover:bg-white/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{opt.label}</div>
                    <div className="text-xs text-white/40 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 space-y-4">
              {[
                { key: 'showTenGods' as const, title: '显示十神信息', desc: '在命盘中标注每个干支的十神关系', icon: '🏷️' },
                { key: 'showNaYin' as const, title: '显示纳音五行', desc: '在四柱下方显示纳音属性（如「海中金」）', icon: '🔔' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-white/40">{item.desc}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => update(item.key, !settings[item.key])}
                    className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                      settings[item.key] ? 'bg-blue-600' : 'bg-ink-200'
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
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-lg">
              🤖
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">AI 深度分析</h2>
              <p className="text-xs text-white/40">智能解读已内置，无需配置</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2">
              <span>✓</span>
              <span>AI 深度分析服务已就绪，所有功能均可直接使用</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              系统已内置 Kimi AI 分析能力，八字分析、合婚分析、事业合作等模块均可自动调用 AI 进行深度解读。
            </p>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-lg">
              🗑️
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">数据管理</h2>
              <p className="text-xs text-white/40">管理本地存储的数据</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">清除分析历史</div>
              <div className="text-xs text-white/40">删除保存在本地的所有命盘记录，不可恢复</div>
            </div>
            <button
              onClick={handleClearHistory}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                clearHistory
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'border border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              {clearHistory ? '✓ 已清除' : '清除'}
            </button>
          </div>
        </section>

        {/* 关于 */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-lg">
              ℹ️
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif">关于</h2>
            </div>
          </div>
          <div className="text-sm text-white/60 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-700">LifeGPS</span>
              <span className="text-white/40">·</span>
              <span>AI 命理分析系统 v0.2.0</span>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              融合现代 AI 技术与传统命理智慧，以理性态度传承东方文化。
              八字分析仅供参考，人生方向由自己掌握。
            </p>
            <div className="flex gap-4 text-xs text-blue-600 pt-2">
              <span>调候用神 · 扶抑辅助</span>
              <span>·</span>
              <span>专业排盘 · AI 解读</span>
            </div>
          </div>
        </section>

        {/* 保存提示 */}
        {saved && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-ink-800 text-white px-6 py-3 rounded-lg shadow-lg text-sm animate-in slide-in-from-bottom-2">
            ✅ 设置已保存
          </div>
        )}
      </div>
    </main>
  )
}
