require('dotenv').config({ path: '../.env' });
const admin = require('firebase-admin');

const serviceAccount = {
  type: 'service_account',
  project_id: 'dogswipe-8994c',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: 'googleapis.com'
};

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function testUserOperations() {
  console.log('\nTesting User Operations:');
  const usersRef = db.collection('users');
  
  // Create
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const userDoc = await usersRef.add(userData);
  console.log('Created user:', userDoc.id);
  
  // Read
  const user = await userDoc.get();
  console.log('Read user:', user.data());
  
  // Update
  await userDoc.update({
    username: 'updateduser',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Updated user');
  
  // Delete
  await userDoc.delete();
  console.log('Deleted user');
}

async function testDogProfileOperations() {
  console.log('\nTesting Dog Profile Operations:');
  const dogProfilesRef = db.collection('dogProfiles');
  
  // Create
  const dogData = {
    name: 'TestDog',
    age: 3,
    breed: 'Mixed',
    ownerId: 'test_owner',
    photos: ['https://example.com/test.jpg'],
    bio: 'Test bio',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const dogDoc = await dogProfilesRef.add(dogData);
  console.log('Created dog profile:', dogDoc.id);
  
  // Read
  const dog = await dogDoc.get();
  console.log('Read dog profile:', dog.data());
  
  // Update
  await dogDoc.update({
    name: 'UpdatedDog',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('Updated dog profile');
  
  // Delete
  await dogDoc.delete();
  console.log('Deleted dog profile');
}

async function testSwipeOperations() {
  console.log('\nTesting Swipe Operations:');
  const swipesRef = db.collection('swipes');
  
  // Create
  const swipeData = {
    swiperId: 'test_swiper',
    swipedId: 'test_swiped',
    direction: 'right',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const swipeDoc = await swipesRef.add(swipeData);
  console.log('Created swipe:', swipeDoc.id);
  
  // Read
  const swipe = await swipeDoc.get();
  console.log('Read swipe:', swipe.data());
  
  // Delete
  await swipeDoc.delete();
  console.log('Deleted swipe');
}

async function testMatchOperations() {
  console.log('\nTesting Match Operations:');
  const matchesRef = db.collection('matches');
  
  // Create
  const matchData = {
    userId1: 'test_user1',
    userId2: 'test_user2',
    dogId1: 'test_dog1',
    dogId2: 'test_dog2',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const matchDoc = await matchesRef.add(matchData);
  console.log('Created match:', matchDoc.id);
  
  // Read
  const match = await matchDoc.get();
  console.log('Read match:', match.data());
  
  // Delete
  await matchDoc.delete();
  console.log('Deleted match');
}

async function testReviewOperations() {
  console.log('\nTesting Review Operations:');
  const reviewsRef = db.collection('reviews');
  
  // Create
  const reviewData = {
    reviewerId: 'test_reviewer',
    reviewedId: 'test_reviewed',
    rating: 5,
    comment: 'Test review',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  const reviewDoc = await reviewsRef.add(reviewData);
  console.log('Created review:', reviewDoc.id);
  
  // Read
  const review = await reviewDoc.get();
  console.log('Read review:', review.data());
  
  // Update
  await reviewDoc.update({
    rating: 4,
    comment: 'Updated review'
  });
  console.log('Updated review');
  
  // Delete
  await reviewDoc.delete();
  console.log('Deleted review');
}

async function runTests() {
  try {
    await testUserOperations();
    await testDogProfileOperations();
    await testSwipeOperations();
    await testMatchOperations();
    await testReviewOperations();
    console.log('\nAll database operations tested successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing database operations:', error);
    process.exit(1);
  }
}

runTests(); 