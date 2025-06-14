"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../../components/AuthProvider";

interface ProfileData {
  email: string;
  name?: string | null;
  username?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [data, setData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!loading) {
        if (!user) {
          router.push("/login");
          return;
        }
        try {
          const metaRes = await axios.get("/api/meta", {
            headers: { "x-email": user.email },
          });
          setData({
            email: user.email as string,
            name: user.name ?? null,
            username: metaRes.data.meta.username,
          });
        } catch {
          router.push("/onboarding");
        }
      }
    };
    fetchData();
  }, [user, loading, router]);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-2xl mb-4">Profile</h1>
      <p>
        <strong>Email:</strong> {data.email}
      </p>
      {data.name && (
        <p>
          <strong>Name:</strong> {data.name}
        </p>
      )}
      {data.username && (
        <p>
          <strong>Username:</strong> {data.username}
        </p>
      )}
    </div>
  );
}
