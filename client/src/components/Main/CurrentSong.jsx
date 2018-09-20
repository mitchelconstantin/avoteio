import React from 'react';

const CurrentSong = (props) => (
  <div className="current-song">
    <div className="current-image">
      <img src={props.song.image} alt="song's image" />
    </div>
    <div className="current-info">
      <div className="current-title">
        <p>{props.song.title}</p>
      </div>
      <div className="current-artist">
        <p>{props.song.artist}</p>
      </div>
    </div>
    <div>
      <button onClick={() => props.skipSong()}>Skip Song</button>
      <p>Skip Count: {props.skipVoteCount}</p>
    </div>
  </div>
);

export default CurrentSong;
