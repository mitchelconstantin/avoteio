import React, { Component } from 'react';
import Main from './Main/Main.jsx'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'Main',
    
    };
  }

  render() {
    let component;
    if(this.state.currentPage === 'Login') {
      // component = <Login />
    } else if (this.state.currentPage === 'CreateRoom') {
      // component = <CreateRoom />
    } else if (this.state.currentPage === 'Main') {
      component = <Main />
    }
    // console.log(data.tracks.items);
    return (
      <div>
        {component}
      </div>
    )
  }
}

export default App;