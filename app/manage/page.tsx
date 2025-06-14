'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem } from '@mui/material';

interface User {
  username: string;
  role: string;
}

export default function ManagePage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'super-admin') {
      router.push('/');
      return;
    }
    fetchUsers(role);
  }, [router]);

  const fetchUsers = async (role: string | null) => {
    const res = await axios.get('/api/users', { headers: { 'x-role': role || '' } });
    setUsers(res.data.users);
  };

  const handleRoleChange = async (username: string, newRole: string) => {
    const role = localStorage.getItem('role');
    await axios.put('/api/users', { username, role: newRole }, { headers: { 'x-role': role || '' } });
    setUsers(prev => prev.map(u => u.username === username ? { ...u, role: newRole } : u));
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Role Management</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map(u => (
            <TableRow key={u.username}>
              <TableCell>{u.username}</TableCell>
              <TableCell>
                <Select value={u.role} onChange={e => handleRoleChange(u.username, e.target.value as string)}>
                  <MenuItem value="super-admin">super-admin</MenuItem>
                  <MenuItem value="admin">admin</MenuItem>
                  <MenuItem value="member">member</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
