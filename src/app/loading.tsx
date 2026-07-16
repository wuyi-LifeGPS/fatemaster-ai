export default function Loading() {
  return (
    <div className="min-h-screen moonly-bg moonly-content flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-[#c9a96e]/30 border-t-[#c9a96e] animate-spin" />
        <p className="text-moonly-secondary text-sm">加载中...</p>
      </div>
    </div>
  )
}
