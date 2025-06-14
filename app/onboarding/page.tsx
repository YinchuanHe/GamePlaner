"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/auth/get-session?disableRefresh=true").then((res) => {
      if (!res.data || !res.data.session) {
        router.push("/login");
      }
    });
  }, [router]);

  const handleSubmit = async () => {
    try {
      const session = await axios.get(
        "/api/auth/get-session?disableRefresh=true",
      );
      const email = session.data?.session?.user?.email;
      if (!email) {
        router.push("/login");
        return;
      }
      await axios.post("/api/meta", { email, username, name });
      router.push("/profile");
    } catch (e) {
      setError("Failed to save profile");
    }
  };

  return (
    <div className="mx-auto max-w-xs py-8">
      <h1 className="text-2xl font-semibold mb-4">Create Profile</h1>
      <div className="space-y-4">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button className="w-full" onClick={handleSubmit}>
          Save
        </Button>
      </div>
    </div>
  );
}
