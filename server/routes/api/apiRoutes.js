const express = require('express');
const router = express.Router();
const db = require('../../../database/index')

router.get('/isLoggedIn', (req, res) => {
  res.json(req.session.spotifyId || null);
});

router.post('/rooms/:roomId', (req, res) => {
  db.showAllUnplayedSongsInRoom(req.params.roomId, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.sendStatus(500);
    } else {
      console.log('data reterieval success!,',data);
      req.session.roomId = req.params.roomId;  
      res.json(data);
    }
  });
});

router.post('/createRoom', (req, res) => {
  const {roomName} = req.body;
  db.addRoom(roomName, req.session.spotifyId, (err, room) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      req.session.roomId = room.insertId;
      res.json(room.insertId);
    }
  });
});

router.get('/getAllSongs', (req, res) => {
  let roomId = req.session.roomId;
  db.showAllUnplayedSongsInRoom(roomId, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

router.post('/saveSong', (req,res) => {
  let roomId = req.session.roomId;
  let songObj = req.body.songObj;
  //ADD SONG TO CURRENT ROOM 
  db.addSongToRoom(songObj, roomId, function(err,data){
    if (err) {
      console.log('NOPE insert song',err);
      res.sendStatus(500);
    } else {
      res.end();
    }
  });
});

router.post('/markSongPlayed', (req,res) => {
  const roomId = req.session.roomId;
  const {songObj: {spotify_id}} = req.body;
  db.markSongAsPlayedInRoom({id: spotify_id}, roomId, (err, result) => {
    if (err) {
      console.log('error updating song played status');
      res.sendStatus(500);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;