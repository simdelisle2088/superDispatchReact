import React, { useEffect, useState } from 'react';
import {
  getLocationCountsByUser,
  getPickedItemCountsByUser,
} from '../controller/PickerStatsController';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TableSortLabel,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const UserLocationStats = () => {
  const [locationCounts, setLocationCounts] = useState({});
  const [pickedCounts, setPickedCounts] = useState({});
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('user');
  const [order, setOrder] = useState('asc');
  const [pickedOrderBy, setPickedOrderBy] = useState('user');
  const [pickedOrder, setPickedOrder] = useState('asc');

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationData = await getLocationCountsByUser();
        setLocationCounts(locationData);
      } catch (err) {
        setError('Failed to fetch location counts.');
      }
    };

    const fetchPickedData = async () => {
      try {
        const pickedData = await getPickedItemCountsByUser();
        setPickedCounts(pickedData);
      } catch (err) {
        setError('Failed to fetch picked item counts.');
      }
    };

    fetchLocationData();
    fetchPickedData();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handlePickedRequestSort = (property) => {
    const isAsc = pickedOrderBy === property && pickedOrder === 'asc';
    setPickedOrder(isAsc ? 'desc' : 'asc');
    setPickedOrderBy(property);
  };

  const sortData = (data, orderBy, order) => {
    return Object.entries(data).sort((a, b) => {
      let valueA, valueB;

      switch (orderBy) {
        case 'user':
          valueA = a[0];
          valueB = b[0];
          break;
        case 'today':
          valueA = a[1].today_count || 0;
          valueB = b[1].today_count || 0;
          break;
        case 'last30':
          valueA = a[1].last_30_days_count;
          valueB = b[1].last_30_days_count;
          break;
        case '31to60':
          valueA = a[1].days_31_to_60_count;
          valueB = b[1].days_31_to_60_count;
          break;
        case 'total':
          valueA = a[1].total_location_count || a[1].total_pick_count;
          valueB = b[1].total_location_count || b[1].total_pick_count;
          break;
        default:
          valueA = a[0];
          valueB = b[0];
      }

      if (order === 'desc') {
        return valueB < valueA ? -1 : valueB > valueA ? 1 : 0;
      } else {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      }
    });
  };

  // Prepare data for charts
  const chartData = Object.entries(pickedCounts).map(([user, stats]) => ({
    name: user,
    today: stats.today_count || 0,
    last30Days: stats.last_30_days_count,
    days31to60: stats.days_31_to_60_count,
  }));

  const SortableTableCell = ({
    align,
    onClick,
    ordered,
    orderDirection,
    children,
  }) => (
    <TableCell
      align={align}
      style={{
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
      }}>
      <TableSortLabel
        active={ordered}
        direction={orderDirection}
        onClick={onClick}>
        {children}
      </TableSortLabel>
    </TableCell>
  );

  return (
    <Container
      maxWidth='lg'
      sx={{ padding: 8, width: '100%', margin: '0 auto' }}>
      <Typography
        variant='h4'
        style={{
          color: 'var(--h1)',
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        Users Stats
      </Typography>

      {error ? (
        <Typography color='error' variant='body1' align='center'>
          {error}
        </Typography>
      ) : (
        <>
          <div className='w-full h-96 mb-8'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='today' fill='#4caf50' name='Today' />
                <Bar dataKey='last30Days' fill='#2196f3' name='Last 30 Days' />
                <Bar dataKey='days31to60' fill='#ff9800' name='31-60 Days' />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={3}
            justifyContent='center'
            alignItems='stretch'>
            <TableContainer component={Paper} elevation={3} sx={{ flex: 1 }}>
              <Typography
                variant='h6'
                style={{
                  padding: '16px',
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'var(--h1)',
                }}>
                Nombre d'emplacements par utilisateur
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <SortableTableCell
                      align='left'
                      onClick={() => handleRequestSort('user')}
                      ordered={orderBy === 'user'}
                      orderDirection={order}>
                      Utilisateur
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handleRequestSort('today')}
                      ordered={orderBy === 'today'}
                      orderDirection={order}>
                      Today
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handleRequestSort('last30')}
                      ordered={orderBy === 'last30'}
                      orderDirection={order}>
                      30 jours
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handleRequestSort('31to60')}
                      ordered={orderBy === '31to60'}
                      orderDirection={order}>
                      31 à 60 jours
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handleRequestSort('total')}
                      ordered={orderBy === 'total'}
                      orderDirection={order}>
                      Total
                    </SortableTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData(locationCounts, orderBy, order).map(
                    ([user, stats]) => (
                      <TableRow key={user}>
                        <TableCell align='left' style={{ color: '#3f51b5' }}>
                          {user}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#4caf50' }}>
                          {stats.today_count || 0}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.last_30_days_count}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.days_31_to_60_count}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.total_location_count}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TableContainer component={Paper} elevation={3} sx={{ flex: 1 }}>
              <Typography
                variant='h6'
                style={{
                  padding: '16px',
                  backgroundColor: '#f0f0f0',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'var(--h1)',
                }}>
                Éléments sorti par utilisateur
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <SortableTableCell
                      align='left'
                      onClick={() => handlePickedRequestSort('user')}
                      ordered={pickedOrderBy === 'user'}
                      orderDirection={pickedOrder}>
                      Utilisateur
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handlePickedRequestSort('today')}
                      ordered={pickedOrderBy === 'today'}
                      orderDirection={pickedOrder}>
                      Aujourd'hui
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handlePickedRequestSort('last30')}
                      ordered={pickedOrderBy === 'last30'}
                      orderDirection={pickedOrder}>
                      30 jours
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handlePickedRequestSort('31to60')}
                      ordered={pickedOrderBy === '31to60'}
                      orderDirection={pickedOrder}>
                      31 à 60 jours
                    </SortableTableCell>
                    <SortableTableCell
                      align='right'
                      onClick={() => handlePickedRequestSort('total')}
                      ordered={pickedOrderBy === 'total'}
                      orderDirection={pickedOrder}>
                      Total
                    </SortableTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortData(pickedCounts, pickedOrderBy, pickedOrder).map(
                    ([user, stats]) => (
                      <TableRow key={user}>
                        <TableCell align='left' style={{ color: '#3f51b5' }}>
                          {user}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#4caf50' }}>
                          {stats.today_count || 0}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.last_30_days_count}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.days_31_to_60_count}
                        </TableCell>
                        <TableCell
                          align='right'
                          style={{ fontWeight: '500', color: '#f57c00' }}>
                          {stats.total_pick_count}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default UserLocationStats;
