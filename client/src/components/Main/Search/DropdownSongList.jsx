import React from 'react';
import DropdownSong from './DropdownSong.jsx'

const DropdownSongList = (props) => (
  <div>
    {props.spotifyResults.map(song => <DropdownSong song={song} selectSong={props.selectSong} key={song.id} />)}
  </div>
);

export default DropdownSongList;