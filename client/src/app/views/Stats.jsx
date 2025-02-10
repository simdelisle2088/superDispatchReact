import React, { useState, useRef } from 'react';
import useStatsController from '../controller/StatsController';
import {
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
  CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import PrintIcon from '@mui/icons-material/Print';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const StatsView = () => {
  const {
    displayedClients,
    searchQuery,
    setSearchQuery,
    fetchClientOrders,
    resetSearch,
    setPageIndex,
    loading,
  } = useStatsController();

  const [dateRanges, setDateRanges] = useState({});
  const [filterActive, setFilterActive] = useState(false);
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = generatePrintContent();
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = `
      <style>
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .average-time-header {
            background-color: #ffde21 !important;
            padding: 10px;
            margin: 15px 0;
          }
          .print-section { 
            margin: 20px;
            page-break-after: always;
          }
          .order-card { 
            border: 1px solid #ccc; 
            padding: 15px; 
            margin: 15px 0;
            page-break-inside: avoid;
          }
          .section-header { 
            background-color: #f5f5f5; 
            padding: 10px; 
            margin: 15px 0;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          .orders-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .page-header {
            page-break-before: always;
            page-break-after: avoid;
            margin-bottom: 20px;
          }
          @page { 
            margin: 2cm;
            size: A4 portrait;
          }
        }
      </style>
      ${printContent.innerHTML}
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const generatePrintContent = () => {
    return displayedClients
      .map(
        (client) => `
      <div class="print-section">
        <h2>${client.client_name} (${client.customer})</h2>
        <h3 class="delivery-time">Average Delivery Time: ${calculateAvgDeliveryTime(
          client.orders_by_time['1-20min'].orders.concat(
            client.orders_by_time['21-40min'].orders,
            client.orders_by_time['41-60min'].orders,
            client.orders_by_time['60-90min'].orders,
            client.orders_by_time['90+min'].orders
          )
        )}</h3>
        ${['1-20min', '21-40min', '41-60min', '60-90min', '90+min']
          .map(
            (timeSection) => `
            <div class="section-header">
              <h4>${timeSection} - Total Orders: ${getFilteredCount(
              client.orders_by_time[timeSection].orders,
              client.client_name
            )}</h4>
            </div>
            <div class="orders-grid">
              ${filterOrdersByDate(
                client.orders_by_time[timeSection].orders,
                client.client_name
              ).reduce((acc, order, index) => {
                return acc;
              }, '')}
          `
          )
          .join('')}
      </div>
    `
      )
      .join('');
  };

  const handleDateChange = (clientName, dateType, newValue) => {
    setDateRanges((prevDateRanges) => ({
      ...prevDateRanges,
      [clientName]: {
        ...prevDateRanges[clientName],
        [dateType]: newValue,
      },
    }));
  };

  const filterOrdersByDate = (orders, clientName) => {
    if (!filterActive || !orders) return orders || [];

    const dateRange = dateRanges[clientName];
    if (!dateRange || !dateRange.start || !dateRange.end) return orders;

    const start = dayjs(dateRange.start).startOf('day');
    const end = dayjs(dateRange.end).endOf('day');

    return orders.filter((order) => {
      // Add null check for order and delivered_at
      if (!order || !order.delivered_at) return false;

      const deliveredAt = dayjs(order.delivered_at);
      return (
        deliveredAt.isSameOrAfter(start) && deliveredAt.isSameOrBefore(end)
      );
    });
  };

  const getFilteredCount = (orders, clientName) => {
    if (!orders) return 0;
    if (!filterActive) return orders.length;
    return filterOrdersByDate(orders, clientName).length;
  };

  const handleFilterByDate = (clientName) => {
    setFilterActive(true);
  };

  const handleResetDateRange = (clientName) => {
    setDateRanges((prevDateRanges) => ({
      ...prevDateRanges,
      [clientName]: {
        start: '',
        end: '',
      },
    }));
    setFilterActive(false);
  };

  const calculateAvgDeliveryTime = (client) => {
    // Safety check for client data
    if (!client || !client.orders_by_time) {
      console.log('No client data available');
      return 'No valid orders';
    }

    // Define maximum delivery time threshold (1 hour and 30 minutes)
    const MAX_DELIVERY_TIME = 90;

    // If the client has a pre-calculated average from the backend, use that
    if (client.avg_delivery_time) {
      return client.avg_delivery_time;
    }

    const timeSections = [
      '1-20min',
      '21-40min',
      '41-60min',
      '60-90min',
      '90+min',
    ];
    let totalMinutes = 0;
    let totalOrders = 0;

    timeSections.forEach((timeSection) => {
      const ordersInSection = client.orders_by_time[timeSection].orders;
      if (ordersInSection && Array.isArray(ordersInSection)) {
        ordersInSection.forEach((order) => {
          if (order && order.delivery_time) {
            const timeStr = order.delivery_time;
            let minutes = 0;

            if (timeStr.includes('hour')) {
              const match = timeStr.match(/(\d+)\s*hours?\s*(\d+)?/);
              if (match) {
                const hours = parseInt(match[1], 10);
                const mins = parseInt(match[2] || '0', 10);
                minutes = hours * 60 + mins;
              }
            } else {
              const match = timeStr.match(/(\d+)/);
              if (match) {
                minutes = parseInt(match[1], 10);
              }
            }

            // Only include orders within the maximum delivery time threshold
            if (!isNaN(minutes) && minutes <= MAX_DELIVERY_TIME) {
              totalMinutes += minutes;
              totalOrders++;
              console.log(
                `Including order with delivery time: ${minutes} minutes`
              );
            } else if (!isNaN(minutes)) {
              console.log(
                `Excluding order with delivery time: ${minutes} minutes (over ${MAX_DELIVERY_TIME} minutes)`
              );
            }
          }
        });
      }
    });

    if (totalOrders === 0) {
      return 'No valid orders';
    }

    const avgMinutes = totalMinutes / totalOrders;

    if (avgMinutes >= 60) {
      const hours = Math.floor(avgMinutes / 60);
      const minutes = Math.round(avgMinutes % 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${
        minutes !== 1 ? 's' : ''
      }`;
    }

    return `${Math.round(avgMinutes)} minutes`;
  };

  const calculateFilteredAvgDeliveryTime = (client) => {
    // Early validation check
    if (!client || !client.orders_by_time) {
      console.log('No client data available');
      return 'No valid orders';
    }

    let totalMinutes = 0;
    let totalOrders = 0;
    const MAX_DELIVERY_TIME = 90; // 1 hour and 30 minutes threshold

    // We need to look through each time section
    const timeSections = [
      '1-20min',
      '21-40min',
      '41-60min',
      '60-90min',
      '90+min',
    ];

    timeSections.forEach((timeSection) => {
      // Get orders for this time section
      const ordersInSection = client.orders_by_time[timeSection].orders;

      // Make sure we have orders in this section
      if (ordersInSection && Array.isArray(ordersInSection)) {
        ordersInSection.forEach((order) => {
          if (order && order.delivery_time) {
            // Extract the number from the delivery time string
            const timeStr = order.delivery_time;
            let minutes = 0;

            if (timeStr.includes('hour')) {
              // Handle "X hours Y minutes" format
              const match = timeStr.match(/(\d+)\s*hours?\s*(\d+)?/);
              if (match) {
                const hours = parseInt(match[1], 10);
                const mins = parseInt(match[2] || '0', 10);
                minutes = hours * 60 + mins;
              }
            } else {
              // Handle "X minutes" format
              const match = timeStr.match(/(\d+)/);
              if (match) {
                minutes = parseInt(match[1], 10);
              }
            }

            // Only include orders that are within our maximum delivery time threshold
            if (!isNaN(minutes) && minutes <= MAX_DELIVERY_TIME) {
              totalMinutes += minutes;
              totalOrders++;
              // Log included orders for debugging
              console.log(
                `Including order with delivery time: ${minutes} minutes`
              );
            } else if (!isNaN(minutes)) {
              // Log excluded orders for debugging
              console.log(
                `Excluding order with delivery time: ${minutes} minutes (over ${MAX_DELIVERY_TIME} minutes)`
              );
            }
          }
        });
      }
    });

    // Calculate and format the average
    if (totalOrders === 0) {
      return 'No valid orders';
    }

    const avgMinutes = totalMinutes / totalOrders;
    console.log(
      `Total minutes: ${totalMinutes}, Total orders: ${totalOrders}, Average: ${avgMinutes}`
    );

    if (avgMinutes >= 60) {
      const hours = Math.floor(avgMinutes / 60);
      const minutes = Math.round(avgMinutes % 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${
        minutes !== 1 ? 's' : ''
      }`;
    }

    return `${Math.round(avgMinutes)} minutes`;
  };

  const handleSearch = () => {
    setPageIndex(0);
    fetchClientOrders(0);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      ref={printRef}
      sx={{
        width: '100%',
        padding: '50px 20px',
        margin: '0 auto',
        flexGrow: 1,
      }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '20px',
          width: {
            md: '100%',
            lg: '50%',
          },
        }}>
        <TextField
          label='Search Clients'
          variant='outlined'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ flex: 1, marginRight: '10px' }}
        />
        <Button
          variant='contained'
          color='primary'
          onClick={handleSearch}
          sx={{ marginRight: '10px' }}>
          Search
        </Button>
        <Button variant='contained' color='secondary' onClick={resetSearch}>
          Reset
        </Button>
      </Box>

      {displayedClients.length > 0 && (
        <Button
          variant='contained'
          color='primary'
          onClick={handlePrint}
          startIcon={<PrintIcon />}
          sx={{ margin: '30px 10px' }}>
          Print Stats
        </Button>
      )}
      {loading && (
        <Box
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && displayedClients.length === 0 ? (
        <Typography
          sx={{
            color: '#ff0000',
            textAlign: 'left',
            marginTop: '20px',
            paddingLeft: '5px',
          }}>
          No clients found
        </Typography>
      ) : (
        displayedClients.map((client) => (
          <Accordion
            key={`${client.client_name}-${client.customer}`}
            sx={{ marginBottom: '10px', backgroundColor: '#e0f7fa' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: '#00796b', color: '#ffffff' }}>
              <Typography>
                {client.client_name} ({client.customer})
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{ padding: '20px', backgroundColor: '#fafafa' }}>
              <Typography
                variant='h6'
                sx={{ marginBottom: '15px', color: '#00796b' }}>
                Average Delivery Time for All Orders:
                <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
                  {' '}
                  {calculateAvgDeliveryTime(client)}
                </span>
              </Typography>
              {filterActive && (
                <Typography
                  variant='h6'
                  sx={{ marginBottom: '15px', color: '#00796b' }}>
                  Filtered Average times for all orders Excluding special orders
                  "under 1h30min":{' '}
                  <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>
                    {calculateFilteredAvgDeliveryTime(client)}
                  </span>
                </Typography>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                <Typography sx={{ marginRight: '10px' }}>
                  Start Date:
                </Typography>
                <input
                  type='date'
                  value={dateRanges[client.client_name]?.start || ''}
                  onChange={(e) =>
                    handleDateChange(
                      client.client_name,
                      'start',
                      e.target.value
                    )
                  }
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}>
                <Typography sx={{ marginRight: '10px' }}>End Date:</Typography>
                <input
                  type='date'
                  value={dateRanges[client.client_name]?.end || ''}
                  onChange={(e) =>
                    handleDateChange(client.client_name, 'end', e.target.value)
                  }
                />
              </Box>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => handleFilterByDate(client.client_name)}
                sx={{ marginBottom: '20px', marginRight: '10px' }}>
                Apply Date Filter
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => handleResetDateRange(client.client_name)}
                sx={{ marginBottom: '20px' }}>
                Reset Date Range
              </Button>
              {['1-20min', '21-40min', '41-60min', '60-90min', '90+min'].map(
                (timeSection) => (
                  <Accordion key={timeSection} sx={{ marginBottom: '10px' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ backgroundColor: '#004FB6FF', color: '#ffffff' }}>
                      <Typography variant='subtitle1'>
                        {timeSection} ---{' '}
                        <span style={{ color: '#FFFFFFFF', fontWeight: '500' }}>
                          Total Orders:{' '}
                          {getFilteredCount(
                            client.orders_by_time[timeSection].orders,
                            client.client_name
                          )}
                        </span>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ padding: '20px', backgroundColor: '#fafafa' }}>
                      <Grid container spacing={2}>
                        {filterOrdersByDate(
                          client.orders_by_time[timeSection].orders,
                          client.client_name
                        ).map((order, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box
                              sx={{
                                border: '1px solid #00796b',
                                borderRadius: '8px',
                                padding: '10px',
                                backgroundColor: '#ffffff',
                              }}>
                              <Typography variant='body2'>
                                <strong>Order #{order.order_number}</strong>
                              </Typography>
                              <Typography variant='body2'>
                                Delivered at: {order.delivered_at}
                              </Typography>
                              <Typography variant='body2'>
                                Driver: {order.driver_name}
                              </Typography>
                              <Typography
                                variant='body2'
                                sx={{ color: '#ff5722' }}>
                                Delivery Time: {order.delivery_time}
                              </Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                )
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default StatsView;
