import React, { Component } from 'react';
import DropdownSongList from './DropdownSongList.jsx';
import {data} from '../../../dummy_data.js';


class SearchBar extends Component {

    constructor(props) {
      super(props);
      this.state = {
        input:'',
        spotifyResults: []
      };
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
    }

    handleInputChange (e) {
        this.setState({
            input:e.target.value
        })
    }

    handleClick(e) {
        //update the main songBank from Database
        e.preventDefault()
        this.props.updateSongBank(this.state.input)
        
        //populate dropdown menu
        //get request from spotify
        //on success:
          //figure out a way to render the top 5 results from Spotify
          //dummy process to populate dropdown Menu
          let spotifyResults = []
          for (let i = 0; i < 5; i++) {
            let song = {
              title: data.tracks.items[i].name,
              artist: data.tracks.items[i].artists[0].name
            }
            spotifyResults.push(song)
          }
          this.setState({
            spotifyResults:spotifyResults
          })
    }

    selectSong () {
        //post a song to the DB
        
    }
  
    render() {
      // console.log(data.tracks.items);
      return (
       <div>
           {/* {console.log('here are search props',this.props)} */}
           <form action=""  >
               <input type="text" value={this.state.input} onChange={this.handleInputChange} />
               <button onClick={(e)=>this.handleClick(e)}>button</button>

               <DropdownSongList spotifyResults={this.state.spotifyResults}/>
           </form>
       </div>
      );
    }
  }




export default SearchBar;