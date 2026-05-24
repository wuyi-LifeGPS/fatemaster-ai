'use client'

interface StarRatingProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

const sizeMap = {
  sm: { star: 'text-sm', gap: 'gap-0.5' },
  md: { star: 'text-base', gap: 'gap-1' },
  lg: { star: 'text-lg', gap: 'gap-1.5' },
}

export function StarRating({ score, size = 'md', showLabel = true }: StarRatingProps) {
  const { star, gap } = sizeMap[size]

  // 根据 score 计算星级（0-100 → 1-5星）
  let fullStars: number
  if (score >= 85) fullStars = 5
  else if (score >= 70) fullStars = 4
  else if (score >= 55) fullStars = 3
  else if (score >= 40) fullStars = 2
  else fullStars = 1

  const emptyStars = 5 - fullStars

  // 运势标签（删除，不再显示旺极/旺/平等文字）
  let label: string
  if (score >= 85) label = ''
  else if (score >= 70) label = ''
  else if (score >= 55) label = ''
  else if (score >= 40) label = ''
  else label = ''

  return (
    <div className="flex items-center gap-1">
      <div className={`flex items-center ${gap}`}>
        {Array.from({ length: fullStars }).map((_, i) => (
          <span key={`full-${i}`} className={`${star} text-amber-500`}>★</span>
        ))}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span key={`empty-${i}`} className={`${star} text-ink-200`}>★</span>
        ))}
      </div>
      {showLabel && (
        <span className={`text-xs text-ink-400 ml-1`}>{label}</span>
      )}
    </div>
  )
}

// 大运等级颜色（用于曲线图节点）
export function fortuneLevelColor(level: string): string {
  switch (level) {
    case '大吉': return '#ef4444'
    case '吉':   return '#f59e0b'
    case '平':   return '#3b82f6'
    case '凶':   return '#64748b'
    case '大凶': return '#6b7280'
    default:     return '#a1887f'
  }
}
