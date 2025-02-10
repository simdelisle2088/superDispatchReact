import axios from 'axios';
import { getStore } from '../components/GetStore';

const API_URL = `${process.env.REACT_APP_API_URL}`;
const X_DISPATCH_KEY =
  'cHVibGljbW91c2VyZWFkdHVybndvcmRzdHJhbmdlcmNvYWNocmVjb3JkdHJvcGljYWxicmFzc3N0b25lYXNsZWVwb3RoZXJ3b3JlZXhj';

const headers = {
  'Content-Type': 'application/json',
  'X-Dispatch-key': X_DISPATCH_KEY,
};

export const getLocalisationsBatch = async (
  page = 1,
  limit = 48,
  searchTerm = ''
) => {
  try {
    const storeId = getStore();
    const offset = (page - 1) * limit;
    const response = await axios.post(
      `${API_URL}/misc_dispatch/v2/get_all_localisation`,
      { storeId },
      { headers, params: { limit, offset, search_term: searchTerm } }
    );
    return {
      localisations: response.data.localisations,
      total: response.headers['x-total-count'],
    };
  } catch (error) {
    console.error('Error fetching localisations:', error);
    throw error;
  }
};

export const archiveLocationsBySection = async (level, row, side) => {
  try {
    const store = getStore();
    const response = await axios.post(
      `${API_URL}/v2/locations_bulk_delete`,
      {
        store,
        level,
        row,
        side,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error archiving locations by section:', error);
    throw error;
  }
};

export const archiveLocalisation = async (upc, fullLocation) => {
  try {
    const response = await axios.put(
      `${API_URL}/v2/archive_localisation`,
      { upc, full_location: fullLocation },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error archiving localisation:', error);
    throw error;
  }
};
