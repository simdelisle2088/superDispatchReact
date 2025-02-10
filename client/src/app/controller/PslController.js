import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;

const PslController = {
  fetchCustomersByPage: async (
    page = 1,
    limit = 20,
    startDate,
    endDate,
    orderNumber,
    store
  ) => {
    try {
      const params = {
        limit,
        page,
      };

      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      if (orderNumber) params.order_number = orderNumber;
      if (store) params.store = store;

      const response = await axios.get(`${API_URL}/v2/psl`, { params });

      return {
        customers: response.data.data || [],
        total: Number(response.headers['x-total-count']) || 0,
      };
    } catch (error) {
      throw new Error(error.message || 'Error fetching customers');
    }
  },

  fetchDriverNames: async (orderNumbers) => {
    try {
      const response = await axios.post(`${API_URL}/v2/psl/drivers`, {
        order_numbers: orderNumbers,
      });
      return response.data.data || [];
    } catch (error) {
      throw new Error(error.message || 'Error fetching driver names');
    }
  },
};

export default PslController;
