import React, { Component } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songBank: [],
      roomID: null,
      playNextSong: false
    };
    this.checkSongStatus = null;
    this.getAllSongs = this.getAllSongs.bind(this);
    this.getSongStatus = this.getSongStatus.bind(this);
    this.playNextSong = this.playNextSong.bind(this);
    this.addSong = this.addSong.bind(this);
    this.upvoteSong = this.upvoteSong.bind(this);
    this.downvoteSong = this.downvoteSong.bind(this);

    this.socket = io.connect();
    this.socket.on('connect', () => {
      console.log('connection made client side');
    });
    
    // Add event listeners
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
    .then(() => {
      this.setState({
        roomID: roomId
      });
      this.getAllSongs();
    })
    .then(() => {
      this.getSongStatus();
    })
    .catch(err => {
      console.log(err);
    });
  }

  upvoteSong(song) {
    axios.post('/api/upvoteSong', {song})
    .then(response => {
      this.socket.emit('songVote');
    })
    .catch(err => {
      console.log(err);
    });
  }

  downvoteSong(song) {
    axios.post('/api/downvoteSong', {song})
    .then(response => {
      this.socket.emit('songVote');
    })
    .catch(err => {
      console.log(err);
    });
  }

  addSong(song) {
    axios.post('/api/saveSong', {song})
    .then((response) => {
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
    this.checkSongStatus = setTimeout(async () => {
      const {data:{playNextSong}} = await axios.get('/spotify/currentSong');
      console.log(playNextSong);
      if (playNextSong) {
        try {
          clearTimeout(this.checkSongStatus);
          await this.playNextSong();
        } catch(err) {
          console.log('there was an error playing the song', err);
        }
      } else {
        this.getSongStatus();
      }
    }, 1000);
  }

  async playNextSong() {
    console.log(this.state.songBank[0]);
    const songId = this.state.songBank[0].spotify_id;
    await axios.post(`/spotify/playSong/${songId}`);
    await axios.post('/api/markSongPlayed', {
      songObj: this.state.songBank[0]
    });
    
    this.getAllSongs();
    this.getSongStatus();
  }

  componentWillUnmount() {
    clearInterval(this.checkSongStatus);
  }

  render() {
    return (  
      <div className="main">
        <h1>Welcome to room Howdy</h1>
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