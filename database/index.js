const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'bbj31ma8tye2kagi.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user     : 'yocqduprp1mltiz3',
    password : process.env.DB_PASSWORD,
    database : 'fysv1ohxudop09ay',
    port: 3306
  });

  const showAllSongsInRoom = (roomId, callback) => {
      connection.query('SELECT * FROM songs s INNER JOIN songs_rooms sr ON s.id = sr.song_id AND sr.room_id = ?', [roomId], (err, results) => {
          if (err) {
              callback(err);
          } else {
              callback(null, results);
          }
      });
  }

  const addSongToSongsTable = (songObj, callback) => {
      connection.query('INSERT INTO songs (title, artist, spotify_id) VALUES (?, ?, ?)', [songObj.name, songObj.artists[0].name, songObj.id], (err, results) => {
          if (err) {
              callback(err);
          } else {
              callback();
          }
      })
  }

  const getSongsId = (songObj, callback) => {
      connection.query('SELECT id FROM songs WHERE songs.spotify_id = ?', [songObj.id], (err, results) => {
        if (err) {
            callback(err);
        } else {
            callback(null, results);
        }
      })
  }

  const addSongToRoom = (songObj, roomId, callback) => {
      connection.query('SELECT * FROM songs WHERE songs.spotify_id = ?', [songObj.id], (err, results) => {
          if (err) {
              callback(err);
          } else {
              if (results.length === 0) {
                  addSongToSongsTable(songObj, (err, results) => {
                      if (err) {
                          callback(err);
                      } else {

                          getSongsId(songObj, (err, results) => {
                              if (err) {
                                  callback(err);
                              } else {
                                  const id = results[0].id;
                                  connection.query('INSERT INTO songs_rooms (song_id, room_id) VALUES (?, ?)', [id, roomId], (err, results) => {
                                      if (err) {
                                          callback(err);
                                      } else {
                                          callback(null, results);
                                      }
                                  })

                              }
                          });
                          
                      }
                  })
              } else {
                getSongsId(songObj, (err, results) => {
                    if (err) {
                        callback(err);
                    } else {
                        const id = results[0].id;
                        connection.query('SELECT * FROM songs_rooms WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
                            if (err) {
                                callback(err);
                            } else {
                                if (results.length === 0) {
                                    connection.query('INSERT INTO songs_rooms (song_id, room_id) VALUES (?, ?)', [id, roomId], (err, results) => {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            callback(null, results);
                                        }
                                    })
                                    
                                } else {
                                    callback(null, 'already added to the room');
                                    console.log('already added to the room');
                                }
                            }
                        })

                    }
                });
              }
          }
      })
  };

  const addRoom = (roomName, callback) => {
    connection.query('INSERT INTO rooms (name) VALUES (?)', [roomName], (err, results, fields) => {
        if (err) {
            callback(err);
        } else {

            callback(null, results); //results has a property of 'insertId', which is the room ID just created 
            
        }
    })
  };

  const markSongAsPlayed = (songObj, roomId, callback) => {
      getSongsId(songObj, (err, results) => {
          if (err) {
              callback(err);
          } else {
              const id = results[0].id;
              connection.query('UPDATE songs_rooms SET isPlayed = 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
              })
          }
      })
  };

  const markRoomAsInaccessible = (roomId, callback) => {
      connection.query('UPDATE rooms SET isAccessible = 0 WHERE id = ?', [roomId], (err, results) => {
          if (err) {
              callback(err);
          } else {
              callback(null, results);
          }
      })
  };

  const upvote = (songObj, roomId, callback) => {
      getSongsId(songObj, (err, results) => {
          if (err) {
              callback(err);
          } else {
              const id = results[0].id;
              connection.query('UPDATE songs_rooms SET upvote = upvote + 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
                  if (err) {
                      callback(err);
                  } else {
                      callback(null, results);
                  }
              })
          }
      })
  };

  const downvote = (songObj, roomId, callback) => {
    getSongsId(songObj, (err, results) => {
        if (err) {
            callback(err);
        } else {
            const id = results[0].id;
            connection.query('UPDATE songs_rooms SET downvote = downvote + 1 WHERE song_id = ? AND room_id = ?', [id, roomId], (err, results) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            })
        }
    })
};

  
  







module.exports = {
    showAllSongsInRoom,
    getSongsId,
    addSongToRoom,
    addRoom,
    markSongAsPlayed,
    markRoomAsInaccessible,
    upvote,
    downvote

};

