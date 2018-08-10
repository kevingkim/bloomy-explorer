import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { withTracker } from 'meteor/react-meteor-data';
// import _ from 'lodash';

import { UsageLogs } from '../api/usageLogs.js';



class MenuPage extends Component {

  // for sample data
  constructor(props) {
    super(props);
    // this.state = {
    // };
  }

  handleClickTrialGraph(d) {
    this.props.saveLog("0", "click trial-graph");
    this.props.setAppState({
      page: "graph",
      expId: "trial",
    });
  }
  handleClickTrialLinear(d) {
    this.props.saveLog("0", "click trial-linear");
    this.props.setAppState({
      page: "linear",
      expId: "trial",
    });
  }
  handleClickExp1Graph(d) {
    this.props.saveLog("0", "click exp1-graph");
    this.props.setAppState({
      page: "graph",
      expId: "exp1",
    });
  }
  handleClickExp1Linear(d) {
    this.props.saveLog("0", "click exp1-linear");
    this.props.setAppState({
      page: "linear",
      expId: "exp1",
    });
  }

  renderList() {
    return (
      <ul>
        <li className="">
          <span className="text">Trial - Expanding graph </span>
          <button className="button" onClick={this.handleClickTrialGraph.bind(this)}>
            Start
          </button>
        </li>
        <li className="">
          <span className="text">Trial - Linear search </span>
          <button className="button" onClick={this.handleClickTrialLinear.bind(this)}>
            Start
          </button>
        </li>

        <li className="">
          <span className="text">Exp1 - Expanding graph </span>
          <button className="button" onClick={this.handleClickExp1Graph.bind(this)}>
            Start
          </button>
        </li>
        <li className="">
          <span className="text">Exp1 - Linear search </span>
          <button className="button" onClick={this.handleClickExp1Linear.bind(this)}>
            Start
          </button>
        </li>


      </ul>
    );
  }

  render() {
    return (
      <div className="containder">
          {this.renderList()}
      </div>
    );
  }

}

export default MenuPage;