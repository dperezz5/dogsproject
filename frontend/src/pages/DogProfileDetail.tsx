import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

interface DogProfileData {
  id: string;
  name: string;
  breed: string;
  age: number;
  gender: string;
  size: string;
  weight: number;
  description: string;
  temperament: string;
  neutered: boolean;
  exerciseNeeds: string;
  favoriteActivities: string[];
  images: string[];
  ownerId: string;
}

const DogProfileDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [dogProfile, setDogProfile] = useState<DogProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  useEffect(() => {
    const fetchDogProfile = async () => {
      if (!id) {
        setError('No profile ID provided');
        setLoading(false);
        return;
      }
      
      try {
        const docRef = doc(firestore, 'dogProfiles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setDogProfile({ id: docSnap.id, ...docSnap.data() } as DogProfileData);
        } else {
          setError('Dog profile not found');
        }
      } catch (err) {
        console.error('Error fetching dog profile:', err);
        setError('Error loading dog profile');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDogProfile();
  }, [id]);
  
  const handleEditProfile = () => {
    navigate(`/dog-profile/edit/${id}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dogswipe-yellow via-dogswipe-orange to-dogswipe-red pt-32 pb-24">
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }
  
  if (error || !dogProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dogswipe-yellow via-dogswipe-orange to-dogswipe-red pt-32 pb-24">
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-700">{error || 'Failed to load dog profile'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 px-4 py-2 bg-dogswipe-orange text-white rounded-full"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const isOwner = currentUser && currentUser.uid === dogProfile.ownerId;
  
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
                DogSwipe - {dogProfile.name}'s Profile
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
                <div className="flex items-center mb-6">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-600 hover:text-dogswipe-orange transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                  </button>
                  
                  {isOwner && (
                    <button
                      onClick={handleEditProfile}
                      className="ml-auto flex items-center text-dogswipe-orange hover:text-dogswipe-red transition-colors"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Profile
                    </button>
                  )}
                </div>
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="md:flex">
                    {/* Left column - Images */}
                    <div className="md:w-1/2">
                      <div className="relative bg-gray-100 h-80">
                        {dogProfile.images && dogProfile.images.length > 0 ? (
                          <img
                            src={dogProfile.images[activeImageIndex]}
                            alt={dogProfile.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-6xl text-gray-400">🐕</span>
                          </div>
                        )}
                        
                        {/* Image navigation arrows */}
                        {dogProfile.images && dogProfile.images.length > 1 && (
                          <>
                            <button
                              disabled={activeImageIndex === 0}
                              onClick={() => setActiveImageIndex(prev => prev - 1)}
                              className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center ${
                                activeImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white cursor-pointer'
                              }`}
                            >
                              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              disabled={activeImageIndex === dogProfile.images.length - 1}
                              onClick={() => setActiveImageIndex(prev => prev + 1)}
                              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center ${
                                activeImageIndex === dogProfile.images.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white cursor-pointer'
                              }`}
                            >
                              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                      
                      {/* Thumbnail navigation */}
                      {dogProfile.images && dogProfile.images.length > 1 && (
                        <div className="flex p-2 gap-2 overflow-x-auto">
                          {dogProfile.images.map((image, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveImageIndex(index)}
                              className={`w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                                index === activeImageIndex ? 'border-dogswipe-orange' : 'border-transparent'
                              }`}
                            >
                              <img src={image} alt={`${dogProfile.name} ${index + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Right column - Info */}
                    <div className="md:w-1/2 p-6">
                      <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {dogProfile.name}
                      </h1>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {dogProfile.breed}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {dogProfile.age} years old
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm capitalize">
                          {dogProfile.gender}
                        </span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm capitalize">
                          {dogProfile.size} size
                        </span>
                        {dogProfile.neutered && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                            Neutered/Spayed
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-700 mb-2">About</h2>
                        <p className="text-gray-600">{dogProfile.description}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="font-medium text-gray-700">Weight</h3>
                          <p className="text-gray-600">{dogProfile.weight} kg</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Temperament</h3>
                          <p className="text-gray-600 capitalize">{dogProfile.temperament}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-700">Exercise Needs</h3>
                          <p className="text-gray-600 capitalize">{dogProfile.exerciseNeeds}</p>
                        </div>
                      </div>
                      
                      {dogProfile.favoriteActivities && dogProfile.favoriteActivities.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-700 mb-2">Favorite Activities</h3>
                          <div className="flex flex-wrap gap-2">
                            {dogProfile.favoriteActivities.map((activity, index) => (
                              <span key={index} className="px-3 py-1 bg-dogswipe-orange/10 text-dogswipe-orange rounded-full text-sm">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogProfileDetail; 