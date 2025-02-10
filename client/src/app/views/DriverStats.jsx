import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
} from '@mui/material';
import { getOrderCountsPerDay } from '../controller/DriverStatsController';
import moment from 'moment';

const DriverOrderCount = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrdersPerDay = async (searchTerm = '', startDate = '') => {
    try {
      setLoading(true);
      const response = await getOrderCountsPerDay(searchTerm);

      if (!response.orders_per_day) {
        setFilteredDrivers([]);
        return;
      }

      const formattedData = formatData(response.orders_per_day);

      const filteredData = applyDateAndNameFilter(
        formattedData,
        searchTerm,
        startDate
      );

      setFilteredDrivers(filteredData);
    } catch (error) {
      setFilteredDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatData = (ordersPerDay) => {
    const groupedData = [];

    for (const driver in ordersPerDay) {
      if (ordersPerDay.hasOwnProperty(driver)) {
        const driverOrders = ordersPerDay[driver].map((order) => {
          const deliveryTimes = order.routes.flatMap((route) =>
            route.delivery_times
              ? route.delivery_times.map(convertTimeToMinutes)
              : []
          );

          const avgDeliveryTimeDay = deliveryTimes.length
            ? `${Math.floor(
                deliveryTimes.reduce((a, b) => a + b, 0) /
                  deliveryTimes.length /
                  60
              )}h ${Math.floor(
                (deliveryTimes.reduce((a, b) => a + b, 0) /
                  deliveryTimes.length) %
                  60
              )}m`
            : 'N/A';

          return {
            date: order.date,
            count: order.order_count,
            avgDeliveryTimeDay,
            routes: order.routes.map((route) => {
              const orderNumbers = route.order_numbers || [];
              const clientNames = route.client_names || [];
              const deliveryTimes = route.delivery_times || [];

              const combinedData = orderNumbers.map((orderNumber, index) => ({
                order_number: orderNumber,
                client_name: clientNames[index] || 'N/A',
                delivery_time: deliveryTimes[index] || 'N/A',
              }));

              const sortedData = combinedData.sort((a, b) => {
                const timeA = convertTimeToMinutes(a.delivery_time);
                const timeB = convertTimeToMinutes(b.delivery_time);
                return timeA - timeB;
              });

              return {
                route: route.route,
                orders: sortedData,
              };
            }),
          };
        });

        const allDriverDeliveryTimes = driverOrders.flatMap((order) =>
          order.routes.flatMap((route) =>
            route.orders.map((ord) => convertTimeToMinutes(ord.delivery_time))
          )
        );

        const avgDeliveryTimeDriver = allDriverDeliveryTimes.length
          ? `${Math.floor(
              allDriverDeliveryTimes.reduce((a, b) => a + b, 0) /
                allDriverDeliveryTimes.length /
                60
            )}h ${Math.floor(
              (allDriverDeliveryTimes.reduce((a, b) => a + b, 0) /
                allDriverDeliveryTimes.length) %
                60
            )}m`
          : 'N/A';

        groupedData.push({
          driverName: driver,
          avgDeliveryTimeDriver,
          orders: driverOrders,
        });
      }
    }
    return groupedData;
  };

  const applyDateAndNameFilter = (data, driverName, date) => {
    if (!driverName && !date) return data;

    return data
      .filter((driver) =>
        driver.driverName.toLowerCase().includes(driverName.toLowerCase())
      )
      .map((driver) => {
        const filteredOrders = driver.orders.filter((order) => {
          const orderDate = moment(order.date, 'YYYY-MM-DD');
          return date ? orderDate.isSame(moment(date)) : true;
        });

        return {
          driverName: driver.driverName,
          avgDeliveryTimeDriver: driver.avgDeliveryTimeDriver,
          orders: filteredOrders,
        };
      })
      .filter((driver) => driver.orders.length > 0);
  };

  const convertTimeToMinutes = (time) => {
    if (!time || typeof time !== 'string') return 0;

    const [hoursPart, minutesPart] = time.includes('h')
      ? time.split('h')
      : [0, time];

    const hours = parseInt(String(hoursPart).trim()) || 0;
    const minutes =
      parseInt(
        String(minutesPart || '0')
          .replace('m', '')
          .trim()
      ) || 0;

    return hours * 60 + minutes;
  };

  const handleSearch = () => {
    fetchOrdersPerDay(searchTerm, startDate);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setFilteredDrivers([]);
  };

  return (
    <Box style={{ margin: '0 auto', padding: '50px 20px' }}>
      <Box
        style={{
          marginBottom: '20px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
        }}>
        <TextField
          label='Recherche Chauffeur'
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '20px', width: '300px' }}
        />
        <Box
          sx={{
            display: 'flex',
          }}>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '8px', fontSize: '14px' }}
          />
        </Box>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSearch}
          style={{ marginLeft: '10px' }}>
          Search
        </Button>
        <Button
          variant='contained'
          color='secondary'
          onClick={resetFilters}
          style={{ marginLeft: '10px' }}>
          Reset
        </Button>
        <Box className='driver_count_link' style={{ marginLeft: '20px' }}>
          <a href='/driverCounts'>Compte des livraisons par chauffeur</a>
        </Box>
      </Box>

      {loading && (
        <Box display='flex' justifyContent='center' mb={3}>
          <CircularProgress />
        </Box>
      )}

      {filteredDrivers && filteredDrivers.length > 0
        ? filteredDrivers.map((driver) => (
            <Box key={driver.driverName} mb={4}>
              <Typography
                variant='h5'
                color='primary'
                gutterBottom
                textAlign='center'>
                {driver.driverName}
              </Typography>
              {driver.orders.map((order) => (
                <Box key={order.date} mb={4}>
                  <Card>
                    <CardHeader
                      title={`Date: ${order.date}`}
                      subheader={`Order Count: ${order.count} | Avg Delivery Time: ${order.avgDeliveryTimeDay}`}
                      sx={{ backgroundColor: '#f5f5f5', textAlign: 'center' }}
                    />
                    <CardContent>
                      <Box
                        display='flex'
                        flexWrap='wrap'
                        justifyContent='space-between'>
                        {order.routes.map((route) => (
                          <Box key={route.route} width='48%' mb={2}>
                            <Typography
                              variant='h6'
                              color='textSecondary'
                              gutterBottom>
                              Route {route.route}
                            </Typography>
                            <Divider />
                            <Box display='flex' flexDirection='column' mt={2}>
                              {route.orders.map((ord, idx) => (
                                <Box
                                  key={idx}
                                  display='flex'
                                  justifyContent='space-between'
                                  mb={1}>
                                  <Typography variant='body2'>
                                    <strong>#{ord.order_number}</strong>
                                  </Typography>
                                  <Typography variant='body2'>
                                    {ord.client_name}
                                  </Typography>
                                  <Typography variant='body2'>
                                    ({ord.delivery_time})
                                  </Typography>
                                </Box>
                              ))}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          ))
        : !loading && (
            <Typography textAlign='center'>No data available.</Typography>
          )}
    </Box>
  );
};

export default DriverOrderCount;
