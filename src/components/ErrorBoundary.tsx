'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen moonly-bg moonly-content flex flex-col items-center justify-center p-6 text-center">
          <div className="text-5xl mb-4">💫</div>
          <h2 className="text-gold text-lg font-semibold mb-2">出了点小状况</h2>
          <p className="text-moonly-secondary text-sm mb-6">页面加载遇到了问题，请刷新重试</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-gold px-6 py-2.5 text-sm"
          >
            刷新页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
