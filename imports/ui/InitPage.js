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

    this.props.saveLog("0", "user id set: "+input, "-");
    this.props.setAppState({
      page: "menu",
      userId: input,
    });

  }

  render() {
    return (
      <div>
        <form className="form" onSubmit={this.handleSubmit.bind(this)}>
          Participant ID:
          <input type="text" ref="textInput" placeholder="Participant ID" />
          <input type="submit" value="Start" />
        </form>
      </div>
    );
  }

}


export default InitPage;
