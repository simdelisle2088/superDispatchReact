import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from '@mui/material';
import usePickFormController from '../controller/PickFormController';
import Papa from 'papaparse';

const PickForm = () => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const { submitPickForm, submitBulkReturns, loading, error, response } =
    usePickFormController();
  const [csvData, setCsvData] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [csvError, setCsvError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (itemName && quantity) {
      await submitPickForm(itemName, parseInt(quantity));
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileSelected(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = Object.keys(results.data[0] || {});
          if (!headers.includes('item') || !headers.includes('units')) {
            setCsvError('CSV file must contain "item" and "units" columns');
            setCsvData([]);
            return;
          }
          setCsvData(results.data);
          setCsvError(null);
        },
        error: (error) => {
          setCsvError('Error parsing CSV file: ' + error.message);
          setCsvData([]);
        },
      });
    }
  };

  const handleSend = async () => {
    if (!csvData.length) {
      setCsvError('Please upload a CSV file first');
      return;
    }

    try {
      await submitBulkReturns(csvData);
    } catch (err) {
      let errorMessage = 'Failed to process the CSV data';

      if (typeof err.response?.data?.detail === 'object') {
        // Handle structured error response
        const detail = err.response.data.detail;
        errorMessage = detail.message;
        if (detail.errors && Array.isArray(detail.errors)) {
          errorMessage += ': ' + detail.errors.join(', ');
        }
      } else if (err.response?.data?.detail) {
        // Handle string error response
        errorMessage = err.response.data.detail;
      }

      setCsvError(errorMessage);
    }
  };

  const getErrorMessage = (error) => {
    if (typeof error === 'object' && error !== null) {
      if (error.message) {
        return `${error.message}${
          error.errors ? ': ' + error.errors.join(', ') : ''
        }`;
      }
      return JSON.stringify(error);
    }
    return error;
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          mx: 'auto',
          mt: 5,
          bgcolor: '#f5f5f5',
          marginTop: '100px',
        }}>
        <Typography
          variant='h5'
          component='h2'
          gutterBottom
          sx={{
            color: 'var(--h1)',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}>
          Démonstration de produits
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Nom de l'article ex: SAT B03361"
            variant='outlined'
            fullWidth
            margin='normal'
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <TextField
            label='Quantitée'
            type='number'
            variant='outlined'
            fullWidth
            margin='normal'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {loading ? (
            <Box display='flex' justifyContent='center' my={2}>
              <CircularProgress />
            </Box>
          ) : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{ mt: 2 }}>
              Envoyer
            </Button>
          )}
          {error && (
            <Alert severity='error' sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {response && (
            <Alert severity='success' sx={{ mt: 2 }}>
              Article ajouté avec succès!
            </Alert>
          )}
        </form>
      </Box>
      <Stack spacing={3} sx={{ marginTop: 4 }}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography
            variant='h6'
            style={{
              marginBottom: '20px',
              fontWeight: 'bold',
              color: 'var(--h1)',
            }}>
            Import CSV File
          </Typography>

          <Stack spacing={2}>
            <Button
              variant='contained'
              component='label'
              sx={{ maxWidth: 200 }}>
              Upload CSV
              <input
                type='file'
                hidden
                accept='.csv'
                onChange={handleFileUpload}
              />
            </Button>

            {csvData.length > 0 && (
              <>
                <TableContainer>
                  <Table size='small'>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Item
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>
                          Units
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {csvData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.item}</TableCell>
                          <TableCell>{row.units}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSend}
                  sx={{ maxWidth: 200 }}
                  disabled={loading}>
                  Send to API
                </Button>
              </>
            )}

            {csvError && (
              <Alert severity='error' sx={{ mt: 2 }}>
                {getErrorMessage(csvError)}
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default PickForm;
