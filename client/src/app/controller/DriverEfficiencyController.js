import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

export const fetchDeliveryStatsByStore = async () => {
  try {
    const storeId = await getStore();
    if (!storeId) throw new Error('Store ID is not available');

    const response = await axios.post(
      `${API_URL}/misc_dispatch/v2/delivery_stats_by_store`,
      { storeId: storeId },
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching delivery stats by store:', error);
    throw error;
  }
};

export const fetchDeliveryCountsByDateRange = async (startDate, endDate) => {
  try {
    const storeId = await getStore();
    if (!storeId) throw new Error('Store ID is not available');

    const formattedStartDate =
      startDate instanceof Date
        ? startDate.toISOString().split('T')[0]
        : startDate;
    const formattedEndDate =
      endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate;

    const response = await axios.post(
      `${API_URL}/misc_dispatch/v2/delivery_counts_by_date_range`,
      {
        storeId: storeId,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      },
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error('Error fetching delivery counts by date range:', error);
    throw error;
  }
};
