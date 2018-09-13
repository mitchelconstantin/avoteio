import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from './Main/Main.jsx';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div>
          <Main />
        </div>
      </Router>
    );
  }
}

export default App;