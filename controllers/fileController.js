const mysql = require('mysql');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dwwguliwb',
    api_key: '268279275622213',
    api_secret: 'KWp4uQFekX-dzi_yfBrmoaPiF8Q'
});

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saurabh@04',
    database: 'authentication'
});

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// cloudinary.uploader.upload("C:\\Users\\shubh\\OneDrive\\Desktop\\MangaRead\\uploads\\1711289918119-iarcs-logo.jpg",
//     { public_id: "localFile" },
//     function (error, result) { console.log(result); });


exports.uploadPhoto = (req, res) => {
    console.log('Request to upload file');

    try {
        const { path: filePath } = req.file;

        cloudinary.uploader.upload(filePath, { folder: 'photoshare' }, async (error, result) => {
            if (error) {
                console.error('Error uploading photo to Cloudinary: ', error);
                return res.status(500).json({ message: 'Server error' });
            }

            console.log('Photo uploaded to Cloudinary');
            const { secure_url: imageUrl } = result;

            console.log(req.file.filename, imageUrl);
            
            const sql = 'INSERT INTO files (filename, path) VALUES (?, ?)';
            mysqlConnection.query(sql, [req.file.filename, imageUrl], (err, result) => {
                if (err) {
                    console.error('Error saving photo URL to MySQL: ', err);
                    return res.status(500).json({ message: 'Server error' });
                }
                console.log('Photo URL saved to MySQL');
                res.status(201).json({ message: 'Photo uploaded successfully' });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllPhotos = (req, res) => {
    console.log('Retrieve');
    const sql = 'SELECT * FROM files';
    mysqlConnection.query(sql, (err, rows) => {
        if (err) {
            console.error('Error fetching photos from MySQL: ', err);
            res.status(500).json({ message: 'Server error' });
        } else {
            res.json(rows);
        }
    });
};
