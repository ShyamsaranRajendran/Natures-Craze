const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const fileUpload = require("express-fileupload");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB successfully');
});

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000','http://192.168.183.209:3000',"https://turmeric-tau.vercel.app"], // Allows only React app to access this API
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const user = require('./routes/user');
const prod = require('./routes/users/products');
app.use('/prod', prod);
app.use('/auth', user);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
