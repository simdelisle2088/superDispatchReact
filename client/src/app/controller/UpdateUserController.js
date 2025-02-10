import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}`;

const UpdateUserController = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/v2/get_all_users`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const updateUser = async (userId, username, roleName, store, permissions) => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      const payload = {
        username,
        role_name: roleName,
        store,
        permissions,
      };

      await axios.put(`${API_URL}/v2/update_user_role/${userId}`, payload);

      await fetchUsers();

      setUpdateLoading(false);
    } catch (err) {
      setUpdateError(err);
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    updateUser,
    updateLoading,
    updateError,
  };
};

export default UpdateUserController;
