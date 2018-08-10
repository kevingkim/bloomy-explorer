import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import _ from 'lodash';

import d3Graph from './d3Graph.js';


export default class ExpGraph extends Component {
  constructor(props){
    super(props);
  }

  dispatcher = null;

  componentDidMount() {
    var dispatcher = d3Graph.create(
      this._rootNode,
      {width: this.props.width, height: this.props.height},
      this.getChartState(),
    );
    var domain = this.props.appState.domain;
    dispatcher.on('point:nodeClick', this.props.handleNodeClick.bind(null, domain));
    dispatcher.on('point:historyClick', this.props.handleHistoryClick.bind(null, domain));
    this.dispatcher = dispatcher;
  }

  componentDidUpdate(prevProps, prevState) {
    d3Graph.update(
       this._rootNode,
      //  {width: this.props.width, height: this.props.height},
       this.getChartState(),
       this.dispatcher
    );
  }

  componentWillUnmount() {
    // d3Graph.destroy(this._rootNode);
  }

  // shouldComponentUpdate() {
  //   // Prevents component re-rendering
  //   return false;
  // }

  getChartState() {
    var appState = this.props.appState;
    return _.assign({}, appState);
  }

  _setRef(componentNode) {
    this._rootNode = componentNode;
  }

  render() {
    return (
      <div className="graph-container" ref={this._setRef.bind(this)} />
    );
  }
}
