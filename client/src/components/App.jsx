import React, { Component } from 'react';
import Main from './Main/Main.jsx'
import CreateRoom from './CreateRoom.jsx'



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 'CreateRoom',
    };

    this.changeCurrentPage = this.changeCurrentPage.bind(this)
  }

  changeCurrentPage (newPage) {
    this.setState({
      currentPage: newPage
    })
  }

  render() {
    let component;
    if(this.state.currentPage === 'Login') {
      // component = <Login />
    } else if (this.state.currentPage === 'CreateRoom') {
      component = <CreateRoom changeCurrentPage={this.changeCurrentPage}/>
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