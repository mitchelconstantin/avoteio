import React from 'react';
import Song from './Song.jsx';

const SongList = (props) => {
  let songListCSS = props.showBSBCSS ? 'bsb-song-list' : 'song-list';
  return (
    <div className={songListCSS}>
      {props.songBank.map(song => (
        <Song song={song} key={song.id} vote={props.vote} />
      ))}
    </div>
  )
};

export default SongList;