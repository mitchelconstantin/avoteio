import React from 'react';
import DropdownSong from './DropdownSong.jsx'

const DropdownSongList = (props) => (
      <div>
        {props.spotifyResults.map( (song,index)=> <DropdownSong title={song.title} artist={song.artist} key={index}   / >)}
      </div>
  
    
)



export default DropdownSongList