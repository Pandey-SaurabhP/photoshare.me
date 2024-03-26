const mysql = require('mysql');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dwwguliwb',
    api_key: '268279275622213',
    api_secret: 'KWp4uQFekX-dzi_yfBrmoaPiF8Q'
});

const mysqlConnection = mysql.createConnection({
    host: 'b2jmm1fqtjqsdqczvoi8-mysql.services.clever-cloud.com',
    user: 'ukptak7bxy2rt7fr',
    password: '6dQAJPxiHUZ3yVzg7Xky',
    database: 'b2jmm1fqtjqsdqczvoi8'
});

// const mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Saurabh@04',
//     database: 'authentication'
// });

mysqlConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});


exports.uploadPhoto = (req, res) => {
    console.log('Request to upload file');

    try {
        const { path: filePath } = req.file;
        const { username, title, description, categories } = req.body;

        cloudinary.uploader.upload(filePath, { folder: 'photoshare' }, async (error, result) => {

            if (error) {
                console.error('Error uploading photo to Cloudinary: ', error);
                return res.status(500).json({ message: 'Server error' });
            }

            console.log('Photo uploaded to Cloudinary');
            const { secure_url: imageUrl } = result;

            console.log(req.file.filename, imageUrl);

            const sql = 'INSERT INTO files (username, filename, path, title, description, tags) VALUES (?, ?, ?, ?, ?, ?)';
            mysqlConnection.query(sql, [username, req.file.filename, imageUrl, title, description, categories], (err, result) => {
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

exports.fetchComments = (req, res) => {
    console.log('Comment retrieval request');
    const {filename}= req.body;
    const qry = 'Select * from comments where filename = ?';

    mysqlConnection.query(qry, [filename], (err, rows) => {
        if (err) {
            console.error('Error fetching comments', err);
            res.status(500).json({ message: 'Server Error' });
        }
        else {
            res.json(rows);
        }
    })
}

exports.addComment = (req, res) => {
    console.log('Request to add comment');
    console.log(req.body);

    try {
        const { email, filename, text } = req.body;
        const sql = 'INSERT INTO comments (email, filename, text, time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)';
        mysqlConnection.query(sql, [email, filename, text], (err, result) => {
            if (err) {
                console.error('Error saving comment to MySQL: ', err);
                return res.status(500).json({ message: 'Server error' });
            }

            console.log('Comment Saved to MySQL');
            res.status(201).json({ message: 'Comment uploaded successfully' });
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getAllPhotos = (req, res) => {
    console.log('Retrieval Request');
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
