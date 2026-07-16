'use client'

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="moonly-card p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-white/5 rounded w-full" />
      ))}
    </div>
  )
}

export function SkeletonText({ lines = 2 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-white/5 rounded w-full" />
      ))}
    </div>
  )
}

export function SkeletonAvatar() {
  return (
    <div className="w-12 h-12 rounded-full bg-white/10 animate-pulse" />
  )
}

export function SkeletonCircle({ size = 12 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-white/10 animate-pulse"
      style={{ width: size * 4, height: size * 4 }}
    />
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="moonly-card p-3 flex items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-lg bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="h-2 bg-white/5 rounded w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
