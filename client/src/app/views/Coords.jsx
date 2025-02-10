import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Pagination,
  Box,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useCoords from '../controller/CoordsController';

const ClientList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  const {
    data,
    error,
    loading,
    handlePageChange,
    page,
    total,
    updateClient,
    deleteClient,
  } = useCoords(50, searchTriggered ? searchTerm : '');
  const [editingData, setEditingData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const initialData = {};
    data.forEach((client) => {
      initialData[client.id] = { ...client };
    });
    setEditingData(initialData);
  }, [data]);

  const handleFieldChange = (id, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const updatedData = editingData[id];

    if (updatedData) {
      const { customer, job, address, postal_code, customer_number } =
        updatedData;

      if (!customer || !job || !address || !postal_code || !customer_number) {
        alert(
          'Please fill in all required fields: customer, job, address, postal code, customer number.'
        );
        return;
      }

      try {
        await updateClient(id, updatedData);
        setSuccessMessage('Client updated successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error updating client:', err);
        setSuccessMessage('Failed to update the client.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await deleteClient(id);
        setSuccessMessage('Client deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting client:', err);
        setSuccessMessage('Failed to delete the client.');
      }
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      alert('Please enter a valid search term.');
      return;
    }
    setSearchTriggered(true); // Enable search mode
    handlePageChange(1); // Reset to the first page for the search
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchTriggered(false); // Exit search mode
    handlePageChange(1); // Reset to the first page
  };

  return (
    <Box sx={{ padding: 4, margin: '30px auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'space-between',
          marginBottom: '30px',
        }}>
        <Box
          sx={{
            alignContent: 'center',
            display: 'flex',
          }}>
          <TextField
            label='Search by Customer or Customer Number'
            variant='outlined'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            style={{ marginRight: '1rem' }}
          />
          <Button
            variant='contained'
            color='primary'
            onClick={handleSearch}
            style={{ marginRight: '1rem' }}>
            Search
          </Button>
          <Button variant='outlined' onClick={handleReset}>
            Reset
          </Button>
        </Box>

        <Typography
          variant='h4'
          gutterBottom
          sx={{ color: 'var(--h1)', fontWeight: 'bold' }}>
          Modifier informations clients
        </Typography>
      </Box>

      {error && <Typography color='error'>{error}</Typography>}
      {loading && <CircularProgress />}

      {successMessage && (
        <Alert severity='success' sx={{ marginBottom: '1rem' }}>
          {successMessage}
        </Alert>
      )}

      {!loading &&
        data.map((client) => (
          <Accordion key={client.id}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                variant='h6'
                sx={{ color: 'var(--h1)', fontWeight: '500' }}>
                {client.customer || 'Unnamed Client'}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TextField
                label='Customer'
                value={editingData[client.id]?.customer || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'customer', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Customer Number'
                value={editingData[client.id]?.customer_number || ''}
                onChange={(e) =>
                  handleFieldChange(
                    client.id,
                    'customer_number',
                    e.target.value
                  )
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Job'
                value={editingData[client.id]?.job || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'job', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Address'
                value={editingData[client.id]?.address || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'address', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Postal Code'
                value={editingData[client.id]?.postal_code || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'postal_code', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Latitude'
                value={editingData[client.id]?.latitude || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'latitude', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <TextField
                label='Longitude'
                value={editingData[client.id]?.longitude || ''}
                onChange={(e) =>
                  handleFieldChange(client.id, 'longitude', e.target.value)
                }
                fullWidth
                margin='normal'
              />
              <Button
                variant='contained'
                onClick={() => handleUpdate(client.id)}
                sx={{
                  marginTop: '1rem',
                  color: 'primary',
                }}>
                Update
              </Button>
              <Button
                variant='contained'
                sx={{
                  backgroundColor: 'var(--red)',
                  marginTop: '1rem',
                  marginLeft: '1rem',
                }}
                onClick={() => handleDelete(client.id)}>
                Delete
              </Button>
            </AccordionDetails>
          </Accordion>
        ))}

      <Pagination
        count={Math.ceil(total / 50)}
        page={page}
        onChange={(event, value) => handlePageChange(value)}
        color='primary'
        style={{ marginTop: '2rem' }}
      />
    </Box>
  );
};

export default ClientList;
