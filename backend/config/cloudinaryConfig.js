import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Cloudinary configuration (hardcoded for now, can be moved to .env later)
const cloudName = "dqdwjsytk";
const apiKey = "586881487232967";
const apiSecret = "FJGDEuJHMYMd7C20szjCRthRcDA";

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

console.log('✓ Cloudinary configuration loaded and initialized successfully');

// Configure multer for file uploads (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Export cloudinary instance and multer upload middleware
export { cloudinary, upload };
