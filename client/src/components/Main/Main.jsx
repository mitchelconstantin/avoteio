import React, { Component } from 'react';
import SearchBar from './Search/SearchBar.jsx';
import SongList from './SongList.jsx';
// import Song from './Song.jsx';
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
    this.checkSongStatus = setTimeout(async () => {
      const {data:{playNextSong}} = await axios.get('/spotify/currentSong');
      if (playNextSong) {
        try {
          clearInterval(this.checkSongStatus);
          await this.playNextSong();
        } catch(err) {
          console.log('there was an error playing the song', err);
        }
      } else {
        this.getSongStatus();
      }
      // axios.get('/spotify/currentSong')
      // .then(async ({data:{playNextSong}}) => {
      //   if (playNextSong) {
      //     // this.setState({
      //     //   playNextSong: true
      //     // })
      //     await this.playNextSong();
      //   }
      // })
      // .catch((error)=> {
      //   console.log(error);
      // })
    }, 1000);
  }

  async playNextSong() {
    const songId = this.state.songBank[0].spotify_id;
    const playSong = axios.post(`/spotify/playSong/${songId}`);
    const updatePlayedStatus = axios.post('/api/markSongPlayed', {
      songObj: this.state.songBank[0]
    });

    await Promise.all([playSong, updatePlayedStatus])
    
    this.getAllSongs();
  }

  componentWillUnmount() {
    clearInterval(this.checkSongStatus);
  }

  render() {
    return (  
      <div className="main">
        <h1>Howdy, World!</h1>
        <div className="center">
          <SongList songBank={this.state.songBank} dropdownSongs={this.dropdownSongs}/>
          <SearchBar updateSongBank={this.updateSongBank} roomID={this.state.roomID} getAllSongs={this.getAllSongs}/>
        </div>
      </div>
    )
  }
}

export default Main;