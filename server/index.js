require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
<<<<<<< HEAD
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('../database/index');
=======
const path = require('path');

const apiRoutes = require('./routes/api/apiRoutes');
const authRoutes = require('./routes/spotify/authRoutes');
// const db = require('../database/index');
>>>>>>> 87059adce7d1199864bab42a4c0fc07b84775ca9

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/../client/dist'));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});



