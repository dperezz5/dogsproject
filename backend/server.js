require('dotenv').config();
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const authMiddleware = require('./middleware/auth');
const uploadsRouter = require('./routes/uploads');

console.log('Starting server initialization...');

// Initialize Firebase Admin SDK
try {
  console.log('Initializing Firebase Admin SDK...');
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

  // Log environment variables (without sensitive data)
  console.log('Environment variables loaded:');
  console.log('FIREBASE_PRIVATE_KEY_ID:', process.env.FIREBASE_PRIVATE_KEY_ID ? 'Set' : 'Not set');
  console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set');
  console.log('FIREBASE_CLIENT_ID:', process.env.FIREBASE_CLIENT_ID ? 'Set' : 'Not set');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'dogswipe-8994c.firebasestorage.app'
  });

  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  process.exit(1);
}

const db = admin.firestore();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3002', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/uploads', uploadsRouter);

// Protected routes using auth middleware
app.use('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Public routes
app.get('/', (req, res) => {
  res.send('DogSwipe API is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Protected routes (require authentication)
app.get('/api/test-db', authMiddleware, async (req, res) => {
  try {
    console.log('Testing Firestore connection...');
    // Create a test document
    const testDocRef = db.collection('test').doc('test-doc');
    await testDocRef.set({
      message: 'Firebase connection is working',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      userId: req.user.uid // Add user ID to the document
    });
    
    // Read the document back
    const doc = await testDocRef.get();
    
    console.log('Firestore test successful');
    res.json({ 
      success: true, 
      message: 'Firebase connection is working',
      data: doc.data()
    });
  } catch (error) {
    console.error('Firebase connection error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Firebase connection failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 