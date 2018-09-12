import React from 'react';
import DropdownSong from './DropdownSong.jsx'

const DropdownSongList = (props) => (
      <div>
        {console.log('here are my songlist props',props)}
        {props.spotifyResults.map( (song,index)=> <DropdownSong song={song}   selectSong={props.selectSong}  key={index} / >)}
      </div>
  
   
)



export default DropdownSongList