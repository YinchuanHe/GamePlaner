"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

interface ProfileData {
  email: string;
  username?: string;
  role?: string;
  image?: string | null;
  club?: string | null;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.user?.email) return;
      const res = await axios.post('/api/profile', {
        email: session.user.email,
      });
      setData(res.data);
    };
    fetchProfile();
  }, [session]);

  if (!data) return <div className="p-4">Loading...</div>;

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
      {data.club && (
        <p>
          <strong>Club:</strong> {data.club}
        </p>
      )}
    </div>
  );
}
