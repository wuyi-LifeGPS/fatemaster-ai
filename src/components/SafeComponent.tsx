'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  componentName?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class SafeComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`SafeComponent error in ${this.props.componentName || 'unknown'}:`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="moonly-card p-4 opacity-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <p className="text-moonly-muted text-sm">
              {this.props.componentName || '组件'}加载失败
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SafeComponent
