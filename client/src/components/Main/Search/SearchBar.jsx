import React, { Component } from 'react';
import DropdownSongList from './DropdownSongList.jsx';
import {data} from '../../../dummy_data.js';
import axios from 'axios'; 


class SearchBar extends Component {

    constructor(props) {
      super(props);
      this.state = {
        input:'',
        spotifyResults: []
      };
      this.handleInputChange = this.handleInputChange.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.selectSong = this.selectSong.bind(this)
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

        // SPOTIFY GET REQUEST

        // axios.get('/api/spotify/search'
        // ).then(function(response){
          // this.setState({
          //   spotifyResults:response
          // })
        //   console.log(response)
        // }).catch(function(error){
        //   console.log(error)
        // })
        
        //populate dropdown menu
        //get request from spotify
        //on success:
          //figure out a way to render the top 5 results from Spotify
          //dummy process to populate dropdown Menu
          let spotifyResults = []
          for (let i = 0; i < 5; i++) {
            let song = data.tracks.items[i];
            spotifyResults.push(song)
          }
          this.setState({
            spotifyResults:spotifyResults
          })


    }

    selectSong (e,songObj) {
        //post a song to the DB
        e.preventDefault()
        console.log('HERE IS MY SONGOBJ',songObj)
        axios.post('/api/saveSong',{
          roomID:this.props.roomID,
          songObj: songObj
        }).then(function(response){
          //ONCE IT IS SUCCESFULLY POSTED, GET ALL SONGS/REFRESH SONGBANK
          // this.props.getAllSongs()

            console.log('POST success!',response)

        }).catch(function(error){
          console.log('POST failed',error)
        })


        //get all songs
        
    }
  
    render() {
      return (
       <div>
           {/* {console.log('here are search props',this.props)} */}
           <form action=""  >
               <input type="text" value={this.state.input} onChange={this.handleInputChange} />
               <button onClick={(e)=>this.handleClick(e)}>button</button>

               <DropdownSongList spotifyResults={this.state.spotifyResults} selectSong={this.selectSong}/>
           </form>
       </div>
      );
    }
  }




export default SearchBar;