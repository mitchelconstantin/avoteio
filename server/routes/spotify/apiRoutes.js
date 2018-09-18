const express = require('express');
const router = express.Router();
const btoa = require('btoa');
const db = require('../../../database/index')
const axios = require('axios');

const getUserByRoomId = (req, res, next) => {
  db.getUserByRoomId(req.session.roomId, (err, [user]) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.roomHost = user;
      next();
    }
  });
}

const getNewAccessToken = async (req, res, next) => {
  // 👇🏼 This date comparison doesn't work for some reason. Can't figure out js date objects
  const needsRefresh = new Date() >= new Date(req.roomHost.token_expires_at - (1000 * 60 * 60 * 5));
  
  if (needsRefresh) {
    const refreshToken = req.roomHost.refresh_token;
    const dataString = `?grant_type=refresh_token&refresh_token=${refreshToken}`;
    const encoded = btoa(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`);
    const options = {
      method: 'POST',
      url: `https://accounts.spotify.com/api/token${dataString}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encoded}`,
      },
    };
    
    try {
      await axios(options)
        .then(({data: {access_token}}) => {
          const time = new Date();
          req.roomHost.newTokenExpiresAt = new Date(time.setHours(time.getHours() + 1)).toISOString().slice(0, 19).replace('T', ' ');
          req.roomHost.newAccessToken = access_token;
        });
    } catch(err) {
      console.log(err);
      res.send(500);
    }
  }

  next();
}

const updateAccessToken = (req, res, next) => {
  if (req.roomHost.newAccessToken) {
    db.updateUserAccessTokenAndExpiresAt(req.roomHost.spotify_id, req.roomHost.newAccessToken, req.roomHost.newTokenExpiresAt, (err) => {
      if (err) {
        console.log(err);
        res.sendStatus(500);
      }
    });
  }

  next();
}

router.use(getUserByRoomId, getNewAccessToken, updateAccessToken);

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/search',
    headers: {
      Authorization: `Bearer ${req.roomHost.access_token}`
    },
    params: {
      q: q,
      type: "track",
      limit: 20
    }
  };

  try {
    const { data: { tracks } } = await axios(options);
    res.json(tracks);
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/playSong/:songId', async (req, res) => {
  const {songId} = req.params;
  const options = {
    method: 'PUT',
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: {
      'Authorization': `Bearer ${req.roomHost.access_token}`
    },
    data: {
      uris: [`spotify:track:${songId}`]
    }
  };

  try {
    await axios(options);
    res.end();
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.get('/roomHost', (req, res) => {
  res.json({
    roomHostId: req.roomHost.spotify_id
  });
})

router.get('/currentSong', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://api.spotify.com/v1/me/player',
    headers: {
      Authorization: `Bearer ${req.roomHost.access_token}`
    }
  };

  try {
    const {data} = await axios(options);
    if (typeof data === 'object') {
      res.json({
        timeUntilNextSong: data.item.duration_ms - data.progress_ms,
        isPlaying: data.is_playing,
        songData: {
          title: data.item.name,
          artist: data.item.artists[0].name,
          image: data.item.album.images[1].url
        }
      });
    }
  } catch(err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;