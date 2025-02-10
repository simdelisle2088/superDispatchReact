import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../controller/LoginController';

import {
  Box,
  Button,
  Container,
  TextField,
  Avatar,
  CssBaseline,
  Paper,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LoginView = ({ setPermissions }) => {
  // Accept setPermissions as a prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigation hook

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    try {
      // Call the login API and update permissions in state
      await loginUser({ email, password }, setPermissions);

      // Redirect to home page after successful login
      navigate('/');
    } catch (err) {
      // Handle login error and set error message
      setError(err.message);
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
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
            Connexion
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          {error && <Typography color='error'>{error}</Typography>}
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Utilisateur'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}>
              Connexion
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginView;
