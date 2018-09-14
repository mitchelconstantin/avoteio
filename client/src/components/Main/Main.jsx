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
      roomID: null
    };
    this.updateSongBank = this.updateSongBank.bind(this);
    this.getAllSongs = this.getAllSongs.bind(this);
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
        songBank: data
      });
    })
    .catch((error) => {
      console.log(error)
    })
  }

  updateSongBank(input) {
    //example push request
    this.state.songBank.push(input)

    // this.setState({
    //   songBank: this.state.songBank
    // })

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