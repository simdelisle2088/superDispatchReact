import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Box,
  Snackbar,
  Alert,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UpdateUserController from '../controller/UpdateUserController';

const Update = () => {
  const { users, loading, error, updateUser, updateLoading, updateError } =
    UpdateUserController();
  const [selectedRole, setSelectedRole] = useState({});
  const [selectedStore, setSelectedStore] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'dispatch', label: 'Dispatch' },
    { value: 'commis', label: 'Commis' },
    { value: 'driver', label: 'Driver' },
    { value: 'picker', label: 'Picker' },
    { value: 'achat', label: 'Achat' },
    { value: 'compte', label: 'Compte payable' },
  ];

  const storeMapping = {
    1: 'St-Hubert',
    2: 'St-Jean',
    3: 'Châteauguay',
  };

  const stores = [
    { value: 1, label: 'St-Hubert' },
    { value: 2, label: 'St-Jean' },
    { value: 3, label: 'Châteauguay' },
  ];

  const handleRoleChange = (userId, newRole) => {
    setSelectedRole((prevState) => ({
      ...prevState,
      [userId]: newRole,
    }));
  };

  const handleStoreChange = (userId, newStore) => {
    setSelectedStore((prevState) => ({
      ...prevState,
      [userId]: newStore,
    }));
  };

  const handleUpdate = async (userId) => {
    const updatedRole = selectedRole[userId];
    const updatedStore = selectedStore[userId];
    const user = users.find((u) => u.id === userId);

    const payload = {
      username: user.username,
      role_name: updatedRole || user.role.name,
      store: storeMapping[updatedStore || user.store],
    };

    try {
      await updateUser(
        userId,
        payload.username,
        payload.role_name,
        payload.store,
        user.permissions
      );

      setSuccessMessage(true);
    } catch (err) {
      console.error('Error updating user:', err);
      setErrorMessage(
        err.response?.data?.detail ||
          'An error occurred while updating the user.'
      );
    }
  };

  if (loading || updateLoading) {
    return <CircularProgress />;
  }

  if (error || updateError) {
    return (
      <Typography color='error'>
        {error?.message || updateError?.message}
      </Typography>
    );
  }

  return (
    <Paper elevation={3} sx={{ margin: '50px auto 0 ' }}>
      <Box
        sx={{
          padding: {
            xs: '16px',
            sm: '24px 50px',
            md: '24px 100px',
            lg: '24px 150px',
            xl: '36px 20px',
          },
        }}>
        <Typography
          variant='h4'
          gutterBottom
          sx={{ color: '#1976D2', fontWeight: 'bold' }}>
          Mettre à jour les utilisateurs
        </Typography>
        {users.map((user) => (
          <Accordion key={user.id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${user.id}-content`}
              id={`panel-${user.id}-header`}>
              <Typography
                sx={{
                  color: 'var(--h1)',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  width: '100%',
                }}>
                {user.username} - {storeMapping[user.store]}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant='subtitle1'>{`Username: ${user.username}`}</Typography>

              <FormControl fullWidth margin='normal'>
                <InputLabel id={`role-label-${user.id}`}>Role</InputLabel>
                <Select
                  labelId={`role-label-${user.id}`}
                  value={selectedRole[user.id] || user.role.name}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  label='Role'>
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin='normal'>
                <InputLabel id={`store-label-${user.id}`}>Store</InputLabel>
                <Select
                  labelId={`store-label-${user.id}`}
                  value={selectedStore[user.id] || user.store}
                  onChange={(e) => handleStoreChange(user.id, e.target.value)}
                  label='Store'>
                  {stores.map((store) => (
                    <MenuItem key={store.value} value={store.value}>
                      {store.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant='contained'
                color='primary'
                onClick={() => handleUpdate(user.id)}>
                Update
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}

        <Snackbar
          open={successMessage}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(false)}>
          <Alert onClose={() => setSuccessMessage(false)} severity='success'>
            User updated successfully!
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage('')}>
          <Alert onClose={() => setErrorMessage('')} severity='error'>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Paper>
  );
};

export default Update;
