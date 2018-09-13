import React, { Component } from 'react';
import { Link, Route, Redirect, withRouter } from 'react-router-dom';
import Main from './Main/Main.jsx'
import CreateRoom from './CreateRoom.jsx'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      roomID:1
    };

    this.changeViewFromLoginToCreate = this.changeViewFromLoginToCreate.bind(this)
    this.setRoomID = this.setRoomID.bind(this)
  }

  changeViewFromLoginToCreate (userID) {
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
    let component;
     if (this.state.userID === null) {
      component = <CreateRoom changeView={this.changeViewFromLoginToCreate} setRoomID={this.setRoomID}/>
    } else {
      // set to login component = <Login />
    }
    // console.log(data.tracks.items);
    console.log(component)
    return (
      <div>
        {console.log(this.state)}
        <Route 
          exact path='/'
          render={(props) => <CreateRoom  changeView={this.changeViewFromLoginToCreate} setRoomID={this.setRoomID}/>}
        />
        <Route 
          path='/rooms'
          component= {Main}
        />
      </div>
    );
  }
}

export default withRouter(App);