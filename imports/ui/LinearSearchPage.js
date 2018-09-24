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
RADIUS_BIG2 = 100;
RADIUS_SMALL2 = 60;

// App component - represents the whole app
export default class LinearSearchPage extends Component {

  _allData = [];
  _history = [];
  _historyLog = [];
  _dummyData = [];
  _xPos = [];

  _dummyDataHist = [];
  _histShiftCounter = 0;

  _modelUrls = [];

  // for sample data
  constructor(props) {
    super(props);
    var domainX = [0,100];
    var domainY = [0,100];

    image_path = image_prefix + "/db_" + this.props.AppState.expId + "/";

    inHistory = false;

    this.initData();

    this.state = {
      data: this.getData({x:domainX, y:domainY}),
      dummyData: this._dummyData,
      dummyDataHist: this._dummyDataHist,
      histShiftCounter: this._histShiftCounter,
      domain: {x:domainX, y:domainY},
      prevDomain: null,
      history: this.getHistory(),
    };

    this.props.saveLog(this.getCurrentNode().imageId,
        "initial node", this.getCurrentNode().historyId);

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
        dummyDataHist: _self._dummyDataHist,
        histShiftCounter: this._histShiftCounter,
        domain: {x:domainX, y:domainY},
        prevDomain: null,
        history: _self.getHistory(),
      };

