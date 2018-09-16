import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import Main from './Main/Main.jsx';
import CreateRoom from './CreateRoom.jsx';
import SideNav from './SideNav.jsx';

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
        <SideNav userId={this.state.userID}/>
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
          render={(props) => (
            <Main {...props} userId={this.state.userID}/>
          )}
        />
      </div>
    );
  }
}

export default withRouter(App);