import { useState } from 'react';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

// Define the headers to be used in every request
const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};
const useStatsController = () => {
  const [clients, setClients] = useState([]);
  const [displayedClients, setDisplayedClients] = useState([]);
  const [, setFilteredClients] = useState([]);
  const [ordersPerPage] = useState(12);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderPagination, setOrderPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalClients, setTotalClients] = useState(0);

  const fetchClientOrders = async () => {
    const storeId = localStorage.getItem('store');
    if (storeId && searchQuery.trim()) {
      if (!searchQuery.trim()) {
        console.error('Please enter a client name or number to search.');
        return;
      }
      try {
        setLoading(true);
        setDisplayedClients([]);
        const response = await axios.post(
          `${API_URL}/misc_dispatch/v2/get_client_orders_info`,
          {
            store: parseInt(storeId, 10),
            search: searchQuery,
            pageIndex,
            ordersPerPage,
          },
          { headers }
        );
        const data = response.data;
        setClients(data.clients);
        setTotalClients(data.totalClients);
        setDisplayedClients(data.clients);
        setLoading(false);
        filterClients(data);
        initializePagination(data);
      } catch (error) {
        console.error('Error fetching client orders:', error);
      }
    } else {
      console.error('Store ID not found in localStorage');
    }
  };

  const filterClients = (clients) => {
    if (searchQuery.trim()) {
      const filtered = clients.filter(
        (client) =>
          client.client_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          client.customer.includes(searchQuery)
      );
      console.log('Filtered clients:', filtered);
      setFilteredClients(filtered);
      paginateClients(filtered);
    } else {
      setFilteredClients([...clients]);
      paginateClients(clients);
    }
  };
  const resetSearch = () => {
    setSearchQuery('');
    setDisplayedClients([]);
    setPageIndex(0);
    setTotalClients(0);
  };
  const paginateClients = (clients) => {
    const start = pageIndex * ordersPerPage;
    const end = start + ordersPerPage;
    setDisplayedClients(clients.slice(start, end));
  };
  const initializePagination = (clients) => {
    const pagination = {};
    clients.forEach((client) => {
      pagination[client.client_name] = {
        '1-20min': 0,
        '21-40min': 0,
        '41-60min': 0,
        '60-90min': 0,
        '90+min': 0,
      };
    });
    setOrderPagination(pagination);
  };
  const onOrderPageChange = (newPageIndex, clientName, timeSection) => {
    const updatedPagination = { ...orderPagination };
    updatedPagination[clientName][timeSection] = newPageIndex;
    setOrderPagination(updatedPagination);
  };
  const paginateOrders = (clientName, timeSection, orders) => {
    const pageIndex = orderPagination[clientName]?.[timeSection] || 0;
    const start = pageIndex * ordersPerPage;
    const end = start + ordersPerPage;
    return orders.slice(start, end);
  };
  return {
    clients,
    displayedClients,
    searchQuery,
    setSearchQuery,
    pageIndex,
    setPageIndex,
    fetchClientOrders,
    resetSearch,
    filterClients,
    paginateOrders,
    onOrderPageChange,
    loading,
    totalClients,
    orderPagination,
  };
};
export default useStatsController;
