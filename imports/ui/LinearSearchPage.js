import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { withTracker } from 'meteor/react-meteor-data';
import _ from 'lodash';

import LinearSearch from './LinearSearch.js';
import Viewer from './Viewer.js';

image_prefix = "";
image_type = ".jpg";

// RADIUS_BIG2 = 135;
// RADIUS_SMALL2 = 75;
RADIUS_BIG2 = 90;
RADIUS_SMALL2 = 50;

// App component - represents the whole app
export default class LinearSearchPage extends Component {

  _allData = [];
  _history = [];
  _historyLog = [];
  _dummyData = [];
  _xPos = [];

  _modelUrls = [];

  // for sample data
  constructor(props) {
    super(props);
    var domainX = [0,100];
    var domainY = [0,100];

    image_path = image_prefix + "/db_" + this.props.AppState.expId + "/";

    this.initData();

    this.state = {
      data: this.getData({x:domainX, y:domainY}),
      dummyData: this._dummyData,
      domain: {x:domainX, y:domainY},
      prevDomain: null,
      history: this.getHistory(),
    };

    this.props.saveLog(this.getCurrentNode().imageId,
        "initial node ("+this.getCurrentNode().historyId+")");

    this.generateDB();

  }

  generateDB() {
    // load 3d model urls
    var _self = this;
    var file = "/" + this.props.AppState.expId + "_modeldb.json";
    this.loadJSON(file, function(json) {
      _self._modelUrls = JSON.parse(json);

      _self.loadDB();

      var domainX = [0,100];
      var domainY = [0,100];
      _self.state = {
        data: _self.getData({x:domainX, y:domainY}),
        dummyData: _self._dummyData,
        domain: {x:domainX, y:domainY},
        prevDomain: null,
        history: _self.getHistory(),
      };

      _self.props.saveLog(_self.getCurrentNode().imageId,
          "initial node ("+_self.getCurrentNode().historyId+")");
    });
  }

  loadModelUrls() {
    // load 3d model urls
    var _self = this;
    var file = "/" + this.props.AppState.expId + "_modeldb.json";
    this.loadJSON(file, function(json) {
      _self._modelUrls = JSON.parse(json);
      _self.initData();
      _self.loadDB();
    });
  }

