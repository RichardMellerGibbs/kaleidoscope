import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Spinner from '../../common/spinner';

import { getActiveUsers } from '../../actions/workerTaskActions';
import TaskItems from './taskItems';

const UserList = styled.div`
  font-size: 140%;
`;

const EmployeeList = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

class WorkerTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUsers: [],
      displayList: false,
      employee: 'initial'
    };
  }

  componentDidMount() {
    const { user, isAuthenticated } = this.props.auth;

    if (isAuthenticated) {
      const jwtToken = user.signInUserSession.idToken.jwtToken;
      this.props.getActiveUsers(jwtToken);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.workerTask !== this.props.workerTask) {
      this.setState(nextProps.workerTask);
    }
  }

  userSelected = e => {
    this.setState({
      ...this.state,
      employee: e.target.value
    });
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { activeUsers } = this.state;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const { loading } = this.props.workerTask;

    let userItems = '';
    let userContent = ''; //UserDropdown list
    let listContent = ''; //Lists of user tasks

    if (loading) {
      userContent = <Spinner />;
    } else {
      //console.log(`active user count ${activeUsers.length}`);

      const prepareActiveUsers = () => {
        if (activeUsers.length === 0) {
          userContent = <h3>No active employees</h3>;
          return;
        }

        //Clone array
        let users = activeUsers.slice(0);

        if (users[0].reference !== 'initial') {
          users.unshift({
            name: 'Please select your name',
            reference: 'initial'
          });
        }

        userItems = users.map(user => {
          if (user.reference === 'initial') {
            return (
              <option disabled value={user.reference} key="1">
                {user.name}
              </option>
            );
          } else {
            return (
              <option value={user.reference} key={user.reference}>
                {user.name}
              </option>
            );
          }
        });

        userContent = (
          <UserList>
            <select value={this.state.employee} onChange={this.userSelected}>
              {userItems}
            </select>
          </UserList>
        );

        for (let user of activeUsers) {
          if (user.reference === this.state.employee) {
            listContent =
              this.state.employee !== 'initial' ? (
                <TaskItems employee={this.state.employee} userDetails={user} />
              ) : null;
            break;
          }
        }

        if (!listContent) {
          listContent = <TaskItems />;
        }
      };

      prepareActiveUsers();
    }

    return (
      <div>
        <EmployeeList>{userContent}</EmployeeList>
        {listContent}
      </div>
    );
  }
}

WorkerTasks.propTypes = {
  getActiveUsers: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  workerTask: state.workerTask
});

export default connect(
  mapStateToProps,
  { getActiveUsers }
)(WorkerTasks);
