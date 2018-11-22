import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
        <div className="container">
          <a className="navbar-brand" href="/">
            <img
              className="nav-logo"
              src={require('../../img/m.png')}
              alt="company logo"
            />
            Marvin Informatics - Renai
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#collapsingNavbarSm"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>
      </nav>
    );
  }
}

export default Navbar;
