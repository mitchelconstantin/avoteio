const router = require('express').Router();

router.route('/spotify').get((req, res) => {
  console.log('should get all songs in room');
  res.end();
});

module.exports = router;