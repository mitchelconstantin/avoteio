import React from 'react';

const DropdownSong = (props) => (
  <div>
    <div onClick={() => props.selectSong(props.song)}>{props.song.name} by {props.song.artists[0].name}</div>
  </div>
);

export default DropdownSong;