import React, { useState } from 'react';
import { createUserRole } from '../controller/SignupController'; // Import the controller

import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  Paper,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const SignUpView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [store, setStore] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const userData = { username, password, role, store };

    try {
      // Call the API to create a user
      const response = await createUserRole(userData);
      console.log('User created successfully:', response);

      // Set success message
      setSuccess('Usager créé avec success!');
    } catch (err) {
      // Handle error and set error message
      setError(err.message);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 8, margin: '50px auto 0 ' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography
          sx={{ paddingBottom: '10px' }}
          variant='h3'
          align='center'
          color='primary'>
          Inscription
        </Typography>
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        {error && <Typography color='error'>{error}</Typography>}
        {success && <Typography color='primary'>{success}</Typography>}
        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='username'
            label='Username'
            name='username'
            autoComplete='username'
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin='normal' required>
            <InputLabel id='role-label'>Role</InputLabel>
            <Select
              labelId='role-label'
              id='role'
              value={role}
              label='Role'
              onChange={(e) => setRole(e.target.value)}>
              <MenuItem value='admin'>Admin</MenuItem>
              <MenuItem value='dispatch'>Dispatch</MenuItem>
              <MenuItem value='commis'>Commis</MenuItem>
              <MenuItem value='driver'>Driver</MenuItem>
              <MenuItem value='picker'>Picker</MenuItem>
              <MenuItem value='achat'>Achat</MenuItem>
              <MenuItem value='compte'>Compte payable</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin='normal' required>
            <InputLabel id='store-label'>Magasin</InputLabel>
            <Select
              labelId='store-label'
              id='store'
              value={store}
              label='Store'
              onChange={(e) => setStore(e.target.value)}>
              <MenuItem value='st-hubert'>St-Hubert</MenuItem>
              <MenuItem value='st-jean'>St-Jean</MenuItem>
              <MenuItem value='châteauguay'>Châteauguay</MenuItem>
            </Select>
          </FormControl>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default SignUpView;
