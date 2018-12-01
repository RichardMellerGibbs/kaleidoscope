import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import axios from 'axios';
import { getCheckInOut } from '../../actions/checkInOutActions';
//import initialData from './components/entryExit/data';
//import testData from './components/entryExit/testData';
import Column from './column';
import Counter from './counter';
import sortTasks from '../../common/sortTasks';
import Spinner from '../../common/spinner';

const Container = styled.div`
  display: flex;
  margin: 0 auto;
`;

class EntryExit extends Component {
  //state = initialData;
  state = {
    tasks: {},
    columns: {
      checkedIn: {},
      checkedOut: {}
    },
    columnOrder: []
  };

  componentDidMount() {
    //Get the data async by calling redux action
    this.props.getCheckInOut();
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
      //Call post endpoint here as the task has moved to a different column.

      if (destination.droppableId === 'checkedIn') {
        //Check in API
        let workerCheckIn = {
          WorkerRef: draggableId,
          CheckedInDateTime: timeNow
        };

        axios
          .put(
            'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev',
            workerCheckIn
          )
          .then(res => {
            //console.log('return from checkedin');
            //console.log(res.data);
          })
          .catch(err => console.log(err));
      } else {
        //Check out API
        let workerCheckout = {
          WorkerRef: draggableId,
          CheckedOutDateTime: timeNow
        };

        axios
          .put(
            'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev',
            workerCheckout
          )
          .then(res => {
            //console.log('return from checkedout');
            //console.log(res.data);
          })
          .catch(err => console.log(err));
      }
    }
  };

  //Bring the initialdata into local state causing a re-render
  componentWillReceiveProps(nextProps) {
    if (nextProps.checkInOut !== this.props.checkInOut) {
      this.setState(nextProps.checkInOut.checkInOut);
    }
  }

  render() {
    const { loading } = this.props.checkInOut;
    let innerContent;
    let content;
    let checkedInCount = 0;
    let checkedOutCount = 0;

    if (this.state.columnOrder.length === 0 || loading) {
      content = <Spinner />;
    } else {
      innerContent = this.state.columnOrder.map(columnId => {
        const column = this.state.columns[columnId];
        const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

        if (columnId === 'checkedIn') checkedInCount = tasks.length;
        if (columnId === 'checkedOut') checkedOutCount = tasks.length;

        return <Column key={column.id} column={column} tasks={tasks} />;
      });

      if (checkedInCount === 0 && checkedOutCount !== 0)
        checkedOutCount = 'All staff have left the building';

      //The array allows multiple adjacent elements to be rendered
      content = [
        <Counter countValue={checkedOutCount} key="0" />,
        innerContent,
        <Counter countValue={checkedInCount} key="1" />
      ];
    }

    return (
      <div className="container">
        <div className="row">
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Container>{content}</Container>
          </DragDropContext>
        </div>
      </div>
    );
  }
}

EntryExit.propTypes = {
  getCheckInOut: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  checkInOut: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  checkInOut: state.checkInOut,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCheckInOut }
)(EntryExit);
