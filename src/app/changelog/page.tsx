'use client'

import Link from 'next/link'

const CHANGELOG = [
  {
    version: 'v2.0.0',
    date: '2025年7月',
    changes: [
      '全新 moonly 深色主题设计',
      '添加全局搜索功能（Ctrl+K）',
      '添加页面加载进度条',
      '添加页面过渡动画',
      '添加回到顶部按钮',
      '添加网络状态检测',
      '添加错误边界处理',
      '添加 Toast 通知系统',
      '添加 Skeleton 骨架屏',
      '添加最近访问记录',
      '添加快捷入口功能',
      '添加使用统计面板',
      '添加AI对话消息复制功能',
      '优化移动端适配体验',
      '优化SEO meta标签',
      '压缩背景图片资源',
      '添加帮助与反馈页面',
      '添加关于页面',
      '添加隐私政策页面',
      '支持键盘快捷键（ESC关闭弹窗）',
      '添加触觉反馈支持',
      '添加数据版本管理',
    ]
  },
  {
    version: 'v1.5.0',
    date: '2025年6月',
    changes: [
      '添加AI命理师对话功能',
      '添加塔罗占卜',
      '添加铜钱起卦',
      '添加梅花易数',
      '添加六爻占卜',
      '添加八字合婚',
      '添加事业合作分析',
      '添加天赋分析',
      '添加姓名学分析',
      '添加每日运势',
    ]
  },
  {
    version: 'v1.0.0',
    date: '2025年5月',
    changes: [
      '八字排盘功能',
      '大运流年分析',
      '流月流日运势',
      '五行能量分析',
      '十神详解',
      '喜用神分析',
      '身强身弱判断',
      '八字档案管理',
      '查询历史记录',
    ]
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* 顶部导航 */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-moonly-secondary">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">更新日志</h1>
      </div>

      <div className="space-y-6">
        {CHANGELOG.map((release) => (
          <div key={release.version} className="moonly-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gold font-semibold">{release.version}</span>
              <span className="text-moonly-muted text-xs">{release.date}</span>
            </div>
            <ul className="space-y-2">
              {release.changes.map((change, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-1">•</span>
                  <span className="text-moonly-secondary text-sm">{change}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
