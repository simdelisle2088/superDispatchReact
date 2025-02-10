import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  useMediaQuery,
} from '@mui/material';
import {
  Home,
  Menu,
  AccountCircle,
  HowToReg,
  DriveEta,
  Assessment,
  QueryStats,
  PrecisionManufacturing,
  Rule,
  TaxiAlert,
  SupportAgent,
  ManageAccounts,
  Map,
  Logout,
  EditLocation,
  FactCheck,
  Preview,
  LocalShipping,
  TransferWithinAStation,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';

const drawerWidth = 300;

const Navbar = ({ userPermissions = [] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const isLargeScreen = useMediaQuery('(min-width:1440px)');
  const isMobileOrTablet = useMediaQuery('(max-width:1440px)');

  useEffect(() => {
    setOpen(isLargeScreen);
  }, [isLargeScreen]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };
  const canCreateUsers = userPermissions.includes('create_users');
  const hasDispatchPerm = userPermissions.includes('dispatch');
  const isLoggedIn = !!localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant='permanent'
        open={open}
        sx={{
          width: open ? drawerWidth : `60px`,
          flexShrink: 0,
          transition: 'width 0.3s',
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : `60px`,
            boxSizing: 'border-box',
            backgroundColor: 'var(--dark-blue)',
            transition: 'width 0.3s',
            overflow: 'hidden',
            height: '100vh',
            justifyContent: 'space-between',
            overflowY: 'hidden',
          },
        }}>
        {isLargeScreen && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: 2,
              cursor: 'pointer',
              borderBottom: '1px solid var(--light-blue)',
              marginBottom: '20px',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
            onClick={() => navigate('/')}>
            <img
              src='/logoSuper.png'
              alt='Logo'
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        )}
        {isMobileOrTablet && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 1,
            }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'var(--light-blue)' }}>
              <Menu />
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            overflowY: 'auto',
            height: 'calc(100vh - 60px)', // Adjust this based on logo height
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}>
          <List>
            {!isLoggedIn && (
              <ListItem button component={Link} to='/login'>
                <ListItemIcon
                  sx={{
                    minWidth: '40px',
                    transition: 'padding 0.3s',
                    paddingRight: open ? '16px' : '8px',
                    color: 'var(--light-blue)',
                  }}>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText
                  primary='Se connecter'
                  primaryTypographyProps={{
                    sx: {
                      fontWeight: 500,
                      fontSize: '20px',
                      color: 'var(--light-blue)',
                    },
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: 'opacity 0.3s, margin-left 0.3s',
                    marginLeft: open ? '0px' : '-20px',
                  }}
                />
              </ListItem>
            )}
            <ListItem button component={Link} to='/'>
              <ListItemIcon
                sx={{
                  minWidth: '40px',
                  transition: 'padding 0.3s',
                  paddingRight: open ? '16px' : '8px',
                  color: 'var(--light-blue)',
                }}>
                <Map />
              </ListItemIcon>
              <ListItemText
                primary='Map'
                primaryTypographyProps={{
                  sx: {
                    fontWeight: 500,
                    fontSize: '20px',
                    color: 'var(--light-blue)',
                  },
                }}
                sx={{
                  opacity: open ? 1 : 0,
                  transition: 'opacity 0.3s, margin-left 0.3s',
                  marginLeft: open ? '0px' : '-20px',
                }}
              />
            </ListItem>
            {canCreateUsers && (
              <>
                <ListItem button component={Link} to='/coords'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <EditLocation />
                  </ListItemIcon>
                  <ListItemText
                    primary='Coordonnées'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/delivery_stats'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <LocalShipping />
                  </ListItemIcon>
                  <ListItemText
                    primary='Stats Livraisons'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/signup'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <HowToReg />
                  </ListItemIcon>
                  <ListItemText
                    primary='Enregistrer un utilisateur'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/update'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <ManageAccounts />
                  </ListItemIcon>
                  <ListItemText
                    primary="Mettre à jour l'utilisateur"
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/picker_stats'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <TransferWithinAStation />
                  </ListItemIcon>
                  <ListItemText
                    primary='Stats Pickers/Locators'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
              </>
            )}

            {hasDispatchPerm && (
              <>
                <ListItem button component={Link} to='/picker_form'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <Preview />
                  </ListItemIcon>
                  <ListItemText
                    primary='Démo Client'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/drivers'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <DriveEta />
                  </ListItemIcon>
                  <ListItemText
                    primary='Chauffeurs'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/driverStats'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <TaxiAlert />
                  </ListItemIcon>
                  <ListItemText
                    primary='Stats Chauffeurs'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/stats'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <QueryStats />
                  </ListItemIcon>
                  <ListItemText
                    primary='Stats'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/commis'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <SupportAgent />
                  </ListItemIcon>
                  <ListItemText
                    primary='Stats Commis'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/rapport'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <Assessment />
                  </ListItemIcon>
                  <ListItemText
                    primary='Rapport'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/psl'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <FactCheck />
                  </ListItemIcon>
                  <ListItemText
                    primary='PSL'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/loc'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <PrecisionManufacturing />
                  </ListItemIcon>
                  <ListItemText
                    primary='Localisations'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
                <ListItem button component={Link} to='/missing'>
                  <ListItemIcon
                    sx={{
                      minWidth: '40px',
                      transition: 'padding 0.3s',
                      paddingRight: open ? '16px' : '8px',
                      color: 'var(--light-blue)',
                    }}>
                    <Rule />
                  </ListItemIcon>
                  <ListItemText
                    primary='Pièces Manquantes'
                    primaryTypographyProps={{
                      sx: {
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'var(--light-blue)',
                      },
                    }}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: 'opacity 0.3s, margin-left 0.3s',
                      marginLeft: open ? '0px' : '-20px',
                    }}
                  />
                </ListItem>
              </>
            )}
          </List>
          {isLoggedIn && (
            <ListItem button onClick={handleLogout}>
              <ListItemIcon
                sx={{
                  transition: 'padding 0.3s',
                  paddingRight: open ? '16px' : '8px',
                  color: 'var(--red)',
                  cursor: 'pointer',
                  paddingBottom: '20px',
                  justifyContent: open ? 'center' : 'left',
                  textAlign: open ? 'center' : 'left',
                  width: '100%',
                }}>
                <Logout sx={{ fontSize: open ? '2.5rem' : '2rem' }} />
              </ListItemIcon>
            </ListItem>
          )}
        </Box>
      </Drawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : `60px`,
          transition: 'margin-left 0.3s',
          margin: 0,
          padding: 0,
        }}></Box>
    </Box>
  );
};

export default Navbar;
