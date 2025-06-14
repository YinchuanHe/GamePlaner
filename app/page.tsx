'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Trash2 } from 'lucide-react';

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
    if (typeof window !== 'undefined' && !localStorage.getItem('loggedIn')) {
      window.location.href = '/login';
    }
    const savedSchedule = localStorage.getItem('schedule');
    const savedScores = localStorage.getItem('scores');
    if (savedSchedule) {
      setSchedule(JSON.parse(savedSchedule));
    }
    if (savedScores) {
      setScores(JSON.parse(savedScores));
    }
  }, []);

  const handleLogout = async () => {
    await axios.post('/api/logout');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

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

  const rows = schedule.flatMap((round, roundIndex) =>
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


  // Calculate total scores and score difference
  const totalTeamAScore = Object.values(scores).reduce((total, score) => total + (score.teamAScore || 0), 0);
  const totalTeamBScore = Object.values(scores).reduce((total, score) => total + (score.teamBScore || 0), 0);
  const teamAscoreDifference = totalTeamAScore - totalTeamBScore;
  const teamBscoreDifference = totalTeamBScore - totalTeamAScore;

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Badminton Match Scheduler</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      <div className="grid md:grid-cols-12 gap-4">
        <div className="md:col-span-9 space-y-2">
          <Textarea
            placeholder="Team A Member List"
            value={teamAPlayers}
            onChange={(e) => handlePlayerListChange('A', e.target.value)}
            className="min-h-32"
          />
          <p className="text-sm text-muted-foreground">Number of players in Team A: {teamAPlayerCount}</p>
          <Textarea
            placeholder="Team B Member List"
            value={teamBPlayers}
            onChange={(e) => handlePlayerListChange('B', e.target.value)}
            className="min-h-32"
          />
          <p className="text-sm text-muted-foreground">Number of players in Team B: {teamBPlayerCount}</p>
        </div>
        <div className="md:col-span-3 space-y-2">
          <Input
            type="number"
            placeholder="Number of Courts"
            value={numCourts}
            onChange={(e) => setNumCourts(parseInt(e.target.value, 10))}
          />
          <Input
            type="number"
            placeholder="Maximum Number of Rounds"
            value={maxRounds}
            onChange={(e) => setMaxRounds(parseInt(e.target.value, 10))}
          />
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-4">
        <Button onClick={handleSubmit}>Generate Match</Button>
        <Button variant="destructive" onClick={handleOpenClearDialog} className="flex items-center">
          <Trash2 className="mr-2 h-4 w-4" /> Clear Match
        </Button>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={enableDupPair} onChange={(e) => setEnableDupPair(e.target.checked)} />
          <span>Duplicate Pair Enable</span>
        </label>
      </div>
      {clearDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-4 rounded-md space-y-4 w-80">
            <h2 className="text-lg font-medium">Confirm Clear Match</h2>
            <p>Are you sure you want to clear the current match schedule and scores? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCloseClearDialog}>Cancel</Button>
              <Button variant="destructive" onClick={handleClearSchedule}>Clear Match</Button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4 max-w-sm">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Score Type</th>
              <th className="p-2">Team A</th>
              <th className="p-2">Team B</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Total Score</td>
              <td className="border p-2 text-center">{totalTeamAScore}</td>
              <td className="border p-2 text-center">{totalTeamBScore}</td>
            </tr>
            <tr>
              <td className="border p-2">Score Diff.</td>
              <td className="border p-2 text-center">{teamAscoreDifference}</td>
              <td className="border p-2 text-center">{teamBscoreDifference}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4 overflow-x-auto" style={{ height: '600px' }}>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">R</th>
              <th className="p-2">C</th>
              <th className="p-2">Team A</th>
              <th className="p-2">Team B</th>
              <th className="p-2">Team A Score</th>
              <th className="p-2">Team B Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={row.round % 2 === 1 ? 'round-bg-1' : ''}>
                <td className="border p-2 text-center">{row.round}</td>
                <td className="border p-2 text-center">{row.court}</td>
                <td className="border p-2">{row.teamA}</td>
                <td className="border p-2">{row.teamB}</td>
                <td className="border p-2 text-center">
                  <Input type="number" className="no-outline w-20" value={scores[row.id]?.teamAScore ?? 0} onChange={(e) => handleScoreChange(row.id, 'A', parseInt(e.target.value, 10))} />
                </td>
                <td className="border p-2 text-center">
                  <Input type="number" className="no-outline w-20" value={scores[row.id]?.teamBScore ?? 0} onChange={(e) => handleScoreChange(row.id, 'B', parseInt(e.target.value, 10))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
