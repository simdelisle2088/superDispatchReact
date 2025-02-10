import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './app/layout/Navbar';
import Home from './app/views/Home';
import Login from './app/views/Login';
import Coords from './app/views/Coords';
import Signup from './app/views/Signup';
import Update from './app/views/Update';
import Psl from './app/views/Psl';
import PickForm from './app/views/PickForm';
import DriverEfficiency from './app/views/DriverEfficiency';
import Drivers from './app/views/Drivers';
import DriverPage from './app/views/DriverPage';
import LocPage from './app/views/LocPage';
import Picker from './app/views/Picker';
import Stats from './app/views/Stats';
import DriverCounts from './app/views/DriverCount';
import Missing from './app/views/ItemMissing';
import DriverStats from './app/views/DriverStats';
import Rapport from './app/views/Rapport';
import Commis from './app/views/Commis';

import AuthGuard from './app/components/HocAuth';
import PermissionGuard from './app/components/HocPerms';
import Rechercher from './app/views/Rechercher';

function App() {
  const [userPermissions, setUserPermissions] = useState([]);

  useEffect(() => {
    const storedPermissions =
      JSON.parse(localStorage.getItem('user_permissions')) || [];
    setUserPermissions(storedPermissions);
  }, []);

  return (
    <Router>
      <div className='appContainer' style={styles.appContainer}>
        <Navbar userPermissions={userPermissions} />
        <Routes>
          <Route
            path='/login'
            element={<Login setPermissions={setUserPermissions} />}
          />
          <Route
            path='/'
            element={
              <AuthGuard>
                <Home />
              </AuthGuard>
            }
          />
          <Route
            path='/picker_form'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <PickForm />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/coords'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['create_users']}
                  userPermissions={userPermissions}>
                  <Coords />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/delivery_stats'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['create_users']}
                  userPermissions={userPermissions}>
                  <DriverEfficiency />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/signup'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['create_users']}
                  userPermissions={userPermissions}>
                  <Signup />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/update'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['create_users']}
                  userPermissions={userPermissions}>
                  <Update />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/picker_stats'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['create_users']}
                  userPermissions={userPermissions}>
                  <Picker />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/psl'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['comptability']}
                  userPermissions={userPermissions}>
                  <Psl />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/drivers'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Drivers />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/driverStats'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <DriverStats />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/driverCounts'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <DriverCounts />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/rechercher'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Rechercher />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/loc'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <LocPage />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/stats'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Stats />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/commis'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Commis />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/rapport'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Rapport />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route
            path='/missing'
            element={
              <AuthGuard>
                <PermissionGuard
                  requiredPermissions={['dispatch']}
                  userPermissions={userPermissions}>
                  <Missing />
                </PermissionGuard>
              </AuthGuard>
            }
          />
          <Route path='/driver-page/:id' element={<DriverPage />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
  },
};

export default App;
