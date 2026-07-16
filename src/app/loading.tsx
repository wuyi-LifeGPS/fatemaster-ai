export default function Loading() {
  return (
    <div className="min-h-screen moonly-bg moonly-content flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin" />
        <p className="text-moonly-text-secondary text-sm">加载中...</p>
      </div>
    </div>
  )
}
