import React, { Component } from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import Main from './Main/Main.jsx';
import CreateRoom from './CreateRoom.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      roomID: null
    };

    this.setUserID = this.setUserID.bind(this);
    this.setRoomID = this.setRoomID.bind(this);
  }

  setUserID (userID) {
    this.setState({
      userID: userID
    });
  }

  setRoomID (roomID) {
    this.setState({
      roomID:roomID
    });
  }

  render() {
    return (
      <div>
        <Route 
          exact path='/'
          render={(props) => (
            <CreateRoom 
              setUserID={this.setUserID}
              setRoomID={this.setRoomID}
              roomID={this.state.roomID}
              userID={this.state.userID}
            />
          )}
        />
        <Route 
          path='/rooms/:roomId'
          component={Main}
        />
      </div>
    );
  }
}

export default withRouter(App);