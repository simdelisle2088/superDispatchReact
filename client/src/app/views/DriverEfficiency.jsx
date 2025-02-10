import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import {
  fetchDeliveryStatsByStore,
  fetchDeliveryCountsByDateRange,
} from '../controller/DriverEfficiencyController';
import { format } from 'date-fns';

const DriverEfficiencyView = () => {
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredStats, setFilteredStats] = useState(null);

  const getStats = async () => {
    try {
      const data = await fetchDeliveryStatsByStore();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const handleFilter = async () => {
    if (!startDate || !endDate) {
      console.error('Please select both start and end dates');
      return;
    }
    try {
      const data = await fetchDeliveryCountsByDateRange(
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      setFilteredStats(data);
    } catch (error) {
      console.error('Error fetching delivery counts by date range:', error);
    }
  };

  const handleDateChange = (setter) => (event) => {
    const dateValue = event.target.value;
    if (dateValue) {
      const [year, month, day] = dateValue.split('-');
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      setter(date);
    } else {
      setter(null);
    }
  };

  const renderStatCard = (title, count, color) => (
    <Card sx={{ backgroundColor: color, color: 'white', flex: 1 }}>
      <CardContent>
        <Typography variant='h6'>{title}</Typography>
        <Typography variant='h4'>{count}</Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ padding: 8, height: '100vh', width: '100%', margin: '0 auto' }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ fontWeight: 'bold', color: 'var(--h1)', paddingBottom: '30px' }}>
        Driver Efficiency Stats
      </Typography>

      <Stack direction='row' spacing={2} alignItems='center' marginBottom={4}>
        <TextField
          fullWidth
          label='Start Date'
          type='date'
          InputLabelProps={{ shrink: true }}
          value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
          onChange={handleDateChange(setStartDate)}
        />
        <TextField
          fullWidth
          label='End Date'
          type='date'
          InputLabelProps={{ shrink: true }}
          value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
          onChange={handleDateChange(setEndDate)}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleFilter}
          sx={{ height: '100%' }}>
          Filter
        </Button>
      </Stack>

      {filteredStats && (
        <Box sx={{ marginBottom: 4 }}>
          <Typography
            variant='h5'
            sx={{ color: 'var(--h1)', fontWeight: 'bold', marginBottom: 2 }}>
            Comptes de livraison filtrée
          </Typography>
          <Stack
            direction='row'
            spacing={2}
            sx={{ width: '100%', display: 'block' }}>
            {Object.entries(filteredStats).map(([storeId, stats]) => (
              <Box key={storeId}>
                <Stack direction='row' spacing={4} sx={{ marginBottom: 2 }}>
                  <Typography variant='h5' sx={{ color: 'var(--h1)' }}>
                    Average Picking Time:{' '}
                    {Math.floor(stats.avg_picking_time / 60)}h{' '}
                    {stats.avg_picking_time % 60}m
                  </Typography>
                  <Typography variant='h5' sx={{ color: 'var(--h1)' }}>
                    Drivers actifs: {stats.unique_drivers}
                  </Typography>
                </Stack>
                <Stack direction='row' spacing={2}>
                  {renderStatCard('1-20 Minutes', stats.min_1_20, '#4caf50')}
                  {renderStatCard('21-40 Minutes', stats.min_21_40, '#2196f3')}
                  {renderStatCard('41-60 Minutes', stats.min_41_60, '#ff9800')}
                  {renderStatCard(
                    '60-90 Minutes',
                    stats.min_60_90,
                    '#e91e63'
                  )}{' '}
                  {/* New card */}
                  {renderStatCard(
                    '90+ Minutes',
                    stats.min_90_plus,
                    '#f44336'
                  )}{' '}
                  {/* Updated label */}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      )}
      <Typography
        variant='h5'
        sx={{
          color: 'var(--h1)',
          marginBottom: 2,
          fontWeight: 'bold',
        }}>
        Tous les comptes de livraison
      </Typography>

      {stats ? (
        Object.entries(stats).map(([storeId, storeStats]) => (
          <Box key={storeId} sx={{ marginBottom: 4 }}>
            {/* Display the average picking time at the top */}
            <Typography
              key={`picking-time-${storeId}`}
              variant='h5'
              sx={{ color: 'var(--h1)', paddingBottom: '30px' }}>
              Average Picking Time:{' '}
              {Math.floor(storeStats.avg_picking_time / 60)}h{' '}
              {storeStats.avg_picking_time % 60}m
            </Typography>

            <Stack spacing={2}>
              {/* First row: Time-based delivery statistics with new categories */}
              <Stack direction='row' spacing={2}>
                {renderStatCard('1-20 Minutes', storeStats.min_1_20, '#4caf50')}
                {renderStatCard(
                  '21-40 Minutes',
                  storeStats.min_21_40,
                  '#2196f3'
                )}
                {renderStatCard(
                  '41-60 Minutes',
                  storeStats.min_41_60,
                  '#ff9800'
                )}
                {renderStatCard(
                  '60-90 Minutes',
                  storeStats.min_60_90,
                  '#e91e63'
                )}{' '}
                {/* New category */}
                {renderStatCard(
                  '90+ Minutes',
                  storeStats.min_90_plus,
                  '#f44336'
                )}{' '}
                {/* Updated category */}
              </Stack>

              {/* Second row: Historical delivery statistics */}
              <Stack direction='row' spacing={2}>
                {renderStatCard(
                  'Last 30 Days',
                  storeStats.last_30_days,
                  '#3f51b5'
                )}
                {renderStatCard(
                  'Last 60 Days',
                  storeStats.last_60_days,
                  '#673ab7'
                )}
                {renderStatCard(
                  'Last 90 Days',
                  storeStats.last_90_days,
                  '#9c27b0'
                )}
                {renderStatCard(
                  'Last 120 Days',
                  storeStats.last_120_days,
                  '#e91e63'
                )}
              </Stack>
            </Stack>
          </Box>
        ))
      ) : (
        <Typography variant='body1' color='textSecondary'>
          Loading stats...
        </Typography>
      )}
    </Box>
  );
};

export default DriverEfficiencyView;
