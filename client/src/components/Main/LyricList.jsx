import React, { Component } from 'react';

class LyricList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newSong: 0,
      currentLyrics: this.props.currentLyrics
    };
  }

  componentDidUpdate() {
    if (this.props.currentLyrics.lyrics !== this.state.currentLyrics.lyrics) {
      this.setState({ currentLyrics: this.props.currentLyrics });
      this.changeSpeed(this.props.currentLyrics.length / 1000);
      this.forceUpdate();
    }
  }
  changeSpeed(songLength) {
    document.getElementsByClassName('marquee2')[0].style.animation = 'none';
    setTimeout(function() {
      document.getElementsByClassName(
        'marquee2'
      )[0].style.animation = `marquee ${songLength}s linear infinite`;
    }, 10);
  }

  render() {
    return (
      <div className="marquee">
        <div className="marquee2">
          {this.state.currentLyrics.lyrics.split('\n').map((line, i) => (
            <div key={'x' + i}>{line}</div>
          ))}
        </div>
      </div>
    );
  }
}
export default LyricList;
