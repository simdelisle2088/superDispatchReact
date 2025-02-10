// RapportController.js
import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

const RapportController = {
  fetchOrdersByPage: async (page = 1, limit = 100, search) => {
    const store = getStore();
    const offset = (page - 1) * limit;

    try {
      const body = {
        store,
        search: search ? search.split(/[ ,]+/).map((term) => term.trim()) : [],
      };

      console.log('Sending request with body:', body); // Add this line

      const response = await axios.post(
        `${API_URL}/misc_dispatch/v2/get_all_drivers_orders?offset=${offset}&limit=${limit}&order=created_at.desc`,
        body,
        { headers }
      );
      return response.data;
    } catch (error) {
      // Enhanced error logging
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response error:', error.response.data); // Add this line
        throw new Error(
          `Failed to fetch orders: ${
            error.response.data.detail || error.message
          }`
        );
      }
      throw new Error('Error fetching orders: ' + error.message);
    }
  },

  fetchOrderStatistics: async () => {
    const store = getStore();

    try {
      const body = { store };
      const response = await axios.post(
        `${API_URL}/misc_dispatch/v2/get_orders_count`,
        body,
        { headers }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Error fetching order statistics');
    }
  },
};

export default RapportController;
