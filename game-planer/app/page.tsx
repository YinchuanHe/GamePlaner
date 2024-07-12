'use client';

import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box } from '@mui/material';
import axios from 'axios';

const Home: React.FC = () => {
  const [numPlayers, setNumPlayers] = useState<number>(12);
  const [numCourts, setNumCourts] = useState<number>(6);
  const [maxRounds, setMaxRounds] = useState<number>(10);
  const [schedule, setSchedule] = useState<string[][][]>([]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/schedule', {
        num_players: numPlayers,
        num_courts: numCourts,
        max_rounds: maxRounds,
      });
      setSchedule(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Badminton Match Scheduler
      </Typography>
      <TextField
        label="Number of Players per Team"
        type="number"
        value={numPlayers}
        onChange={(e) => setNumPlayers(parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Number of Courts"
        type="number"
        value={numCourts}
        onChange={(e) => setNumCourts(parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Maximum Number of Rounds"
        type="number"
        value={maxRounds}
        onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}
        fullWidth
        margin="normal"
      />
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Generate Schedule
        </Button>
      </Box>
      <Grid container spacing={3} mt={4}>
        {schedule.map((round, roundIndex) => (
          <Grid item xs={12} key={roundIndex}>
            <Typography variant="h6">Round {roundIndex + 1}</Typography>
            {round.map((match, matchIndex) => (
              <Typography key={matchIndex}>
                Court {matchIndex + 1}: {match[0][0]} & {match[0][1]} vs {match[1][0]} & {match[1][1]}
              </Typography>
            ))}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
