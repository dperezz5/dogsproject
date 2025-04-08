import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 font-poppins">
            Welcome to Your Dashboard
          </h1>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">User Information</h2>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {currentUser?.email}</p>
            <p className="text-gray-600"><span className="font-medium">User ID:</span> {currentUser?.uid}</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dogswipe-yellow/10 p-4 rounded-xl">
                <h3 className="font-semibold text-lg text-dogswipe-orange mb-2">Your Dogs</h3>
                <p className="text-gray-600">You haven't added any dogs yet.</p>
                <button className="mt-3 px-4 py-2 bg-dogswipe-orange text-white rounded-full text-sm font-medium hover:bg-dogswipe-red transition-colors">
                  Add a Dog
                </button>
              </div>
              
              <div className="bg-dogswipe-teal/10 p-4 rounded-xl">
                <h3 className="font-semibold text-lg text-dogswipe-teal mb-2">Recent Matches</h3>
                <p className="text-gray-600">No matches found yet.</p>
                <button className="mt-3 px-4 py-2 bg-dogswipe-teal text-white rounded-full text-sm font-medium hover:bg-dogswipe-teal/80 transition-colors">
                  Discover Dogs
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full text-base font-medium hover:bg-gray-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 