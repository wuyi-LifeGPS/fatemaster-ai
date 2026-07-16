'use client'

import CollapsibleSection from '@/components/CollapsibleSection'
import ZodiacFortune from '@/components/ZodiacFortune'
import LuckyColor from '@/components/LuckyColor'
import LuckyHours from '@/components/LuckyHours'
import DailyQuote from '@/components/DailyQuote'
import WuxingEnergy from '@/components/WuxingEnergy'
import DirectionGuide from '@/components/DirectionGuide'
import LuckyNumbers from '@/components/LuckyNumbers'
import FengShuiTip from '@/components/FengShuiTip'
import WeeklyFortune from '@/components/WeeklyFortune'
import HoroscopeWidget from '@/components/HoroscopeWidget'

import DailyBenefactor from '@/components/DailyBenefactor'
import WeeklyFortuneSummary from '@/components/WeeklyFortuneSummary'

export default function DailyFortuneSection() {
  return (
    <CollapsibleSection title="每日运势" icon="🌟" defaultOpen={true}>
      <DailyBenefactor />
      <WeeklyFortuneSummary />
      <ZodiacFortune />
      <LuckyColor />
      <LuckyHours />
      <DailyQuote />
      <WuxingEnergy />
      <DirectionGuide />
      <LuckyNumbers />
      <FengShuiTip />
      <WeeklyFortune />
      <HoroscopeWidget />
    </CollapsibleSection>
  )
}
