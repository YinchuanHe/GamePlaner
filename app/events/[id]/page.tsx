'use client';
import { useEventPage } from '@/hooks/useEventPage';
import EventHeader from '@/components/event/EventHeader';
import RegistrationControls from '@/components/event/RegistrationControls';
import EventBody from '@/components/event/EventBody';
import PageSkeleton from '@/components/PageSkeleton';
import { useEffect, useState } from 'react';
import ConfirmRevertDialog from '@/components/event/ConfirmRevertDialog';

export default function EventPage({ params }: { params: { id: string } }) {
  const {
    session, event,
    groups, matches,
    isAdmin, isParticipant,
    canRegister, canUnregister,
    actions, // joinEvent, leaveEvent, …
  } = useEventPage(params.id);

  const [showRevertModal, setShowRevertModal] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!showRevertModal) return
    if (countdown === 0) return
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [showRevertModal, countdown])

  if (!event) return <PageSkeleton />;

  return (
    <div className="p-4 space-y-6">
      <EventHeader
        event={event}
        isAdmin={isAdmin}
        onPrev={() => {
          if (isAdmin && event.status === 'arranging') {
            setCountdown(5)
            setShowRevertModal(true)
          } else {
            actions.prevStep()
          }
        }}
        onNext={actions.nextStep}
      />

      <RegistrationControls
        canRegister={canRegister}
        canUnregister={canUnregister}
        onRegister={actions.joinEvent}
        onUnregister={actions.leaveEvent}
      />

      <EventBody
        status={event.status}
        participants={event.participants}
        groups={groups}
        matches={matches}
        actions={actions}
        isAdmin={isAdmin}
        user={session?.user}
      />

      <ConfirmRevertDialog
        open={showRevertModal}
        onClose={() => setShowRevertModal(false)}
        onConfirm={async () => {
          await actions.deleteAllMatches()
          await actions.prevStep()
        }}
      />
    </div>
  );
}