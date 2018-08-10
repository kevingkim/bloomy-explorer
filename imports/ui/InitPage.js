import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { UsageLogs } from '../api/usageLogs.js';

class InitPage extends Component {

  // for sample data
  constructor(props) {
    super(props);

  }

  handleSubmit(event) {
    event.preventDefault();

    const input = ReactDOM.findDOMNode(this.refs.textInput).value;

    this.props.saveLog("0", "user id set: "+input);
    this.props.setAppState({
      page: "menu",
      userId: input,
    });

    // console.log(this.props.getAppState());

    // UsageLogs.insert({
    //   userId: this.props.getAppState.userId,
    //   time: new Date(),
    //   timeStamp: new Date().getTime(),
    //   status: "0",
    //   message: "user id set"
    // }, (error, result) => { });
    // console.log(UsageLogs.find().fetch());

  }

  render() {
    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          User ID:
          <input type="text" ref="textInput" placeholder="userID" />
          <input type="submit" value="Start" />
        </form>
      </div>
    );
  }

}


export default InitPage;
