'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await axios.post('/api/signup', { username, password });
      if (res.data.success) {
        router.push('/login');
      }
    } catch (e: any) {
      setError('Signup failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" mt={4}>Sign Up</Typography>
      <Box mt={2}>
        <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Sign Up</Button>
        <Button component={Link} href="/login" fullWidth sx={{ mt: 1 }}>Back to Login</Button>
      </Box>
    </Container>
  );
}
