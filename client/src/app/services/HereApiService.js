// src/services/HereApiService.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

// Fetch route information for a list of routes
export const getRouteInfo = async (routes) => {
  try {
    const params = new URLSearchParams();
    routes.forEach((route) => params.append('routes', route));

    const response = await axios.get(
      `${API_URL}/misc_dispatch/get_route_info`,
      {
        headers,
        params,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching route info:', error);
    throw new Error('Error fetching route info');
  }
};

// Fetch route details between origin and destination
export const getRoute = async (origin, destination, departureTime = null) => {
  try {
    const params = { origin, destination };
    if (departureTime) params.departureTime = departureTime;

    const response = await axios.get(`${API_URL}/misc_dispatch/get_route`, {
      headers,
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching route:', error);
    throw new Error('Error fetching route');
  }
};
