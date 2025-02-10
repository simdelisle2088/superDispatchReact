import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

const fetchData = async (endpoint, storeId) => {
  try {
    const response = await axios.post(
      `${API_URL}${endpoint}`,
      { store: storeId },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const getLocationCountsByUser = async () => {
  const storeId = await getStore();
  return fetchData('/misc_dispatch/v2/count_by_user', storeId);
};

export const getPickedItemCountsByUser = async () => {
  const storeId = await getStore();
  return fetchData('/misc_dispatch/v2/picked_count', storeId);
};
