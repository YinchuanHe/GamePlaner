import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import User from '../../../../models/User';
import sharp from 'sharp';
import { uploadAvatar } from '../../../../lib/r2';

export async function compressAvatar(data: Buffer): Promise<Buffer> {
  return await sharp(data)
    .resize(96, 96, { fit: 'cover' })        // Crop and scale to square
    .webp({ quality: 85, effort: 5 })        // WebP format with good balance
    .toBuffer();                             // Output as buffer for upload or save
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('avatar');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ success: false, message: 'No avatar file' }, { status: 400 });
  }
  const arrayBuffer = await file.arrayBuffer();
  const compressed = await compressAvatar(Buffer.from(arrayBuffer));
  await connect();
  const key = `avatars/${session.user.id}.webp`;
  const url = await uploadAvatar(key, compressed, 'image/webp');
  await User.updateOne({ _id: session.user.id }, { image: url });
  return NextResponse.json({ success: true, url });
}
