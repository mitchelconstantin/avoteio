require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const routes = require('./routes.js');
=======
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('../database/index');
>>>>>>> 843d5365795628f252b1c6e5277a6ed3554ca47b

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});



