import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../auth';
import connect from '../../../../../utils/mongoose';
import Event from '../../../../../models/Event';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  await connect();
  const event = await Event.findById(params.id);
  if (!event) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  const isParticipant = event.participants.some(
    (p: any) => p.toString() === session.user.id
  );
  const canLeave =
    event.status === 'registration' &&
    (!event.registrationEndTime || event.registrationEndTime > new Date());

  if (!isParticipant || !canLeave) {
    return NextResponse.json({ success: false }, { status: 403 });
  }

  await Event.updateOne(
    { _id: params.id },
    { $pull: { participants: session.user.id } }
  );
  return NextResponse.json({ success: true });
}
