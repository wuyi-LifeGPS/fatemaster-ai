'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

const AUTOSAVE_PREFIX = 'lifegps_autosave_'

interface AutosaveState {
  [key: string]: any
}

export function useAutosave(formId: string, data: AutosaveState, interval: number = 3000) {
  const [hasDraft, setHasDraft] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const key = AUTOSAVE_PREFIX + formId

  // 检查是否有草稿
  useEffect(() => {
    if (typeof window === 'undefined') return
    const draft = localStorage.getItem(key)
    setHasDraft(!!draft)
  }, [key])

  // 自动保存
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      if (Object.keys(data).length > 0) {
        localStorage.setItem(key, JSON.stringify(data))
        setHasDraft(true)
      }
    }, interval)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [data, key, interval])

  const loadDraft = useCallback(() => {
    if (typeof window === 'undefined') return null
    try {
      const draft = localStorage.getItem(key)
      return draft ? JSON.parse(draft) : null
    } catch {
      return null
    }
  }, [key])

  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
    setHasDraft(false)
  }, [key])

  return { hasDraft, loadDraft, clearDraft }
}
