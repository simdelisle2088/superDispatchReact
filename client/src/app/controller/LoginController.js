import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/v2/login_user`;

export const loginUser = async (userData, setPermissions) => {
  try {
    const response = await axios.post(API_URL, {
      username: userData.email,
      password: userData.password,
    });

    const permissionNames = response.data.role.permissions.map(
      (perm) => perm.name
    );

    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user_permissions', JSON.stringify(permissionNames));

    if (response.data.store) {
      localStorage.setItem('store', response.data.store);
    } else {
      console.warn('Store information is missing in the response');
    }

    setPermissions(permissionNames);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.detail || 'Login failed');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response from server');
    } else {
      console.error('Error:', error.message);
      throw new Error('Login error');
    }
  }
};
