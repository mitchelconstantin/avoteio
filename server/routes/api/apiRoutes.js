const express = require('express');
const router = express.Router();
const db = require('../../../database/index')

router.route('/isLoggedIn', (req, res) => {
  res.send(req.session.spotifyId || null);
});

router.route('/createRoom', (req, res) => {
  const {roomName} = req.body;
  db.addRoom(roomName, req.session.spotifyId, (err, room) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      res.send(room.insertId);
    }
  });
});

router.route('/getAllSongs').get((req, res) => {
  let roomID = req.query.roomID  
  db.showAllSongsInRoom(roomID,function(err,data){
    if (err) {
      console.log('NO DATA 4 U',err);
      res.end();
    } else {
      console.log('data reterieval success!,',data);
      res.send(data);
    }
  });
});

router.route('/saveSong').post((req,res) => {
  console.log('post request success!',req.body)
  let roomID = req.body.roomID;
  let songObj = req.body.songObj;
  //ADD SONG TO CURRENT ROOM 
  db.addSongToRoom(songObj,roomID, function(err,data){
    if (err) {
      console.log('NOPE insert song',err);
      res.end();
    } else {
      console.log('data insertion success!,',data);
      res.end();
    }
  });
})

module.exports = router;