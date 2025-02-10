import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/v2/create_user_role`;

export const createUserRole = async (userData) => {
  try {
    const response = await axios.post(API_URL, {
      username: userData.username,
      password: userData.password,
      role_name: userData.role,
      store: userData.store,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Error creating user');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error('Error setting up request');
    }
  }
};
