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
      roomID: this.props.match.params.roomId
    };
    this.updateSongBank = this.updateSongBank.bind(this);
    this.getAllSongs = this.getAllSongs.bind(this);
  }
  
  componentDidMount() {
    // console.log(this.state.roomID);
    // axios.get('/api/getAllSongs', {
    //   params: {
    //     roomID: this.state.roomID
    //   }
    // }).then((response) => {
    //   console.log(response);
    //   // this.setState({
    //   //   songBank: response
    //   // })
    //   // console.log('getAllSongs Success!',response)
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  getAllSongs() {
    // e.preventDefault()
    // make a get request to server
    console.log('We made it to getAllSongs in MAIN',this.state)
    axios.get('/api/getAllSongs',{
      params: {
       roomID:this.state.roomID
      }
     }).then(({data}) => {
      console.log('getAllSongs Success!',data)
      this.setState({
        songBank: data
      })
     }).catch(function(error){
       console.log(error)
     })
  
    console.log('I am getting all Songs!')
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