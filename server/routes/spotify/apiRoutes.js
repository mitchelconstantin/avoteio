const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const axios = require('axios');

router.get('/search', (req, res) => {
  const { q } = req.query;
  db.getUserByRoomId(req.session.roomId, (err, data) => {
    if (err) {
      console.log(`Couldn't retrieve user`, err);
      res.sendStatus(500);
    } else {
      const [user] = data;
      let accessToken = user.access_token;

      axios.get('https://api.spotify.com/v1/search', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        params: {
          q: q,
          type: "track",
          limit: 20
        }
      })
      .then(({ data: { tracks } }) => {
        res.json(tracks);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    }
  });
});

// Spotify play
router.post('/playSong/:songId', (req, res) => {
  console.log(req.params);
  const {songId} = req.params;
  db.getUserByRoomId(req.session.roomId, (err, data) => {
    if (err) {
      console.log(`Couldn't retrieve user`, err);
      res.sendStatus(500);
    } else {
      const [user] = data;
      let accessToken = user.access_token;
      const options = {
        method: 'PUT',
        url: 'https://api.spotify.com/v1/me/player/play',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        data: {
          uris: [`spotify:track:${songId}`]
        }
      };
  
      axios(options)
      .then(response => {
        console.log(response);
        res.json(response);
      })
      .catch(err => {
        console.log('is this the error?',err);
        res.sendStatus(500);
      });
    }
  });
});

router.get('/currentSong', (req, res) => {
  db.getUserByRoomId(req.session.roomId, (err, data) => {
    if (err) {
      console.log(`Couldn't retrieve user`, err);
      res.sendStatus(500);
    } else {
      const [user] = data;
      let accessToken = user.access_token;

      axios.get('https://api.spotify.com/v1/me/player', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then(({data}) => {
        if (typeof data === 'object' && data.progress_ms + 1200 >= data.item.duration_ms) {
          res.json({ playNextSong: true });
        } else {
          res.json({ playNextSong: false });
        }
      })
      .catch(err => {
        console.log('not able to get current song',err);
        res.sendStatus(500);
      });
    }
  });
});

module.exports = router;