import random
from itertools import combinations, product

def generate_pairs(players):
    return list(combinations(players, 2))

def can_schedule_match(team_a_pair, team_b_pair, used_pairs, used_players):
    if team_a_pair in used_pairs or team_b_pair in used_pairs:
        return False
    if used_players.intersection(team_a_pair) or used_players.intersection(team_b_pair):
        return False
    return True

def schedule_matches(team_a_pairs, team_b_pairs, courts, max_rounds):
    matches = list(product(team_a_pairs, team_b_pairs))
    random.shuffle(matches)  # Shuffle to randomize pairings
    schedule = []
    used_pairs = set()

    for _ in range(max_rounds):
        current_round = []
        used_players = set()
        round_matches = []

        for match in matches:
            team_a_pair, team_b_pair = match

            if can_schedule_match(team_a_pair, team_b_pair, used_pairs, used_players):
                current_round.append((team_a_pair, team_b_pair))
                used_players.update(team_a_pair)
                used_players.update(team_b_pair)
                round_matches.append(match)

                # If current round is full, stop scheduling for this round
                if len(current_round) == courts:
                    break

        # If the round is not empty, add it to the schedule
        if current_round:
            schedule.append(current_round)
            for match in round_matches:
                matches.remove(match)
                team_a_pair, team_b_pair = match
                used_pairs.add(team_a_pair)
                used_pairs.add(team_b_pair)
        else:
            # No more matches can be scheduled
            break

    return schedule

def randomize_pairs(pairs):
    random.shuffle(pairs)
    return pairs

def main():
    num_teams = 2
    num_players = int(input("Enter the number of player per team: "))
    num_courts = int(input("Enter the number of courts available: "))
    max_rounds = int(input("Enter the maximum number of rounds: "))
    
    # Create players
    team_a_players = [f"A{i+1}" for i in range(num_players)]
    team_b_players = [f"B{i+1}" for i in range(num_players)]
    
    # Generate pairs
    team_a_pairs = generate_pairs(team_a_players)
    team_b_pairs = generate_pairs(team_b_players)
    
    # Randomize pairs
    team_a_pairs = randomize_pairs(team_a_pairs)
    team_b_pairs = randomize_pairs(team_b_pairs)
    
    # Schedule matches
    match_schedule = schedule_matches(team_a_pairs, team_b_pairs, num_courts, max_rounds)
    
    # Print schedule
    for round_num, round_matches in enumerate(match_schedule):
        print(f"Round {round_num + 1}:")
        for court_num, match in enumerate(round_matches):
            team_a_pair, team_b_pair = match
            print(f"  Court {court_num + 1}: {team_a_pair} vs {team_b_pair}")
        print()

if __name__ == "__main__":
    main()
