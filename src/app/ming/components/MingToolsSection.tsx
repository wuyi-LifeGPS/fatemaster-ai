'use client'

import CollapsibleSection from '@/components/CollapsibleSection'
import DailyYiJi from '@/components/DailyYiJi'
import SolarTermDisplay from '@/components/SolarTermDisplay'
import LunarDateDisplay from '@/components/LunarDateDisplay'

export default function MingToolsSection() {
  return (
    <CollapsibleSection title="命理工具" icon="🔮" defaultOpen={true}>
      <DailyYiJi />
      <SolarTermDisplay />
      <LunarDateDisplay />
    </CollapsibleSection>
  )
}
