import React from 'react';
import { Box } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
        margin: 0,
      }}>
      <Box
        component='iframe'
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2797.0965648518936!2d-73.38590362428205!3d45.4880001559154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc90533713c898f%3A0xa9e7515a92a42f6d!2sPi%C3%A8ces%20d&#39;auto%20Super!5e0!3m2!1sen!2sca!4v1682537937761!5m2!1sen!2sca'
        allowFullScreen={false}
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        title='Google Maps'
        sx={{
          width: '100%',
          height: '100%',
          border: 0,
        }}
      />
    </Box>
  );
};

export default Home;
