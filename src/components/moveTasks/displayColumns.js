import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import sortTasks from "../../common/sortTasks";
import Column from "./column";
import styled from "styled-components";

import {
  moveGenericTask,
  moveToUserTask,
  moveFromUserTask
} from "../../actions/moveActions";

const Container = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
`;

class DisplayColumns extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: {},
      columns: {},
      columnOrder: []
    };
  }

  componentDidMount() {
    this.setState({
      ...this.state,
      tasks: this.props.tasks,
      columns: this.props.colData,
      columnOrder: this.props.cols
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.cols !== this.props.cols) {
      this.setState({
        ...this.state,
        tasks: nextProps.tasks,
        columns: nextProps.colData,
        columnOrder: nextProps.cols
      });
    }
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

    const newColumns = {
      ...this.state.columns,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish
    };

    const newState = {
      ...this.state,
      columns: newColumns
    };

    //Needed to update activeUsers in moveTasks
    const moveInstruction = {
      fromCol: start.id,
      toCol: finish.id,
      taskId: draggableId
    };

    //Passing columns state back to parent to keep it's state upto date
    this.props.disColTaskMoved(newColumns, moveInstruction);

    this.setState(newState);

    const updatesAllowed = true;
    const timeNow = Date.now();

    if (updatesAllowed) {
      //call endpoint api to update

      let taskMove = "";

      //if moving to user
      if (finish.id === "USER") {
        taskMove = {
          reference: this.props.employee,
          spoolDetail: {
            Spool: draggableId,
            spoolName: this.state.tasks[draggableId].spoolName,
            Activity: start.title,
            StartDate: timeNow
          }
        };

        this.props.moveToUserTask(taskMove, jwtToken, moveInstruction);
      } else if (start.id === "USER") {
        taskMove = {
          employeeRef: this.props.employee,
          spoolRef: draggableId,
          spoolName: this.state.tasks[draggableId].spoolName,
          locationId: finish.id,
          StartDate: timeNow
        };

        this.props.moveFromUserTask(taskMove, jwtToken, moveInstruction);
      } else {
        taskMove = {
          spoolRef: draggableId,
          spoolName: this.state.tasks[draggableId].spoolName,
          locationId: finish.id,
          StartDate: timeNow
        };

        this.props.moveGenericTask(taskMove, jwtToken, moveInstruction);
      }
    }
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    let mainContent = this.state.columnOrder.map(columnId => {
      const column = this.state.columns[columnId];
      const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);
      return <Column key={column.id} column={column} tasks={tasks} />;
    });

    return (
      <div className="row">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Container>{mainContent}</Container>
        </DragDropContext>
      </div>
    );
  }
}

DisplayColumns.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  moveTasks: state.moveTasks
});

export default connect(
  mapStateToProps,
  { moveGenericTask, moveToUserTask, moveFromUserTask }
)(DisplayColumns);
