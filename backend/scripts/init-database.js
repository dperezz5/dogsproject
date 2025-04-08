require('dotenv').config({ path: '../.env' });
const admin = require('firebase-admin');

// Initialize Firebase Admin with service account credentials
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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initializeCollections() {
  try {
    // Create users collection with a template document
    await db.collection('users').doc('template').set({
      id: 'template',
      username: 'template_user',
      email: 'template@example.com',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      profilePicture: '',
      location: new admin.firestore.GeoPoint(0, 0),
      preferences: {
        maxDistance: 10,
        minAge: 1,
        maxAge: 15,
        breeds: []
      }
    });
    console.log('Created users collection with template document');

    // Create dogProfiles collection with a template document
    await db.collection('dogProfiles').doc('template').set({
      id: 'template',
      userId: 'template_user_id',
      name: 'Template Dog',
      age: 1,
      breed: 'Template Breed',
      gender: 'male',
      size: 'medium',
      description: 'Template description',
      photos: [],
      location: new admin.firestore.GeoPoint(0, 0),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    console.log('Created dogProfiles collection with template document');

    // Create swipes collection with a template document
    await db.collection('swipes').doc('template').set({
      id: 'template',
      swiperId: 'template_user_id',
      swipedDogId: 'template_dog_id',
      direction: 'right',
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Created swipes collection with template document');

    // Create matches collection with a template document
    await db.collection('matches').doc('template').set({
      id: 'template',
      dogProfile1: 'template_dog_id_1',
      dogProfile2: 'template_dog_id_2',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      isActive: true
    });
    console.log('Created matches collection with template document');

    // Create reviews collection with a template document
    await db.collection('reviews').doc('template').set({
      id: 'template',
      reviewerId: 'template_user_id',
      reviewedUserId: 'template_reviewed_user_id',
      rating: 5,
      comment: 'Template review comment',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('Created reviews collection with template document');

    console.log('All collections initialized successfully!');
  } catch (error) {
    console.error('Error initializing collections:', error);
  } finally {
    process.exit();
  }
}

initializeCollections(); 