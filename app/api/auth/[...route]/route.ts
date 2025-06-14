import { getAuthHandler } from '../../../../lib/auth';

export async function GET(request: Request) {
  const handler = await getAuthHandler();
  return handler.GET(request);
}

export async function POST(request: Request) {
  const handler = await getAuthHandler();
  return handler.POST(request);
}
