const admin = require('firebase-admin');

const authMiddleware = async (req, res, next) => {
  try {
    // Get the ID token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Add the user info to the request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: decodedToken.role || 'user'
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

module.exports = authMiddleware; 