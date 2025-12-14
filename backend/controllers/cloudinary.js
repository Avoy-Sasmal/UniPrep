import { cloudinary, upload } from '../config/cloudinaryConfig.js';

/**
 * Upload a single file to Cloudinary
 * Route: POST /api/cloudinary/upload
 * Body: multipart/form-data with 'file' field
 */
export const uploadFromBrowser = async (req, res) => {
  try {
    // Check if Cloudinary is configured
    const cloudName = cloudinary.config().cloud_name;
    const apiKey = cloudinary.config().api_key;
    
    if (!cloudName || !apiKey) {
      console.error('Cloudinary configuration missing');
      return res.status(500).json({ 
        error: 'Cloudinary not configured', 
        message: 'Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your backend/.env file' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const file = req.file;
    const tags = req.body.tags ? req.body.tags.split(',') : [];

    // Convert buffer to stream for Cloudinary
    const buffer = file.buffer;

    // Determine resource type based on file MIME type
    let resourceType = 'auto';
    if (file.mimetype === 'application/pdf') {
      resourceType = 'raw'; // PDFs should be uploaded as raw files
    } else if (file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    }

    // Upload to Cloudinary using upload_stream
    await new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: resourceType,
        folder: 'uniprep-copilot', // Optional: organize files in a folder
        tags: tags,
        use_filename: true,
        unique_filename: true
      };

      // For PDFs, add additional options
      if (resourceType === 'raw') {
        uploadOptions.format = 'pdf';
      }

      cloudinary.uploader
        .upload_stream(
          uploadOptions,
          (error, uploadResult) => {
            if (error) {
              console.error('Cloudinary upload error:', error.message);
              reject(error);
            } else {
              // Log success without exposing full URL in production
              if (process.env.NODE_ENV === 'development') {
                console.log('✓ File uploaded successfully to Cloudinary');
                console.log('Resource type:', resourceType, 'Format:', uploadResult.format);
              }
              resolve(uploadResult);
              res.status(200).json({
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                format: uploadResult.format,
                resource_type: uploadResult.resource_type,
                width: uploadResult.width,
                height: uploadResult.height,
                bytes: uploadResult.bytes,
                created_at: uploadResult.created_at,
                mime_type: file.mimetype
              });
            }
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error('Error in uploadFromBrowser:', error);
    res.status(500).json({ error: 'Failed to upload file', message: error.message });
  }
};

/**
 * Upload multiple files to Cloudinary
 * Route: POST /api/cloudinary/upload-multiple
 * Body: multipart/form-data with 'files' field (array)
 */
export const uploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const files = req.files;
    const tags = req.body.tags ? req.body.tags.split(',') : [];

    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto',
              folder: 'uniprep-copilot',
              tags: tags,
              use_filename: true,
              unique_filename: true
            },
            (error, uploadResult) => {
              if (error) {
                console.error('Cloudinary upload error for', file.originalname, ':', error);
                reject(error);
              } else {
                resolve({
                  url: uploadResult.secure_url,
                  public_id: uploadResult.public_id,
                  format: uploadResult.format,
                  width: uploadResult.width,
                  height: uploadResult.height,
                  bytes: uploadResult.bytes,
                  created_at: uploadResult.created_at,
                  original_filename: file.originalname
                });
              }
            }
          )
          .end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    res.status(200).json({ files: results });
  } catch (error) {
    console.error('Error in uploadMultiple:', error);
    res.status(500).json({ error: 'Failed to upload files', message: error.message });
  }
};

/**
 * Delete a file from Cloudinary
 * Route: DELETE /api/cloudinary/delete/:public_id
 */
export const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.params;

    if (!public_id) {
      return res.status(400).json({ error: 'public_id is required' });
    }

    // Deleting file from Cloudinary

    const result = await cloudinary.uploader.destroy(public_id, {
      resource_type: 'auto'
    });

    if (result.result === 'ok') {
      res.status(200).json({ message: 'File deleted successfully', result });
    } else {
      res.status(404).json({ error: 'File not found', result });
    }
  } catch (error) {
    console.error('Error in deleteFile:', error);
    res.status(500).json({ error: 'Failed to delete file', message: error.message });
  }
};

/**
 * Get Cloudinary configuration status
 * Route: GET /api/cloudinary/config
 */
export const getConfig = async (req, res) => {
  try {
    const isConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      configured: isConfigured,
      cloud_name: isConfigured ? process.env.CLOUDINARY_CLOUD_NAME : null,
      has_api_key: !!process.env.CLOUDINARY_API_KEY,
      has_api_secret: !!process.env.CLOUDINARY_API_SECRET
    });
  } catch (error) {
    console.error('Error in getConfig:', error);
    res.status(500).json({ error: 'Failed to get configuration', message: error.message });
  }
};

// Export multer middleware for use in routes
export { upload };
