import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import { UsageLogs } from '../api/usageLogs.js';

import ExpGraphPage from './ExpGraphPage.js';
import LinearSearchPage from './LinearSearchPage.js';
import InitPage from './InitPage.js';
import MenuPage from './MenuPage.js';
// import FormPage from './FormPage.js';

_page = "init";
_userId = "default";
_expId = "none";

// App component - represents the whole app
class App extends Component {

  // for sample data
  constructor(props) {
    super(props);
    this.state = {
      page: _page,
      userId: _userId,
      expId:  _expId,
    };
  }

  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }

  getAppState() {
    console.log(this.state);
    return this.state;
  }

  saveLog(status, message) {
    UsageLogs.insert({
      userId: this.state.userId,
      time: new Date(),
      timeStamp: new Date().getTime(),
      page: this.state.page,
      expId: this.state.expId,
      status: status,
      message: message,
    }, (error, result) => { });

    // console.log(UsageLogs.find().fetch());
  }

  handleClickFinish() {
    this.saveLog("0", "finish and back to menu");
    this.setAppState({
      page: "menu",
    });
  }

  handleClickExit() {
    this.saveLog("0", "exit");
    this.setAppState({
      page: "init",
      userId: "none",
    });
  }


  renderPage() {
    switch (this.state.page) {
      case "init":
        return (
          <InitPage
            setAppState={this.setAppState.bind(this)}
            saveLog={this.saveLog.bind(this)}
          />
        );
      case "menu":
        return (
          <MenuPage
            setAppState={this.setAppState.bind(this)}
            getAppState={this.getAppState.bind(this)}
            saveLog={this.saveLog.bind(this)}
          />
        );
        break;
      case "graph":
        return (
          <ExpGraphPage
            // graphWidth="1200px" viewerWidth="900px" height="1000px"
            graphWidth="800px" viewerWidth="700px" height="650px"
            setAppState={this.setAppState.bind(this)}
            saveLog={this.saveLog.bind(this)}
            AppState={this.state}
            handleClickFinish={this.handleClickFinish.bind(this)}
            handleClickExit={this.handleClickExit.bind(this)}
          />
        );
        break;
      case "linear":
        return (
          <LinearSearchPage
            // graphWidth="1200px" viewerWidth="900px" height="1000px"
            graphWidth="800px" viewerWidth="700px" height="650px"
            setAppState={this.setAppState.bind(this)}
            saveLog={this.saveLog.bind(this)}
            AppState={this.state}
            handleClickFinish={this.handleClickFinish.bind(this)}
            handleClickExit={this.handleClickExit.bind(this)}
          />
        );
        break;
      // case "form":
      //   return (
      //     <FormPage
      //       handleClickBackToMenu={this.handleClickBackToMenu.bind(this)}
      //       handleClickContinue={this.handleClickContinue.bind(this)}
      //     />
      //   );
      //   break;
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>BloomyExplorer: Bouquet design exploration</h1>
        </header>
        <div>
          {this.renderPage()}
        </div>
      </div>
    );
  }

}

// export default App;
export default withTracker(() => {
  return {
    usageLogs: UsageLogs.find({}).fetch(),
//     designStates: DesignStates.find({}, {sort: {nodeNumber: 1}}).fetch(),
  };
})(App);
