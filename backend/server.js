const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// const fileUpload = require("express-fileupload");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB successfully');
});

const app = express();
app.use(express.json());
// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.183.209:3000',
  'https://turmeric-tau.vercel.app'
];

// Enable CORS with dynamic origin checking
app.use(cors({
  origin: (origin, callback) => {
    // If the request has no origin (e.g., from a server-side request), allow it
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Optional, if you need cookies to be sent with the request
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

const user = require('./routes/user');
const prod = require('./routes/users/products');
const order = require('./routes/users/order');
app.use('/orders', order);
app.use('/prod', prod);
app.use('/auth', user);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
