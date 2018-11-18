import React, { Component } from 'react';
import axios from 'axios';

class ClockInOut extends Component {
  state = {
    workers: []
  };

  componentDidMount() {
    //Check in API
    axios
      .get(
        'https://6sm7s3jxfd.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
      )
      .then(res => {
        console.log('checkedIn raw', res.data);
        //let checkedInData = res.data;

        let checkedInData = res.data.map(worker => {
          worker.category = 'checkedIn';
          return worker;
        });

        checkedInData.push({
          reference: 'R145678',
          category: 'checkedIn',
          WorkerName: {
            WorkerSurname: 'Gibbs'
          }
        });

        checkedInData.push({
          reference: 'F45623',
          category: 'checkedIn',
          WorkerName: {
            WorkerSurname: 'Franklin'
          }
        });

        console.log('now ', checkedInData);

        //Check out API
        axios
          .get(
            'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev?WorkerRef=*'
          )
          .then(res => {
            console.log('checkedOut raw ', res.data);
            let checkedOutWorkers = res.data.map(worker => {
              worker.category = 'checkedOut';
              return worker;
            });

            const workers = checkedInData.concat(checkedOutWorkers);
            this.setState({ workers: workers });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  onCheckOutClick(e) {
    console.log('checkout button clicked');
    // let workerCheckout = {
    //   WorkerRef: 'RJ8888',
    //   CheckedOutDateTime: 1541323635208
    // };

    // //Check out API
    // axios
    //   .put(
    //     'https://5yspssp9j7.execute-api.eu-west-2.amazonaws.com/dev',
    //     workerCheckout
    //   )
    //   .then(res => {
    //     console.log('return from checkedout');
    //     console.log(res.data);
    //   })
    //   .catch(err => console.log(err));
  }

  onDragOver = e => {
    e.preventDefault();
  };

  onDragStart = (e, id) => {
    //console.log('dragstart:', id);
    e.dataTransfer.setData('id', id);
  };

  onTaskDrop = (e, cat) => {
    let id = e.dataTransfer.getData('id');

    let workers = this.state.workers.filter(worker => {
      if (worker.reference === id) {
        worker.category = cat;
      }
      return worker;
    });

    this.setState({
      ...this.state,
      workers
    });
  };

  render() {
    var workers = {
      checkedIn: [],
      checkedOut: []
    };

    this.state.workers.forEach(w => {
      workers[w.category].push(
        <div
          key={w.reference}
          onDragStart={e => this.onDragStart(e, w.reference)}
          draggable
          className="draggable"
        >
          {w.WorkerName.WorkerSurname}
        </div>
      );
    });

    return (
      <div className="main-schedule">
        <div className="container">
          <div className="row">
            <div
              className="col-md-4 m-auto sched-col pending"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onTaskDrop(e, 'checkedIn')}
            >
              <span className="task-header">Check In</span>
              {workers.checkedIn}
            </div>
            <div
              className="col-md-4 m-auto sched-col droppable"
              onDragOver={e => this.onDragOver(e)}
              onDrop={e => this.onTaskDrop(e, 'checkedOut')}
            >
              <span className="task-header">Check Out</span>
              {workers.checkedOut}
            </div>
          </div>
          {/* <button
            onClick={this.onCheckOutClick.bind(this)}
            className="btn btn-dangeer"
          >
            Check out
          </button> */}
        </div>
      </div>
    );
  }
}

export default ClockInOut;
