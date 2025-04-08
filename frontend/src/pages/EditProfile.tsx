import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { updateProfile, updateEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';

const EditProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    currentPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>({});
  
  useEffect(() => {
    if (currentUser) {
      // Set initial form data from current user
      setFormData(prev => ({
        ...prev,
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
      }));
      
      // Fetch additional user profile data from Firestore
      const fetchUserProfile = async () => {
        if (currentUser.uid) {
          try {
            const userDocRef = doc(firestore, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              setUserProfile(userDoc.data());
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      };
      
      fetchUserProfile();
    }
  }, [currentUser]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    
    try {
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }

      // Verify authentication state
      if (!currentUser.uid) {
        throw new Error('User ID is missing');
      }

      console.log('Current user:', {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName
      });
      
      // Create a profile update object
      const updates: any = {};
      
      // Check if display name has changed
      if (formData.displayName !== currentUser.displayName) {
        updates.displayName = formData.displayName;
      }
      
      // Email update requires reauthentication
      if (formData.email !== currentUser.email && formData.currentPassword) {
        if (!currentUser.email) {
          throw new Error('Current user has no email to update');
        }
        
        // Reauthenticate user before updating email
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formData.currentPassword
        );
        
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, formData.email);
      }
      
      // If password is being updated
      if (formData.password && formData.confirmPassword && formData.currentPassword) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        
        // Reauthenticate user before updating password
        const credential = EmailAuthProvider.credential(
          currentUser.email!,
          formData.currentPassword
        );
        
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, formData.password);
      }
      
      // Update profile in Firebase Auth
      if (Object.keys(updates).length > 0) {
        await updateProfile(currentUser, updates);
      }
      
      // Save additional profile fields to Firestore
      try {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        console.log('Attempting to update Firestore document:', {
          uid: currentUser.uid,
          displayName: formData.displayName,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        });

        const userDoc = await getDoc(userDocRef);
        
        if (!userDoc.exists()) {
          console.log('Creating new user document');
          await setDoc(userDocRef, {
            displayName: formData.displayName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          console.log('Updating existing user document');
          await setDoc(userDocRef, {
            displayName: formData.displayName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            updatedAt: new Date(),
          }, { merge: true });
        }
        
        console.log('Firestore update successful');
      } catch (firestoreError: any) {
        console.error('Firestore error:', firestoreError);
        throw new Error(`Failed to update profile in database: ${firestoreError.message}`);
      }
      
      setSuccess('Profile updated successfully!');
      
      // Reset sensitive form fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
        currentPassword: '',
      }));
      
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
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
                DogSwipe Profile
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
                  Edit Your Profile
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
                      {/* Profile Picture - Would require storage setup */}
                      <div className="flex justify-center mb-6">
                        {currentUser?.photoURL ? (
                          <img 
                            src={currentUser.photoURL} 
                            alt="Profile" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-dogswipe-orange" 
                          />
                        ) : (
                          <div className="w-32 h-32 rounded-full bg-dogswipe-orange/20 flex items-center justify-center border-4 border-dogswipe-orange">
                            <span className="text-4xl font-bold text-dogswipe-orange">
                              {formData.displayName.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Display Name */}
                        <div>
                          <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
                            Display Name
                          </label>
                          <input
                            type="text"
                            id="displayName"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                          />
                        </div>
                        
                        {/* Email */}
                        <div>
                          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                          />
                        </div>
                        
                        {/* Phone Number */}
                        <div>
                          <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                          />
                        </div>
                        
                        {/* Current Password - Required for sensitive changes */}
                        <div>
                          <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Required for email/password changes"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange text-sm"
                          />
                        </div>
                        
                        {/* New Password */}
                        <div>
                          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                            New Password
                            <span className="text-xs text-gray-500 ml-1">(leave blank to keep current)</span>
                          </label>
                          <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                          />
                        </div>
                        
                        {/* Confirm New Password */}
                        <div>
                          <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dogswipe-orange/40 focus:border-dogswipe-orange"
                          />
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
                          {loading ? 'Saving...' : 'Save Changes'}
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

export default EditProfile; 