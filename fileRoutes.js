const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('./controllers/fileController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Initialize multer instance
const upload = multer({ storage: storage });

// Route handler for file upload
router.post('/upload', upload.single('photo'), fileController.uploadPhoto);
router.get('/retrieve', fileController.getAllPhotos);
router.get('/test', () => {
    console.log('Hello from Express!');
});

module.exports = router;