      _self.props.saveLog(_self.getCurrentNode().imageId,
          "initial node", _self.getCurrentNode().historyId);
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
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IlhmdmVWNStPUFFzRWhQM0NuZWFRdUE9PSIsInZhbHVlIjoidGJhNnRsd3JmSTB2UmliR1dPV3U3UjZmQUFucHVUN1ZiSXk2TTluOXU3a2NXQWcrbnVhV3E5S1loVElSXC81MFRXYVwvaENFR2JcL3ZWd3RcL2tVSFNkKzZPejNsT1RxYUVzVWo1N1pcL3U4TWVtVFRTUjV6OHUrblJqaDNiZzUrcnh3RGlkV2h3VWpENndcL0pmWHY2THVuVHJSOGp2Nzhia2FTTGNvTHF3NmhialFqUHB0NVYzTU9NeHBFaFBLczBjVWE1bDRcL0V5NU9DZEUzR0U5NUNQUndCSzdIWXBBaXhjaHpSR3lBV1ppTENUUERPXC9DWVNHNXFEcUYxRVVFUlRFd2R2OGhwT3BaNDVTZGVsYk5xc0Zlc1BWYWZWN1o4MmdQS1hKblRtcXlUSDJKWT0iLCJtYWMiOiIyNDg1ODI1ZmE4NWMyMjJjOTk0MGUzYzQ3ZmQzM2U5YzIzMjlhYmNjMTIyNjE2ODZmNTExMGYxNTZiYWI5YWU1In0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6ImJlTnJlakFQK2J1Z2hKc2xBNVwvajJRPT0iLCJ2YWx1ZSI6InJrMVpuK21yXC9udjdhd3MzSGVKNHd2b0J4MWxlbGpqYWRHTVU1QUpTYWZnNnlEeGJGbE03SGZNd01kS29TQmZcL2lxb1k3MmNDWktuQjZEUFF2c0VZOGZXU2lzeGRzaitvckNZS0Urck5JQ2dpUE1rOHBWQ25TcFl5N1hVa1lHdU9vV1hnaFJhTnU5ZXlhUitBeVF2QmpcL1k2TEFmbGpNYWlpU2ZEMGt1ODZWVGVsRnlvZUIxbmxBdkkzV1JicWpCNDMrclBZYWpxZ0dLTnRYNGxVWFVkQmg2QUlXMEU5U2cyUUJMT1hJa1g2a2pSaUV1NFkxM2RBbWlESVIwQW5oblJXc29vTHQwUVZoTmxsRkJ3UkZvN01XZDVPcTJRVkdiTDZramRLYWdhR2UwPSIsIm1hYyI6IjMxYzZjZDc0YTUxNDNhNzBiN2VjZDNmNWMyYjQ5ZjQ0YmZkNGI1YTVjNGUzMzllODlmMGMyODFiOTQ3OWZmMzEifQ==";
        break;
      case 'exp2':
        initialModelUrl1 = "https://create.bloomypro.com/embed/eyJpdiI6IldQMk4rdExud3dUMGpWckhrRFAzN2c9PSIsInZhbHVlIjoiZk5TVTdkZHd3MmtkWnZWV3BaSWdxekw3aEF4U3BYS0VrXC9samdKdU5hbkdqVmMweThmMEpIaXRFWnBSR0ZSRDZqVmM2azNCRm1ldXIrRGtJUU9jdHFSa0ZRTDMwMnM5clwvUzV6aTgzV3VCWmRGWm50aEd2b3dsazc5dFY5cmlQYjNQY3RoTjJBcXk2RVVrTVVRNnlrZlJhUys3SGRmWWZ0QzFRR2hKRGdqeFVtVjdwMXJRREVENHB4MmdpWE1YYTNYcXVuamFsSDI5ZlhuQ3licXBcL1BvNFBweTlxeFBiTk5HOUxXK2ljUzl5d09XNGlKMzBISjNVQkFoS0liTHNmbENzY1EwZnlSZnM5UU1FazZ5WDVnVjBLMEFzUEdZaWRIK0M2NW42QkNmYmM9IiwibWFjIjoiNzU0YTFhYmY5MTBmMGVkYzQ0MjE1NDM2NGNjMzBiYTA5MjI0OGI2NzdjY2Q0OWMxOTM1MzhmNDc3MGIxOTllOCJ9";
        initialModelUrl2 = "https://create.bloomypro.com/embed/eyJpdiI6IjV1SWVUSG13bW5mYmxrK0xwNEFYblE9PSIsInZhbHVlIjoiR2s2MVBHTG1NTUNZaEpnZ01TZytGUXNiYWkwNVRiK0s2b1FWK1BpcWZmbzNGTHcxVjd5djU4blNxaGQzMVhQRUlvb1UrN2oycUlSOHUxXC94VytpNzliRWpNVHoraTY2ZXBHcTB5U1U1N2tGV1BuT1ViRXhmRnZIMVFEZzhNdWlobStlWlFKSWp4T1pGNzNTUmNBMEE1UUxtUW45VkdxZVFKK0ZZZDZnU3M5QlNvbEhkWmZYOWs5eUNRSGc0bTBYR2dCdWlFbm0wWHQ2N0NobzF6SGticVFQeDNvT3Q0eU9nRjBidmtuSVZDNm50RTZkeFFJUE9YWk1ZTFhXV3lHVWtQUHJQWXRaK3RSelwvYVVsRWp5SFdnZSttdUhyYzI5RzN4YnhtcFFrUVNMMD0iLCJtYWMiOiJmOWM2MWIzNWRiZmViZjk1NTdjYjc2NmJlZjY5MTBjY2M2MDIzN2ZiNDQzMWMxNDQ1NTEzYmI1NWM0ZDlkNTIyIn0=";
        initialModelUrl3 = "https://create.bloomypro.com/embed/eyJpdiI6Inp1Rjk1TFwvc0QxeUVydEl1Z3Rnc0ZRPT0iLCJ2YWx1ZSI6Im1kRE1QQlA2MzcwSnJCRnczVWZrVmhHRUVGaG9ScTRmZzZad2g1Sk81MFYrNDlUVEp2eE1WY2VSNXN6cmNCbzZoUTNrQWVGdkEwR05zWTlhOTQySVYwT2xPY05mUE1GM0tUMUJFM0RaVUkzU3dkY3RMRGxQVUxTZHh4NWY3RUNPOExjcEV5Y0lFTTRhOGZwamN6K3FJVGRUMFBUVHVWQkJwQjRTS3h1VEt2bmxSYlZiZDBZTE14VVlXTmhhVHZnWkRnK3NBSnpPKzY2T3AwSForQU5OWGttOXhqYWk2T1ZzRmJlS0Q2aHp0bTdGYUFRREJkSnRleG9CWFRBaXJiQVVIR0JBd2xFNU9UMU0xRTJXelN2OUdkVzliY0dLb2hkeWMrUVRwNW1xZlwvdz0iLCJtYWMiOiI2Mzk5YTMzOTY5ZjJhYzRkZjQzMDgzNDQxNDllZWU2ZGIxMTM5OTY1ODBmMDBiY2I2MmFmZDkwMmYyNDEzYTdhIn0=";
        break;
      default:
        initialModelUrl1 = "";
        initialModelUrl2 = "";
        initialModelUrl3 = "";
    }

    this._allData = [
      {x: 50, y: 65, z: RADIUS_BIG2,
        id: '1111',
        historyId: 'h1',
        focused: true, saved: false, displayed: false,
        imageId: 1111,
        image: image_path + "1111" + image_type,
        modelUrl: initialModelUrl1,
        tag: ["______", "______", "______", "______"],
        tag_de: ["______", "______", "______", "______"],
      },
      // {x: 70, y: 65, z: RADIUS_SMALL2,
      //   id: '1112',
      //   focused: false, saved: false, displayed: false,
      //   imageId: 1112,
      //   image: image_path + "1112"  + image_type,
      //   modelUrl: initialModelUrl2,
      //   tag: ["______", "______", "______", "space"],
      // },
      // {x: 90, y: 65, z: RADIUS_SMALL2,
      //   id: '1113',
      //   focused: false, saved: false, displayed: false,
      //   imageId: 1113,
      //   image: image_path + "1113"  + image_type,
      //   modelUrl: initialModelUrl3,
      //   tag: ["______", "______", "______", "space"],
      // },
      {x: 70, y: 65, z: RADIUS_SMALL2,
        id: '1212',
        focused: false, saved: false, displayed: false,
        imageId: 1212,
        image: image_path + "1212"  + image_type,
        modelUrl: initialModelUrl2,
        tag: ["______", "texture", "______", "space"],
        tag_de: ["______", "Textur ", "______", "Abstand"],
      },
      {x: 90, y: 65, z: RADIUS_SMALL2,
        id: '3211',
        focused: false, saved: false, displayed: false,
        imageId: 3211,
        image: image_path + "3211"  + image_type,
        modelUrl: initialModelUrl3,
        tag:    ["color_ ", "texture", "______", "______"],
        tag_de: ["Farbe_", "Textur ", "______", "______"],
      },
    ];

    this._history = [
      {x: 50, y: 65, z: RADIUS_BIG2,
        id: '1111',
        focused: true, saved: false, displayed: false,
        imageId: 1111,
        image: image_path + "1111"  + image_type,
        modelUrl: initialModelUrl1,
        historyId: 'h1',
      },
    ];

    this._dummyData = [
        {x: 15, y: 15, z: 50,
          id: 'left',
          parentId: 'd0',
          parentX: 50, parentY: 50,
          numChildren: 0,
          focused: false, saved: false, displayed: false,
          imageId: "_01",
          image: image_path + "_02.png",
        },
        {x: 85, y: 15, z: 50,
          id: 'right',
          parentId: 'd0',
          parentX: 50, parentY: 50,
          numChildren: 0,
          focused: false, saved: false, displayed: false,
          imageId: "_02",
          image: image_path + "_01.png",
        },
      ];

      this._dummyDataHist = [
          {x: 90, y: 0, z: 20,
            id: 'left',
            // parentId: 'd0',
            parentX: 50, parentY: 50,
            numChildren: 0,
            focused: false, saved: false, displayed: false,
            imageId: "_01",
            image: image_path + "_02.png",
          },
          {x: 95, y: 0, z: 50,
            id: 'right',
            // parentId: 'd0',
            parentX: 50, parentY: 20,
            numChildren: 0,
            focused: false, saved: false, displayed: false,
            imageId: "_02",
            image: image_path + "_01.png",
          },
        ];

      this._histShftCounter = 0;
  }

  loadDB() {
    for (var i=3; i<81; i++)  this._xPos.push(50 + 20*i);
    this._xPos = this.shuffle(this._xPos);

    var idx = 0;
    for (var i1=1; i1<4; i1++) {
      for (var i2=1; i2<4; i2++) {
        for (var i3=1; i3<4; i3++) {
          for (var i4=1; i4<4; i4++) {
            // if (i1==1 && i2==1 && i3==1)  continue;
            if (i1==1 && i2==1 && i3==1 && i4==1)  continue;
            if (i1==1 && i2==2 && i3==1 && i4==2)  continue;
            if (i1==3 && i2==2 && i3==1 && i4==1)  continue;
            var id = i1.toString()+i2.toString()+i3.toString()+i4.toString();
            // var xIndex = (i1-1)*3*3*3 + (i2-1)*3*3 + (i3-1)*3 + (i4-1) - 3;

            var tag = ["______", "______", "______", "______"];
            var tag_de = ["______", "______", "______", "______"];
            if (i1 != 1) {
              tag[0] = "color_ ";
              tag_de[0] = "Farbe_";
            }
            if (i2 != 1) {
              tag[1] = "texture";
              tag_de[1] = "Textur ";
            }
            if (i3 != 1) {
              tag[2] = "form__";
              tag_de[2] = "Form_ ";
            }
            if (i4 != 1) {
              tag[3] = "space";
              tag_de[3] = "Abstand";
            }

            this._allData.push(
              {x: this._xPos[idx], y: 65, z: RADIUS_SMALL2,
                id: id,
                focused: false, saved: false, displayed: true,
                imageId: id,
                image: image_path + id + image_type,
                modelUrl: this.findModelUrl(id),
                tag: tag,
                tag_de: tag_de,
              }
            );

            idx++;
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

  getHistShitCounter() {
    return this._histShftCounter;
  }

  getCurrentNode() {
    // return this._history[this._history.length-1];
    return this._allData.filter( obj => obj.focused===true )[0];
  }

  handleNodeClick(domain, d) {

    // if (this._history[this._history.length-1].id != d.id) {
    if (d.focused == false) {

      // get the last focus
      var lastFocus = this._history.filter( obj => obj.focused==true )[0];
      // console.log("last focus: ", lastFocus.id);

      // cut history if necessary
      for (var i=this._history.length-1; i>=0; i--) {
        // console.log("check: ", this._history[i].historyId, lastFocus.historyId);
        if (this._history[i].historyId == lastFocus.historyId) {
          break;
        }
        this._history = this._history.slice(0,i);
      }

      this.setAppState({
        history: this.getHistory(),
      });

      let tempNode = Object.assign({}, d);
      tempNode.historyId = lastFocus.historyId + '1';
      tempNode.focused = true;
      this._history.push(tempNode);

      lastFocus.focused = false;
      inHistory = false;

      // save log
      this.props.saveLog(tempNode.imageId, "click DESIGN", tempNode.historyId);
      // console.log(tempNode.imageId, "click ("+tempNode.historyId+")");

      this.updateTags(d);
      this.shiftPane(d);

      for (var i=0; i<this._allData.length; i++) {
        this._allData[i].z = RADIUS_SMALL2;
        this._allData[i].focused = false;
      }
      d.z = RADIUS_BIG2;
      d.focused = true;

      this._histShftCounter = 0;

      this.setAppState({
        history: this.getHistory(),
        histShiftCounter: this.getHistShitCounter(),
      });
    }
  }

  updateTags(d) {

    for (var i=0; i<this._allData.length; i++) {
      var newTag = ["______", "______", "______", "______"];
      var newTag_de = ["______", "______", "______", "______"];
      if (this._allData[i].id[0] != d.id[0]) {
        newTag[0] = "color_ ";
        newTag_de[0] = "Farbe_";
      }
      if (this._allData[i].id[1] != d.id[1]) {
        newTag[1] = "texture";
        newTag_de[1] = "Textur ";
      }
      if (this._allData[i].id[2] != d.id[2]) {
        newTag[2] = "form__";
        newTag_de[2] = "Form_ ";
      }
      if (this._allData[i].id[3] != d.id[3]) {
        newTag[3] = "space";
        newTag_de[3] = "Abstand";
      }
      this._allData[i].tag = newTag;
      this._allData[i].tag_de = newTag_de;
    }

    var newDomainX = [d.x-2, d.x-1];
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
    this.props.saveLog("-", "navigate "+d.id, "-");

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

  handleDummyHistClick(domain, d) {
    if (d.id==="left") {
      if (this._histShftCounter==0) return;
      this._histShftCounter++;
    }
    else if (d.id==="right") {
      this._histShftCounter--;
    }

    this.props.saveLog("-", "history navigate "+d.id, "-");
    // console.log(this._histShftCounter);
    this.setAppState({
      histShiftCounter: this.getHistShitCounter(),
    });
  }

  handleHistoryClick (domain, d) {

    // if (this._history[this._history.length-1].id != d.id) {
    // if (d.focused == false) {

    var lastFocus = this._history.filter( obj => obj.focused==true )[0];
    if (d != lastFocus) {
      for (var i=0; i<this._allData.length; i++) {
        if (this._allData[i].id == d.id) {
          this._allData[i].z = RADIUS_BIG2;
          this._allData[i].focused = true;
        }
        else {
          this._allData[i].z = RADIUS_SMALL2;
          this._allData[i].focused = false;
        }
      }

      lastFocus.focused = false;
      d.focused = true;

      inHistory = true;

      // save log
      this.props.saveLog(d.imageId, "history click", d.historyId);
      // console.log(d.imageId, "history click ("+d.historyId+")");

      this.updateTags(d);
      this.shiftPane(d);
    }
  }

  setAppState(partialState, callback) {
    return this.setState(partialState, callback);
  }

  handleClickSave() {
    var currentNode = this.getCurrentNode();
    if (currentNode.saved==false) {
      currentNode.saved = true;
      this.props.saveLog(currentNode.imageId, "save design", currentNode.id);
      // console.log(currentNode.imageId, "save design ("+currentNode.id+")");
      // alert("Design saved. Saved designs will be shown in red circles in the history.");
      alert("Design gespeichert. Gespeicherte Designs werden in der Historie in roten Kreisen angezeigt.");

      var fromHistory = this._history.filter( obj => obj.id == currentNode.id );
      for (var i=0; i<fromHistory.length; i++) {
        fromHistory[i].saved = true;
      }
    }
    else {
      currentNode.saved = false;
      this.props.saveLog(currentNode.imageId, "unsave design", currentNode.id);
      // console.log(currentNode.imageId, "unsave design ("+currentNode.id+")");
      // alert("Design unsaved.");
      alert("Design nicht gespeichert.");

      var fromHistory = this._history.filter( obj => obj.id == currentNode.id );
      for (var i=0; i<fromHistory.length; i++) {
        fromHistory[i].saved = false;
      }
    }

  }

  renderTaskDescription() {
    var taskDescription = "";
    switch(this.props.AppState.expId) {
      case "trial":
      // taskDescription = "Task description: Find red dotted squares that are tightly-spaced in linear formation.";
      taskDescription = "Aufgabenbeschreibung: Finden Sie rot gestrichelte Felder, die in einer Reihe angeordnet, eng beieinander liegen.";
        break;
      case "exp1":
      // taskDescription = "Task description: Mrs. Heinrich, an 80-year-old regular customer, would like to buy a bouquet for her birthday party. The bouquet should stand on the dining table. The apartment is furnished in a romantic style. Her birthday is in summer.";
      taskDescription = "Aufgabenbeschreibung: Frau Heinrich, eine 80-jährige Stammkundin, möchte gerne einen Blumenstrauss zum Anlass ihrer Geburtstagsfeier kaufen. Der Blumenstrauss soll auf dem Esstisch stehen. Die Wohnung ist im romantischen Stiel eingerichtet. Ihr Geburtstag ist im Sommer.";
        break;
      case "exp2":
      // taskDescription = "Task description: A young woman enters your shop, whom you have not seen before. She is interested in a round hand-bound bridal bouquet. The wedding will take place at the end of May and the bride will wear white. She informs them that she likes natural flowers and the colour purple.";
      taskDescription = "Aufgabenbeschreibung: Eine junge Frau betritt Ihren Laden, die sie zuvor noch nicht gesehen haben. Sie ist an einem Hochzeitsblumenstrauss interessiert. Die Hochzeit findet im Mai statt und die Braut wird weiss tragen. Sie informiert sie, dass natürliche Blumen und die Farbe Lila mag.";
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
            handleDummyHistClick={this.handleDummyHistClick.bind(this)}
          />

          <Viewer
            width={this.props.viewerWidth}
            height={this.props.height}
            appState={this.state}
            getCurrentNode={this.getCurrentNode.bind(this)}
          />
        </div>

        <div className="description">
          <button className="button" onClick={this.handleClickSave.bind(this)}>
            {/* Save/Unsave this design */}
            Speichern/Dieses Design aufheben
          </button>
          <button className="button" onClick={this.props.handleClickReturnToMenu.bind(this)}>
            {/* Return to menu */}
            Zurück zum Menü
          </button>
          <button className="button" onClick={this.props.handleClickExit.bind(this)}>
            {/* Exit */}
            Beenden
          </button>
        </div>
      </div>
    );
  }

}
