import React, { useState, useEffect } from 'react';
import { fetchAllCommisData } from '../controller/CommisStatsController';
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
  Grid,
} from '@mui/material';

const storeColors = {
  1: '#C5A800FF',
  2: '#0087BDFF',
  3: '#00B300FF',
};

const storeNames = {
  1: 'St-Hubert',
  2: 'St-Jean',
  3: 'Chateauguay',
};

const CommisStatsView = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('net_sales');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllCommisData();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 900000);

    return () => clearInterval(interval);
  }, []);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = data.slice().sort((a, b) => {
    if (orderBy === 'net_sales' || orderBy === 'net_sales_MTD') {
      return order === 'asc'
        ? (a[orderBy] || 0) - (b[orderBy] || 0)
        : (b[orderBy] || 0) - (a[orderBy] || 0);
    }
    return 0;
  });

  const getStoreData = (storeId) => {
    return sortedData.filter((item) => item.store === storeId);
  };

  return (
    <Container
      maxWidth='lg'
      sx={{
        padding: '50px!important',
        margin: '0 auto',
        width: '100%!important',
        maxWidth: '100%!important',
      }}>
      <Typography
        variant='h4'
        align='center'
        gutterBottom
        sx={{ color: 'var(--h1)', fontWeight: 'bold', fontSize: '48px' }}>
        Commis Stats
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3].map((storeId) => (
          <Grid item xs={12} md={4} key={storeId}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        fontSize: '26px',
                        color: 'var(--dark-blue)',
                        fontWeight: '500',
                      }}>
                      Commis {storeNames[storeId]}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getStoreData(storeId).map((row, index) => (
                    <TableRow
                      key={index}
                      style={{
                        backgroundColor: storeColors[storeId] || '#fff',
                      }}>
                      <TableCell className='table-cell-commis'>
                        <span>{index + 1}</span>
                        {row.counterman}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CommisStatsView;
