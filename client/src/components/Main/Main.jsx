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

    this.getAllSongs();
    this.getSongStatus();
    this.pollCurrentSong();
  }

  upvoteSong(song) {
    axios.post('/api/upvoteSong', {song})
    .then(() => {
      this.socket.emit('songVote');
    })
    .catch(err => {
      console.log(err);
    });
  }

  downvoteSong(song) {
    axios.post('/api/downvoteSong', {song})
    .then(() => {
      this.socket.emit('songVote');
    })
    .catch(err => {
      console.log(err);
    });
  }

  async getHostId() {
    const {data: {roomHostId}} = await axios.get('/spotify/roomHost');
    this.setState({
      roomHostId
    });
  }

  pollCurrentSong() {
    setTimeout(async () => {
      await this.getCurrentSong();
      this.pollCurrentSong();
    }, 5000);
  }

  async getCurrentSong() {
    const {data: {songData}} = await axios.get('/spotify/currentSong');
    this.setState({
      currentSong: songData
    });
  }

  addSong(song) {
    axios.post('/api/saveSong', {song})
    .then(() => {
      this.socket.emit('addSong');
    })
    .catch(function (error) {
      console.log('POST failed', error)
    });
  }

  getAllSongs() {
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
    if (this.state.userId === this.state.roomHostId) {
      clearTimeout(this.updateNextSongTimer);

      this.updateNextSongTimer = setTimeout(async () => {
        const {data} = await axios.get('/spotify/currentSong');
        const {timeUntilNextSong} = data;

        clearTimeout(this.setPlayNextSong);
        this.setPlayNextSong = setTimeout(this.playNextSong, timeUntilNextSong - 1500);
        this.getSongStatus();
      }, 10000);
    }
  }

  async playNextSong() {
    const song = this.state.songBank[0];
    const {spotify_id} = song;
    await axios.post(`/spotify/playSong/${spotify_id}`);
    await axios.post('/api/markSongPlayed', {
      songObj: song
    })
    .then(() => {
      this.getAllSongs();
    });
  }

  componentWillUnmount() {
    clearTimeout(this.setPlayNextSong);
    clearTimeout(this.updateNextSongTimer);
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