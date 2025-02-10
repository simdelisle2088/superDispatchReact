import React, { useState, useEffect } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Stack,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import PslController from '../controller/PslController';
import { format, parseISO } from 'date-fns';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Psl = () => {
  const [customers, setCustomers] = useState([]); // Customer data
  const [loading, setLoading] = useState(true);
  const [driverLoading, setDriverLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Check if more pages are available
  const [, setTotal] = useState(0); // Total number of customers

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [store, setStore] = useState('');

  // Helper function to format date correctly before sending to backend
  const formatDate = (date) => {
    if (!date) return null;
    return format(parseISO(date), 'yyyy-MM-dd'); // Format date as 'YYYY-MM-DD'
  };

  // Fetch customer data from API
  const fetchCustomers = async (currentPage, customFilters = {}) => {
    try {
      setLoading(true);
      const { customers: newCustomers, total } =
        await PslController.fetchCustomersByPage(
          currentPage,
          20,
          formatDate(customFilters.startDate), // Use updated filters for API call
          formatDate(customFilters.endDate), // Use updated filters for API call
          customFilters.orderNumber,
          customFilters.store
        );

      setCustomers(newCustomers);
      setTotal(total);
      setHasMore(newCustomers.length > 0 && newCustomers.length === 20);
      setLoading(false);

      const orderNumbers = newCustomers.map(
        (customer) => customer.order_number
      );
      fetchDriverNames(orderNumbers);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const fetchDriverNames = async (orderNumbers) => {
    try {
      setDriverLoading(true);
      const driverNames = await PslController.fetchDriverNames(orderNumbers);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) => ({
          ...customer,
          driver_name:
            driverNames.find((d) => d.order_number === customer.order_number)
              ?.driver_name || '',
        }))
      );
      setDriverLoading(false);
    } catch (err) {
      console.error('Error fetching driver names:', err);
      setDriverLoading(false);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    fetchCustomers(page, {
      startDate,
      endDate,
      orderNumber,
      store,
    });
  }, [page, store]);

  // Handle page change
  const handleNextPage = () => {
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  // Handle the search button click to set filters and fetch data
  const handleSearch = () => {
    setPage(1);
    fetchCustomers(1, {
      startDate,
      endDate,
      orderNumber,
      store,
    }); // Fetch with updated filters
  };

  // Handle resetting filters
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setOrderNumber('');
    setPage(1);
    fetchCustomers(1, {
      startDate: '',
      endDate: '',
      orderNumber: '',
      store: '',
    }); // Refresh with default filter values
  };

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom style={{ color: '#3f51b5' }}>
        PSL Customers List
      </Typography>

      {/* Date Range and Search Filters */}
      <Box sx={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <TextField
          type='date'
          label='Start Date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }} // Keep the label floating
        />
        <TextField
          type='date'
          label='End Date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }} // Keep the label floating
        />
        <TextField
          label='Search by Order Number'
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          style={{ flex: 1 }}
        />
        <FormControl style={{ minWidth: 120 }}>
          <InputLabel>Store</InputLabel>
          <Select
            value={store}
            onChange={(e) => setStore(e.target.value)}
            label='Store'>
            <MenuItem value=''>All Stores</MenuItem>
            <MenuItem value={1}>St-Hubert</MenuItem>
            <MenuItem value={2}>St-Jean</MenuItem>
            <MenuItem value={3}>Chateauguay</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' onClick={handleSearch}>
          Search
        </Button>
        <Button variant='contained' onClick={handleReset}>
          Reset
        </Button>
      </Box>

      {/* Loading Indicator */}
      {loading && !customers.length && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem',
          }}>
          <CircularProgress />
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <Typography variant='h6' color='error' style={{ textAlign: 'center' }}>
          Error: {error.message}
        </Typography>
      )}

      {/* Customer List */}
      {!loading && customers && customers.length > 0 ? (
        <Paper
          elevation={3}
          style={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: '#f0f0f0',
          }}>
          <List>
            {customers.map((customer, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <Typography
                      variant='h5'
                      style={{ color: 'var(--dark-blue)' }}>
                      {`Order Number: ${customer.order_number}`}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant='h6' style={{ color: 'var(--blue)' }}>
                        {`Client Number: ${customer.customer}`}
                      </Typography>
                      <Typography
                        variant='body1'
                        style={{ color: 'var(--h1)' }}>
                        {`Client Name: ${customer.client_name}`}
                      </Typography>
                      <Typography>{`Driver Name: ${
                        customer.driver_name ||
                        (driverLoading ? 'Loading...' : '')
                      }`}</Typography>
                      <Typography
                        style={{
                          color: 'var(--h1)',
                        }}>{`Store: ${customer.store}`}</Typography>
                      <Typography
                        variant='body2'
                        style={{ color: 'var(--date)' }}>
                        {`Created At: ${format(
                          new Date(customer.created_date),
                          'yyyy-MM-dd HH:mm:ss'
                        )}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        !loading && (
          <Typography variant='h6' style={{ textAlign: 'center' }}>
            No customers found.
          </Typography>
        )
      )}

      {/* Pagination Controls */}
      <Stack
        direction='row'
        spacing={2}
        justifyContent='center'
        alignItems='center'
        sx={{ marginTop: 4 }}>
        <Button
          variant='contained'
          startIcon={<ArrowBackIosIcon />}
          onClick={handlePrevPage}
          disabled={page === 1}>
          Previous
        </Button>
        <Typography variant='h6'>Page {page}</Typography>
        <Button
          variant='contained'
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextPage}
          disabled={!hasMore}>
          Next
        </Button>
      </Stack>
    </Container>
  );
};

export default Psl;
