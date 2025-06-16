'use client'
import Image from 'next/image'

export interface UserCardProps {
  user: {
    id: string
    username: string
    image?: string | null
  }
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="flex items-center space-x-2 p-2 border rounded-md">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.username}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      )}
      <span>{user.username}</span>
    </div>
  )
}
