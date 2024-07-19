const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const uploadDir = 'uploads'; // Directory for temporary uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const fileName = path.basename(filePath, path.extname(filePath));
  const outputPath = path.dirname(filePath);

  try {
    // Resize image
    await Promise.all([
      sharp(filePath).resize(100, 100).toFile(`${outputPath}/${fileName}-small.jpg`),
      sharp(filePath).resize(500, 500).toFile(`${outputPath}/${fileName}-medium.jpg`),
      sharp(filePath).resize(800, 800).toFile(`${outputPath}/${fileName}-large.jpg`)
    ]);

    // Construct URLs
    const imageUrls = {
      small: `/uploads/${fileName}-small.jpg`,
      medium: `/uploads/${fileName}-medium.jpg`,
      large: `/uploads/${fileName}-large.jpg`
    };

    // Clean up the original uploaded file
    fs.unlinkSync(filePath);

    res.json({ imageUrls });
  } catch (error) {
    console.error('Error resizing image:', error);
    res.status(500).json({ message: 'Failed to process image' });
  }
});

module.exports = router;
