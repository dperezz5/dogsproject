const express = require('express');
const router = express.Router();
const multer = require('multer');
const admin = require('firebase-admin');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// POST route for uploading images
router.post('/image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = admin.storage().bucket();
    const fileName = `${req.user.uid}/dogs/${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);
    
    // Create a write stream to upload the file
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    // Handle errors during upload
    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    });

    // When upload completes, return the public URL
    blobStream.on('finish', async () => {
      // Make file publicly accessible
      await file.makePublic();
      
      // Get the public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      res.status(200).json({ url: publicUrl });
    });

    // Write the file buffer to Firebase Storage
    blobStream.end(req.file.buffer);
  } catch (error) {
    console.error('Error in upload route:', error);
    res.status(500).json({ error: 'Server error during upload' });
  }
});

module.exports = router; 