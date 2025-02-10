import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

export const getDrivers = async () => {
  try {
    const store = getStore();
    const body = { store };
    const response = await axios.post(`${API_URL}/driver/get_drivers`, body, {
      headers,
    });
    return response.data.drivers || [];
  } catch (error) {
    console.error('Error occurred while fetching drivers', error);
    throw new Error(error.message || 'Error fetching drivers');
  }
};

export const getDriverById = async (id) => {
  try {
    const body = { driver_id: id };
    const response = await axios.post(`${API_URL}/driver/get_driver`, body, {
      headers,
    });
    return response.data.drivers || [];
  } catch (error) {
    console.error('Error fetching driver details', error);
    throw new Error(error.message || 'Error fetching driver details');
  }
};

export const getOrdersByDriverId = async (id) => {
  try {
    const body = { driver_id: id };
    const response = await axios.post(
      `${API_URL}/misc_dispatch/get_all_orders_by_id`,
      body,
      {
        headers,
      }
    );
    return {
      orders: response.data.orders || [],
      averageDeliveryTimeHours: response.data.average_delivery_time_hours || 0,
    };
  } catch (error) {
    console.error('Error fetching orders by driver', error);
    throw new Error(error.message || 'Error fetching orders by driver');
  }
};

export const updateDriverStatusActive = async (id) => {
  try {
    const body = { driver_id: id };
    const response = await axios.post(`${API_URL}/driver/activate`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error activating driver', error);
    throw new Error(error.message || 'Error activating driver');
  }
};

export const updateDriverStatusNotActive = async (id) => {
  try {
    const body = { driver_id: id };
    const response = await axios.post(`${API_URL}/driver/deactivate`, body, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error deactivating driver', error);
    throw new Error(error.message || 'Error deactivating driver');
  }
};
