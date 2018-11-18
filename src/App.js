import React, { Component } from 'react';
import './App.css';
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import axios from 'axios';
import Navbar from './components/layout/navbar';
//import initialData from './components/entryExit/data';
import testData from './components/entryExit/testData';
import Column from './components/entryExit/column';

const Container = styled.div`
  display: flex;
  margin: 0 auto;
`;

const MainTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

class App extends Component {
  //state = initialData;
  state = {
    tasks: {},
    columns: {
      checkedIn: {},
      checkedOut: {}
    },
    columnOrder: []
  };

  componentWillMount() {
    //Check in API - get data
    axios
      .get(
        'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
      )
      .then(res => {
        //console.log('checkedIn raw', res.data);

        let checkedInData = res.data.map(worker => {
          worker.category = 'checkedIn';
          return worker;
        });

        /************************************************/
        /* Extra employees here
        /************************************************/
        testData.forEach(testEmployee => {
          checkedInData.push(testEmployee);
        });

        //testData
        /************************************************/
        /* Extra employees here
        /************************************************/

        //console.log('now ', checkedInData);

        //Check out API - get data
        axios
          .get(
            'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
          )
          .then(res => {
            //console.log('checkedOut raw ', res.data);
            let checkedOutWorkers = res.data.map(worker => {
              worker.category = 'checkedOut';
              return worker;
            });

            const initialWorkers = checkedInData.concat(checkedOutWorkers);
            //console.log('initialWorkers ', initialWorkers);

            let tasks = {};

            initialWorkers.forEach((worker, index) => {
              tasks[worker.reference] = {
                id: worker.reference,
                surname: worker.WorkerName.WorkerSurname
              };
            });

            let checkInTasks = [];
            initialWorkers.forEach(worker => {
              if (worker.category === 'checkedIn') {
                checkInTasks.push(worker.reference);
              }
            });

            //console.log('checkInTasks ', checkInTasks);

            let checkOutTasks = [];
            initialWorkers.forEach(worker => {
              if (worker.category === 'checkedOut')
                checkOutTasks.push(worker.reference);
            });

            const initialTaskState = {
              tasks,
              columns: {
                checkedIn: {
                  id: 'checkedIn',
                  title: 'Checked In',
                  taskIds: checkInTasks
                },
                checkedOut: {
                  id: 'checkedOut',
                  title: 'Checked Out',
                  taskIds: checkOutTasks
                }
              },
              columnOrder: ['checkedIn', 'checkedOut']
            };

            // console.log('initialWorkers ', initialWorkers);
            // console.log('initialTasks ', tasks);
            // console.log('checkInTasks ', checkInTasks);
            // console.log('checkOutTasks ', checkOutTasks);
            console.log('initialTaskState ', initialTaskState);

            //this.setState({ workers: initialWorkers });
            this.setState(initialTaskState);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
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
    const startTaskIds = Array.from(start.taskIds);

    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
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

    const updatesAllowed = false;

    if (updatesAllowed) {
      //TODO: Call post endpoint here as the task has moved to a different column.
      console.log('destination x ', destination.droppableId); //checkedIn or checkedOut
      console.log('draggableId ', draggableId); //employee referecne

      if (destination.droppableId === 'checkedIn') {
        //Check in API
        let workerCheckIn = {
          WorkerRef: draggableId,
          CheckedInDateTime: 1541323635208
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
        //Must be checking out
        //Check out API
        let workerCheckout = {
          WorkerRef: draggableId,
          CheckedOutDateTime: 1541323635208
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

  render() {
    const content = this.state.columnOrder.map(columnId => {
      const column = this.state.columns[columnId];
      const tasks = column.taskIds.map(taskId => this.state.tasks[taskId]);

      return <Column key={column.id} column={column} tasks={tasks} />;
    });

    return (
      <div className="App">
        <Navbar />
        <MainTitle>Please check in or out</MainTitle>
        <div className="container">
          <div className="row">
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Container>{content}</Container>
            </DragDropContext>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
