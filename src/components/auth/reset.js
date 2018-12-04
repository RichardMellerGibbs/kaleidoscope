import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import classnames from 'classnames';
import { resetPassword } from '../../actions/authActions';

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.location.state.email,
      password: '',
      errors: {},
      code: '',
      passwordReset: false,
      displayError: true
    };
  }

  //Where to go following password reset - login
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, displayError: true });
    }

    if (nextProps.auth.passwordReset) {
      this.setState({
        passwordReset: nextProps.auth.passwordReset
      });
    }
  }

  //reacts to user input
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      code: this.state.code
    };

    this.props.resetPassword(userData);
    this.setState({ displayError: false });
  };

  clearError = e => {
    e.preventDefault();
    this.setState({ displayError: false });
  };

  render() {
    const { errors } = this.state;

    if (this.state.passwordReset) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Reset Password</h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="input"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.code
                    })}
                    placeholder="Code"
                    name="code"
                    value={this.state.code}
                    onChange={this.onChange}
                  />
                  {errors.code && (
                    <div className="invalid-feedback">{errors.code}</div>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password
                    })}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                {/* <div className="form-group">
                  <input
                    type="password"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.password2
                    })}
                    placeholder="Confirm Password"
                    name="password2"
                    value={this.state.password2}
                    onChange={this.onChange}
                  />
                  {errors.password2 && (
                    <div className="invalid-feedback">{errors.password2}</div>
                  )}
                </div> */}
                <input
                  type="submit"
                  className="btn btn-info btn-block mt-4 submit-button"
                />
                {/* {this.state.passwordReset && !errors.reset && (
                  <div className="alert alert-success warningPanel">
                    <a className="close" data-dismiss="alert">
                      &times;
                    </a>
                    Your password has been reset. You can now login
                  </div>
                )} */}
                {errors.message && this.state.displayError && (
                  <div className="alert alert-danger">
                    <button className="close" onClick={this.clearError}>
                      &times;
                    </button>
                    {errors.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Reset.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { resetPassword }
)(Reset);
