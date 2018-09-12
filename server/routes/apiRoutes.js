const express = require('express');

const router = express.Router();

router.route('/rooms/getAllSongs').get((req, res) => {
  let roomID = req.query.roomID
  console.log('should get all songs in room', roomID);

  res.end();
});

module.exports = router;