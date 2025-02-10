import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrdersByDriverId } from '../controller/DriverController';
import {
  filterAndCalculateAverageDeliveryTime,
  getDeliveryTime,
  calculateAverageDeliveryTimeForPeriod,
} from '../controller/DriverPageController';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Paper,
  Card,
  CardContent,
  TextField,
} from '@mui/material';

const DriverPage = () => {
  const { id: driverId } = useParams(); // Get driver ID from URL
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]); // New state for filtered orders
  const [, setOriginalOrders] = useState([]);
  const [averageDeliveryTime, setAverageDeliveryTime] = useState('');
  const [averageDeliveryTime7Days, setAverageDeliveryTime7Days] = useState('');
  const [averageDeliveryTime30Days, setAverageDeliveryTime30Days] =
    useState('');
  const [, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 50;

  // Filter states
  const [orderIdFilter, setOrderIdFilter] = useState('');

  useEffect(() => {
    const loadDriverOrders = async (id) => {
      try {
        const { orders: driverOrders } = await getOrdersByDriverId(id);
        setOrders(driverOrders);
        setFilteredOrders(driverOrders); // Initialize filtered orders
        setOriginalOrders(driverOrders);
        setTotalOrders(driverOrders.length);
        setTotalPages(Math.ceil(driverOrders.length / ordersPerPage));
        setAverageDeliveryTime(
          filterAndCalculateAverageDeliveryTime(driverOrders)
        );
        setAverageDeliveryTime7Days(
          calculateAverageDeliveryTimeForPeriod(driverOrders, 7)
        );
        setAverageDeliveryTime30Days(
          calculateAverageDeliveryTimeForPeriod(driverOrders, 30)
        );
      } catch (error) {
        console.error('Error fetching driver orders:', error);
      }
    };

    if (driverId) {
      loadDriverOrders(driverId);
    }
  }, [
    driverId,
    setOrders,
    setOriginalOrders,
    setTotalOrders,
    setTotalPages,
    setAverageDeliveryTime,
  ]);

  useEffect(() => {
    let filtered = orders;

    if (orderIdFilter) {
      filtered = filtered.filter((order) =>
        order.order_number.toString().includes(orderIdFilter)
      );
    }

    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / ordersPerPage));
    setCurrentPage(1);
  }, [orderIdFilter, orders]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  return (
    <Box sx={{ padding: 4, margin: '0 auto' }}>
      <Typography
        variant='h4'
        gutterBottom
        sx={{ color: '#1976D2', fontWeight: 'bold' }}>
        Driver Orders
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          marginBottom: '20px',
        }}>
        <Card
          sx={{
            backgroundColor: '#E3F2FD',
            textAlign: 'center',
            minHeight: '150px',
            width: '300px',
            margin: '10px',
          }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Overall Average Delivery Time
            </Typography>
            <Typography variant='h4' sx={{ color: '#1565C0' }}>
              {averageDeliveryTime}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#C8E6C9',
            textAlign: 'center',
            minHeight: '150px',
            width: '300px',
            margin: '10px',
          }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Last 7 Days Average Delivery Time
            </Typography>
            <Typography variant='h4' sx={{ color: '#2E7D32' }}>
              {averageDeliveryTime7Days}
            </Typography>
          </CardContent>
        </Card>

        <Card
          sx={{
            backgroundColor: '#FFF9C4',
            textAlign: 'center',
            minHeight: '150px',
            width: '300px',
            margin: '10px',
          }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Last 30 Days Average Delivery Time
            </Typography>
            <Typography variant='h4' sx={{ color: '#F9A825' }}>
              {averageDeliveryTime30Days}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          label='Filter by Order ID'
          variant='outlined'
          value={orderIdFilter}
          onChange={(e) => setOrderIdFilter(e.target.value)}
          sx={{ marginRight: '10px', flex: 1 }}
        />
      </Box>

      <Typography
        variant='h6'
        gutterBottom
        sx={{ marginTop: 4, color: '#1976D2' }}>
        Order Details
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Delivered At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Delivery Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.order_number}>
                <TableCell>{order.order_number}</TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {new Date(order.delivered_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  {order.is_delivered ? 'Delivered' : 'Pending'}
                </TableCell>
                <TableCell>{getDeliveryTime(order)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
};

export default DriverPage;
