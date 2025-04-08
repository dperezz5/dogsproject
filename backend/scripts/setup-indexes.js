require('dotenv').config();
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: "dogswipe-8994c",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupIndexes() {
  try {
    console.log('Setting up Firestore indexes...');

    // Note: Firestore indexes are created automatically when needed
    // This script is just to document the required indexes

    const requiredIndexes = [
      {
        collection: 'dogProfiles',
        fields: ['location', 'createdAt'],
        queryScope: 'COLLECTION',
        order: 'ASCENDING'
      },
      {
        collection: 'swipes',
        fields: ['swiperId', 'timestamp'],
        queryScope: 'COLLECTION',
        order: 'DESCENDING'
      },
      {
        collection: 'matches',
        fields: ['dogProfile1', 'isActive'],
        queryScope: 'COLLECTION',
        order: 'DESCENDING'
      },
      {
        collection: 'matches',
        fields: ['dogProfile2', 'isActive'],
        queryScope: 'COLLECTION',
        order: 'DESCENDING'
      }
    ];

    console.log('Required indexes:');
    requiredIndexes.forEach(index => {
      console.log(`- Collection: ${index.collection}`);
      console.log(`  Fields: ${index.fields.join(', ')}`);
      console.log(`  Order: ${index.order}`);
    });

    console.log('\nNote: Firestore will automatically create these indexes when needed.');
    console.log('You can view and manage indexes in the Firebase Console under Firestore > Indexes');

    process.exit(0);
  } catch (error) {
    console.error('Error setting up indexes:', error);
    process.exit(1);
  }
}

setupIndexes(); 