import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import Spinner from "../../common/spinner";
import { getUsersAndGenericTasks } from "../../actions/moveActions";
import DisplayColumns from "./displayColumns";
import sortTasks from "./sortTasks";
import sortUsers from "./sortUsers";

const DropDownList = styled.div`
  font-size: 140%;
`;

const ColDropDownList = styled.select`
  font-size: 140%;
  width: 210px;
`;

const ClearName = styled.button`
  margin-left: 10px;
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

const INITIAL = "initial";

class MoveTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeUsers: [],
      tasks: {},
      columns: {},
      columnOrder: [],
      employee: "initial",
      leftColItem: "initial",
      rightColItem: "initial"
    };
  }

  componentDidMount() {
    const { user, isAuthenticated } = this.props.auth;

    if (isAuthenticated) {
      const jwtToken = user.signInUserSession.idToken.jwtToken;
      this.props.getUsersAndGenericTasks(jwtToken);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.moveTasks !== this.props.moveTasks) {
      //Sort the columnOrder
      let sortedColumnItems = nextProps.moveTasks.genericTasks.columnOrder;
      let sortedActiveUsers = nextProps.moveTasks.activeUsers;

      if (nextProps.moveTasks.genericTasks.columnOrder) {
        sortedColumnItems = sortTasks(
          nextProps.moveTasks.genericTasks.columnOrder,
          nextProps.moveTasks.genericTasks.columns
        );

        //Sort the users
        sortedActiveUsers = sortUsers(nextProps.moveTasks.activeUsers);
      }

      this.setState({
        ...this.state,
        activeUsers: sortedActiveUsers,
        tasks: nextProps.moveTasks.genericTasks.tasks,
        columns: nextProps.moveTasks.genericTasks.columns,
        columnOrder: sortedColumnItems
      });
    }
  }

  //Absorb child state
  disColTaskMoved = (cols, move) => {
    let newActiveUsers = [...this.state.activeUsers];

    //If from a user then remove the task from the activeUsers list
    if (move.fromCol === "USER") {
      for (let user of newActiveUsers) {
        if (user.reference === this.state.employee) {
          for (let i = 0; i < user.spools.length; i++) {
            if (user.spools[i].Spool === move.taskId) {
              user.spools.splice(i, 1);
              break;
            }
          }
          break;
        }
      }
    }
    //If to a user then add the task to the activeUsers list
    if (move.toCol === "USER") {
      for (let i = 0; i < newActiveUsers.length; i++) {
        if (newActiveUsers[i].reference === this.state.employee) {
          newActiveUsers[i].spools.push({
            Activity: this.state.tasks[move.taskId].spoolName,
            EndDate: "None",
            Spool: this.state.tasks[move.taskId].id,
            StartDate: this.state.tasks[move.taskId].startDate,
            spoolName: this.state.tasks[move.taskId].spoolName
          });
          break;
        }
      }
    }

    this.setState({
      ...this.state,
      columns: cols,
      activeUsers: newActiveUsers
    });
  };

  userSelected = e => {
    this.addUserToLeftCol(e.target.value);
  };

  clearName = e => {
    this.setState({
      ...this.state,
      employee: INITIAL,
      leftColItem: "initial",
      rightColItem: "initial"
    });
  };

  leftColSelected = e => {
    let newCols = { ...this.state.columns };
    let newColOrder = [...this.state.columnOrder];

    //Remove user from left col if it is present
    delete newCols["USER"];

    var index = newColOrder.indexOf("USER");
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

  addUserToLeftCol(employee) {
    let newTasks = { ...this.state.tasks };
    let newColumns = { ...this.state.columns };
    let newColumnOrder = [...this.state.columnOrder];

    let userSpools = "";
    for (let user of this.state.activeUsers) {
      if (user.reference === employee) {
        userSpools = user.spools;
        break;
      }
    }

    //Delete the old users tasks from the pool
    if (this.state.columns["USER"]) {
      for (let task of this.state.columns["USER"].taskIds) {
        delete newTasks[task];
      }
    }

    //and from the columns
    delete newColumns["USER"];

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
    newColumns["USER"] = {
      id: "USER",
      title: "My Tasks",
      taskIds: userSpools.map(spool => {
        return spool.Spool;
      })
    };

    //Add the USER column if necessary
    if (newColumnOrder[0] !== "USER") {
      newColumnOrder.unshift("USER");
    }

    //pre-pop right col with first item to allow columns to render
    let newRightColItem = this.state.rightColItem;
    if (newRightColItem === "initial") {
      newRightColItem = newColumnOrder[1];
    }

    this.setState({
      ...this.state,
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder,
      leftColItem: "USER",
      rightColItem: newRightColItem,
      employee: employee
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const { loading } = this.props.moveTasks;

    let userItems = "";
    let userContent = ""; //UserDropdown list
    let columnPickers = ""; //Column Dropdown pickers
    let leftColItems = "";
    let rightColItems = "";
    let columnsContent = "";

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
            name: "Please select your name",
            reference: "initial"
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
            <select value={this.state.employee} onChange={this.userSelected}>
              {userItems}
            </select>
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
            if (col.reference === "USER" && columnId === "right") {
              return null;
            }
            if (
              (columnId === "left" && col.name === this.state.rightColItem) ||
              (columnId === "right" && col.name === this.state.leftColItem)
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
          if (col === "USER") {
            return {
              reference: col,
              name: "My Tasks"
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
            name: "Select location",
            reference: "initial"
          });
        }

        leftColItems = buildColList(columnList, "left");
        rightColItems = buildColList(columnList, "right");

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
    }

    return (
      <div>
        <EmployeeList>{userContent}</EmployeeList>
        <div className="row">{columnPickers}</div>
        {columnsContent}
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
