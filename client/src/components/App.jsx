import React, { Component } from 'react';
import {data} from '../dummy_data.js';
import SearchBar from './SearchBar.jsx';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songBank: 'I will eventually be an array of songs'
    };
    this.updateSongBank = this.updateSongBank.bind(this)
  }

  updateSongBank (songBank) {
    this.setState({
      songBank: songBank
    })
    console.log('here is the songBank now:',songBank)
  }
  render() {
    // console.log(data.tracks.items);
    return (
      <div>
        <h1>Howdy, World!</h1>
        <SearchBar updateSongBank={this.updateSongBank}/>
      </div>
    )
  }
}

export default App;