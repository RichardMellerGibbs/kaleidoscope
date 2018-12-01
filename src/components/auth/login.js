import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { loginUser, forgotPassword } from '../../actions/authActions';
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
      forgotPasswordSent: false,
      displayError: true
    };
  }

  //Prevents access to register route if already logged in
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  //Where to go following login - home
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/');
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors, displayError: true });
    }

    if (nextProps.auth.forgotPasswordSent) {
      this.setState({ forgotPasswordSent: nextProps.auth.forgotPasswordSent });
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
      password: this.state.password
    };

    this.props.loginUser(userData);
    this.setState({ displayError: false });
  };

  forgotPassword = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email
    };

    this.props.forgotPassword(userData);
    this.setState({ displayError: false });
  };

  clearError = e => {
    e.preventDefault();
    this.setState({ displayError: false });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Log In</h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={classnames('form-control form-control-lg', {
                      'is-invalid': errors.email
                    })}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
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
                <input type="submit" className="btn btn-info btn-block mt-4" />
                <div className="forgot-password" onClick={this.forgotPassword}>
                  Forgot Password?
                </div>
                {this.state.forgotPasswordSent && !errors.forgot && (
                  <div className="alert alert-success warningPanel">
                    <button className="close" data-dismiss="alert">
                      &times;
                    </button>
                    An email has been sent to your mailbox containing further
                    instructions
                  </div>
                )}
                {errors.forgot && this.state.displayError && (
                  <div className="alert alert-danger">
                    <button className="close" onClick={this.clearError}>
                      &times;
                    </button>
                    {errors.forgot}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser, forgotPassword }
)(Login);
