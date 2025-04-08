import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { v4 as uuidv4 } from 'uuid';

const DogProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    weight: '',
    description: '',
    temperament: 'friendly',
    neutered: false,
    exerciseNeeds: 'medium',
    favoriteActivities: '',
    images: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to create a dog profile');
      }
      
      // Convert age and weight to numbers
      const dogData = {
        ...formData,
        age: parseInt(formData.age) || 0,
        weight: parseFloat(formData.weight) || 0,
        favoriteActivities: formData.favoriteActivities.split(',').map(activity => activity.trim()),
        ownerId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Generate a unique ID for the dog profile
        id: uuidv4()
      };
      
      // Save dog profile to Firestore
      const dogProfileRef = doc(firestore, 'dogProfiles', dogData.id);
      await setDoc(dogProfileRef, dogData);
      
      setSuccess('Dog profile created successfully!');
      
      // Reset form or navigate to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'Failed to create dog profile');
    } finally {
      setLoading(false);
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
                DogSwipe - Dog Profile
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
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 font-poppins main-gradient text-center">
                  {formData.name ? `${formData.name}'s Profile` : 'Add Your Dog'}
                </h1>
                
                {error && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}
                
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Basic Information Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name */}
                          <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                              Name*
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Your dog's name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                          
                          {/* Breed */}
                          <div>
                            <label htmlFor="breed" className="block text-gray-700 font-medium mb-2">
                              Breed*
                            </label>
                            <input
                              type="text"
                              id="breed"
                              name="breed"
                              required
                              value={formData.breed}
                              onChange={handleChange}
                              placeholder="e.g., Golden Retriever"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                          
                          {/* Age */}
                          <div>
                            <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
                              Age (years)*
                            </label>
                            <input
                              type="number"
                              id="age"
                              name="age"
                              required
                              min="0"
                              max="20"
                              value={formData.age}
                              onChange={handleChange}
                              placeholder="e.g., 3"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                          
                          {/* Gender */}
                          <div>
                            <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                              Gender*
                            </label>
                            <select
                              id="gender"
                              name="gender"
                              required
                              value={formData.gender}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                          
                          {/* Size */}
                          <div>
                            <label htmlFor="size" className="block text-gray-700 font-medium mb-2">
                              Size
                            </label>
                            <select
                              id="size"
                              name="size"
                              value={formData.size}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            >
                              <option value="small">Small</option>
                              <option value="medium">Medium</option>
                              <option value="large">Large</option>
                            </select>
                          </div>
                          
                          {/* Weight */}
                          <div>
                            <label htmlFor="weight" className="block text-gray-700 font-medium mb-2">
                              Weight (kg)
                            </label>
                            <input
                              type="number"
                              id="weight"
                              name="weight"
                              min="0"
                              max="100"
                              value={formData.weight}
                              onChange={handleChange}
                              placeholder="e.g., 15"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Personality & Preferences Section */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Personality & Preferences</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Description */}
                          <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                              Description*
                            </label>
                            <textarea
                              id="description"
                              name="description"
                              required
                              rows={3}
                              value={formData.description}
                              onChange={handleChange}
                              placeholder="Tell us about your dog's personality, habits, and what makes them special..."
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                          
                          {/* Temperament */}
                          <div>
                            <label htmlFor="temperament" className="block text-gray-700 font-medium mb-2">
                              Temperament
                            </label>
                            <select
                              id="temperament"
                              name="temperament"
                              value={formData.temperament}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            >
                              <option value="friendly">Friendly</option>
                              <option value="shy">Shy</option>
                              <option value="energetic">Energetic</option>
                              <option value="calm">Calm</option>
                              <option value="playful">Playful</option>
                            </select>
                          </div>
                          
                          {/* Exercise Needs */}
                          <div>
                            <label htmlFor="exerciseNeeds" className="block text-gray-700 font-medium mb-2">
                              Exercise Needs
                            </label>
                            <select
                              id="exerciseNeeds"
                              name="exerciseNeeds"
                              value={formData.exerciseNeeds}
                              onChange={handleChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                          </div>
                          
                          {/* Favorite Activities */}
                          <div className="md:col-span-2">
                            <label htmlFor="favoriteActivities" className="block text-gray-700 font-medium mb-2">
                              Favorite Activities
                            </label>
                            <input
                              type="text"
                              id="favoriteActivities"
                              name="favoriteActivities"
                              value={formData.favoriteActivities}
                              onChange={handleChange}
                              placeholder="e.g., fetch, swimming, running (comma separated)"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                            />
                          </div>
                          
                          {/* Neutered */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="neutered"
                              name="neutered"
                              checked={formData.neutered}
                              onChange={handleChange}
                              className="h-4 w-4 text-dogswipe-orange focus:ring-dogswipe-orange/40 border-gray-300 rounded"
                            />
                            <label htmlFor="neutered" className="ml-2 block text-gray-700">
                              Neutered/Spayed
                            </label>
                          </div>
                        </div>
                      </div>
                      
                      {/* Image Upload Section - Would be implemented with Firebase Storage */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-medium text-gray-800 mb-4">Photos</h2>
                        
                        <div className="border-dashed border-2 border-gray-300 rounded-lg p-8 text-center">
                          <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Photo upload will be available soon!
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between mt-8">
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard')}
                          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full font-medium hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                        
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-2 bg-dogswipe-orange text-white rounded-full font-medium hover:bg-dogswipe-red transition-colors disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Dog Profile'}
                        </button>
                      </div>
                    </form>
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

export default DogProfile; 