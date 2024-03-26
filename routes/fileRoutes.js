const express = require('express');
const router = express.Router();
const multer = require('multer');
const fileController = require('../controllers/fileController');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.single('photo'), fileController.uploadPhoto);
router.get('/retrieve', fileController.getAllPhotos);

// router.get('/test', () => {
//     console.log('Hello from Express!');
// });

router.post('/add_comment', fileController.addComment);
router.post('/retrieve_comment', fileController.fetchComments);

module.exports = router;
