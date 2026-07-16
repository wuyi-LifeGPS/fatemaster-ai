'use client'

import CollapsibleSection from '@/components/CollapsibleSection'
import FortuneStick from '@/components/FortuneStick'
import FortuneQuiz from '@/components/FortuneQuiz'
import TarotDaily from '@/components/TarotDaily'

export default function FunQuizSection() {
  return (
    <CollapsibleSection title="趣味测试" icon="🎯" defaultOpen={true}>
      <FortuneStick />
      <FortuneQuiz />
      <TarotDaily />
    </CollapsibleSection>
  )
}
