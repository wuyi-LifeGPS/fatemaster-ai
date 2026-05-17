'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Settings {
  analysisStyle: 'detailed' | 'concise' | 'professional'
  includeDailyFortune: boolean
  showTenGods: boolean
  showNaYin: boolean
  language: 'zh' | 'zh-TW'
  kimiApiKey: string
}

const defaultSettings: Settings = {
  analysisStyle: 'detailed',
  includeDailyFortune: true,
  showTenGods: true,
  showNaYin: false,
  language: 'zh',
  kimiApiKey: '',
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
    <main className="min-h-screen bg-fate-50">
      {/* Header */}
      <header className="bg-ink-900 text-fate-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">设置</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
        {/* AI 设置 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 font-serif">AI 分析设置</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Kimi API Key（可选）</label>
              <input
                type="password"
                value={settings.kimiApiKey}
                onChange={(e) => update('kimiApiKey', e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 text-sm"
              />
              <p className="text-xs text-ink-400 mt-2">
                填写后可获得 AI 深度分析。Key 仅保存在本地浏览器，不会上传到服务器。
                <a href="https://platform.moonshot.cn/" target="_blank" rel="noopener noreferrer" className="text-fate-600 underline">
                  获取 API Key →
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 分析偏好 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 font-serif">分析偏好</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">分析风格</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { key: 'detailed', label: '详细版', desc: '全面解读，适合深入了解' },
                  { key: 'concise', label: '简洁版', desc: '重点突出，快速获取核心' },
                  { key: 'professional', label: '专业版', desc: '术语完整，适合进阶用户' },
                ] as const).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => update('analysisStyle', opt.key)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      settings.analysisStyle === opt.key
                        ? 'border-fate-600 bg-fate-50 text-fate-800'
                        : 'border-fate-200 hover:border-fate-400'
                    }`}
                  >
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-ink-400 mt-1">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">显示十神信息</div>
                <div className="text-sm text-ink-400">在命盘中标注每个干支的十神关系</div>
              </div>
              <button
                onClick={() => update('showTenGods', !settings.showTenGods)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.showTenGods ? 'bg-fate-600' : 'bg-ink-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.showTenGods ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium">显示纳音五行</div>
                <div className="text-sm text-ink-400">在四柱下方显示纳音属性（如「海中金」）</div>
              </div>
              <button
                onClick={() => update('showNaYin', !settings.showNaYin)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.showNaYin ? 'bg-fate-600' : 'bg-ink-200'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.showNaYin ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* 数据管理 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-6 font-serif">数据管理</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">清除分析历史</div>
                <div className="text-sm text-ink-400">删除保存在本地的所有命盘记录</div>
              </div>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
              >
                {clearHistory ? '已清除 ✓' : '清除'}
              </button>
            </div>
          </div>
        </section>

        {/* 关于 */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 font-serif">关于</h2>
          <div className="text-sm text-ink-500 space-y-2">
            <p><span className="font-medium text-ink-700">LifeGPS</span> · AI 命理分析系统</p>
            <p>版本 v0.1.0</p>
            <p className="text-xs text-ink-400 mt-4">
              融合现代 AI 技术与传统命理智慧，以理性态度传承东方文化。
              八字分析仅供参考，人生方向由自己掌握。
            </p>
          </div>
        </section>

        {/* 保存提示 */}
        {saved && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-ink-800 text-white px-6 py-3 rounded-lg shadow-lg text-sm">
            设置已保存
          </div>
        )}
      </div>
    </main>
  )
}
