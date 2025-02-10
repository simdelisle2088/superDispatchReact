import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

class DriverStatsController {
  static async getDriverStats() {
    try {
      const store = getStore();
      if (!store) {
        throw new Error('Store not found');
      }

      const response = await axios.post(
        `${API_URL}/misc_dispatch/v2/driver_order_counts`,
        { store },
        { headers }
      );

      if (response.data) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching driver stats:', error);
      throw new Error(
        error.response?.data?.detail || 'Failed to fetch driver statistics'
      );
    }
  }

  static transformStatsData(stats) {
    if (!Array.isArray(stats)) return [];

    return stats.map((driver) => ({
      driverName: driver.driver_name,
      totalDeliveries: driver.total_deliveries,
      last30Days: driver.last_30_days,
      last60Days: driver.last_60_days,
    }));
  }

  static async getFormattedDriverStats() {
    try {
      const rawStats = await this.getDriverStats();
      return this.transformStatsData(rawStats);
    } catch (error) {
      console.error('Error getting formatted driver stats:', error);
      throw error;
    }
  }
}

export default DriverStatsController;
