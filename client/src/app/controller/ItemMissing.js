import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;

const ProblemsController = {
  getAllMissingItems: async () => {
    const store = getStore();
    console.log('Store ID:', store);
    const body = { store };
    const response = await axios.post(
      `${API_URL}/v2/get_all_missing_items_v2`,
      body
    );
    console.log('API response:', response);
    return response.data;
  },

  markItemInStock: async (itemId) => {
    const response = await axios.post(`${API_URL}/v2/in_stock_v2`, {
      id: itemId,
    });
    return response.data;
  },
};
export default ProblemsController;
