import React, { Component } from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      roomCode: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRoomCodeChange = this.handleRoomCodeChange.bind(this);
  }

  componentDidMount() {
    axios.get('/api/isLoggedIn')
    .then(({ data }) => {
      this.props.setUserID(data);
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleInputChange(e) {
    this.setState({
      input: e.target.value
    })
  }

  handleRoomCodeChange(e) {
    this.setState({
      roomCode: e.target.value
    })
  }

  handleClick(e) {
    e.preventDefault()
    
    if (this.state.input) {
      axios.post('/api/createRoom', {
        roomName: this.state.input
      })
      .then(({ data }) => {
        this.props.setRoomID(data);
        this.props.history.push(`/rooms/${data}`);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  joinRoom() {
    const {roomCode} = this.state;
    this.props.setRoomID(roomCode);
    this.props.history.push(`/rooms/${roomCode}`);
  }

  render() {
    let component;
    if (this.props.userID) {
      component = (
        <div className="create-room">
          <h2>Create A Room</h2>
            <div className="create-form">            
              <input className="create-input" type="text" value={this.state.input} onChange={this.handleInputChange} />
              <button className='create-btn' onClick={(e) => this.handleClick(e)}>Create</button>
            </div>
        </div>
      )
    } else {
      component = <a className="spotify-login" href="/auth/login">+ Login With Spotify</a>
    }

    return (
      <div className="main-login">
        {component}
        <div className="join-room">
          <p>or join an existing room</p>
          <div className="join-form">
            <input className="join-input" type="text" placeholder="Enter a room code..." value={this.state.roomCode} onChange={this.handleRoomCodeChange} />
            <button className="join-btn" onClick={() => this.joinRoom()}>Join Room</button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateRoom);