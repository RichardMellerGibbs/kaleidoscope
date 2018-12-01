import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              className="nav-logo"
              src={require('../../img/m.png')}
              alt="company logo"
            />
            Marvin Informatics - Renai
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#collapsingNavbarSm"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="collapsingNavbarSm">
            <ul className="navbar-nav ml-auto">
              {/* <li className="nav-item">
                <Link href="" className="nav-link" to="Login">
                  Login
                </Link>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
