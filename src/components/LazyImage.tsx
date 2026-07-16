'use client'

import { useState, useRef, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  placeholder?: string
}

export default function LazyImage({ src, alt, className = '', placeholder }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* 占位符 */}
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}

      {/* 实际图片 */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
      )}

      {/* 如果提供了 placeholder，先显示 */}
      {placeholder && !loaded && (
        <img
          src={placeholder}
          alt={alt}
          className="w-full h-full object-cover opacity-30 blur-sm"
        />
      )}
    </div>
  )
}
