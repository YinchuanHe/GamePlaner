'use client'
import { Skeleton } from './ui/skeleton'

export default function PageSkeleton() {
  return (
    <div className="p-4 space-y-2">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  )
}
