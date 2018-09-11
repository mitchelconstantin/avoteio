const express = require('express');

const router = express.Router();

router.route('/rooms/:roomId').get((req, res) => {
  console.log('should get all songs in room');
  res.end();
});

module.exports = router;