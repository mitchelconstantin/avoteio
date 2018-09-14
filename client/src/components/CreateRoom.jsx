import React, { Component } from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import axios from 'axios';

class CreateRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
        input: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  handleInputChange (e) {
    this.setState({
        input:e.target.value
    })
  }

  handleClick(e) {
    if (this.state.input) {
      e.preventDefault()
  
      axios.post('/api/createRoom', {
        roomName: this.state.input
      })
      .then(({data}) => {
        this.props.setRoomID(data);
        this.props.history.push(`/rooms/${data}`);
      })
      .catch(error => {
        console.log(error);
      });
    }
  }

  render() {
    let component;
    if (this.props.userID) {
      component = (
        <div>
          <h2>Create A Room</h2>
          <input type="text" value={this.state.input} onChange={this.handleInputChange} />
          <button onClick={(e)=>this.handleClick(e)}>button</button>
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
          <input type="text" placeholder="Enter a room code..."/>
          <button>Join Room</button>
        </div>
     </div>
    );
  }
}

export default withRouter(CreateRoom);