import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;

export const fetchAllCommisData = async () => {
  try {
    const response = await axios.get(`${API_URL}/v2/commis-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching commis data:', error);
    throw error;
  }
};
