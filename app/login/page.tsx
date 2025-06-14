'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await axios.post('/api/login', { username, password });
      if (res.data.success) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('role', res.data.role);
        router.push('/');
      }
    } catch (e: any) {
      setError('Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" mt={4}>Login</Typography>
      <Box mt={2}>
        <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>Login</Button>
        <Button component={Link} href="/signup" fullWidth sx={{ mt: 1 }}>Sign Up</Button>
      </Box>
    </Container>
  );
}
