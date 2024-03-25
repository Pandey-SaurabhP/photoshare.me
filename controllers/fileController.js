const mysql = require('mysql');

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


exports.uploadPhoto = (req, res) => {
    console.log('Request to upload file');
    console.log(req); // Access uploaded file using req.file, not req.body.file

    try {
        const { filename, path } = req.file;

        const sql = 'INSERT INTO files (filename, path) VALUES (?, ?)'; // Assuming no username is needed

        mysqlConnection.query(sql, [filename, path], (err, result) => {
            if (err) {
                console.error('Error uploading photo to MySQL: ', err);
                res.status(500).json({ message: 'Server error' });
            } else {
                console.log('Photo uploaded to MySQL');
                res.status(201).json({ message: 'Photo uploaded successfully' });
            }
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
