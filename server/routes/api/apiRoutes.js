const express = require('express');
const router = express.Router();
const db = require('../../../database/index')

router.get('/isLoggedIn', (req, res) => {
  res.json(req.session.spotifyId || null);
});

router.post('/createRoom', (req, res) => {
  const {roomName} = req.body;
  db.addRoom(roomName, req.session.spotifyId, (err, room) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.json(room.insertId);
    }
  });
});

router.get('/getAllSongs', (req, res) => {
  let {roomID} = req.query;  
  db.showAllUnplayedSongsInRoom(roomID, (err,data) => {
    if (err) {
      console.log('NO DATA 4 U',err);
      res.end();
    } else {
      console.log('data reterieval success!,',data);
      res.json(data);
    }
  });
});

router.post('/saveSong', (req,res) => {
  let roomID = req.body.roomID;
  let songObj = req.body.songObj;
  //ADD SONG TO CURRENT ROOM 
  db.addSongToRoom(songObj, roomID, function(err,data){
    if (err) {
      console.log('NOPE insert song',err);
      res.end();
    } else {
      console.log('data insertion success!,',data);
      res.end();
    }
  });
});

module.exports = router;