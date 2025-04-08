import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import IPadLayout from './components/layout/IPadLayout';

// Placeholder components for new routes
const Discover: React.FC = () => (
  <IPadLayout title="Discover Dogs">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Discover Dogs</h1>
      <p className="text-gray-600">Discover page content coming soon...</p>
    </div>
  </IPadLayout>
);

const Chat: React.FC = () => (
  <IPadLayout title="Chat">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Chat</h1>
      <p className="text-gray-600">Chat page content coming soon...</p>
    </div>
  </IPadLayout>
);

const Profile: React.FC = () => (
  <IPadLayout title="Profile">
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>
      <p className="text-gray-600">Profile page content coming soon...</p>
    </div>
  </IPadLayout>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/discover" 
                element={
                  <ProtectedRoute>
                    <Discover />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
