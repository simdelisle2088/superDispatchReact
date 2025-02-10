import React, { useEffect, useState } from 'react';
import {
  getLocalisationsBatch,
  archiveLocalisation,
  archiveLocationsBySection,
} from '../controller/LocController';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Pagination,
  Box,
  Container,
  TextField,
  Button,
  Stack,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ITEMS_PER_PAGE = 48;

const LocalisationView = () => {
  const [localisations, setLocalisations] = useState([]);
  const [filteredLocalisations, setFilteredLocalisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [archiveForm, setArchiveForm] = useState({
    level: '',
    row: '',
    side: '',
  });
  const [archiveLoading, setArchiveLoading] = useState(false);

  const handleArchiveSection = async (e) => {
    e.preventDefault();
    setArchiveLoading(true);
    try {
      const result = await archiveLocationsBySection(
        archiveForm.level,
        archiveForm.row,
        archiveForm.side
      );
      setSnackbarMessage(
        `Successfully DELETED ${result.locations_archived} locations`
      );
      setSnackbarOpen(true);
      // Reset form and refresh data
      setArchiveForm({ level: '', row: '', side: '' });
      fetchData(page, searchTerm);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.detail || 'Error DELETING locations'
      );
      setSnackbarOpen(true);
    } finally {
      setArchiveLoading(false);
    }
  };

  const fetchData = async (page, searchTerm = '') => {
    setLoading(true);
    try {
      const { localisations, total } = await getLocalisationsBatch(
        page,
        ITEMS_PER_PAGE,
        searchTerm
      );
      setLocalisations(localisations);
      setFilteredLocalisations(localisations);
      setTotal(total);
    } catch (error) {
      console.error('Error fetching localisations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = async () => {
    setPage(1);
    await fetchData(1, searchTerm);
  };

  const resetFilter = () => {
    setSearchTerm('');
    setPage(1);
    fetchData(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
  };

  const handleDelete = async (upc, fullLocation) => {
    try {
      await archiveLocalisation(upc, fullLocation);
      fetchData(page, searchTerm);
      setSnackbarMessage(`La localisation est supprimée`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error archiving localisation:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth={false} sx={{ marginTop: '20px' }}>
      <Stack
        direction='row'
        spacing={2}
        sx={{ margin: '20px auto', width: '80%' }}>
        <TextField
          label='Recherche par UPC ou NOM'
          variant='outlined'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
          fullWidth
        />
        <Button variant='contained' color='primary' onClick={handleSearch}>
          Search
        </Button>
        <Button variant='contained' color='secondary' onClick={resetFilter}>
          Reset
        </Button>
      </Stack>
      <Stack
        component='form'
        onSubmit={handleArchiveSection}
        direction='row'
        spacing={2}
        sx={{
          margin: '20px auto',
          width: '80%',
          padding: '16px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
        }}>
        <Typography variant='subtitle1' sx={{ alignSelf: 'center' }}>
          Delete by Section:
        </Typography>
        <TextField
          label='Level'
          variant='outlined'
          size='small'
          value={archiveForm.level}
          onChange={(e) =>
            setArchiveForm((prev) => ({ ...prev, level: e.target.value }))
          }
          required
        />
        <TextField
          label='Row'
          variant='outlined'
          size='small'
          value={archiveForm.row}
          onChange={(e) =>
            setArchiveForm((prev) => ({ ...prev, row: e.target.value }))
          }
          required
        />
        <TextField
          label='Side'
          variant='outlined'
          size='small'
          value={archiveForm.side}
          onChange={(e) =>
            setArchiveForm((prev) => ({ ...prev, side: e.target.value }))
          }
          required
        />
        <Button
          variant='contained'
          color='error'
          type='submit'
          disabled={archiveLoading}
          startIcon={
            archiveLoading ? <CircularProgress size={20} /> : <DeleteIcon />
          }>
          DELETE Section
        </Button>
      </Stack>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          gap: '16px',
        }}>
        {filteredLocalisations.map((loc, index) => (
          <Box
            key={`${loc.upc}-${index}`}
            sx={{ flexBasis: 'calc(25% - 16px)', boxSizing: 'border-box' }}>
            <Card sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}>
              <CardContent sx={{ paddingBottom: '10px!important' }}>
                <Typography variant='h6' gutterBottom>
                  {loc.name}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>UPC:</strong> {loc.upc}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Level:</strong> {loc.level}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Row:</strong> {loc.row}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Side:</strong> {loc.side}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Column:</strong> {loc.column}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Shelf:</strong> {loc.shelf}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Bin:</strong> {loc.bin || 'No bin linked'}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Full Location:</strong> {loc.full_location}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Updated By:</strong> {loc.updated_by}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Updated At:</strong> {formatDate(loc.updated_at)}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Created By:</strong> {loc.created_by}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Created At:</strong> {formatDate(loc.created_at)}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>Item Count:</strong> {loc.item_count}
                </Typography>
                {/* <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                  p={1}>
                  <IconButton
                    sx={{
                      padding: '0px!important',
                    }}
                    color='error'
                    aria-label='delete'
                    onClick={() => handleDelete(loc.upc, loc.full_location)}>
                    <DeleteIcon />
                  </IconButton>
                </Box> */}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          paddingBottom: '50px',
        }}>
        <Pagination
          count={Math.ceil(total / ITEMS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
          color='primary'
        />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert
          onClose={handleSnackbarClose}
          severity='success'
          sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LocalisationView;
