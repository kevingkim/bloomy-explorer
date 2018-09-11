import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';
import _ from 'lodash';

import d3Linear from './d3Linear.js';


export default class LinearSearch extends Component {
  constructor(props){
    super(props);
  }

  dispatcher = null;

  componentDidMount() {
    var dispatcher = d3Linear.create(
      this._rootNode,
      {width: this.props.width, height: this.props.height},
      this.getChartState(),
    );
    var domain = this.props.appState.domain;
    dispatcher.on('point:nodeClick', this.props.handleNodeClick.bind(null, domain));
    dispatcher.on('point:historyClick', this.props.handleHistoryClick.bind(null, domain));
    dispatcher.on('point:dummyNodeClick', this.props.handleDummyNodeClick.bind(null, domain));
    dispatcher.on('point:dummyHistClick', this.props.handleDummyHistClick.bind(null, domain));
    this.dispatcher = dispatcher;
  }

  componentDidUpdate(prevProps, prevState) {
    // D3 Code to update the chart
    d3Linear.update(
       this._rootNode,
      //  {width: this.props.width, height: this.props.height},
       this.getChartState(),
       this.dispatcher
    );
  }

  componentWillUnmount() {
    // d3Linear.destroy(this._rootNode);
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
