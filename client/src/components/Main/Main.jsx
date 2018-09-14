import React, { Component } from 'react';
import {data} from '../../dummy_data.js';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
import Song from './Song.jsx'
import axios from 'axios'; 


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
  }
  
  componentDidMount() {
    const {roomId} = this.props.match.params;
    axios.get(`/api/rooms/${roomId}`)
    .then(response => {
      this.setState({
        roomID: roomId
      });
      this.getAllSongs();
    })
    .then(()=>{
      this.getSongStatus();
    })
    .catch(err => {
      console.log(err);
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
        songBank: data.reverse()
      });
    })
    .catch((error) => {
      console.log(error);
    })
  }

  getSongStatus() {
    this.checkSongStatus = setInterval(()=> {
      axios.get('/spotify/currentSong')
      .then(({data:{playNextSong}}) => {
        if (playNextSong) {
          // this.setState({
          //   playNextSong: true
          // })
          this.playNextSong();
        }
      })
      .catch((error)=> {
        console.log(error);
      })
    }, 1000);
  }

  playNextSong() {
    const songId = this.state.songBank[0].spotify_id;
    axios.post(`/spotify/playSong/${songId}`)
    .catch(function (error) {
      // this.getSongStatus();
      console.log('POST failed', error);
    });
  }

  componentWillUnmount() {
    clearInterval(this.checkSongStatus);
  }

  render() {
    return (  
      <div>
        <h1>Howdy, World!</h1>
        <SongList songBank={this.state.songBank} dropdownSongs={this.dropdownSongs}/>
        <SearchBar updateSongBank={this.updateSongBank} roomID={this.state.roomID} getAllSongs={this.getAllSongs}/>
      </div>
    )
  }
}

export default Main;