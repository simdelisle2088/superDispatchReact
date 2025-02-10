import React, { useEffect, useState } from 'react';
import RapportController from '../controller/RapportController';
import { getRouteInfo } from '../services/HereApiService';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Box,
  Stack,
  TextField,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const RapportView = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [filteredOrders, setFilteredOrders] = useState({});
  const [routeTimes, setRouteTimes] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalOrders, setTotalOrders] = useState(0);
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState(0);
  const [avgDeliveryTime, setAvgDeliveryTime] = useState('N/A');
  const [loading, setLoading] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const BUFFER_TIME_MS = 180000;

  useEffect(() => {
    fetchOrdersWithRoutes();

    // Only set up the refresh interval if we're not searching
    let refreshIntervalId;
    if (!isSearchActive) {
      refreshIntervalId = setInterval(() => {
        fetchOrdersWithRoutes();
      }, 30000);
    }

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, [page, searchTerm, isSearchActive]); // Add isSearchActive as dependency

  useEffect(() => {
    setFilteredOrders(groupedOrders);
  }, [searchTerm, groupedOrders]);

  useEffect(() => {
    fetchOrderStatistics();
  }, []);

  useEffect(() => {
    calculateTotalAndAverageTime();
  }, [filteredOrders]);

  useEffect(() => {
    fetchOrdersWithRoutes();
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchOrdersWithRoutes();
  }, [searchTerm]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRouteTimes((prevTimes) => {
        const updatedTimes = {};

        Object.keys(prevTimes).forEach((route) => {
          const arrivalString = prevTimes[route]?.arrival;

          if (arrivalString) {
            const arrivalTime = new Date(arrivalString).getTime();
            const currentTime = Date.now();
            const timeLeft = arrivalTime + BUFFER_TIME_MS - currentTime;

            updatedTimes[route] = {
              ...prevTimes[route],
              timeLeft: timeLeft > 0 ? timeLeft : 0,
            };
          } else {
            updatedTimes[route] = {
              ...prevTimes[route],
              timeLeft: 0,
            };
          }
        });
        return updatedTimes;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchOrderStatistics = async () => {
    try {
      const stats = await RapportController.fetchOrderStatistics();
      setTotalOrders(stats.total_orders);
      setDeliveredOrdersCount(stats.delivered_orders_count);
      setAvgDeliveryTime(stats.average_delivery_time);
    } catch (error) {
      console.error('Error fetching order statistics:', error);
    }
  };

  const fetchOrdersWithRoutes = async () => {
    try {
      const routes = await RapportController.fetchOrdersByPage(
        page,
        100,
        searchTerm
      );

      if (Object.keys(routes).length === 0) {
        setHasMore(false);
        return;
      }

      const sortedRoutes = Object.keys(routes)
        .sort((a, b) => {
          const latestOrderA = Math.max(
            ...routes[a].orders.map((order) =>
              new Date(order.created_at).getTime()
            )
          );
          const latestOrderB = Math.max(
            ...routes[b].orders.map((order) =>
              new Date(order.created_at).getTime()
            )
          );
          return latestOrderB - latestOrderA;
        })
        .reduce((acc, key) => {
          acc[key] = routes[key];
          return acc;
        }, {});

      const searchTerms = searchTerm
        .split(/[ ,]+/)
        .map((term) => term.trim().toLowerCase());

      const matchedTrackingNumbers = new Set();

      Object.values(sortedRoutes).forEach((route) => {
        route.orders.forEach((order) => {
          const matchesClientName = order.client_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesOrderNumber = order.order_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          let matchesMergedOrders = false;
          if (order.merged_order_numbers) {
            try {
              const mergedOrders = JSON.parse(order.merged_order_numbers);
              matchesMergedOrders = searchTerms.some((term) =>
                mergedOrders.some((mergedOrder) =>
                  mergedOrder.toLowerCase().includes(term)
                )
              );
            } catch (error) {
              console.error('Error parsing merged_order_numbers:', error);
            }
          }

          if (matchesClientName || matchesOrderNumber || matchesMergedOrders) {
            matchedTrackingNumbers.add(order.tracking_number);
          }
        });
      });

      const filteredRoutes = {};

      Object.keys(sortedRoutes).forEach((route) => {
        const routeOrders = sortedRoutes[route].orders.filter((order) =>
          matchedTrackingNumbers.has(order.tracking_number)
        );

        if (routeOrders.length > 0 || !searchTerm) {
          filteredRoutes[route] = {
            ...sortedRoutes[route],
            orders:
              routeOrders.length > 0 ? routeOrders : sortedRoutes[route].orders,
          };
        }
      });

      setGroupedOrders(filteredRoutes);
      setFilteredOrders(filteredRoutes);
    } catch (error) {
      console.error('Error fetching orders or route info:', error);
    }
  };

  const spinAnimation = {
    animation: 'spin 1s infinite linear',
  };

  const displayTime = async (route) => {
    let filteredRoutes = routeTimes;
    const val = await getRouteInfo([route]);
    filteredRoutes = { ...filteredRoutes, ...val };

    await setRouteTimes(filteredRoutes);
    return;
  };

  const calculateTotalAndAverageTime = () => {
    let totalDeliveryTime = 0;
    let deliveredOrdersCount = 0;

    Object.values(filteredOrders).forEach((route) => {
      route.orders.forEach((order) => {
        if (order.delivered_at !== '1000-01-01T12:00:00') {
          const createdTime = new Date(order.created_at).getTime();
          const deliveredTime = new Date(order.delivered_at).getTime();
          totalDeliveryTime += deliveredTime - createdTime;
          deliveredOrdersCount += 1;
        }
      });
    });

    if (deliveredOrdersCount > 0) {
      const avgTimeMs = totalDeliveryTime / deliveredOrdersCount;
      const hours = Math.floor(avgTimeMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      setAvgDeliveryTime(`${hours}h ${minutes}m`);
    } else {
      setAvgDeliveryTime('N/A');
    }
  };

  const formatTime = (ms) => {
    if (ms > 0) {
      const totalSeconds = Math.floor(ms / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      return `${hours}h ${minutes}m ${seconds}s`;
    } else {
      return 'À Proximité';
    }
  };

  const calculateDeliveryTime = (createdAt, deliveredAt) => {
    const createdTime = new Date(createdAt).getTime();
    const deliveredTime = new Date(deliveredAt).getTime();

    if (createdTime && deliveredTime && deliveredAt !== '1000-01-01T12:00:00') {
      const diffMs = deliveredTime - createdTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } else {
      return 'N/A';
    }
  };

  const calculateOrderDelay = (fullOrderCreatedAt, deliveredAt) => {
    const createdTime = new Date(fullOrderCreatedAt).getTime();
    const deliveredTime = new Date(deliveredAt).getTime();

    if (createdTime && deliveredTime && deliveredAt !== '1000-01-01T12:00:00') {
      const diffMs = deliveredTime - createdTime;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h ${minutes}m`;
    } else {
      return 'N/A';
    }
  };

  const isValidFile = (filename) => {
    if (!filename || filename.endsWith('/no')) {
      return false;
    }
    try {
      const fileObj = JSON.parse(filename);
      return !(fileObj.detail && fileObj.detail === 'Not Found');
    } catch {
      return true;
    }
  };

  const handleNextPage = () => {
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
  };

  const handleClick = async (route) => {
    setLoading(route);
    await displayTime(route);
    setLoading(undefined);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setIsSearchActive(e.target.value !== '');
  };

  const handleResetSearch = () => {
    setSearchTerm('');
    setIsSearchActive(false);
    fetchOrdersWithRoutes();
    setPage('');
  };

  return (
    <Box sx={{ padding: '0 10px 20px', width: '100%', minHeight: '100vh' }}>
      <Box
        sx={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 auto 50px',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            width: '100%',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
          }}>
          <TextField
            label='Search by Order Number'
            variant='outlined'
            margin='dense'
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsSearchActive(true);
                fetchOrdersWithRoutes();
              }
            }}
            value={searchTerm}
            sx={{
              width: {
                xs: '100%',
                sm: '80%',
                md: '20%',
              },
            }}
          />
          <Button
            sx={{
              padding: '15px 30px',
              width: 'fit-content',
              marginTop: '5px',
              color: 'var(--red)',
              border: '1px solid var(--red)',
            }}
            onClick={handleResetSearch}
            variant='outlined'>
            Reset
          </Button>
        </Box>
        <Box className='box_stats' sx={{ textAlign: 'right' }}>
          <Typography
            sx={{ color: 'var(--h1)', fontWeight: 'bold' }}
            variant='h6'
            gutterBottom>
            Order Statistics
          </Typography>
          <Typography>
            <span>Total Orders:</span> {totalOrders}
          </Typography>
          <Typography>
            <span>Delivered Orders:</span> {deliveredOrdersCount}
          </Typography>
          <Typography>
            <span>Average Delivery Time:</span> {avgDeliveryTime}
          </Typography>
        </Box>
      </Box>

      {Object.keys(filteredOrders).length === 0 ? (
        <Typography variant='h6'>No orders available</Typography>
      ) : (
        Object.keys(filteredOrders).map((route) => (
          <Box key={route} sx={{ marginBottom: 4 }}>
            <Typography
              variant='h5'
              gutterBottom
              sx={{ color: 'var(--h1)', fontWeight: '600' }}>
              {route} - {filteredOrders[route].driver_name}
            </Typography>
            {filteredOrders[route].orders.map((order) => {
              const isDelivered = order.delivered_at !== '1000-01-01T12:00:00';
              const timeLeft = routeTimes[order.order_number]?.timeLeft;
              let mergedOrdersArray = [];
              try {
                mergedOrdersArray = order.merged_order_numbers
                  ? JSON.parse(order.merged_order_numbers)
                  : [];
              } catch (error) {
                console.error('Error parsing merged_order_numbers:', error);
              }
              return (
                <Accordion
                  key={order.tracking_number}
                  sx={{
                    marginY: 1,
                    backgroundColor: isDelivered
                      ? 'var(--delivered)'
                      : 'var(--dark-blue)',
                    color: isDelivered ? 'var(--text-delivered)' : 'white',
                  }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        justifyContent: 'space-between',
                      }}>
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontSize: '20px',
                            letterSpacing: '0.03em',
                            flexGrow: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}>
                          {order.tracking_number} — {order.client_name}
                          {isDelivered && <span>(Livré)</span>}
                        </Typography>
                        {mergedOrdersArray.length > 0 && (
                          <Typography
                            sx={{
                              fontWeight: '400',
                              fontSize: '16px',
                              marginLeft: '10px',
                              color: 'var(--highlight-color)',
                            }}>
                            Merged Orders: {mergedOrdersArray.join(', ')}
                          </Typography>
                        )}
                      </Box>

                      {!isDelivered && (
                        <Typography
                          sx={{
                            fontWeight: '400',
                            fontSize: '16px',
                            marginRight: '10px',
                          }}>
                          {timeLeft !== undefined ? formatTime(timeLeft) : ''}
                          <Button
                            aria-label='Refresh'
                            onClick={() => handleClick(route)}>
                            {loading == route ? (
                              <RefreshIcon sx={spinAnimation} />
                            ) : routeTimes[order.order_number] ? (
                              <RefreshIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </Button>
                        </Typography>
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ marginLeft: 2 }}>
                    <Typography>Adresse: {order.address}</Typography>
                    <Typography>
                      Numéro de suivi: {order.tracking_number}
                    </Typography>
                    <Typography>
                      Imprimé à:{' '}
                      {new Date(order.full_order_created_at).toLocaleString()}
                    </Typography>
                    <Typography>
                      Créé à: {new Date(order.created_at).toLocaleString()}
                    </Typography>
                    <Typography>
                      Livré à: {new Date(order.delivered_at).toLocaleString()}
                    </Typography>
                    <Typography>
                      Délai de la Commande:{' '}
                      {calculateOrderDelay(
                        order.full_order_created_at,
                        order.delivered_at
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        marginBottom: '10px',
                      }}>
                      Délai de la livraison:{' '}
                      {calculateDeliveryTime(
                        order.created_at,
                        order.delivered_at
                      )}
                    </Typography>
                    {isValidFile(order.photo_filename) && (
                      <Typography
                        component='a'
                        href={order.photo_filename}
                        target='_blank'
                        rel='noopener noreferrer'
                        color='var(--red)'
                        style={{
                          fontWeight: 'bold',
                          textDecoration: 'none',
                        }}>
                        Voir Photo
                      </Typography>
                    )}
                    <Box sx={{ marginTop: 2 }}>
                      {order.items.map((item, index) => (
                        <Box key={index} sx={{ marginTop: 1 }}>
                          <Typography>Commande: {item.order_number}</Typography>
                          <Box>
                            <Typography>
                              <b>Item:</b> {item.item}
                            </Typography>
                            <Typography>
                              <b>Description:</b> {item.description}
                            </Typography>
                            <Typography>
                              <b>Quantitée:</b> {item.units}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </Box>
        ))
      )}

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
          Précédent
        </Button>
        <Typography variant='h6'>Page {page}</Typography>
        <Button
          variant='contained'
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextPage}
          disabled={!hasMore}>
          Suivant
        </Button>
      </Stack>
    </Box>
  );
};

export default RapportView;
