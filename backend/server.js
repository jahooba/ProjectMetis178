// Import dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
require("dotenv").config();

// Add authentication routes
const authRoutes = require('./routes/authRoute.js');
const courseRoutes = require('./routes/courseRoute.js');

// Express app/instance
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()) // for parsing json/application
app.use(cookieParser())

// Database Connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connected'))
.catch((err) => console.log('Database not connected', err))


app.use('/', authRoutes)
app.use('/api', courseRoutes);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// listen for requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})