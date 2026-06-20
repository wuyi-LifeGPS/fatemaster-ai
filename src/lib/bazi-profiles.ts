// ===== 八字档案管理 =====
// 存储用户的八字档案（自己、家人、朋友等）

const STORAGE_KEY = 'bazi_profiles'
const MAX_PROFILES = 20

export interface BaziProfile {
  id: string
  name: string
  gender: '男' | '女'
  year: number
  month: number
  day: number
  hour: number
  minute: number
  isLunar: boolean
  birthTimeLabel: string // 如 "寅时"
  createdAt: number
  baziData?: any // 缓存的四柱计算结果
}

function generateId(): string {
  return 'bp_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function getAllProfiles(): BaziProfile[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveAllProfiles(list: BaziProfile[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function addProfile(profile: Omit<BaziProfile, 'id' | 'createdAt'>): BaziProfile {
  const list = getAllProfiles()
  const newProfile: BaziProfile = {
    ...profile,
    id: generateId(),
    createdAt: Date.now(),
  }
  list.unshift(newProfile)
  const trimmed = list.slice(0, MAX_PROFILES)
  saveAllProfiles(trimmed)
  return newProfile
}

export function getProfiles(): BaziProfile[] {
  return getAllProfiles()
}

export function getProfileById(id: string): BaziProfile | undefined {
  return getAllProfiles().find(p => p.id === id)
}

export function updateProfile(id: string, updates: Partial<BaziProfile>): BaziProfile | null {
  const list = getAllProfiles()
  const idx = list.findIndex(p => p.id === id)
  if (idx < 0) return null
  list[idx] = { ...list[idx], ...updates }
  saveAllProfiles(list)
  return list[idx]
}

export function removeProfile(id: string) {
  const list = getAllProfiles().filter(p => p.id !== id)
  saveAllProfiles(list)
}

export function getDefaultProfile(): BaziProfile | undefined {
  return getAllProfiles()[0]
}

export function setDefaultProfile(id: string) {
  const list = getAllProfiles()
  const idx = list.findIndex(p => p.id === id)
  if (idx < 0) return
  const [profile] = list.splice(idx, 1)
  list.unshift(profile)
  saveAllProfiles(list)
}

export function clearProfiles() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
