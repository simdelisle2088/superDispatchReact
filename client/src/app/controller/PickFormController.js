import axios from 'axios';
import { useState } from 'react';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;

const usePickFormController = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const submitPickForm = async (itemName, quantity) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const storeId = getStore(); // Retrieve the current store ID
      const body = {
        item_name: itemName,
        quantity,
        store_id: storeId,
      };

      const res = await axios.post(`${API_URL}/v2/picker_form`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setResponse(res.data);
    } catch (err) {
      setError(
        err.response
          ? err.response.data.detail
          : 'An unexpected error occurred.'
      );
    } finally {
      setLoading(false);
    }
  };

  const submitBulkReturns = async (items) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const storeId = getStore();
      const formattedItems = items.map((item) => ({
        item: item.item,
        units: item.units,
        store: storeId,
      }));

      const res = await axios.post(
        `${API_URL}/v2/bulk-returns/`,
        {
          items: formattedItems,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      setResponse(res.data);
    } catch (err) {
      // Format error message based on response structure
      let errorMessage = 'An unexpected error occurred.';

      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'object' && detail.message) {
          // Handle structured error with message and errors array
          errorMessage = detail.message;
          if (detail.errors && Array.isArray(detail.errors)) {
            errorMessage += ': ' + detail.errors.join(', ');
          }
        } else {
          // Handle simple string error
          errorMessage = detail;
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    submitPickForm,
    submitBulkReturns,
    loading,
    error,
    response,
  };
};

export default usePickFormController;
