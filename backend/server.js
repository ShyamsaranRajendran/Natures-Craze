const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected to MongoDB successfully');
});

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

app.use(express.static(path.join(__dirname, 'public')));


const user = require('./routes/user');
app.use('/auth/', user);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
