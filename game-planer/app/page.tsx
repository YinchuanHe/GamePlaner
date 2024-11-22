'use client';

import React, { useEffect, useState } from 'react';
import { Container, TextField, Button, Typography, Grid, Box, Switch, FormControlLabel, Checkbox, TableContainer, Table, Paper, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from 'axios';
import { DataGrid, GridCellParams, GridColDef, GridRowClassNameParams, GridRowsProp } from '@mui/x-data-grid';
import { Height } from '@mui/icons-material';

const Home: React.FC = () => {

  const [teamAPlayers, setTeamAPlayers] = useState<string>('');
  const [teamBPlayers, setTeamBPlayers] = useState<string>('');
  
  const [numCourts, setNumCourts] = useState<number>(6);
  const [maxRounds, setMaxRounds] = useState<number>(10);
  const [schedule, setSchedule] = useState<string[][][]>([]);
  const [enableDupPair, setEnableDupPair] = useState<boolean>(false);
  const [scores, setScores] = useState<{ [key: string]: { teamAScore: number; teamBScore: number } }>({});
  const [clearDialogOpen, setClearDialogOpen] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load data from local storage
    const savedSchedule = localStorage.getItem('schedule');
    const savedScores = localStorage.getItem('scores');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const handlePlayerListChange = (team: 'A' | 'B', value: string) => {
    if (team === 'A') {
      setTeamAPlayers(value);
    } else {
      setTeamBPlayers(value);
    }
  };

  const handleScoreChange = (id: string, team: 'A' | 'B', value: number) => {
    setScores(prevScores => {
      const newScores = {
          ...prevScores,
          [id]: {
              ...prevScores[id],
              [`team${team}Score`]: value
          }
      };
      // Save scores to local storage
      localStorage.setItem('scores', JSON.stringify(newScores));
      return newScores;
    });
  };

  const handleOpenClearDialog = () => {
    setClearDialogOpen(true); // Open dialog
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false); // Close dialog without clearing
  };

  const handleSubmit = async () => {
    const teamAList = teamAPlayers.split('\n').filter(name => name.trim() !== '');
    const teamBList = teamBPlayers.split('\n').filter(name => name.trim() !== '');

    if (teamAList.length !== teamBList.length) {
      setError('Both teams must have the same number of players.');
      return;
    }

    setError(null);

    try {
      const response = await axios.post('/api/schedule', {
        team_a_players: teamAList,
        team_b_players: teamBList,
        num_courts: numCourts,
        max_rounds: maxRounds,
        enableDupPair: enableDupPair,
      });
      const generatedSchedule = response.data;
      setSchedule(generatedSchedule);
      localStorage.setItem('schedule', JSON.stringify(generatedSchedule));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearSchedule = () => {
    setSchedule([]);
    localStorage.removeItem('schedule');
    localStorage.removeItem('scores')
  };

  const teamAPlayerCount = teamAPlayers.split('\n').filter(name => name.trim() !== '').length;
  const teamBPlayerCount = teamBPlayers.split('\n').filter(name => name.trim() !== '').length;

  const rows: GridRowsProp = schedule.flatMap((round, roundIndex) =>
    round.map((match, matchIndex) => {
      const id = `${roundIndex}-${matchIndex}`;
      return {
        id,
        round: roundIndex + 1,
        court: matchIndex + 1,
        teamA: `${match[0][0]} & ${match[0][1]}`,
        teamB: `${match[1][0]} & ${match[1][1]}`,
        teamAScore: scores[id]?.teamAScore ?? 0,
        teamBScore: scores[id]?.teamBScore ?? 0
      };
    })
  );

  const columns: GridColDef[] = [
    { field: 'round', headerName: 'R', width: 50 },
    { field: 'court', headerName: 'C', width: 50 },
    { field: 'teamA', headerName: 'Team A', flex: 1, maxWidth: 250 },
    { field: 'teamB', headerName: 'Team B', flex: 1, maxWidth: 250 },
    {
      field: 'teamAScore',
      headerName: 'Team A Score',
      flex: 1,
      width: 15,
      renderCell: (params: GridCellParams) => (
        <TextField
          type="number"
          value={params.value}
          inputProps={{ min: 0, max: 21 }}
          className="no-outline"
          onChange={(e) => handleScoreChange(params.id as string, 'A', parseInt(e.target.value, 10))}
        />
      ),
    },
    {
      field: 'teamBScore',
      headerName: 'Team B Score',
      flex: 1,
      width: 15,
      renderCell: (params: GridCellParams) => (
        <TextField
          className="no-outline"
          type="number"
          value={params.value}
          inputProps={{ min: 0, max: 21 }}
          onChange={(e) => handleScoreChange(params.id as string, 'B', parseInt(e.target.value, 10))}
        />
      ),
    },
  ];

  const getRowClassName = (params: GridRowClassNameParams) => {
    const roundNumber = params.row.round;
    // Apply 'round-bg-1' class to odd rounds and skip even rounds
    return roundNumber % 2 == 1 ? 'round-bg-1' : '';
  };

  // Calculate total scores and score difference
  const totalTeamAScore = Object.values(scores).reduce((total, score) => total + (score.teamAScore || 0), 0);
  const totalTeamBScore = Object.values(scores).reduce((total, score) => total + (score.teamBScore || 0), 0);
  const teamAscoreDifference = totalTeamAScore - totalTeamBScore;
  const teamBscoreDifference = totalTeamBScore - totalTeamAScore;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Badminton Match Scheduler
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <TextField
            label="Team A Member List"
            type='text'
            fullWidth
            margin="normal"
            multiline
            value={teamAPlayers}
            onChange={(e) => handlePlayerListChange('A', e.target.value)}
          />
          <Typography variant="body2" color="textSecondary">
            Number of players in Team A: {teamAPlayerCount}
          </Typography>
          <TextField
            label="Team B Member List"
            type='text'
            fullWidth
            margin="normal"
            multiline
            value={teamBPlayers}
            onChange={(e) => handlePlayerListChange('B', e.target.value)}
          />
          <Typography variant="body2" color="textSecondary">
            Number of players in Team B: {teamBPlayerCount}
          </Typography>
        </Grid>
        <Grid item xs={3}>
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
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" color="primary" onClick={handleSubmit} sx={{marginRight:8}}>
          Generate Match
        </Button>
        <Button variant="outlined" color="error" startIcon={<DeleteForeverIcon />} onClick={handleOpenClearDialog} sx={{marginRight:8}}>
          Clear Match
        </Button>
        <FormControlLabel
          label="Duplicate Pair Enable"
          control={
            <Checkbox
              checked={enableDupPair}
              onChange={(e)=>{
                setEnableDupPair(e.target.checked)}}
            />
          }
        />
      </Box>
      <Dialog
        open={clearDialogOpen}
        onClose={handleCloseClearDialog}
      >
        <DialogTitle>Confirm Clear Match</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear the current match schedule and scores? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearSchedule} color="error" autoFocus>
            Clear Match
          </Button>
        </DialogActions>
      </Dialog>
      <Box mt={4} maxWidth={300}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Score Type</TableCell>
                <TableCell>Team A</TableCell>
                <TableCell>Team B</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Total Score</TableCell>
                <TableCell>{totalTeamAScore}</TableCell>
                <TableCell>{totalTeamBScore}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Score Diff.</TableCell>
                <TableCell>{teamAscoreDifference}</TableCell>
                <TableCell>{teamBscoreDifference}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box mt={4} style={{ height:'600px', width: '100%' }}>
        <DataGrid 
        rows={rows} 
        columns={columns} 
        getRowClassName={getRowClassName}
        disableColumnMenu
        disableColumnSorting
        />
      </Box>
    </Container>
  );
};

export default Home;
