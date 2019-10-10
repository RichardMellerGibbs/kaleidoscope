import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Spinner from '../../common/spinner';
import { getUsersAndGenericTasks } from '../../actions/moveActions';
import DisplayColumns from './displayColumns';
import sortTasks from './sortTasks';
import sortUsers from './sortUsers';
import { cloneDeep } from 'lodash';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import { prepData } from '../../reducers/moveTasksReducer';

const DropDownList = styled.div`
  font-size: 140%;
`;

//width was 210
const ColDropDownList = styled.select`
  font-size: 140%;
  width: 300px;
`;

const InputField = styled.input`
  width: 250px;
  height: 26px;
`;

const SelectField = styled.select`
  width: 250px;
  height: 26px;
`;

const ClearName = styled.button`
  margin-left: 10px;
  width: 60px;
`;

const EmployeeList = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

const INITIAL = 'initial';
let env = 'prod';
if (process.env.REACT_APP_ENV === 'dev') {
  env = 'dev';
}

const getUsersUrl = `https://cvskwag0kl.execute-api.eu-west-2.amazonaws.com/${env}?postId=*`;
const getTasksUrl = `https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/${env}?spoolId=*`;
const moveToUserTasksUrl = `https://3tn3vh0ze6.execute-api.eu-west-2.amazonaws.com/${env}`;
const moveFromUserTaskUrl = `https://gw9owr65wi.execute-api.eu-west-2.amazonaws.com/${env}`;
const moveGenericTaskUrl = `https://73fakm0vqc.execute-api.eu-west-2.amazonaws.com/${env}`;

class MoveTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUsers: [],
      tasks: {},
      columns: {},
      columnOrder: [],
      employee: 'initial',
      leftColItem: 'initial',
      rightColItem: 'initial',
      searchField: false,
      searchValue: '',
      overlay: false,
      disableResetSearchBtn: true,
      disableSearchBtn: true
    };
  }

  componentDidMount() {
    const { user, isAuthenticated } = this.props.auth;
    if (isAuthenticated) {
      const jwtToken = user.signInUserSession.idToken.jwtToken;
      this.props.getUsersAndGenericTasks(jwtToken);
    }
  }

  preparePropState = data => {
    const sortedColumnItems = sortTasks(
      data.genericTasks.columnOrder,
      data.genericTasks.columns
    );

    // console.log(`data.genericTasks = ${JSON.stringify(data.genericTasks)}`);
    // console.log(`data.activeUsers = ${JSON.stringify(data.activeUsers)}`);

    const sortedActiveUsers = sortUsers(data.activeUsers);
    // console.log(`sortedActiveUsers = ${JSON.stringify(sortedActiveUsers)}`);
    const employee = this.state.employee;

    if (employee !== 'initial') {
      // Section to populate the user left col
      let newTasks = cloneDeep(data.genericTasks.tasks);
      let newColumns = cloneDeep(data.genericTasks.columns);
      let newColumnOrder = cloneDeep(sortedColumnItems);
      let activeUsers = cloneDeep(data.activeUsers);

      let userSpools = '';
      for (let user of activeUsers) {
        if (user.reference === employee) {
          userSpools = user.spools;
          break;
        }
      }

      //Delete the old users tasks from the pool
      if (newColumns['USER']) {
        let newColumns = cloneDeep(data.genericTasks.columns);
        for (let task of newColumns['USER'].taskIds) {
          delete newTasks[task];
        }
      }
      //and from the columns
      delete newColumns['USER'];

      //Add the newly selected users task data
      if (userSpools.length > 0) {
        for (let spool of userSpools) {
          newTasks[spool.Spool] = {
            id: spool.Spool,
            status: spool.Status,
            startDate: spool.StartDate,
            spoolName: spool.Activity
          };
        }
      }

      //Now add the column data
      newColumns['USER'] = {
        id: 'USER',
        title: 'My Tasks',
        taskIds: userSpools.map(spool => {
          return spool.Spool;
        })
      };

      //Add the USER column if necessary
      if (newColumnOrder[0] !== 'USER') {
        newColumnOrder.unshift('USER');
      }

      let newRightColItem = this.state.rightColItem;
      if (newRightColItem === 'initial') {
        newRightColItem = newColumnOrder[1];
      }

      // this.setState({
      //   activeUsers: sortedActiveUsers,
      //   tasks: newTasks,
      //   columns: newColumns,
      //   columnOrder: newColumnOrder,
      //   leftColItem: 'USER',
      //   rightColItem: newRightColItem,
      //   employee: employee
      // });
      // return;

      return {
        activeUsers: sortedActiveUsers,
        tasks: newTasks,
        columns: newColumns,
        columnOrder: newColumnOrder,
        leftColItem: 'USER',
        rightColItem: newRightColItem,
        employee: employee
      };
    }

    return {
      activeUsers: sortedActiveUsers,
      tasks: data.genericTasks.tasks,
      columns: data.genericTasks.columns,
      columnOrder: sortedColumnItems
    };

    // this.setState({
    //   activeUsers: sortedActiveUsers,
    //   tasks: data.genericTasks.tasks,
    //   columns: data.genericTasks.columns,
    //   columnOrder: sortedColumnItems
    // });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.moveTasks !== this.props.moveTasks) {
      const data = nextProps.moveTasks;

      if (!data.genericTasks.columnOrder) {
        return;
      }
      const result = this.preparePropState(data);

      this.setState({
        activeUsers: result.activeUsers,
        tasks: result.tasks,
        columns: result.columns,
        columnOrder: result.columnOrder
      });
    }
  }

  // Call from displayColumns following a move
  disColTaskMoved = async (taskMove, direction) => {
    this.setState({
      overlay: true
    });

    if (direction === 'TO USER') {
      await axios
        .post(moveToUserTasksUrl, taskMove)
        .catch(err =>
          console.log(`Error when moving to user ${err.toString()}`)
        );
    } else if (direction === 'FROM USER') {
      await axios
        .post(moveFromUserTaskUrl, taskMove)
        .catch(err =>
          console.log(`Error when moving from user ${err.toString()}`)
        );
    } else if (direction === 'GENERIC') {
      await axios
        .post(moveGenericTaskUrl, taskMove)
        .catch(err =>
          console.log(`Error when moving generic task ${err.toString()}`)
        );
    }

    const result = await this.serverRefresh();

    if (result.leftColItem && result.leftColItem === 'USER') {
      this.setState({
        overlay: false,
        searchValue: '',
        disableResetSearchBtn: true,
        disableSearchBtn: true,
        activeUsers: result.activeUsers,
        tasks: result.tasks,
        columns: result.columns,
        columnOrder: result.columnOrder,
        leftColItem: result.leftColItem,
        rightColItem: result.rightColItem,
        employee: result.employee
      });
    } else {
      this.setState({
        overlay: false,
        searchValue: '',
        disableResetSearchBtn: true,
        disableSearchBtn: true,
        activeUsers: result.activeUsers,
        tasks: result.tasks,
        columns: result.columns,
        columnOrder: result.columnOrder
      });
    }

    // const { user, isAuthenticated } = this.props.auth;

    // if (isAuthenticated) {
    //   const jwtToken = user.signInUserSession.idToken.jwtToken;
    //   this.props.getUsersAndGenericTasks(jwtToken);
    // }
  };

  serverRefresh = async () => {
    // Get a fresh copy of activeusers and tasks
    let response;
    await axios
      .all([axios.get(getUsersUrl), axios.get(getTasksUrl)])
      .then(
        axios.spread((activeUsers, genericTasks) => {
          const payload = {
            activeUsers: activeUsers,
            genericTasks: genericTasks
          };
          // const userIdx = payload.activeUsers.data.findIndex(
          //   obj => obj.name === 'Matt Burston'
          // );
          // console.log(
          //   `Matt Burston = ${JSON.stringify(
          //     payload.activeUsers.data[userIdx]
          //   )}`
          // );
          // Initial data prep
          const data = {
            genericTasks: prepData(payload.genericTasks.data),
            activeUsers: payload.activeUsers.data,
            moveInstruction: {}
          };
          response = this.preparePropState(data);
        })
      )
      .catch(err =>
        console.log(`error when getting users and tasks err ${err.toString()}`)
      );

    return response;
  };

  selectUser = (user, isolatedTaskInUsers = null) => {
    const searchField = true;
    this.addUserToLeftCol(user, searchField, isolatedTaskInUsers);
  };

  userSelected = e => {
    this.selectUser(e.target.value);
  };

  clearFields = () => {
    this.setState(
      {
        ...this.state,
        activeUsers: [],
        tasks: {},
        columns: {},
        columnOrder: [],
        employee: 'initial',
        leftColItem: 'initial',
        rightColItem: 'initial',
        searchField: false
      },
      function() {
        const { user, isAuthenticated } = this.props.auth;

        if (isAuthenticated) {
          const jwtToken = user.signInUserSession.idToken.jwtToken;
          this.props.getUsersAndGenericTasks(jwtToken);
        }
      }
    );
  };

  clearName = e => {
    this.clearFields();
  };

  clearSearch = async e => {
    this.setState({
      overlay: true
    });

    // await this.serverRefresh();

    const result = await this.serverRefresh();

    if (result.leftColItem && result.leftColItem === 'USER') {
      this.setState({
        overlay: false,
        searchValue: '',
        disableResetSearchBtn: true,
        disableSearchBtn: true,
        activeUsers: result.activeUsers,
        tasks: result.tasks,
        columns: result.columns,
        columnOrder: result.columnOrder,
        leftColItem: result.leftColItem,
        rightColItem: result.rightColItem,
        employee: result.employee
      });
    } else {
      this.setState({
        overlay: false,
        searchValue: '',
        disableResetSearchBtn: true,
        disableSearchBtn: true,
        activeUsers: result.activeUsers,
        tasks: result.tasks,
        columns: result.columns,
        columnOrder: result.columnOrder
      });
    }

    // this.setState({
    //   disableResetSearchBtn: true,
    //   overlay: false,
    //   searchValue: '',
    //   disableSearchBtn: true
    // });
  };

  searchTasks = e => {
    // If in activeusers then switch to that user (on left) and show just that item
    // If in tasks then switch to that col (on right) and show just that item
    // Following any dag end, refresh but take them back to where they were in terms of
    // selections

    // Button text will now have 2 values. Toggle them here so that either a search
    // can be executed for the task or a server refresh can be executed

    const taskToFind = this.state.searchValue;

    // Searches for non user allocated tasks
    let foundTask = null;
    for (const item in this.state.columns) {
      if (this.state.columns[item].id !== 'USER') {
        const tasks = this.state.columns[item].taskIds;
        if (tasks.includes(taskToFind)) {
          foundTask = {
            title: this.state.columns[item].title,
            colId: this.state.columns[item].id,
            tasks: tasks
          };
          break;
        }
      }
    }

    // Searches for user allocated tasks
    let activeUserEntry = null;
    this.state.activeUsers.map(user => {
      for (const spool of user.spools) {
        if (spool.Spool === taskToFind) {
          activeUserEntry = user;
          return true;
        }
      }
      return false;
    });

    if (activeUserEntry && foundTask && env === 'dev') {
      console.log(`ERROR - DUPLICATE FOUND`);
      console.log(`dup activeUserEntry = ${JSON.stringify(activeUserEntry)}`);
      console.log(`dup fountTask = ${JSON.stringify(foundTask)}`);
      return;
    }

    if (activeUserEntry) {
      // Switching user
      //Find the index of the user that contains the task
      const userIdx = this.state.activeUsers.findIndex(
        obj => obj.reference === activeUserEntry.reference
      );

      // Find the index in that users spools that contains the task we are searching for
      const spoolIdx = this.state.activeUsers[userIdx].spools.findIndex(
        obj => obj.Spool === taskToFind
      );

      // Copy the active users
      // const isolatedTaskInUsers = [...this.state.activeUsers];
      // Deep copy
      const isolatedTaskInUsers = JSON.parse(
        JSON.stringify(this.state.activeUsers)
      );
      // Overwrite the target users spool array with just the one task we require
      const newUserSpools = [];
      newUserSpools.push(this.state.activeUsers[userIdx].spools[spoolIdx]);
      isolatedTaskInUsers[userIdx].spools = newUserSpools;

      // Allows all changes into state to re-render
      this.selectUser(activeUserEntry.reference, isolatedTaskInUsers);
    }

    if (foundTask) {
      const newTask = {
        id: this.state.columns[foundTask.colId].id,
        title: this.state.columns[foundTask.colId].title,
        colId: foundTask.colId,
        taskIds: [taskToFind]
      };

      // console.log(`newTask = ${JSON.stringify(newTask)}`);
      const restrictedColumns = JSON.parse(JSON.stringify(this.state.columns));
      restrictedColumns[foundTask.colId] = newTask;

      // console.log(`this.state.columns = ${JSON.stringify(restrictedColumns)}`);
      this.setState({
        columns: restrictedColumns,
        rightColItem: foundTask.colId
      });
    }
  };

  updateSearchValue = e => {
    if (e.target.value === '') {
      this.setState({
        searchValue: e.target.value,
        disableResetSearchBtn: false,
        disableSearchBtn: true
      });
    } else {
      this.setState({
        searchValue: e.target.value,
        disableResetSearchBtn: false,
        disableSearchBtn: false
      });
    }
  };

  leftColSelected = e => {
    let newCols = cloneDeep(this.state.columns);
    let newColOrder = cloneDeep(this.state.columnOrder);

    //Remove user from left col if it is present
    delete newCols['USER'];

    var index = newColOrder.indexOf('USER');
    if (index > -1) {
      newColOrder.splice(index, 1);
    }

    this.setState({
      ...this.state,
      leftColItem: e.target.value,
      employee: INITIAL,
      columns: newCols,
      columnOrder: newColOrder
    });
  };

  rightColSelected = e => {
    this.setState({
      ...this.state,
      rightColItem: e.target.value
    });
  };

  addUserToLeftCol(employee, searchField, isolatedTaskInUsers = null) {
    let newTasks = cloneDeep(this.state.tasks);
    let newColumns = cloneDeep(this.state.columns);
    let newColumnOrder = cloneDeep(this.state.columnOrder);
    let activeUsers = cloneDeep(this.state.activeUsers);

    if (isolatedTaskInUsers) {
      activeUsers = isolatedTaskInUsers;
    }

    let userSpools = '';
    for (const user of activeUsers) {
      if (user.reference === employee) {
        userSpools = user.spools;
        break;
      }
    }

    //Delete the old users tasks from the pool
    if (this.state.columns['USER']) {
      for (let task of this.state.columns['USER'].taskIds) {
        delete newTasks[task];
      }
    }

    //and from the columns
    delete newColumns['USER'];

    //Add the newly selected users task data
    if (userSpools.length > 0) {
      for (let spool of userSpools) {
        newTasks[spool.Spool] = {
          id: spool.Spool,
          status: spool.Status,
          startDate: spool.StartDate,
          spoolName: spool.Activity
        };
      }
    }

    //Now add the column data
    newColumns['USER'] = {
      id: 'USER',
      title: 'My Tasks',
      taskIds: userSpools.map(spool => {
        return spool.Spool;
      })
    };

    //Add the USER column if necessary
    if (newColumnOrder[0] !== 'USER') {
      newColumnOrder.unshift('USER');
    }

    //pre-pop right col with first item to allow columns to render
    let newRightColItem = this.state.rightColItem;
    if (newRightColItem === 'initial') {
      newRightColItem = newColumnOrder[1];
    }

    this.setState({
      ...this.state,
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder,
      leftColItem: 'USER',
      rightColItem: newRightColItem,
      employee: employee,
      searchField: searchField
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const { loading } = this.props.moveTasks;

    let userItems = '';
    let userContent = ''; //UserDropdown list
    let columnPickers = ''; //Column Dropdown pickers
    let leftColItems = '';
    let rightColItems = '';
    let columnsContent = '';
    let searchOption = '';

    if (loading) {
      userContent = <Spinner />;
    } else {
      const prepareActiveUsers = () => {
        if (this.state.activeUsers.length === 0) {
          userContent = <h3>No active employees</h3>;
          return;
        }

        //Clone array
        let users = this.state.activeUsers.slice(0);

        if (users[0].reference !== INITIAL) {
          users.unshift({
            name: 'Please select your name',
            reference: 'initial'
          });
        }

        userItems = users.map(user => {
          if (user.reference === INITIAL) {
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
          <DropDownList>
            <SelectField
              value={this.state.employee}
              onChange={this.userSelected}
            >
              {userItems}
            </SelectField>
            <ClearName
              className="btn btn-sm btn-primary"
              onClick={this.clearName}
            >
              Clear
            </ClearName>
          </DropDownList>
        );
      };

      const buildColList = (columnList, columnId) => {
        const colItems = columnList.map(col => {
          if (col.reference === INITIAL) {
            return (
              <option disabled value={col.reference} key="1">
                {col.name}
              </option>
            );
          } else {
            if (col.reference === 'USER' && columnId === 'right') {
              return null;
            }
            if (
              (columnId === 'left' &&
                col.reference === this.state.rightColItem) ||
              (columnId === 'right' && col.reference === this.state.leftColItem)
            ) {
              return (
                <option disabled value={col.reference} key={col.reference}>
                  {col.name}
                </option>
              );
            } else {
              return (
                <option value={col.reference} key={col.reference}>
                  {col.name}
                </option>
              );
            }
          }
        });

        return colItems;
      };

      const prepareGeneicColumns = () => {
        if (Object.keys(this.state.columns).length === 0) return;

        let columnList = this.state.columnOrder.map(col => {
          if (col === 'USER') {
            return {
              reference: col,
              name: 'My Tasks'
            };
          } else {
            return {
              reference: col,
              name: this.state.columns[col].title
            };
          }
        });

        if (columnList[0].reference !== INITIAL) {
          columnList.unshift({
            name: 'Select location',
            reference: 'initial'
          });
        }

        leftColItems = buildColList(columnList, 'left');
        rightColItems = buildColList(columnList, 'right');

        //Prepare column pickers
        columnPickers = (
          <Container>
            <ColDropDownList
              value={this.state.leftColItem}
              onChange={this.leftColSelected}
            >
              {leftColItems}
            </ColDropDownList>
            <ColDropDownList
              value={this.state.rightColItem}
              onChange={this.rightColSelected}
            >
              {rightColItems}
            </ColDropDownList>
          </Container>
        );
      };

      prepareActiveUsers();
      prepareGeneicColumns();

      if (
        this.state.leftColItem !== INITIAL &&
        this.state.rightColItem !== INITIAL
      ) {
        const columns = [this.state.leftColItem, this.state.rightColItem];

        columnsContent = (
          <DisplayColumns
            cols={columns}
            colData={this.state.columns}
            tasks={this.state.tasks}
            employee={this.state.employee}
            disColTaskMoved={this.disColTaskMoved}
          />
        );
      }

      if (this.state.searchField) {
        searchOption = (
          <EmployeeList>
            <DropDownList>
              <InputField
                placeholder="Task Search"
                value={this.state.searchValue}
                onChange={evt => this.updateSearchValue(evt)}
              ></InputField>
              <ClearName
                className="btn btn-sm btn-primary"
                onClick={this.searchTasks}
                disabled={this.state.disableSearchBtn}
              >
                Search
              </ClearName>
              <ClearName
                className="btn btn-sm btn-primary"
                onClick={this.clearSearch}
                disabled={this.state.disableResetSearchBtn}
              >
                Reset
              </ClearName>
            </DropDownList>
          </EmployeeList>
        );
      } else {
        searchOption = null;
      }
    }

    return (
      <div>
        <LoadingOverlay
          active={this.state.overlay}
          spinner={<Spinner />}
          styles={{
            wrapper: {}
          }}
          classNamePrefix="MyLoader_"
        >
          <EmployeeList>{userContent}</EmployeeList>
          {searchOption}
          <div className="row">{columnPickers}</div>
          {columnsContent}
        </LoadingOverlay>
      </div>
    );
  }
}

MoveTasks.propTypes = {
  getUsersAndGenericTasks: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  moveTasks: state.moveTasks
});

export default connect(
  mapStateToProps,
  { getUsersAndGenericTasks }
)(MoveTasks);
