// server.js
const express = require('express');
const bodyParser = require('body-parser');

const userRoutes = require('./userRoutes');
const fileRoutes = require('./fileRoutes');
const path = require('path');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
