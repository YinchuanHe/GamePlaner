import { NextResponse } from 'next/server';
import { generatePairs, canScheduleMatch, scheduleMatches } from '../../../utils/scheduler';

export async function POST(request: Request) {
  const { num_players, num_courts, max_rounds } = await request.json();

  const team_a_players = Array.from({ length: num_players }, (_, i) => `A${i + 1}`);
  const team_b_players = Array.from({ length: num_players }, (_, i) => `B${i + 1}`);

  const team_a_pairs = generatePairs(team_a_players);
  const team_b_pairs = generatePairs(team_b_players);

  const match_schedule = scheduleMatches(team_a_pairs, team_b_pairs, num_courts, max_rounds);

  return NextResponse.json(match_schedule);
}
