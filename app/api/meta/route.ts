import { NextResponse } from "next/server";
import connect from "../../../utils/mongoose";
import UserMeta from "../../../models/UserMeta";

export async function GET(request: Request) {
  const email = request.headers.get("x-email");
  if (!email) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  await connect();
  const meta = await UserMeta.findOne({ email });
  if (!meta) {
    return NextResponse.json({ success: false }, { status: 404 });
  }
  return NextResponse.json({ success: true, meta });
}

export async function POST(request: Request) {
  const { email, username, name } = await request.json();
  if (!email || !username) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
  await connect();
  const existing = await UserMeta.findOne({ email });
  if (existing) {
    existing.username = username;
    existing.name = name;
    await existing.save();
  } else {
    await UserMeta.create({ email, username, name });
  }
  return NextResponse.json({ success: true });
}
