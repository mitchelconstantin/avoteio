import React, { Component } from 'react';

class LyricList extends Component {
  constructor(props) {
    super(props);
    console.log('current lyricss: ', this.props.currentLyrics);
    this.state = {
      newSong: 0,
      currentLyrics: this.props.currentLyrics,
      lyricsToShow: 'loading lyrics...'
    };
  }

  componentDidUpdate() {
    console.log('update-------------------------------');

    let progress = this.props.currentLyrics.progress;
    let length = this.props.currentLyrics.length;
    let percentComplete = ((progress / length) * 100).toFixed(2);
    if (percentComplete > 10 && percentComplete < 90) {
      //if song is between 5 and 90 percent done, go back 10 percent
      percentComplete += 10;
      console.log('sup');
    }
    let lineCount = this.props.currentLyrics.lyrics.split(/\r\n|\r|\n/).length;
    let lineToStart = Math.floor((percentComplete / 100) * lineCount);
    if (lineToStart < 1) {
      lineToStart = 1;
    }
    let linesToRemove = lineToStart - 1;

    if (this.props.currentLyrics.lyrics !== this.state.currentLyrics.lyrics) {
      let lyricAr = this.props.currentLyrics.lyrics.split(/\r\n|\r|\n/);
      lyricAr = lyricAr.slice(linesToRemove);
      lyricAr = lyricAr.join('\n');

      this.setState({
        currentLyrics: this.props.currentLyrics,
        lyricsToShow: lyricAr
      });
      this.changeSpeed(
        (this.props.currentLyrics.length - this.props.currentLyrics.progress) /
          1000
      );
      this.forceUpdate();
    }
  }
  changeSpeed(songLength) {
    console.log('----------------changing the speed');
    document.getElementsByClassName('marquee2')[0].style.animation = 'none';
    setTimeout(function() {
      document.getElementsByClassName(
        'marquee2'
      )[0].style.animation = `marquee ${songLength}s linear infinite`;
    }, 10);
  }
  trimLyrics(song, percentComplete) {}

  render() {
    return (
      <div className="marquee">
        <div className="marquee2">
          {this.state.lyricsToShow.split('\n').map((line, i) => (
            <div key={'x' + i}>{line}</div>
          ))}
        </div>
      </div>
    );
  }
}
export default LyricList;
