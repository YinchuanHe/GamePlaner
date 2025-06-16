"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import PageSkeleton from "../../components/PageSkeleton";
import { useApi } from "../../lib/useApi";

interface ProfileData {
  email: string;
  username?: string;
  role?: string;
  image?: string | null;
  clubs?: string[];
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const { request, loading, error } = useApi();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      const res = await request<ProfileData>({
        url: '/api/profile',
        method: 'post',
        data: { email: session.user.email },
      });
      setData(res);
    };
    fetchProfile();
  }, [session, request]);

  if (loading || !data) {
    return <PageSkeleton />;
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>;
  }

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl mb-4">Profile</h1>
      {data.image && (
  <Image
    src={data.image}
    alt="Profile picture"
    width={96}
    height={96}
    className="rounded-full"
    priority
  />
)}
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      {data.username && (
        <p>
          <strong>Username:</strong> {data.username}
        </p>
      )}
      {data.role && (
        <p>
          <strong>Role:</strong> {data.role}
        </p>
      )}
      {data.clubs && data.clubs.length > 0 && (
        <p>
          <strong>Clubs:</strong> {data.clubs.join(', ')}
        </p>
      )}
    </div>
  );
}
