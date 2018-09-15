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
        <div>
          <h2>Create A Room</h2>
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={(e) => this.handleClick(e)}>button</button>
        </div>
      )
    } else {
      component = <a href="/auth/login">Login With Spotify</a>
    }

    return (
      <div>
        {component}
        <div>
          <h3>Or join an existing room</h3>
          <input type="text" placeholder="Enter a room code..." value={this.state.roomCode} onChange={this.handleRoomCodeChange} />
          <button onClick={() => this.joinRoom()}>Join Room</button>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateRoom);