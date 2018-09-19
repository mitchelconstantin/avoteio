import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import CurrentSong from './CurrentSong.jsx';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songBank: [],
      currentSong: null,
      roomID: null,
      roomHostId: null,
      roomName: '',
      userId: null,
      playNextSong: false
    };

    this.checkSongStatus = null;
    this.setPlayNextSong = null;
    this.getAllSongs = this.getAllSongs.bind(this);
    this.getSongStatus = this.getSongStatus.bind(this);
    this.playNextSong = this.playNextSong.bind(this);
    this.addSong = this.addSong.bind(this);
    this.upvoteSong = this.upvoteSong.bind(this);
    this.downvoteSong = this.downvoteSong.bind(this);
    this.getCurrentSong = this.getCurrentSong.bind(this);

    // Listen for socket events and respond accordingly
    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('connection made client side');
    });
    
    this.socket.on('songAdded', () => {
      this.getAllSongs();
    });

    this.socket.on('songWasVoted', () => {
      this.getAllSongs();
    });
  }
  
  componentDidMount() {
    localStorage.clear();
    // Go get the current userId (null if not signed in) and roomId from the server
    const {roomId} = this.props.match.params;
    axios.post(`/api/rooms/${roomId}`)
    .then(({data}) => {
      this.setState({
        roomID: roomId,
        userId: data.userId
      });
    })
    .then(() => {
      this.getHostId();
    })
    .catch(err => {
      console.log(err);
    });

    this.getAllSongs(); // Get all unplayed songs for this room
    this.getSongStatus(); // Begin polling spotify for the time remaining on the host's currently playing song
    this.pollCurrentSong(); // Start polling spotify for the host's currently playing song
  }

  upvoteSong(song) {
    if (!localStorage.getItem('spotify_ids') || !JSON.parse(localStorage.getItem('spotify_ids'))[song.spotify_id]) {
      let spotify_ids = JSON.parse(localStorage.getItem('spotify_ids')) || {};
      spotify_ids[song.spotify_id] = true;
      localStorage.setItem('spotify_ids', JSON.stringify(spotify_ids));

      // Update the song in the db and emit a songVote event to the server socket
      axios.post('/api/upvoteSong', { song })
        .then(() => {
          this.socket.emit('songVote');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  downvoteSong(song) {
    if (!localStorage.getItem('spotify_ids') || !JSON.parse(localStorage.getItem('spotify_ids'))[song.spotify_id]) {
      let spotify_ids = JSON.parse(localStorage.getItem('spotify_ids')) || {};
      spotify_ids[song.spotify_id] = true;
      localStorage.setItem('spotify_ids', JSON.stringify(spotify_ids));

      // Update the song in the db and emit a songVote event to the server socket
      axios.post('/api/downvoteSong', { song })
        .then(() => {
          this.socket.emit('songVote');
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  async getHostId() {
    // Get the host of the room that you just entered (so all users in the room can use their access token)
    const {data: {roomHostId}} = await axios.get('/spotify/roomHost');
    this.setState({
      roomHostId
    });
  }

  pollCurrentSong() {
    // Get the current song every five seconds from Spotify and then queue itself back up
    setTimeout(async () => {
      await this.getCurrentSong();
      this.pollCurrentSong();
    }, 5000);
  }

  async getCurrentSong() {
    // Ask Spotify for the host's currently playing song

    // 👇🏼 Should really be inside a try...catch block for legit error handling
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    this.setState({
      currentSong: songData
    });
  }

  addSong(song) {
    // Add a song to the current room and emit an addSong event to the server
    axios.post('/api/saveSong', {song})
    .then(() => {
      this.socket.emit('addSong');
    })
    .catch(function (error) {
      console.log('POST failed', error)
    });
  }

  getAllSongs() {
    // Get all unplayed songs for the current room
    axios.get('/api/getAllSongs', {
      params: {
       roomID: this.state.roomID
      }
    })
    .then(({data}) => {
      this.setState({
        songBank: data
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  getSongStatus() {
    // Poll Spotify for the time remaining on the host's current song
    // Only the host can call this fn so that this.playNextSong can only be 
    // invoked from one client (otherwise it would be called once for every 
    // person in the room and pop off a ton of songs in the room)
    if (this.state.userId === this.state.roomHostId) {
      // Make sure all timeouts that haven't run are cleared before queueing up the next poll
      clearTimeout(this.updateNextSongTimer);

      this.updateNextSongTimer = setTimeout(async () => {
        // Ask Spotify for info about the currently playing song
        const {data} = await axios.get('/spotify/currentSong');
        const {timeUntilNextSong} = data;

        // Make sure all timeouts that haven't run are cleared before queueing up the next setTimeout
        clearTimeout(this.setPlayNextSong);
        // Ask Spotify to play the next song 1.5s before the current song ends (ensure that there's
        // no dead space while this async fn is happening)
        this.setPlayNextSong = setTimeout(this.playNextSong, timeUntilNextSong - 1500);

        // Queue up the next poll by calling itself
        this.getSongStatus();
      }, 10000);
    }
  }

  async playNextSong() {
    // Only called from within this.getSongStatus
    // Grab the first song from the song bank (highest upvotes - downvotes)
    // and ask Spotify to play it
    const song = this.state.songBank[0];
    const {spotify_id} = song;
    await axios.post(`/spotify/playSong/${spotify_id}`);

    // Once Spotify successfully plays the song, mark the song as played in the db
    // 👇🏼 Shitty mix of asyn/await & promises (some desperate debugging caused this)
    await axios.post('/api/markSongPlayed', {
      songObj: song
    })
    .then(() => {
      this.getAllSongs();
    });
  }

  componentWillUnmount() {
    // Clear all timeouts when they navigate to another room/render any other component in it's place
    clearTimeout(this.setPlayNextSong);
    clearTimeout(this.updateNextSongTimer);
    localStorage.clear();
  }

  render() {
    let currentSong = this.state.currentSong ? <CurrentSong song={this.state.currentSong}/> : "";
    return (  
      <div className="main">
        <h1>Welcome to your Avoteio room!</h1>
        {currentSong}
        <div className="center">
          <SongList 
            songBank={this.state.songBank}
            dropdownSongs={this.dropdownSongs}
            upvoteSong={this.upvoteSong}
            downvoteSong={this.downvoteSong}
          />
          <SearchBar
            updateSongBank={this.updateSongBank}
            roomID={this.state.roomID}
            getAllSongs={this.getAllSongs}
            addSong={this.addSong}
          />
        </div>
      </div>
    )
  }
}

export default Main;