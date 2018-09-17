import React from 'react';

const DropdownSong = (props) => (
  <div className="dropdown-song-list">
    <div className="dropdown-song-list-entry" onClick={() => props.selectSong(props.song)}>{props.song.name} by {props.song.artists[0].name}</div>
  </div>
);

export default DropdownSong;