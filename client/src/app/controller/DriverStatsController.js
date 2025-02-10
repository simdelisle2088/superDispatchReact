// DriverStatsController.js
import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = process.env.REACT_APP_API_URL;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

export const getOrderCountsPerDay = async (searchQuery = '') => {
  try {
    const storeId = getStore();

    // Match the Pydantic model structure exactly
    const requestBody = {
      store: storeId,
      search: searchQuery ? [searchQuery] : [], // Convert to array as per model
    };

    // Log request data for debugging
    console.log('Request payload:', requestBody);

    const response = await axios.post(
      `${API_URL}/driver/get_orders_per_day`,
      requestBody,
      { headers }
    );

    // Log response for debugging
    console.log('API Response:', response.data);

    return response.data;
  } catch (error) {
    // Log detailed error information
    console.error('Error in getOrderCountsPerDay:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};
