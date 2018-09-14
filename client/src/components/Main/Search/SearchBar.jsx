import React, { Component } from 'react';
import DropdownSongList from './DropdownSongList.jsx';
import { data } from '../../../dummy_data.js';
import axios from 'axios';


class SearchBar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      spotifyResults: []
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectSong = this.selectSong.bind(this)
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value
    })
  }

  handleClick(e) {
    //update the main songBank from Database
    e.preventDefault()

    // SPOTIFY GET REQUEST
    axios.get('/spotify/search', {
      params: {
        q: this.state.input
      }
    })
    .then(({data: {items}}) => {
      this.setState({
        spotifyResults: items
      });
    }).catch(function(error){
      console.log(error)
    })
  }

  selectSong(songObj) {
    axios.post('/api/saveSong', {songObj})
    .then((response) => {
      //ONCE IT IS SUCCESFULLY POSTED, GET ALL SONGS/REFRESH SONGBANK
      this.setState({
        spotifyResults: []
      })
      this.props.getAllSongs()
      
    }).catch(function (error) {
      console.log('POST failed', error)
    })


    //get all songs

  }

  render() {
    return (
      <div>
        <form action=""  >
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={(e) => this.handleClick(e)}>button</button>

          <DropdownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong} />
        </form>
      </div>
    );
  }
}




export default SearchBar;