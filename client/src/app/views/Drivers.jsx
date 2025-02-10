import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDrivers,
  updateDriverStatusActive,
  updateDriverStatusNotActive,
} from '../controller/DriverController';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Switch,
  Box,
} from '@mui/material';

const DriverListComponent = () => {
  const [drivers, setDrivers] = useState([]);

  const storeMapping = {
    1: 'Saint-Hubert',
    2: 'Saint-Jean-sur-richelieu',
    3: 'Châteauguay',
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const data = await getDrivers();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
    }
  };

  const goToDriverDetails = (driver) => {
    navigate(`/driver-page/${driver.id}`);
  };

  const toggleActive = async (driver, isActive) => {
    try {
      if (isActive) {
        await updateDriverStatusActive(driver.id);
      } else {
        await updateDriverStatusNotActive(driver.id);
      }

      const updatedDrivers = drivers.map((d) =>
        d.id === driver.id ? { ...d, is_active: isActive } : d
      );
      setDrivers(updatedDrivers);

      console.log('Status updated successfully');
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  return (
    <Box sx={{ padding: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center',
        }}>
        {drivers.map((driver) => (
          <Box key={driver.id} sx={{ width: '100%', maxWidth: '350px' }}>
            <Card
              sx={{
                minWidth: 275,
                backgroundColor: driver.is_active ? '#e8f5e9' : '#ffebee',
                transition: 'background-color 0.3s',
              }}
              elevation={3}>
              <CardContent>
                <Typography variant='h6'>{driver.username}</Typography>
                <Typography variant='body2' color='textSecondary'>
                  Store: {storeMapping[driver.store]}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Status: {driver.is_active ? 'Active' : 'Inactive'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  variant='outlined'
                  onClick={() => goToDriverDetails(driver)}>
                  View Details
                </Button>
                <Switch
                  checked={driver.is_active}
                  onChange={() => toggleActive(driver, !driver.is_active)}
                  color='primary'
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <Typography variant='body2'>
                  {driver.is_active ? 'Deactivate' : 'Activate'}
                </Typography>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DriverListComponent;
