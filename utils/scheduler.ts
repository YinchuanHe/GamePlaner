type Pair = [string, string];

export function generatePairs(players: string[]): Pair[] {
  return players.flatMap((v, i) => players.slice(i + 1).map(w => [v, w] as Pair));
}

export function canScheduleMatch(
  team_a_pair: Pair,
  team_b_pair: Pair,
  used_pairs: Set<string>,
  used_players: Set<string>,
  enableDupPair: boolean,
): boolean {
  if (!enableDupPair && (used_pairs.has(team_a_pair.join(',')) || used_pairs.has(team_b_pair.join(',')))) {
    return false;
  }
  if (
    used_players.has(team_a_pair[0]) ||
    used_players.has(team_a_pair[1]) ||
    used_players.has(team_b_pair[0]) ||
    used_players.has(team_b_pair[1])
  ) {
    return false;
  }
  return true;
}

export function scheduleMatches(
  team_a_pairs: Pair[],
  team_b_pairs: Pair[],
  courts: number,
  max_rounds: number,
  enableDupPair: boolean
): Pair[][][] {
  const matchesArray = team_a_pairs.flatMap(a => team_b_pairs.map(b => [a, b] as [Pair, Pair]));
  const shuffledMatches = shuffle(matchesArray);
  const matches = new Set(shuffledMatches);
  const schedule: Pair[][][] = [];
  const used_pairs = new Set<string>();

  for (let i = 0; i < max_rounds; i++) {
    const current_round: Pair[][] = [];
    const used_players = new Set<string>();
    const round_matches: any[] = [];

    for (const match of matches) {
      const [team_a_pair, team_b_pair] = match;

      if (canScheduleMatch(team_a_pair, team_b_pair, used_pairs, used_players, enableDupPair)) {
        current_round.push([team_a_pair, team_b_pair]);
        used_players.add(team_a_pair[0]).add(team_a_pair[1]).add(team_b_pair[0]).add(team_b_pair[1]);
        round_matches.push(match);

        if (current_round.length === courts) {
          break;
        }
      }
    }

    if (current_round.length > 0) {
      schedule.push(current_round);
      round_matches.forEach(match => {
        matches.delete(match);
        used_pairs.add(match[0].join(',')).add(match[1].join(','));
      });
    } else {
      break;
    }
  }

  return schedule;
}

function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
