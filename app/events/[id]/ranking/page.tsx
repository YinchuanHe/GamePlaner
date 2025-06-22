'use client'

import { useEventPage } from '@/hooks/useEventPage'
import PageSkeleton from '@/components/PageSkeleton'
import UserCard from '@/components/UserCard'

export default function EventRankingPage({ params }: { params: { id: string } }) {
  const {
    event,
    matches,
  } = useEventPage(params.id)

  if (!event) {
    return <PageSkeleton />
  }

  const rankingMap: Record<string, { user: any; margin: number }> = {}

  matches.forEach(match => {
    const [a, b] = match.teams
    if (a.score !== b.score) {
      const winning = a.score > b.score ? a : b
      const margin = Math.abs(a.score - b.score)
      winning.players.forEach((p: any) => {
        const pid = p.id
        if (!rankingMap[pid]) {
          rankingMap[pid] = { user: p, margin: 0 }
        }
        rankingMap[pid].margin += margin
      })
    }
  })

  const ranking = Object.values(rankingMap).sort((x, y) => y.margin - x.margin)

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Ranking</h1>
      <div className="space-y-2">
        {ranking.length === 0 ? (
          <p>No results yet.</p>
        ) : (
          ranking.map(r => (
            <div key={r.user.id} className="flex justify-between items-center">
              <UserCard user={r.user} />
              <span className="font-semibold">{r.margin}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
