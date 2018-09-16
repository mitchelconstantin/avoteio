import React, { Component } from 'react';

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true
    };

    this.toggleActiveState = this.toggleActiveState.bind(this);
  }

  toggleActiveState() {
    this.setState({
      active: !this.state.active
    });
  }

  render() {
    return (
      <div className={this.state.active ? "side-nav active" : "side-nav hidden"}>
        {this.state.active ? 
          <div className="nav-carrot"><i className="fas fa-chevron-left" onClick={this.toggleActiveState}></i></div>
        :
        <div className="nav-carrot"><i className="fas fa-chevron-right" onClick={this.toggleActiveState}></i></div>
        }
        <div className="nav-logo">
          <img src="/static/images/Logo-transparent.png" alt="Avoteio Logo"/>
        </div>
        <div className="nav-links">
          <a className="nav-link" href="/">Home</a>
          {this.props.userId ?
            <a className="nav-link" href="/auth/logout">Logout</a>
          :
            <a className="nav-link" href="/auth/login">Login</a>
          }
        </div>
      </div>
    )
  }
}

export default SideNav;