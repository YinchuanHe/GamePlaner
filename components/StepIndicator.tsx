'use client'
import React from 'react'

export const EVENT_STEPS = [
  'preparing',
  'registration',
  'arranging-matches',
  'match-running',
  'ended',
] as const

export type EventStep = typeof EVENT_STEPS[number]

export interface StepIndicatorProps {
  step: EventStep
}

export default function StepIndicator({ step }: StepIndicatorProps) {
  const currentIndex = EVENT_STEPS.indexOf(step)
  return (
    <ol className="flex justify-between mb-4">
      {EVENT_STEPS.map((s, i) => (
        <li
          key={s}
          className={
            'flex-1 text-center ' +
            (i === currentIndex ? 'font-semibold' : 'text-muted-foreground')
          }
        >
          {s.replace('-', ' ')}
        </li>
      ))}
    </ol>
  )
}
