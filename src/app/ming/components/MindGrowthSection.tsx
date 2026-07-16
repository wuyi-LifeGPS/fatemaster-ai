'use client'

import CollapsibleSection from '@/components/CollapsibleSection'
import MeditationTimer from '@/components/MeditationTimer'
import GratitudeJournal from '@/components/GratitudeJournal'
import DreamJournal from '@/components/DreamJournal'
import HabitTracker from '@/components/HabitTracker'
import CountdownWidget from '@/components/CountdownWidget'
import BreathingGuide from '@/components/BreathingGuide'
import MoodTracker from '@/components/MoodTracker'

export default function MindGrowthSection() {
  return (
    <CollapsibleSection title="心灵成长" icon="🧘" defaultOpen={false}>
      <MeditationTimer />
      <GratitudeJournal />
      <DreamJournal />
      <HabitTracker />
      <CountdownWidget />
      <BreathingGuide />
      <MoodTracker />
    </CollapsibleSection>
  )
}
