import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import sortTasks from '../../common/sortTasks';
import Spinner from '../../common/spinner';
import Column from './column';

import {
  getGenericSpools,
  moveSpool,
  moveToUserSpool,
  moveFromUserSpool
} from '../../actions/workerTaskActions';

const Container = styled.div`
  display: flex;
  margin: 0 auto;
`;

class TaskItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayList: false,
      tasks: {},
      columns: {},
      columnOrder: []
    };
  }

  getGenericTasks = reference => {
    //Turn off display
    this.setState({ ...this.state, displayList: false });

    const { user, isAuthenticated } = this.props.auth;

    if (isAuthenticated && !reference) {
      const jwtToken = user.signInUserSession.idToken.jwtToken;
      this.props.getGenericSpools(jwtToken);
    }
  };

  componentDidMount() {
    this.getGenericTasks(this.props.employee);
  }

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn
        }
      };

      this.setState(newState);
      return;
    }

    //Moving from one column to another
    const { user } = this.props.auth;
    const jwtToken = user.signInUserSession.idToken.jwtToken;

    let startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);

    const sortedStartTasks = sortTasks(startTaskIds, this.state.tasks);

    const newStart = {
      ...start,
      taskIds: sortedStartTasks
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);

    const sortedFinishTasks = sortTasks(finishTaskIds, this.state.tasks);

    const newFinish = {
      ...finish,
      taskIds: sortedFinishTasks
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };

    this.setState(newState);

    const updatesAllowed = true;
    const timeNow = Date.now();

    if (updatesAllowed) {
      //call endpoint api to update

      //console.log('start ', start);
      //console.log('finish ', finish);

      let taskMove = '';

      //if moving to user
      if (finish.id === 'USER') {
        taskMove = {
          reference: this.props.employee,
          spoolDetail: {
            Spool: draggableId,
            spoolName: this.state.tasks[draggableId].spoolName,
            Activity: start.title,
            StartDate: timeNow
          }
        };

        this.props.moveToUserSpool(taskMove, jwtToken);
      } else if (start.id === 'USER') {
        //console.log('moving from user');
        taskMove = {
          employeeRef: this.props.employee,
          spoolRef: draggableId,
          spoolName: this.state.tasks[draggableId].spoolName,
          locationId: finish.id,
          StartDate: timeNow
        };

        this.props.moveFromUserSpool(taskMove, jwtToken);
      } else {
        taskMove = {
          spoolRef: draggableId,
          spoolName: finish.title,
          locationId: finish.id,
          StartDate: timeNow
        };

        this.props.moveSpool(taskMove, jwtToken);
      }

      //console.log('taskMove ', taskMove);
    }
  };

  replaceUserColumn(userSpools) {
    let newTasks = {};
    let newColumns = Object.assign({}, this.state.columns);
    let newColumnOrder = this.state.columnOrder.slice(0);

    //Delete any current user tasks
    for (let task in this.state.tasks) {
      if (this.state.tasks[task].spoolName !== 'My Tasks') {
        newTasks[task] = {
          id: task,
          status: this.state.tasks[task].status,
          startDate: this.state.tasks[task].startDate,
          spoolName: this.state.tasks[task].spoolName
        };
      }
    }

    // console.log('this.state.tasks ', this.state.tasks);
    // console.log('this.state.columns ', this.state.columns);
    // console.log('userSpools ', userSpools);

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

    this.setState({
      ...this.state,
      displayList: true,
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.employee !== this.props.employee) {
      this.setState({ ...this.state, employee: nextProps.employee });
      this.replaceUserColumn(nextProps.userDetails.spools);
    }

    if (nextProps.genericSpools !== this.props.genericSpools) {
      if (nextProps.genericSpools.itemPut) {
        //Prevents state change after item put
        return;
      }

      if (Object.keys(nextProps.genericSpools.genericSpools).length > 0) {
        this.setState({
          ...this.state,
          displayList: true,
          tasks: nextProps.genericSpools.genericSpools.tasks,
          columns: nextProps.genericSpools.genericSpools.columns,
          columnOrder: nextProps.genericSpools.genericSpools.columnOrder
        });
      }
    }
  }

  render() {
    const { isAuthenticated } = this.props.auth;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    const { spoolLoading } = this.props.genericSpools;

    let mainContent = '';
    let taskLists = '';

    if (spoolLoading) {
      mainContent = <Spinner />;
    } else {
      if (this.state.displayList) {
        taskLists = this.state.columnOrder.map(columnId => {
          const column = this.state.columns[columnId];
          const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
          return <Column key={column.id} column={column} tasks={tasks} />;
        });
      }

      mainContent = taskLists;
    }

    return (
      <div className="row">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>{mainContent}</Container>
        </DragDropContext>
      </div>
    );
  }
}

TaskItems.propTypes = {
  auth: PropTypes.object.isRequired,
  getGenericSpools: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  genericSpools: state.genericSpools
});

export default connect(
  mapStateToProps,
  { getGenericSpools, moveSpool, moveToUserSpool, moveFromUserSpool }
)(TaskItems);
