const express = require('express');
const router = express.Router();
const db = require('../../database/index');


router.route('/getAllSongs').get((req, res) => {
  let roomID = req.query.roomID  
  db.showAllSongsInRoom(roomID,function(err,data){
    if(err) {
      console.log('NO DATA 4 U',err)
      res.end();

    } else {
      console.log('data reterieval success!,',data)
      res.status(200).send(data)

    }
  })

});

router.route('/saveSong').post((req,res) => {
  console.log('post request success!',req.body)
  let roomID = req.body.roomID
  let songObj = req.body.songObj
  //ADD TO SONG TABLE
   db.addSongToSongsTable(songObj,roomID, function(err,data){
    if(err) {
      console.log('NOPE insert song',err)
      res.end();
    } else {
      console.log('data insertion success!,',data)
      //ADD SONG TO CURRENT ROOM 
      db.addSongToRoom(songObj,roomID, function(err,data){
        if(err) {
          console.log('NOPE insert song',err)
          res.end();
        } else {
          console.log('data insertion success!,',data)
          res.status(200).end()
        }
       })
    }
   })
})

module.exports = router;