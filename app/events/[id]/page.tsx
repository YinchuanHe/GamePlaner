'use client';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button'
import PageSkeleton from '../../../components/PageSkeleton'
import { useApi } from '../../../lib/useApi'
import EventContent from '../../../components/EventContent'
import StepIndicator, {
  EVENT_STEPS,
  EventStep,
} from '../../../components/StepIndicator'
import dayjs from 'dayjs';

interface Participant {
  id: string;
  username: string;
  image?: string | null;
}

export default function EventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { request, loading, error } = useApi();
  const [name, setName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [editingName, setEditingName] = useState('');
  const [editingVisibility, setEditingVisibility] = useState('');
  const [editingGameStyle, setEditingGameStyle] = useState('');
  const [editingRegEnd, setEditingRegEnd] = useState('');
  const [editingLocation, setEditingLocation] = useState('');
  const [editingMaxPoint, setEditingMaxPoint] = useState('');
  const [editingCourtCount, setEditingCourtCount] = useState('');
  const [statusText, setStatusText] = useState<EventStep>('preparing');
  const [visibility, setVisibility] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [registrationEndTime, setRegistrationEndTime] = useState('');
  const [clubName, setClubName] = useState('');
  const [clubId, setClubId] = useState('');
  const [location, setLocation] = useState('');
  const [gameStyle, setGameStyle] = useState('');
  const [maxPoint, setMaxPoint] = useState('');
  const [courtCount, setCourtCount] = useState('');
  const [isParticipant, setIsParticipant] = useState(false);

  const fetchEvent = useCallback(async () => {
    const res = await request<{ event: any }>({
      url: `/api/events/${params.id}`,
      method: 'get',
    });
    setName(res.event.name);
    setEditingName(res.event.name);
    setEditingVisibility(res.event.visibility || '');
    setEditingGameStyle(res.event.gameStyle || '');
    setGameStyle(res.event.gameStyle || '');
    setEditingRegEnd(res.event.registrationEndTime ? dayjs(res.event.registrationEndTime).format('YYYY-MM-DDTHH:mm') : '');
    setEditingLocation(res.event.location || '');
    setEditingMaxPoint(
      res.event.maxPoint !== undefined ? String(res.event.maxPoint) : ''
    );
    setEditingCourtCount(
      res.event.courtCount !== undefined ? String(res.event.courtCount) : ''
    );
    setStatusText(res.event.status);
    setVisibility(res.event.visibility);
    setCreatedAt(res.event.createdAt);
    setRegistrationEndTime(res.event.registrationEndTime || '');
    setClubName(res.event.clubName || '');
    setClubId(res.event.club || '');
    setLocation(res.event.location || '');
    setMaxPoint(res.event.maxPoint !== undefined ? String(res.event.maxPoint) : '');
    setCourtCount(res.event.courtCount !== undefined ? String(res.event.courtCount) : '');
    setParticipants(res.event.participants);
    if (session?.user?.id) {
      setIsParticipant(res.event.participants.some((p: any) => p.id === session.user?.id));
    }
  }, [params.id, request, session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login');
      return;
    }
    fetchEvent();
  }, [status, session, router, fetchEvent]);

  const isAdmin =
    session?.user?.role === 'admin' || session?.user?.role === 'super-admin';

  const canRegister =
    !isAdmin &&
    !isParticipant &&
    statusText === 'registration' &&
    (!registrationEndTime || dayjs(registrationEndTime).isAfter(dayjs())) &&
    (
      visibility === 'public-join' ||
      session?.user?.role === 'super-admin' ||
      session?.user?.role === 'admin' ||
      (session?.user?.clubs && session.user.clubs.includes(clubId))
    );

  const joinEvent = async () => {
    await request({ url: `/api/events/${params.id}`, method: 'post' });
    fetchEvent();
  };


  const saveInfo = async () => {
    await request({
      url: `/api/events/${params.id}`,
      method: 'put',
      data: {
        name: editingName,
        visibility: editingVisibility,
        gameStyle: editingGameStyle,
        registrationEndTime: editingRegEnd || undefined,
        location: editingLocation,
        maxPoint: editingMaxPoint ? Number(editingMaxPoint) : undefined,
        courtCount: editingCourtCount ? Number(editingCourtCount) : undefined,
      },
    });
    setName(editingName);
    setVisibility(editingVisibility);
    setGameStyle(editingGameStyle);
    setRegistrationEndTime(editingRegEnd);
    setLocation(editingLocation);
    setMaxPoint(editingMaxPoint);
    setCourtCount(editingCourtCount);
  };

  const steps: EventStep[] = [...EVENT_STEPS];

  const nextStep = async () => {
    const idx = steps.indexOf(statusText);
    if (idx < steps.length - 1) {
      const newStatus = steps[idx + 1];
      await request({
        url: `/api/events/${params.id}`,
        method: 'put',
        data: { status: newStatus },
      });
      setStatusText(newStatus);
    }
  };

  const prevStep = async () => {
    const idx = steps.indexOf(statusText);
    if (idx > 0) {
      const newStatus = steps[idx - 1];
      await request({
        url: `/api/events/${params.id}`,
        method: 'put',
        data: { status: newStatus },
      });
      setStatusText(newStatus);
    }
  };

  const removeParticipant = async (userId: string) => {
    await request({
      url: `/api/events/${params.id}?participantId=${userId}`,
      method: 'delete',
    });
    fetchEvent();
  };

  const generateMatches = async () => {
    // placeholder for match generation API
    await request({
      url: `/api/events/${params.id}/draws`,
      method: 'post',
      data: {
        gameStyle: editingGameStyle,
        maxPoint: editingMaxPoint ? Number(editingMaxPoint) : undefined,
        courtCount: editingCourtCount ? Number(editingCourtCount) : undefined,
      },
    });
  };

  if (status === 'loading' || loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <div className="p-4">Failed to load.</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">Event</h1>
      <StepIndicator step={statusText} />
      {isAdmin && (
        <div className="flex space-x-2 mb-4">
          <Button onClick={prevStep} disabled={statusText === steps[0]}>
            Previous
          </Button>
          <Button onClick={nextStep} disabled={statusText === steps[steps.length - 1]}>
            Next
          </Button>
        </div>
      )}
      <p className="text-xl">{name}</p>
      {clubName && (
        <p className="text-sm text-muted-foreground">Host: {clubName}</p>
      )}
      {location && (
        <p className="text-sm text-muted-foreground">Location: {location}</p>
      )}
      <p className="text-sm text-muted-foreground">Status: {statusText}</p>
      {registrationEndTime && (
        <p className="text-sm text-muted-foreground">
          Register by: {dayjs(registrationEndTime).format('YYYY-MM-DD HH:mm')}
        </p>
      )}
      <p className="text-sm text-muted-foreground">
        Created: {dayjs(createdAt).format('YYYY-MM-DD HH:mm')}
      </p>
      {canRegister && <Button onClick={joinEvent}>Register</Button>}
      <EventContent
        status={statusText}
        isAdmin={isAdmin}
        participants={participants}
        editingName={editingName}
        setEditingName={setEditingName}
        editingVisibility={editingVisibility}
        setEditingVisibility={setEditingVisibility}
        editingGameStyle={editingGameStyle}
        setEditingGameStyle={setEditingGameStyle}
        editingRegEnd={editingRegEnd}
        setEditingRegEnd={setEditingRegEnd}
        editingLocation={editingLocation}
        setEditingLocation={setEditingLocation}
        editingMaxPoint={editingMaxPoint}
        setEditingMaxPoint={setEditingMaxPoint}
        editingCourtCount={editingCourtCount}
        setEditingCourtCount={setEditingCourtCount}
        saveInfo={saveInfo}
        removeParticipant={removeParticipant}
        generateMatches={generateMatches}
      />
    </div>
  );
}
