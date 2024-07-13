import { NextResponse } from 'next/server';
import { generatePairs, canScheduleMatch, scheduleMatches } from '../../../utils/scheduler';

export async function POST(request: Request) {
  const { team_a_players, team_b_players, num_courts, max_rounds, enableDupPair } = await request.json();

  const team_a_pairs = generatePairs(team_a_players);
  const team_b_pairs = generatePairs(team_b_players);

  const match_schedule = scheduleMatches(team_a_pairs, team_b_pairs, num_courts, max_rounds, enableDupPair);

  return NextResponse.json(match_schedule);
}
