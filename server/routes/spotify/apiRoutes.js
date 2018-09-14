const express = require('express');
const router = express.Router();
const db = require('../../../database/index')

router.get('/search', (req, res) => {
  console.log(req.session);
  res.end();
});

module.exports = router;