import React from 'react';
import Song from './Song.jsx';

const SongList = (props) => (
  <div className="song-list">
    {/* {console.log('HERE ARE MY SONG LIST PROPS: ', props)} */}
    {props.songBank.map(song => <Song song={song} key={song.id} />)}
  </div>
);

export default SongList;