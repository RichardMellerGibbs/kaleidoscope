import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Navbar from "./components/layout/navbar";
import EntryExit from "./components/entryExit/entryExit";
import Login from "./components/auth/login";
import Reset from "./components/auth/reset";
import WorkerTasks from "./components/workerTasks/workerTasks";
import MoveTasks from "./components/moveTasks/moveTasks";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <div className="appBody">
              <Route exact path="/" component={EntryExit} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/reset" component={Reset} />
              <Route exact path="/workerTasks" component={WorkerTasks} />
              <Route exact path="/moveTasks" component={MoveTasks} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
