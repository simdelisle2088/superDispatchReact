import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  TableSortLabel,
} from '@mui/material';
import DriverStatsController from '../controller/DriverCountController';

const DriverCounts = () => {
  const [driverStats, setDriverStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderBy, setOrderBy] = useState('driverName');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    const fetchDriverStats = async () => {
      try {
        const stats = await DriverStatsController.getFormattedDriverStats();
        setDriverStats(stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriverStats();
  }, []);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = React.useMemo(() => {
    const compareFunction = (a, b) => {
      let valueA = a[orderBy];
      let valueB = b[orderBy];

      // Handle numeric fields
      if (orderBy !== 'driverName') {
        valueA = Number(valueA);
        valueB = Number(valueB);
      }

      if (valueA < valueB) {
        return order === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    };

    return [...driverStats].sort(compareFunction);
  }, [driverStats, order, orderBy]);

  if (loading) {
    return (
      <Box
        display='flex'
        justifyContent='center'
        alignItems='center'
        minHeight='200px'>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color='error'>Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      p={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
      }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{
          color: 'var(--h1)',
          paddingTop: '30px',
          fontWeight: 'Bold',
        }}>
        Compte des livraisons par chauffeur
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'driverName'}
                  direction={orderBy === 'driverName' ? order : 'asc'}
                  onClick={() => handleRequestSort('driverName')}>
                  <strong>Chauffeur</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'totalDeliveries'}
                  direction={orderBy === 'totalDeliveries' ? order : 'asc'}
                  onClick={() => handleRequestSort('totalDeliveries')}>
                  <strong>Total des livraisons</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'last30Days'}
                  direction={orderBy === 'last30Days' ? order : 'asc'}
                  onClick={() => handleRequestSort('last30Days')}>
                  <strong>30 derniers jours</strong>
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={orderBy === 'last60Days'}
                  direction={orderBy === 'last60Days' ? order : 'asc'}
                  onClick={() => handleRequestSort('last60Days')}>
                  <strong>60 derniers jours</strong>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((driver, index) => (
              <TableRow
                key={index}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{driver.driverName}</TableCell>
                <TableCell align='right'>{driver.totalDeliveries}</TableCell>
                <TableCell align='right'>{driver.last30Days}</TableCell>
                <TableCell align='right'>{driver.last60Days}</TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DriverCounts;
