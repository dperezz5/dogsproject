import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './auth/Login';

const Home: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && currentUser) {
      // If user is already logged in, redirect to dashboard
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);
  
  // Show login page directly on the home page
  return <Login />;
};

export default Home;