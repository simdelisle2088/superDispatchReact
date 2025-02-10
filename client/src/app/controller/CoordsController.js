import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = `${process.env.REACT_APP_API_URL}`;

const useCoords = (limit = 50, searchTerm = '') => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchCoordsData = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        const response = await axios.get(`${API_URL}/v2/get_pos_arc_d_head`, {
          params: {
            limit,
            offset,
            search: searchTerm,
          },
        });
        setData(response.data);
        setTotal(response.headers['x-total-count']);
      } catch (err) {
        setError('Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };
    fetchCoordsData();
  }, [page, limit, searchTerm]);

  const updateClient = async (id, updatedData) => {
    try {
      const response = await axios.put(
        `${API_URL}/v2/update_client/${id}`,
        updatedData
      );
      console.log('Client updated successfully:', response.data);

      setData((prevData) =>
        prevData.map((client) =>
          client.id === id ? { ...client, ...updatedData } : client
        )
      );
    } catch (err) {
      console.error('Failed to update client:', err);
      setError('Failed to update client');
    }
  };

  const deleteClient = async (id) => {
    try {
      await axios.delete(`${API_URL}/v2/delete_client/${id}`);
      console.log(`Client with ID ${id} deleted successfully`);

      // Remove the deleted client from the state
      setData((prevData) => prevData.filter((client) => client.id !== id));
    } catch (err) {
      console.error('Failed to delete client:', err);
      setError('Failed to delete client');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return {
    data,
    error,
    loading,
    handlePageChange,
    page,
    total,
    updateClient,
    deleteClient, // Include the delete function in the returned object
  };
};

export default useCoords;
