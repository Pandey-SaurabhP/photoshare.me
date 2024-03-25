// controllers/userController.js
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const secretKey = 'xyz';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saurabh@04',
    database: 'authentication'
});

connection.connect();

const generateToken = (user) => {
    return jwt.sign({ id: user.id }, secretKey, { expiresIn: '10m' });
};

exports.getUserInfo = (req, res) => {
    console.log('Recived request', req.body);
    const token = req.body.headers.Authorization.split(' ')[1];
    console.log(token);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            const userId = decoded.id;
            connection.query('SELECT username, email FROM users WHERE id = ?', [userId], (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Internal server error' });
                } else if (results.length === 0) {
                    res.status(404).json({ message: 'User not found' });
                } else {
                    res.json(results[0]);
                }
            });
        }
    });
};

exports.signup = (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            const user = { username, email, password: hash };
            connection.query('INSERT INTO users SET ?', user, (error, results) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Internal server error' });
                } else {
                    const token = generateToken({ id: results.insertId });
                    res.json({ token });
                }
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        } else {
            if (results.length === 0) {
                res.status(401).json({ message: 'Invalid email or password' });
            } else {
                const user = results[0];

                bcrypt.compare(password, user.password, (err, isValid) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ message: 'Internal server error' });
                    } else if (!isValid) {
                        res.status(401).json({ message: 'Invalid email or password' });
                    } else {
                        const token = generateToken({ id: user.id });
                        res.json({ token });
                    }
                });
            }
        }
    });
};