  loadJSON(file, callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == 200) {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);
  }

  findModelUrl(key) {
    var found = null;
    for (var i=0; i<this._modelUrls.length; i++) {
      if (this._modelUrls[i].id == key) {
        return this._modelUrls[i].url;
      }
    }
    return null;
  }

  initData() {
    var initialModelUrl1 = null;
    var initialModelUrl2 = null;
    var initialModelUrl3 = null;
    switch(this.props.AppState.expId) {
      case 'exp1':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6Ik54aXBkOUNWSEM0XC9VVDVDSndKalBnPT0iLCJ2YWx1ZSI6IkNGeEtDRU5PK0ZcL3ZOXC8zaDRCSHlNRHg0SDFXZ1RPS0h3eE5VSTZkRXZNb096d25ROGVnVUZmbVltT2ZpSVRMTFU1VTBKZlRGUWJ0XC9vNG9RUXpCaGxJakFPY3R3aHdXVVUxNVphaDFJXC9nSEM0OHJHYmQxaXhCXC9mRWZxbWtQZUkyYlkwcUdSTXI1T3pjVFNDMk8xSE1FRDJRU2hBNW1QQ0hySFZBc0NGaEFkcklWamk0R0lHQ0xFbkVGNTNVTWpOZmM2NUwzb2I0YVB1UXM0aXhTNmpOeVNWV2ZTRUVsdStUdHp0UHBGZTBWNE11R2JXYjFteFRvc29vRVlaY00raUVqTEpuaytqdDM4MTRCK3dkR3pDVHBHTXJpRktLK1VhXC9scjAzR0EyXC81VT0iLCJtYWMiOiJmYWYwMzAyMjNiNjE3ZWE3N2MwM2RjODZjOWU0NzA5NDI5YzY0MGMyYTMwOGRlZTk5YzE4OTQ0ZmIzZWNiY2U1In0=";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IjJmbVVBZEx6T0twN0V0dTFndTc1dnc9PSIsInZhbHVlIjoiVkxLckdlRTVZUU1NajhrRDBcL1BjSDQ4dExZMlBnc2x5bURRXC9mc3o5NWJNZkpCdTJLWGxaM0c4eVdRUHlKYzJHNDl1UGZQZmlya0Vydk9IOERyQm9BR1RmV0owazBRd0h0aWhnb21cL2k0OEZNakc3WHhmd3A5T3c4aEt5V3RiVzNhUGVaRUJMNlFXYVVEZmc1bm9TMkZiajBNN1M3TEFNTXU2NHBCZExzMmoydjZsN2krSkdMVk0rWEdBWWtjeUFLSDZ1dUhXQmp0XC9ZS1NzMndsbFNxbHR4Um4ydGN6U0tCWUZ0UGY2MmVoUU5FdzZpWlR0dnltNXlnNzVjVzVEVDFWc1J5SnpUNStnM040dWJKaXN4T1FJZDJ2UHBcL0tkUUF2UkdUTlc5NHlsRT0iLCJtYWMiOiJmYmNmYjVkMDM0NWUyMDlhMTIwYTRlYzQ2ZWMzYjYyNmE4NjcwNjhiZWM3NThlNTI2ZGJhNjUwYzI5YTFhOGNkIn0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6IkVpdFR0K1pwemMrdlIzTk9uWDJrSEE9PSIsInZhbHVlIjoiZGhHeEZyMkZZVUVTbVFiMkJzZFwvT2FkcUNkRGtXSVBoVTJ3QVpybUpoVmJWTE92WkNKQ2Jxazc4aUx6VG9COXFvMFcwSHhZZFpmM2xkdjI2TjJjVDF6WmN3WGVWdnVJZDRvRzVneEg1SEwrcGgzXC9sbUtyc3hYc3JEZGV6bUlEWTlvaGxIN2xhRGFJVGpEZDdZV0pBb3hSS2t4Rk9QaGlWZ3dlXC9NYkg1YUxKV2dkRXRpdEw0RjNsaGxJWE5yb2NGWWdDSkJkeTNcL2pSczR5SUJwVmJVNHpvQU91dFRmRm9UdUlFTEd1MW1aK1dBTVdlSUh5d0gwMGJGRkUrUWs0VVFtTW5RbkZBcGo0UzRyQlloSUJsR0s0QWFDY1g0SzhEYkM3YzR3Tkg0azk4PSIsIm1hYyI6ImE2MTgxNGM2YTYzMjNmNDc1YWM4NjJkZGQ5OTI3NTFiMjU1OTcyZjM2OGI3YTc3NGZhZTM1YzM4ZGFmYmMzOTcifQ==";
        break;
      case 'exp2':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6IldQMk4rdExud3dUMGpWckhrRFAzN2c9PSIsInZhbHVlIjoiZk5TVTdkZHd3MmtkWnZWV3BaSWdxekw3aEF4U3BYS0VrXC9samdKdU5hbkdqVmMweThmMEpIaXRFWnBSR0ZSRDZqVmM2azNCRm1ldXIrRGtJUU9jdHFSa0ZRTDMwMnM5clwvUzV6aTgzV3VCWmRGWm50aEd2b3dsazc5dFY5cmlQYjNQY3RoTjJBcXk2RVVrTVVRNnlrZlJhUys3SGRmWWZ0QzFRR2hKRGdqeFVtVjdwMXJRREVENHB4MmdpWE1YYTNYcXVuamFsSDI5ZlhuQ3licXBcL1BvNFBweTlxeFBiTk5HOUxXK2ljUzl5d09XNGlKMzBISjNVQkFoS0liTHNmbENzY1EwZnlSZnM5UU1FazZ5WDVnVjBLMEFzUEdZaWRIK0M2NW42QkNmYmM9IiwibWFjIjoiNzU0YTFhYmY5MTBmMGVkYzQ0MjE1NDM2NGNjMzBiYTA5MjI0OGI2NzdjY2Q0OWMxOTM1MzhmNDc3MGIxOTllOCJ9";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IkFHTGdiOGN2TWozREdyVExnMWZWN3c9PSIsInZhbHVlIjoiTU1FekRkckdFN3IrTWExcnVmcG9yam5qdlNXQzY0WVQ5WkZZemx5RjFGMTVBVlZVUFVpekhOb041U0NiUEMrXC8yTnBPOTM1R2xvVlJZa2VpZEt4RHMwN2F0TWFYdnBDSWVUYURLUVFXNnpWWEJGbHBrYjh2azN0a0htRFlYNXB2VHRCc0NrSXE3RnFQTWI4ZGM0RzBMdUlMb1V4MlhBcDVXU2lFQzRZdmhkb1wvaHR0WnNNYVBDZm5KVzhCOW1kMXR2bmd1d3ZtNFNkRStTOURid0syMDRqcXB6STdGeFliaHQ2WDFBa0N4V0xVemlmbFFIeGk3WXhZT0xDdFcwWVhyN2NobWNQT3lCYUZTNUlnT1IxM3ZhME9taFJFS2VyeURFUlBrK2Erc29pdz0iLCJtYWMiOiI2OWVmYWJlNTAzYTE0NWU4NDJiZTBlYjc0ODEyNDkyZDY2Yjk1ZjllODI3NmEwMTMyNWU0YmE3NjM2N2ZkOTg4In0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6IkZ5UHpuVG5pajNyYm5hXC93dDBZOUd3PT0iLCJ2YWx1ZSI6Im8wb3A3TFwvMG1VQUVxN0ZzTFJyRzlDTldraHl2Zmp4QXQ5Y2ROMkZ1Q0kxUkVJa1lmTTZDVHByWGF5T2E0b1dKclFxekpGTU1ZcEVSWEFoZTVnVHJocytrY0dpdU0xUDg0dDl4S3MxZVI4WWlHXC8rRUIwRGZoYmJ3bUpTbUdacUJMdkYwQlNKZUxYWmJFZkNjY09WbW0zWDJKdkRrNmNkSnFPR0pDaWlCait6alNnS0N3SWgyWGQ2R0FWUll3NHpzZ2o3aW1RQ2E0SzlwRU92aE5HM2JvTHlPSVVQZTN0ekFvTTdOczg0TjZuN3BRcVBteXFwY2VmZkdaVmIyKzl1cHd6ZGxYUTZYcFJBZWFOK2JMaHI5OFBqaGdEYXZPOHVZVDBlSFZJSDZqTGc9IiwibWFjIjoiNjQ2ZWVjZTdiOWU2ODhlYTcyMTg5ZDFkNTRkYTAyNDY2NWIyZWI0NmQzZDljNzM1ODY0YzMzYTc4MWZhOWY4ZiJ9";
        break;
      default:
        initialModelUrl1 = "";
        initialModelUrl2 = "";
        initialModelUrl3 = "";
    }

    this._allData = [
      {x: 50, y: 50, z: RADIUS_BIG2,
        id: '1111',
        focused: true, expanded: false, displayed: false,
        imageId: 1111,
        image: image_path + "1111" + image_type,
        modelUrl: initialModelUrl1,
      },
      {x: 70, y: 50, z: RADIUS_SMALL2,
        id: '1112',
        focused: false, expanded: false, displayed: false,
        imageId: 1112,
        image: image_path + "1112"  + image_type,
        modelUrl: initialModelUrl2,
      },
      {x: 90, y: 50, z: RADIUS_SMALL2,
        id: '1113',
        focused: false, expanded: false, displayed: false,
        imageId: 1113,
        image: image_path + "1113"  + image_type,
        modelUrl: initialModelUrl3,
      },
    ];

    this._history = [
      {x: 50, y: 50, z: RADIUS_BIG2,
        id: '1111',
        focused: true, expanded: false, displayed: false,
        imageId: 1111,
        image: image_path + "1111"  + image_type,
        modelUrl: initialModelUrl1,
        historyId: 'h1',
      },
    ];

    this._dummyData = [
        {x: 15, y: 20, z: 50,
          id: 'left',
          parentId: 'd0',
          parentX: 50, parentY: 50,
          numChildren: 0,
          focused: false, expanded: false, displayed: false,
          imageId: "_01",
          image: image_path + "_02.png",
        },
        {x: 85, y: 20, z: 50,
          id: 'right',
          parentId: 'd0',
          parentX: 50, parentY: 50,
          numChildren: 0,
          focused: false, expanded: false, displayed: false,
          imageId: "_02",
          image: image_path + "_01.png",
        },
      ];
  }

  loadDB() {
    for (var i=3; i<81; i++)  this._xPos.push(50 + 20*i);
    this._xPos = this.shuffle(this._xPos);

    for (var i1=1; i1<4; i1++) {
      for (var i2=1; i2<4; i2++) {
        for (var i3=1; i3<4; i3++) {
          for (var i4=1; i4<4; i4++) {
            if (i1==1 && i2==1 && i3==1)  continue;
            var id = i1.toString()+i2.toString()+i3.toString()+i4.toString();
            var xIndex = (i1-1)*3*3*3 + (i2-1)*3*3 + (i3-1)*3 + (i4-1) - 3;
            this._allData.push(
              {x: this._xPos[xIndex], y: 50, z: RADIUS_SMALL2,
                id: id,
                focused: false, expanded: false, displayed: true,
                imageId: id,
                image: image_path + id + image_type,
                modelUrl: this.findModelUrl(id),
              }
            );
          }
        }
      }
    }
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }


  getData(domain) {
    return _.filter(this._allData, this.isInDomain.bind(null, domain));
  }

  isInDomain(domain, d) {
    // return d.x >= domain.x[0]-d.z && d.x <= domain.x[1]+d.z;
    return d.x >= domain.x[0] && d.x <= domain.x[1];
    // return d.displayed == true;
  }

  getHistory() {
    return this._history;
  }

  getCurrentNode() {
    return this._history[this._history.length-1];
    // return this._allData.filter( obj => obj.focused===true )[0];
  }

  handleNodeClick(domain, d) {

    for (var i=0; i<this._allData.length; i++) {
      this._allData[i].z = RADIUS_SMALL2;
    }

    d.z = RADIUS_BIG2;
    d.focused = true;

    var lastHistoryId = this._history[this._history.length-1].historyId;

    let tempNode = Object.assign({}, d);
    tempNode.historyId = lastHistoryId + '1';

    this._history.push(tempNode);

    // save log
    this.props.saveLog(tempNode.imageId, "click ("+tempNode.historyId+")");

    this.shiftPane(d);
  }

  shiftPane(d) {
    var newDomainX = [d.x-50, d.x+50];
    var newDomainY = [0, 100];
    this.setAppState({
      data: this.getData({x:newDomainX, y:newDomainY}),
      domain: _.assign({}, this.state.domain, {
        x: newDomainX,
        y: newDomainY,
      }),
      prevDomain: this.state.domain,
      history: this.getHistory(),
    });
  }

  handleDummyNodeClick(domain, d) {
    // left and right limits
    if (this.state.domain.x[0]<=0 && d.id==="left") return ;
    if (this.state.domain.x[0]>=20*this._allData.length-50 && d.id==="right") return;

    var dX = 20;
    var newDomainX = domain.x;
    var newDomainY = domain.y;

    if (d.id==="left") {
      newDomainX = [this.state.domain.x[0]-dX, this.state.domain.x[1]-dX];
    }
    else if (d.id==="right") {
      newDomainX = [this.state.domain.x[0]+dX, this.state.domain.x[1]+dX];
    }

    // save log
    this.props.saveLog("-", "navigate "+d.id);

    this.setAppState({
      data: this.getData({x:newDomainX, y:newDomainY}),
      domain: _.assign({}, this.state.domain, {
        x: newDomainX,
        y: newDomainY,
      }),
      prevDomain: this.state.domain,
      history: this.getHistory(),
    });

  }

  handleHistoryClick (domain, d) {
    // store history
    this._historyLog.push(Object.assign({}, this._history));

    // update history
    for (var i=this._history.length-1; i>=0; i--) {
      if (this._history[i].historyId == d.historyId) {
        break;
      }
      this._history = this._history.slice(0,i);
    }

    // save log
    this.props.saveLog(d.imageId, "history click ("+d.historyId+")");

    this.shiftPane(d);
  }

  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }

  renderTaskDescription() {
    var taskDescription = "";
    switch(this.props.AppState.expId) {
      case "trial":
        taskDescription = "Task description: Find red dotted squares that are tightly-spaced in linear formation";
        break;
      case "exp1":
        taskDescription = "Task description: Mrs. Heinrich, an 80-year-old regular customer, would like to buy a bouquet for her birthday party. The bouquet should stand on the dining table. The apartment is furnished in a romantic style. Her birthday is in summer.";
        break;
      case "exp2":
        taskDescription = "Task description: A young woman enters your shop, which you have not seen before. She is interested in a round hand-bound bridal bouquet. The wedding will take place at the end of May and the bride will wear white. She informs them that she likes natural flowers and the colour purple.";
      default:
        break;
    }
    return (taskDescription);
  }

  render() {
    return (
      <div className="containder">
        <div className="description">
          {this.renderTaskDescription()}
        </div>
        <div className="subContainer">
          <LinearSearch
            width={this.props.graphWidth}
            height={this.props.height}
            appState={this.state}
            setAppState={this.setAppState.bind(this)}
            handleNodeClick={this.handleNodeClick.bind(this)}
            handleHistoryClick = {this.handleHistoryClick.bind(this)}
            handleDummyNodeClick={this.handleDummyNodeClick.bind(this)}
          />

          <Viewer
            width={this.props.viewerWidth}
            height={this.props.height}
            appState={this.state}
            getCurrentNode={this.getCurrentNode.bind(this)}
          />
        </div>

        <div className="description">
          <button className="button" onClick={this.props.handleClickFinish.bind(this)}>
            Finish
          </button>
          <button className="button" onClick={this.props.handleClickExit.bind(this)}>
            Exit
          </button>
        </div>
      </div>
    );
  }

}
