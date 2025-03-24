// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect} from 'react';
import Login from './components/Login';
import List from './components/List'
import Edit from './components/Edit';
import Create from './components/Create';
import axios from 'axios';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));
  const [isAdmin, setIsAdmin] = useState(null); // null - initially to indicate loading

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log('useEffect triggered - Token:', token, 'isAuthenticated:', isAuthenticated); //
    if (token && !isAdmin) {
      axios.get('http://localhost:8000/test/user/', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          console.log('User info:', res.data);
          setIsAdmin(res.data.is_staff);
          setIsAuthenticated(true);
        })
        .catch(error => {
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
          setIsAdmin(false);
        });
    }
  });

  const AdminRoute = ({ children }) => {
    console.log('AdminRoute check - isAdmin:', isAdmin);  //
    return isAdmin ? children : <Navigate to="/clients" />;
  };

  // Wait for isAdmin to be determined before rendering protected routes
  if(isAuthenticated && isAdmin===null){ // Prevent premature rendering
    return <div>Loading..</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/clients" />}
        />
        <Route
          path="/clients"
          element={isAuthenticated ? <List isAdmin={isAdmin} /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients/:id/edit"
          element={ isAuthenticated ? ( <AdminRoute> <Edit /> </AdminRoute> ) : ( <Navigate to="/login" />) }
        />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route
          path="/clients/create"
          element={ isAuthenticated ? ( <AdminRoute> <Create /> </AdminRoute>) : ( <Navigate to="/login" /> )}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;