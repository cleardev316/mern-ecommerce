import express from 'express';import { body, check } from 'express-validator';
import multer from 'multer';
import validateRequest from '../middleware/validator.js';
import { uploadMedia } from '../utils/cloudinary.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
    if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // To accept the file pass `true`, like so:
    cb(null, true);
  } else {
        // To reject this file pass `false`, like so:
    cb(new Error('Images only!'), false); 
  }
};

const upload = multer({ storage, fileFilter }).single('image');

router.post('/', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageResult = await uploadMedia(req.file.path);
    const imageUrl = imageResult.secure_url;

    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
