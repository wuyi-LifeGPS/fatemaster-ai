'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen moonly-bg moonly-content flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-4">💫</div>
      <h1 className="text-gold-gradient text-2xl font-bold mb-2">星象扰动</h1>
      <p className="text-moonly-text-secondary text-sm mb-2 max-w-xs">
        似乎遇到了一些宇宙能量波动
      </p>
      {error.digest && (
        <p className="text-moonly-text-muted text-xs mb-8 font-mono">{error.digest}</p>
      )}
      <button
        onClick={reset}
        className="btn-gold px-8 py-3 text-sm font-medium"
      >
        重新尝试
      </button>
    </div>
  )
}
