'use client'
import dayjs from 'dayjs'

export interface ClubCardProps {
  club: {
    id: string
    name: string
    description?: string
    location?: string
    createdBy?: string
    createdAt?: string
    logoUrl?: string
  }
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <div className="border rounded-md p-4 flex space-x-4 items-start">
      {club.logoUrl && (
        <img
          src={club.logoUrl}
          alt={club.name}
          className="w-12 h-12 object-cover rounded-full"
        />
      )}
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{club.name}</h3>
        {club.description && (
          <p className="text-sm text-muted-foreground">{club.description}</p>
        )}
        {club.location && (
          <p className="text-sm text-muted-foreground">Location: {club.location}</p>
        )}
        {club.createdBy && (
          <p className="text-sm text-muted-foreground">Created by: {club.createdBy}</p>
        )}
        {club.createdAt && (
          <p className="text-sm text-muted-foreground">
            Created: {dayjs(club.createdAt).format('YYYY-MM-DD HH:mm')}
          </p>
        )}
      </div>
    </div>
  )
}
