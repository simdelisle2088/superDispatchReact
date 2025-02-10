import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import ProblemsController from '../controller/ItemMissing';

const ProblemsComponent = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMissingItems = async () => {
    try {
      setLoading(true);
      const missingItems = await ProblemsController.getAllMissingItems();
      setItems(missingItems);
    } catch (error) {
      console.error('Error fetching missing items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMissingItems();

    const pollingInterval = setInterval(() => {
      loadMissingItems();
    }, 180000);

    return () => clearInterval(pollingInterval);
  }, []);

  const handleMarkInStock = async (itemId) => {
    try {
      await ProblemsController.markItemInStock(itemId);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error marking item as in-stock:', error);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: '20px 10px', sm: '30px 20px', md: '50px 30px' },
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        width: { xs: '100%', sm: '95%', md: '90%' },
      }}>
      <Typography
        variant='h4'
        component='h1'
        gutterBottom
        sx={{
          color: 'var(--red)',
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
        }}>
        Tableau de bord des éléments manquants
      </Typography>

      <Typography
        variant='body1'
        color='textSecondary'
        component='p'
        sx={{
          paddingBottom: '20px',
          fontSize: { xs: '0.9rem', sm: '1rem' },
        }}>
        Ci-dessous la liste des éléments manquants. Vous pouvez les marquer
        comme en stock une fois ils sont disponibles.
      </Typography>

      {loading ? (
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight='200px'>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table
            sx={{ minWidth: { xs: 320, sm: 500 } }}
            aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Commande</TableCell>
                <TableCell>Localisation</TableCell>
                <TableCell>Pièces</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Commis</TableCell>
                <TableCell>Unités</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.order_number}</TableCell>
                  <TableCell>{item.loc}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.picked_by}</TableCell>
                  <TableCell>{item.units}</TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleMarkInStock(item.id)}
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.875rem' },
                      }}>
                      Mark In Stock
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={4} sx={{ paddingBottom: '50px' }}>
        <Typography
          variant='body2'
          color='textSecondary'
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          *Cette page est actualisée toutes les 3 minutes pour maintenir les
          données à jour.
        </Typography>
      </Box>
    </Box>
  );
};

export default ProblemsComponent;
