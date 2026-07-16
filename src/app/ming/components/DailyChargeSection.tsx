'use client'

import CollapsibleSection from '@/components/CollapsibleSection'
import DailyPoem from '@/components/DailyPoem'
import DailyTrivia from '@/components/DailyTrivia'
import DailyWisdom from '@/components/DailyWisdom'
import DailyProverb from '@/components/DailyProverb'
import DailyJoke from '@/components/DailyJoke'
import DailyChallenge from '@/components/DailyChallenge'
import DailyPositive from '@/components/DailyPositive'
import DailyHealth from '@/components/DailyHealth'
import DailySentence from '@/components/DailySentence'
import DailyMood from '@/components/DailyMood'
import DailyFortune from '@/components/DailyFortune'
import DailyMotto from '@/components/DailyMotto'
import DailyZen from '@/components/DailyZen'
import DailyAdvice from '@/components/DailyAdvice'
import DailyInsight from '@/components/DailyInsight'
import DailyAffirmation from '@/components/DailyAffirmation'
import DailyReflection from '@/components/DailyReflection'
import DailyMantra from '@/components/DailyMantra'

export default function DailyChargeSection() {
  return (
    <CollapsibleSection title="每日充电" icon="📚" defaultOpen={false}>
      <DailyPoem />
      <DailyTrivia />
      <DailyWisdom />
      <DailyProverb />
      <DailyJoke />
      <DailyChallenge />
      <DailyPositive />
      <DailyHealth />
      <DailySentence />
      <DailyMood />
      <DailyFortune />
      <DailyMotto />
      <DailyZen />
      <DailyAdvice />
      <DailyInsight />
      <DailyAffirmation />
      <DailyReflection />
      <DailyMantra />
    </CollapsibleSection>
  )
}
