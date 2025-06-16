'use client'

import React from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '../lib/utils'

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

interface StepProps {
  title: string
  isCompleted?: boolean
  isActive?: boolean
}

const Step = ({ title, isCompleted, isActive }: StepProps) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center justify-center">
        <div
          className={cn(
            'w-8 h-8 rounded-full border-2 flex items-center justify-center',
            isCompleted
              ? 'border-primary bg-primary text-primary-foreground'
              : isActive
                ? 'border-primary'
                : 'border-muted'
          )}
        >
          {isCompleted ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="text-sm font-medium">
              {title[0].toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="ml-4">
        <p
          className={cn(
            'text-sm font-medium',
            isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {title}
        </p>
      </div>
    </div>
  )
}

export default function StepIndicator({ step }: StepIndicatorProps) {
  const currentIndex = EVENT_STEPS.indexOf(step)
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
      {EVENT_STEPS.map((s, index) => (
        <React.Fragment key={s}>
          <Step
            title={s.replace('-', ' ')}
            isCompleted={index < currentIndex}
            isActive={index === currentIndex}
          />
          {index < EVENT_STEPS.length - 1 && (
            <ChevronRight className="hidden md:block text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
