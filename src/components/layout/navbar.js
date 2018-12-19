import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser, getCurrentUser } from '../../actions/authActions';
import styled from 'styled-components';

const NavButton = styled.div`
  background: none !important;
  color: inherit;
  border: none;
  padding: 0 !important;
  font: inherit;
  cursor: pointer;
`;

const Project = styled.div`
  display: inline-block;
  padding-left: 10px;
  font-family: 'Aguafina Script', cursive;
  font-size: 150%;
`;

class Navbar extends Component {
  componentDidMount() {
    this.props.getCurrentUser();
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.logoutUser();
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/" />
        </li>
        <li className="nav-item">
          <NavButton
            onClick={this.onLogoutClick.bind(this)}
            className="nav-link"
          >
            Logout
          </NavButton>
        </li>
      </ul>
    );

    const guestLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>
    );

    return (
      <nav className="navbar navbar-expand-md navbar-dark mb-4">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img
              className="nav-logo"
              src={require('../../img/m.png')}
              alt="company logo"
            />
            Marvin Informatics <Project>Renai</Project>
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
              {isAuthenticated ? authLinks : guestLinks}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser, getCurrentUser }
)(Navbar);
