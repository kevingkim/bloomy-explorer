import React, { Component, PropTypes } from "react";
import ReactDOM from 'react-dom';

export default class Viewer extends Component {
  constructor(props){
    super(props);
  }

  getSrc() {
    // console.log(this.props.getCurrentNode());
    // return "http://127.0.0.1:8887/_01.jpeg";
    return this.props.getCurrentNode().image;
  }

  renderViewer() {
    modelUrl = this.props.getCurrentNode().modelUrl;

    if (modelUrl == "") {
      console.log("null url");
      return (
        <img
          src={this.getSrc()}
          width={this.props.width}
          height="auto"
        />
      );
    }

    return (
      <iframe id="200_194_express_html_inpage_0.if"
        src={this.props.getCurrentNode().modelUrl}
        width={this.props.width}
        height={this.props.height}
        frameBorder="0"
        scrolling="no"
        allowFullScreen="true">
      </iframe>
    );
  }

  render() {
    return (
      <div className="viewer-container" margin="auto">
        {this.renderViewer()}
        {/* <iframe id="200_194_express_html_inpage_0.if"
          src={this.props.getCurrentNode().modelUrl}
          width={this.props.width}
          height={this.props.height}
          frameBorder="0"
          scrolling="no"
          allowFullScreen="true">
        </iframe> */}
      </div>
    );
  }
}
