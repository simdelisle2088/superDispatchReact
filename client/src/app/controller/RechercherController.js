import axios from 'axios';
import { getStore } from '../components/GetStore';

// API configuration with environment-based URL
const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

// Default headers for all API requests
const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

const RechercheController = {
  // Added searchQuery parameter to match the backend API expectations
  fetchOneOrder: async (searchQuery = '') => {
    const store = getStore();

    try {
      // Updated request body to include both required parameters
      const body = {
        search_query: searchQuery, // Match the snake_case format expected by the backend
        store: store,
      };

      const response = await axios.post(
        `${API_URL}/misc_dispatch/v2/search_driver_order`,
        body,
        { headers }
      );

      return response.data;
    } catch (error) {
      // Enhanced error handling with more specific error message
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        'Error searching for driver order';
      throw new Error(errorMessage);
    }
  },
};

// Export the controller object directly instead of calling it as a function
export default RechercheController;
