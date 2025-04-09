import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase/config';

interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  images: string[];
}

const Dashboard: React.FC = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [dogProfiles, setDogProfiles] = useState<DogProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set the user's display name or email as the greeting name
    if (currentUser) {
      if (currentUser.displayName) {
        setUserName(currentUser.displayName.split(' ')[0]);
      } else if (currentUser.email) {
        // Use the part before the @ in the email
        setUserName(currentUser.email.split('@')[0]);
      }
      // Fetch dog profiles
      fetchDogProfiles();
    }
  }, [currentUser]);

  const fetchDogProfiles = async () => {
    if (!currentUser) return;
    
    try {
      const dogsRef = collection(firestore, 'dogProfiles');
      const q = query(dogsRef, where('ownerId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const profiles: DogProfile[] = [];
      querySnapshot.forEach((doc) => {
        profiles.push({ id: doc.id, ...doc.data() } as DogProfile);
      });
      
      setDogProfiles(profiles);
    } catch (error) {
      console.error('Error fetching dog profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Failed to sign out', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dogswipe-yellow via-dogswipe-orange to-dogswipe-red pt-32 pb-24">
      <div className="container mx-auto px-4 py-8 h-[calc(100vh-12rem)] flex items-center justify-center">
        {/* iPad Mockup - Horizontal */}
        <div className="w-full max-w-6xl aspect-[4/3] bg-gray-800 rounded-[40px] p-3 shadow-2xl border-8 border-gray-900 relative overflow-hidden">
          {/* iPad Home Button */}
          <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2 w-2 h-12 bg-gray-900 rounded-l-lg z-10"></div>
          
          {/* Camera */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rounded-full z-10"></div>
          
          {/* iPad Screen */}
          <div className="w-full h-full bg-white rounded-[30px] overflow-hidden flex flex-col">
            {/* iPad Status Bar */}
            <div className="bg-gray-100 py-2 px-6 border-b border-gray-200 flex justify-between items-center">
              <div className="text-gray-700 font-medium">
                DogSwipe Dashboard
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-xs text-gray-500">9:41 AM</div>
                <div className="text-xs text-gray-500">
                  <span className="inline-flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 4.75C2 3.784 2.784 3 3.75 3h12.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0116.25 17H3.75A1.75 1.75 0 012 15.25V4.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h12.5a.25.25 0 00.25-.25V4.75a.25.25 0 00-.25-.25H3.75z"></path>
                      <path d="M5 8.75A.75.75 0 015.75 8h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 8.75zm0 2.5A.75.75 0 015.75 11h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 015 11.25z"></path>
                    </svg>
                    100%
                  </span>
                </div>
              </div>
            </div>
            
            {/* iPad Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 font-poppins main-gradient">
                  Welcome, {userName}!
                </h1>
                
                {/* User Profile Section - New Addition */}
                <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-dogswipe-yellow to-dogswipe-orange p-4 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-white">My Profile</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        {currentUser?.photoURL ? (
                          <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="w-24 h-24 rounded-full object-cover border-4 border-dogswipe-orange" 
                          />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-dogswipe-orange/20 flex items-center justify-center border-4 border-dogswipe-orange">
                            <span className="text-2xl font-bold text-dogswipe-orange">
                              {userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {currentUser?.displayName || userName}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Email:</span> {currentUser?.email}
                        </p>
                        <p className="text-gray-600 mb-4">
                          <span className="font-medium">Member since:</span> {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                        </p>
                        
                        <Link to="/edit-profile" className="inline-flex items-center px-4 py-2 bg-dogswipe-orange text-white rounded-full text-sm font-medium hover:bg-dogswipe-red transition-colors">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Dogs */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-dogswipe-orange/10 p-4 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-dogswipe-orange">Your Dogs</h2>
                    </div>
                    
                    <div className="p-4">
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dogswipe-orange mx-auto"></div>
                          <p className="mt-4 text-gray-500">Loading your dogs...</p>
                        </div>
                      ) : dogProfiles.length === 0 ? (
                        <div className="text-center py-8">
                          <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <p className="mt-2 text-gray-500">You haven't added any dogs yet</p>
                          <button 
                            onClick={() => navigate('/dog-profile')}
                            className="mt-4 px-4 py-2 bg-dogswipe-orange text-white rounded-full text-sm font-medium hover:bg-dogswipe-red transition-colors"
                          >
                            Add Your First Dog
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {dogProfiles.map((dog) => (
                            <div 
                              key={dog.id} 
                              className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => navigate(`/dog-profile/${dog.id}`)}
                            >
                              {dog.images && dog.images.length > 0 ? (
                                <img 
                                  src={dog.images[0]} 
                                  alt={dog.name}
                                  className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                                  <span className="text-2xl text-gray-400">🐕</span>
                                </div>
                              )}
                              <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{dog.name}</h3>
                                <p className="text-sm text-gray-600">{dog.breed} • {dog.age} years old</p>
                              </div>
                              <div className="ml-4">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </div>
                            </div>
                          ))}
                          <button 
                            onClick={() => navigate('/dog-profile')}
                            className="w-full mt-4 px-4 py-2 bg-dogswipe-orange text-white rounded-full text-sm font-medium hover:bg-dogswipe-red transition-colors"
                          >
                            Add Another Dog
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Column: Chats */}
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    <div className="bg-dogswipe-teal/10 p-4 border-b border-gray-100">
                      <h2 className="text-xl font-semibold text-dogswipe-teal">Chat History</h2>
                    </div>
                    
                    <div className="p-4">
                      {/* Empty state */}
                      <div className="text-center py-8">
                        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="mt-2 text-gray-500">No chat history yet</p>
                        <button className="mt-4 px-4 py-2 bg-dogswipe-teal text-white rounded-full text-sm font-medium hover:bg-dogswipe-teal/80 transition-colors">
                          Start Looking for Matches
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 text-center">
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 