import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../auth';
import connect from '../../../../utils/mongoose';
import User from '../../../../models/User';
import sharp from 'sharp';
import { uploadAvatar } from '../../../../lib/r2';

async function compressUnder1kb(data: Buffer): Promise<Buffer> {
  let quality = 80;
  let width = 96;
  while (true) {
    const output = await sharp(data)
      .resize(width, width, { fit: 'cover' })
      .webp({ quality })
      .toBuffer();
    if (output.byteLength <= 1024) return output;
    if (quality > 20) {
      quality -= 10;
    } else {
      width = Math.floor(width * 0.8);
      if (width < 16) return output.slice(0, 1024);
    }
  }
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
  const compressed = await compressUnder1kb(Buffer.from(arrayBuffer));
  await connect();
  const key = `avatars/${session.user.id}.webp`;
  const url = await uploadAvatar(key, compressed, 'image/webp');
  await User.updateOne({ _id: session.user.id }, { image: url });
  return NextResponse.json({ success: true, url });
}
