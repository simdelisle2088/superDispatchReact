import React, { useState } from 'react';
import RechercheController from '../controller/RechercherController';
import {
  TextField,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  LocalShipping,
  AccessTime,
  LocationOn,
  Person,
  Phone,
  Assignment,
  LocalOffer,
  Check,
  Schedule,
  Map,
} from '@mui/icons-material';

const Rechercher = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Handle search submission
  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const results = await RechercheController.fetchOneOrder(searchTerm);
      setSearchResults(results);
    } catch (err) {
      setError(err.message);
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Format date to local string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  // Render order items
  const renderItems = (items) => (
    <Box mt={2} sx={{ padding: '2rem' }}>
      <Typography variant='h6' gutterBottom>
        Order Items
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={1} className='p-4'>
              <Typography variant='subtitle1' className='font-bold'>
                {item.item}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                {item.description}
              </Typography>
              <Box display='flex' gap={2} mt={1}>
                <Chip
                  label={`Units: ${item.units}`}
                  size='small'
                  color='primary'
                />
                <Chip
                  label={`Scanned: ${item.num_scanned}/${item.confirmed_scanned}`}
                  size='small'
                  color={item.state ? 'success' : 'warning'}
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Render order details
  const renderOrder = (order) => (
    <Card className='mb-4' sx={{ padding: '2rem' }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'>
              <Typography variant='h6'>Order #{order.order_number}</Typography>
              <Chip
                icon={order.is_delivered ? <Check /> : <Schedule />}
                label={order.is_delivered ? 'Delivered' : 'In Progress'}
                color={order.is_delivered ? 'success' : 'primary'}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display='flex' gap={1} alignItems='center'>
              <Person />
              <Typography>{order.client_name} -- </Typography>
              <Typography>#{order.customer}</Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <Phone />
              <Typography>{order.phone_number}</Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <LocationOn />
              <Typography>{order.address}</Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <Map />
              <Typography>{order.latitude}</Typography>
              <Typography>{order.longitude}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display='flex' gap={1} alignItems='center'>
              <Assignment />
              <Typography>Tracking: {order.tracking_number}</Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <LocalOffer />
              <Typography>Price: ${order.price}</Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <AccessTime />
              <Typography>
                Created At: {formatDate(order.created_at)}
              </Typography>
            </Box>
            <Box display='flex' gap={1} alignItems='center' mt={1}>
              <AccessTime />
              <Typography>
                Delivered At: {formatDate(order.delivered_at)}
              </Typography>
            </Box>
          </Grid>

          {order.items && renderItems(order.items)}

          {order.photo_filename && (
            <Grid item xs={12}>
              <Box mt={2}>
                <img
                  src={order.photo_filename}
                  alt='Delivery confirmation'
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box
      className='p-4'
      sx={{
        margin: '5rem 10rem',
      }}>
      <Paper className='p-4 mb-4'>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            label='Search Orders'
            variant='outlined'
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder='Enter order number, tracking number, or customer name'
            className='mb-4'
          />
        </form>
      </Paper>

      {loading && (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity='error' className='mb-4'>
          {error}
        </Alert>
      )}

      {searchResults &&
        Object.entries(searchResults).map(([route, data]) => (
          <Box key={route} className='mb-6'>
            <Box
              display='flex'
              gap={2}
              alignItems='center'
              className='mb-4'
              sx={{ padding: '2rem' }}>
              <LocalShipping />
              <Typography variant='h5'>
                Route: {route} - Driver: {data.driver_name}
              </Typography>
            </Box>
            {data.orders.map((order) => renderOrder(order))}
          </Box>
        ))}
    </Box>
  );
};

export default Rechercher;
