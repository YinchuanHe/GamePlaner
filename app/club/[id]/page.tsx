'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface ClubData {
  id: string;
  name: string;
  members: string[];
  events: string[];
}

export default function ClubHome({ params }: { params: { id: string } }) {
  const [data, setData] = useState<ClubData | null>(null);

  useEffect(() => {
    axios.get(`/api/clubs/${params.id}`).then(res => setData(res.data));
  }, [params.id]);

  if (!data) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <div>
        <h2 className="text-xl mb-2">Members</h2>
        <ul className="list-disc ml-4">
          {data.members.map(m => <li key={m}>{m}</li>)}
        </ul>
      </div>
      <div>
        <h2 className="text-xl mb-2">Events</h2>
        <ul className="list-disc ml-4">
          {data.events.map(e => <li key={e}>{e}</li>)}
        </ul>
      </div>
    </div>
  );
}
